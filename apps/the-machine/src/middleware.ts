/**
 * The Machine - Authentication Middleware
 * 
 * Protects all routes except /login
 * Simple session-based authentication for admin access
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple session store (in production, use Redis or D1)
const sessions = new Map<string, { operatorId: string; expiresAt: number }>();

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes (no auth required)
  const publicRoutes = ['/login', '/api/login', '/api/logout'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionToken = request.cookies.get('machine_session')?.value;

  if (!sessionToken) {
    // No session, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify session
  const session = sessions.get(sessionToken);
  if (!session || session.expiresAt < Date.now()) {
    // Invalid or expired session
    sessions.delete(sessionToken);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Valid session - add operator ID to headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-operator-id', session.operatorId);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

// Export session management functions for use in API routes
export function createSession(operatorId: string): string {
  const sessionToken = generateSessionToken();
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

  sessions.set(sessionToken, { operatorId, expiresAt });

  return sessionToken;
}

export function deleteSession(sessionToken: string): void {
  sessions.delete(sessionToken);
}

export function getSession(sessionToken: string) {
  return sessions.get(sessionToken);
}

function generateSessionToken(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}
