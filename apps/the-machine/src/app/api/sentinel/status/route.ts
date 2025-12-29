/**
 * Sentinel Overall Status API
 * 
 * Returns comprehensive status of all Sentinel monitoring systems
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  checkROMIntegrity,
  checkAirGap,
  checkConsensusProtocol,
  checkCognitiveWork,
  trackPublicAICapabilities,
  detectHiddenChannels,
  detectRogueAGI,
} from '@/lib/sentinel';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth(request);

    // Run all monitoring systems in parallel
    const [
      infrastructureChecks,
      aiIntelligence,
      watchdogDetections,
    ] = await Promise.all([
      // Infrastructure monitoring
      Promise.all([
        checkROMIntegrity('default-hash', {}),
        checkAirGap('galion-main-system'),
        checkConsensusProtocol({}, {}),
        checkCognitiveWork(5e17, 1e18),
      ]),
      
      // AI intelligence
      trackPublicAICapabilities(),
      
      // Watchdog network
      Promise.all([
        detectHiddenChannels(['galion-core-a', 'galion-core-b']),
        detectRogueAGI({}),
      ]).then(([hiddenChannels, rogueAGI]) => [...hiddenChannels, ...rogueAGI]),
    ]);

    // Calculate overall status
    const infrastructurePassed = infrastructureChecks.every(check => check.passed);
    const criticalInfraFailures = infrastructureChecks.filter(
      check => !check.passed && (check.severity === 'critical' || check.severity === 'existential')
    );

    const highRiskAI = aiIntelligence.filter(
      report => report.risk_assessment === 'critical' || report.risk_assessment === 'high'
    );

    const existentialThreats = watchdogDetections.filter(
      d => d.severity === 'existential'
    );
    const criticalThreats = watchdogDetections.filter(
      d => d.severity === 'critical'
    );

    // Determine overall threat level
    let overallThreatLevel: 'normal' | 'elevated' | 'high' | 'critical' | 'existential';
    
    if (existentialThreats.length > 0 || criticalInfraFailures.some(c => c.severity === 'existential')) {
      overallThreatLevel = 'existential';
    } else if (criticalThreats.length > 0 || criticalInfraFailures.length > 0) {
      overallThreatLevel = 'critical';
    } else if (highRiskAI.length > 0) {
      overallThreatLevel = 'high';
    } else if (!infrastructurePassed) {
      overallThreatLevel = 'elevated';
    } else {
      overallThreatLevel = 'normal';
    }

    return NextResponse.json({
      success: true,
      overall_status: {
        threat_level: overallThreatLevel,
        systems_operational: infrastructurePassed,
        watchdog_active: true,
        last_update: new Date().toISOString(),
      },
      infrastructure: {
        all_checks_passed: infrastructurePassed,
        total_checks: infrastructureChecks.length,
        failed_checks: infrastructureChecks.filter(c => !c.passed).length,
        critical_failures: criticalInfraFailures.length,
        checks: infrastructureChecks,
      },
      ai_intelligence: {
        total_reports: aiIntelligence.length,
        high_risk_count: highRiskAI.length,
        reports: aiIntelligence.slice(0, 10), // First 10
      },
      watchdog: {
        total_detections: watchdogDetections.length,
        existential_threats: existentialThreats.length,
        critical_threats: criticalThreats.length,
        detections: watchdogDetections,
      },
      operator: {
        id: session.operatorId,
        name: session.operatorName,
        role: session.role,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Sentinel status error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to retrieve Sentinel status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
