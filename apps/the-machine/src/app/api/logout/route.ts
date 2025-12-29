/**
 * The Machine - Logout API
 * 
 * POST /api/logout - End operator session
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/middleware';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('machine_session')?.value;

    if (sessionToken) {
      // Delete session
      deleteSession(sessionToken);
    }

    // Clear cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete('machine_session');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
