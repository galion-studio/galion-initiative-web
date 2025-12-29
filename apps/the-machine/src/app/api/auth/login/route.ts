/**
 * Login API Route
 * 
 * Authenticates operators and creates sessions
 * Logs all login attempts for audit trail
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSession, hashPassword } from '@/lib/auth';
import { getDatabaseForRequest } from '@/lib/db-local';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Get local development database
    const client = getDatabaseForRequest();

    // Find operator by email
    const operator = await client.getOperatorByEmail(email);

    if (!operator) {
      // Don't reveal if user exists or not (security best practice)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if operator is active
    if (!operator.is_active) {
      // Log failed login attempt
      await client.createAuditLog({
        id: `login-fail-${Date.now()}`,
        category: 'operator-action',
        severity: 'warning',
        action: 'Login attempt - inactive account',
        justification: `Operator ${operator.id} attempted login but account is inactive`,
        operatorId: operator.id,
        containsPersonalData: false,
      });

      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 403 }
      );
    }

    // TODO: In production, verify password hash
    // For now, we don't have passwords stored yet
    // const passwordHash = await hashPassword(password);
    // if (!operator.password_hash || operator.password_hash !== passwordHash) {
    //   return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    // }

    // Create session
    const authResult = await createSession(operator);

    if (!authResult.success || !authResult.session || !authResult.token) {
      return NextResponse.json(
        { error: authResult.error || 'Failed to create session' },
        { status: 500 }
      );
    }

    // Update last login time
    await client.updateOperatorLogin(operator.id);

    // Log successful login
    await client.createAuditLog({
      id: `login-${operator.id}-${Date.now()}`,
      category: 'operator-action',
      severity: 'info',
      action: 'Operator login',
      justification: `Operator ${operator.name} (${operator.role}) logged in successfully`,
      operatorId: operator.id,
      metadata: {
        email: operator.email,
        role: operator.role,
        sessionExpiresAt: authResult.session.expiresAt,
      },
      containsPersonalData: true,
    });

    // Return session token
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
        // Set session cookie
        'Set-Cookie': `session=${authResult.token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${8 * 60 * 60}`,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      {
        error: 'Login failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
