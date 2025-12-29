/**
 * Logout API Route
 *
 * Revokes operator sessions
 * Logs all logout events for audit trail
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, revokeSession } from '@/lib/auth';
import { createDatabaseClient } from '@/lib/db-client';

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await requireAuth(request);

    // Get database client
    const client = createDatabaseClient();

    // Extract token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader || '';

    // Revoke session
    const revoked = await revokeSession(token);

    // Log logout
    await client.createAuditLog({
      id: `logout-${session.operatorId}-${Date.now()}`,
      category: 'operator-action',
      severity: 'info',
      action: 'Operator logout',
      justification: `Operator ${session.operatorName} logged out`,
      operatorId: session.operatorId,
      metadata: {
        sessionRevoked: revoked,
      },
      containsPersonalData: false,
    });

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    }, {
      headers: {
        // Clear session cookie
        'Set-Cookie': 'session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
      },
    });

  } catch (error) {
    console.error('Logout error:', error);

    return NextResponse.json(
      {
        error: 'Logout failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
