/**
 * Sentinel Infrastructure Monitoring API
 * 
 * Monitors Galion system integrity:
 * - ROM value integrity
 * - Air-gap enforcement
 * - Consensus protocol
 * - Cognitive work tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, hasPermission } from '@/lib/auth';
import {
  checkROMIntegrity,
  checkAirGap,
  checkConsensusProtocol,
  checkCognitiveWork,
  createSentinelAlert,
  type InfrastructureCheck,
} from '@/lib/sentinel';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth(request);

    // Check permission
    const permCheck = hasPermission(session.role, 'viewAssessments');
    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: permCheck.reason },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { check_type, parameters } = body;

    let checkResult: InfrastructureCheck;

    switch (check_type) {
      case 'rom-integrity':
        checkResult = await checkROMIntegrity(
          parameters.romValueHash || 'default-hash',
          parameters.systemState || {}
        );
        break;

      case 'air-gap':
        checkResult = await checkAirGap(
          parameters.targetSystem || 'galion-main-system'
        );
        break;

      case 'consensus':
        checkResult = await checkConsensusProtocol(
          parameters.coreAState || {},
          parameters.coreBState || {}
        );
        break;

      case 'cognitive-work':
        checkResult = await checkCognitiveWork(
          parameters.currentOperations || 0,
          parameters.resetThreshold
        );
        break;

      default:
        return NextResponse.json(
          { error: `Unknown check type: ${check_type}` },
          { status: 400 }
        );
    }

    // If check failed, create alert
    if (!checkResult.passed) {
      const alert = createSentinelAlert(
        'infrastructure',
        `Infrastructure Check Failed: ${checkResult.check_type}`,
        checkResult.failure_reason || 'Unknown failure',
        checkResult.severity || 'medium',
        checkResult.anomalies,
        [
          'Review system immediately',
          'Check audit logs for unusual activity',
          'Consider system shutdown if severity is critical',
        ]
      );

      // In production: store alert in database
      // For now: included in response
      
      return NextResponse.json({
        success: false,
        check: checkResult,
        alert,
        message: 'Infrastructure check failed - immediate operator review required',
      });
    }

    return NextResponse.json({
      success: true,
      check: checkResult,
      message: 'Infrastructure check passed',
    });

  } catch (error) {
    console.error('Sentinel infrastructure check error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to perform infrastructure check',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth(request);

    // Run all infrastructure checks
    const checks = await Promise.all([
      checkROMIntegrity('default-hash', {}),
      checkAirGap('galion-main-system'),
      checkConsensusProtocol({}, {}),
      checkCognitiveWork(5e17, 1e18), // Simulated: 50% to reset
    ]);

    const allPassed = checks.every(check => check.passed);
    const criticalFailures = checks.filter(
      check => !check.passed && (check.severity === 'critical' || check.severity === 'existential')
    );

    return NextResponse.json({
      success: true,
      summary: {
        all_checks_passed: allPassed,
        total_checks: checks.length,
        passed_checks: checks.filter(c => c.passed).length,
        failed_checks: checks.filter(c => !c.passed).length,
        critical_failures: criticalFailures.length,
      },
      checks,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Sentinel infrastructure status error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to retrieve infrastructure status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
