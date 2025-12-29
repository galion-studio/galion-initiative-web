/**
 * Session Refresh API Route
 *
 * Extends session expiration for active operators
 * Prevents session timeout during active use
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, refreshSession } from '@/lib/auth';
import { createDatabaseClient } from '@/lib/db-client';

export async function POST(request: NextRequest) {
  try {
    // Verify current session
    const session = await requireAuth(request);

    // Get database client
    const client = createDatabaseClient();

    // Extract current token
    const authHeader = request.headers.get('Authorization');
    const currentToken = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader || '';

    // Refresh session (creates new token with extended expiration)
    const authResult = await refreshSession(currentToken);

    if (!authResult.success || !authResult.session || !authResult.token) {
      return NextResponse.json(
        { error: authResult.error || 'Failed to refresh session' },
        { status: 401 }
      );
    }

    // Log session refresh
    await client.createAuditLog({
      id: `refresh-${session.operatorId}-${Date.now()}`,
      category: 'operator-action',
      severity: 'info',
      action: 'Session refreshed',
      justification: `Operator ${session.operatorName} extended their session`,
      operatorId: session.operatorId,
      metadata: {
        newExpiresAt: authResult.session.expiresAt,
      },
      containsPersonalData: false,
    });

    return NextResponse.json({
      success: true,
      session: {
        operatorId: authResult.session.operatorId,
        operatorName: authResult.session.operatorName,
        operatorEmail: authResult.session.operatorEmail,
        role: authResult.session.role,
        expiresAt: authResult.session.expiresAt,
      },
      token: authResult.token,
    }, {
      headers: {
        // Update session cookie with new token
        'Set-Cookie': `session=${authResult.token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${8 * 60 * 60}`,
      },
    });

  } catch (error) {
    console.error('Session refresh error:', error);

    return NextResponse.json(
      {
        error: 'Session refresh failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 401 }
    );
  }
}
