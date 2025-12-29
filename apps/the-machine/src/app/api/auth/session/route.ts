/**
 * Session Check API Route
 * 
 * Verifies current session and returns operator info
 * Can be used by frontend to check if user is logged in
 */

import { NextRequest, NextResponse } from 'next/server';
import { optionalAuth, getSessionInfo, isSessionExpiringSoon } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Try to get current session (non-required)
    const session = await optionalAuth(request);

    if (!session) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    // Return session info
    const sessionInfo = getSessionInfo(session);

    return NextResponse.json({
      authenticated: true,
      operator: {
        id: session.operatorId,
        name: session.operatorName,
        email: session.operatorEmail,
        role: session.role,
      },
      session: {
        expiresAt: session.expiresAt,
        expiresIn: sessionInfo.expiresIn,
        expiringSoon: sessionInfo.expiringSoon,
      },
    });

  } catch (error) {
    console.error('Session check error:', error);
    
    return NextResponse.json({
      authenticated: false,
      error: 'Session check failed',
    });
  }
}
