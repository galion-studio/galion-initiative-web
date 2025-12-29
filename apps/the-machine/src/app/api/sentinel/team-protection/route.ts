/**
 * Sentinel Team Protection API
 * 
 * Protects Galion team from:
 * - Deepfake attacks
 * - Social engineering
 * - Phishing
 * - Manipulation
 * - Impersonation
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, hasPermission } from '@/lib/auth';
import {
  detectDeepfakes,
  detectSocialEngineering,
  type SocialEngineeringDetection,
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
    const { detection_type, content, metadata } = body;

    let detection: SocialEngineeringDetection | null = null;

    switch (detection_type) {
      case 'deepfake':
        if (!content.media) {
          return NextResponse.json(
            { error: 'Media content required for deepfake detection' },
            { status: 400 }
          );
        }
        detection = await detectDeepfakes(
          content.media,
          metadata?.suspected_target
        );
        break;

      case 'social-engineering':
        if (!content.communication) {
          return NextResponse.json(
            { error: 'Communication content required for social engineering detection' },
            { status: 400 }
          );
        }
        detection = await detectSocialEngineering({
          content: content.communication.content || '',
          sender: content.communication.sender || 'unknown',
          recipient: content.communication.recipient || session.operatorName,
          context: content.communication.context || '',
        });
        break;

      default:
        return NextResponse.json(
          { error: `Unknown detection type: ${detection_type}` },
          { status: 400 }
        );
    }

    if (detection) {
      // Threat detected
      return NextResponse.json({
        success: true,
        threat_detected: true,
        detection,
        message: `${detection.attack_type.toUpperCase()} attack detected - follow recommended actions`,
        requires_immediate_response: detection.threat_level === 'critical' || detection.threat_level === 'high',
      });
    }

    // No threat detected
    return NextResponse.json({
      success: true,
      threat_detected: false,
      message: 'No social engineering threat detected',
    });

  } catch (error) {
    console.error('Sentinel team protection error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to perform team protection check',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
