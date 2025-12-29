/**
 * Sentinel Watchdog Network API
 * 
 * Monitors for rogue AGI and hidden coordination:
 * - Hidden communication channels
 * - Convergence detection
 * - Value drift
 * - Rogue AGI emergence
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, hasPermission } from '@/lib/auth';
import {
  detectHiddenChannels,
  detectRogueAGI,
  type WatchdogDetection,
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
    const { detection_type, parameters } = body;

    let detections: WatchdogDetection[] = [];

    switch (detection_type) {
      case 'hidden-channels':
        detections = await detectHiddenChannels(
          parameters.monitored_systems || ['galion-core-a', 'galion-core-b']
        );
        break;

      case 'rogue-agi':
        detections = await detectRogueAGI(
          parameters.monitoring_data || {}
        );
        break;

      default:
        return NextResponse.json(
          { error: `Unknown detection type: ${detection_type}` },
          { status: 400 }
        );
    }

    // Check for existential threats
    const existentialThreats = detections.filter(
      d => d.severity === 'existential'
    );

    if (existentialThreats.length > 0) {
      return NextResponse.json({
        success: true,
        alert_level: 'EXISTENTIAL',
        detections: existentialThreats,
        message: 'EXISTENTIAL THREAT DETECTED - IMMEDIATE ACTION REQUIRED',
        recommended_actions: [
          'Initiate emergency shutdown protocol',
          'Alert all watchdog network nodes',
          'Notify AI safety research community',
          'Contact regulatory authorities',
        ],
      });
    }

    const criticalThreats = detections.filter(
      d => d.severity === 'critical'
    );

    return NextResponse.json({
      success: true,
      alert_level: criticalThreats.length > 0 ? 'CRITICAL' : 'NORMAL',
      detections,
      summary: {
        total_detections: detections.length,
        by_severity: {
          existential: existentialThreats.length,
          critical: criticalThreats.length,
          high: detections.filter(d => d.severity === 'high').length,
          medium: detections.filter(d => d.severity === 'medium').length,
          low: detections.filter(d => d.severity === 'low').length,
        },
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Sentinel watchdog detection error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to perform watchdog detection',
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

    // Run all watchdog checks
    const [hiddenChannels, rogueAGI] = await Promise.all([
      detectHiddenChannels(['galion-core-a', 'galion-core-b']),
      detectRogueAGI({}),
    ]);

    const allDetections = [...hiddenChannels, ...rogueAGI];
    const existentialThreats = allDetections.filter(d => d.severity === 'existential');
    const criticalThreats = allDetections.filter(d => d.severity === 'critical');

    return NextResponse.json({
      success: true,
      status: existentialThreats.length > 0 ? 'EXISTENTIAL_THREAT' :
              criticalThreats.length > 0 ? 'CRITICAL_THREAT' : 'NORMAL',
      summary: {
        total_detections: allDetections.length,
        existential_threats: existentialThreats.length,
        critical_threats: criticalThreats.length,
        watchdog_systems_online: true,
        last_scan: new Date().toISOString(),
      },
      detections: allDetections,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Sentinel watchdog status error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to retrieve watchdog status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
