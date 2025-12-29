/**
 * The Machine - Login API
 * 
 * POST /api/login - Authenticate operator
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/middleware';

// In production, store these in environment variables or database
const VALID_OPERATORS = new Map([
  ['operator-001', { password: 'admin123', name: 'Admin Operator', email: 'admin@machine.local' }],
  // Add more operators as needed
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operatorId, password } = body;

    if (!operatorId || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing credentials' },
        { status: 400 }
      );
    }

    // Verify credentials
    const operator = VALID_OPERATORS.get(operatorId);
    
    if (!operator || operator.password !== password) {
      // Log failed attempt (in production, log to audit system)
      console.warn(`Failed login attempt for operator: ${operatorId}`);
      
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session
    const sessionToken = createSession(operatorId);

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      operator: {
        id: operatorId,
        name: operator.name,
        email: operator.email,
      },
    });

    // Set secure cookie
    response.cookies.set('machine_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Log successful login (in production, log to audit system)
    console.log(`Operator ${operatorId} logged in successfully`);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
