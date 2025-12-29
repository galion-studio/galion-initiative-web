/**
 * THE MACHINE v2.0 - Authentication & Session Management
 * 
 * Finch Protocol Compliance:
 * - Complete audit trail of all logins/logouts
 * - Role-based access control
 * - Session management
 * - No autonomous action (operator must authenticate)
 */

import { SignJWT, jwtVerify } from 'jose';
import type { Operator } from './db-client';

// =============================================================================
// TYPES
// =============================================================================

export type OperatorRole = 'admin' | 'operator' | 'viewer';

export interface Session {
  operatorId: string;
  operatorName: string;
  operatorEmail: string;
  role: OperatorRole;
  issuedAt: number;
  expiresAt: number;
}

export interface AuthResult {
  success: boolean;
  session?: Session;
  token?: string;
  error?: string;
}

export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SESSION_DURATION_HOURS = 8; // 8 hour sessions
const SESSION_DURATION_MS = SESSION_DURATION_HOURS * 60 * 60 * 1000;

// JWT secret key (in production, use environment variable)
const getJWTSecret = (): Uint8Array => {
  const secret = process.env.JWT_SECRET || 'the-machine-secret-key-change-in-production';
  return new TextEncoder().encode(secret);
};

// =============================================================================
// SESSION MANAGEMENT
// =============================================================================

/**
 * Create a new session for an operator
 * 
 * Finch Protocol: All operator sessions are logged for audit trail
 */
export async function createSession(operator: Operator): Promise<AuthResult> {
  try {
    const now = Date.now();
    const expiresAt = now + SESSION_DURATION_MS;

    const session: Session = {
      operatorId: operator.id,
      operatorName: operator.name,
      operatorEmail: operator.email,
      role: operator.role,
      issuedAt: now,
      expiresAt,
    };

    // Create JWT token
    const token = await new SignJWT({
      operatorId: session.operatorId,
      operatorName: session.operatorName,
      operatorEmail: session.operatorEmail,
      role: session.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(Math.floor(now / 1000))
      .setExpirationTime(Math.floor(expiresAt / 1000))
      .setSubject(session.operatorId)
      .sign(getJWTSecret());

    return {
      success: true,
      session,
      token,
    };
  } catch (error) {
    console.error('Session creation error:', error);
    return {
      success: false,
      error: 'Failed to create session',
    };
  }
}

/**
 * Verify a session token
 * 
 * Returns session data if valid, null if invalid/expired
 */
export async function verifySession(token: string): Promise<Session | null> {
  try {
    const verified = await jwtVerify(token, getJWTSecret());
    
    const payload = verified.payload as any;
    
    // Check if expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return {
      operatorId: payload.operatorId,
      operatorName: payload.operatorName,
      operatorEmail: payload.operatorEmail,
      role: payload.role,
      issuedAt: payload.iat * 1000,
      expiresAt: payload.exp * 1000,
    };
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

/**
 * Refresh a session (extend expiration)
 */
export async function refreshSession(currentToken: string): Promise<AuthResult> {
  const session = await verifySession(currentToken);
  
  if (!session) {
    return {
      success: false,
      error: 'Invalid or expired session',
    };
  }

  // Create new session with same operator
  const operator: Operator = {
    id: session.operatorId,
    name: session.operatorName,
    email: session.operatorEmail,
    role: session.role,
    created_at: 0, // Not needed for refresh
    is_active: true,
  };

  return createSession(operator);
}

/**
 * Revoke a session (logout)
 * 
 * Note: With JWT, we can't actually revoke tokens on the server side
 * unless we maintain a blacklist. For now, client should discard the token.
 */
export async function revokeSession(token: string): Promise<boolean> {
  // In a production system, add token to blacklist in database
  // For now, just verify it was valid
  const session = await verifySession(token);
  return session !== null;
}

// =============================================================================
// ROLE-BASED ACCESS CONTROL
// =============================================================================

/**
 * Permission matrix for different roles
 */
const PERMISSIONS = {
  admin: {
    // Admins can do everything
    createAssessment: true,
    viewAssessments: true,
    approveAssessment: true,
    deleteAssessment: true,
    createOperator: true,
    viewOperators: true,
    modifyOperator: true,
    deleteOperator: true,
    viewAuditLogs: true,
    exportAuditLogs: true,
    modifySettings: true,
    shutdownSystem: true,
    authorizeDataRetention: true,
  },
  operator: {
    // Operators can assess threats and view their own data
    createAssessment: true,
    viewAssessments: true,
    approveAssessment: true,
    deleteAssessment: false,
    createOperator: false,
    viewOperators: true,
    modifyOperator: false,
    deleteOperator: false,
    viewAuditLogs: true, // Can view own logs
    exportAuditLogs: false,
    modifySettings: false,
    shutdownSystem: false,
    authorizeDataRetention: false,
  },
  viewer: {
    // Viewers can only view (read-only access)
    createAssessment: false,
    viewAssessments: true,
    approveAssessment: false,
    deleteAssessment: false,
    createOperator: false,
    viewOperators: true,
    modifyOperator: false,
    deleteOperator: false,
    viewAuditLogs: true,
    exportAuditLogs: false,
    modifySettings: false,
    shutdownSystem: false,
    authorizeDataRetention: false,
  },
};

export type Permission = keyof typeof PERMISSIONS.admin;

/**
 * Check if an operator has a specific permission
 */
export function hasPermission(role: OperatorRole, permission: Permission): PermissionCheck {
  const rolePermissions = PERMISSIONS[role];
  const allowed = rolePermissions[permission];

  if (!allowed) {
    return {
      allowed: false,
      reason: `Role '${role}' does not have permission for '${permission}'`,
    };
  }

  return { allowed: true };
}

/**
 * Require a specific permission (throws error if not allowed)
 */
export function requirePermission(role: OperatorRole, permission: Permission): void {
  const check = hasPermission(role, permission);
  if (!check.allowed) {
    throw new Error(`Permission denied: ${check.reason}`);
  }
}

/**
 * Check if operator can access another operator's data
 */
export function canAccessOperatorData(
  requestingOperatorId: string,
  requestingRole: OperatorRole,
  targetOperatorId: string
): PermissionCheck {
  // Admins can access anyone's data
  if (requestingRole === 'admin') {
    return { allowed: true };
  }

  // Operators and viewers can only access their own data
  if (requestingOperatorId === targetOperatorId) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: 'Can only access your own operator data',
  };
}

// =============================================================================
// PASSWORD HASHING (Simple implementation - use bcrypt in production!)
// =============================================================================

/**
 * Hash a password
 * 
 * NOTE: This is a simple implementation for demonstration.
 * In production, use bcrypt or argon2!
 */
export async function hashPassword(password: string): Promise<string> {
  // In production: use bcrypt
  // const hash = await bcrypt.hash(password, 10);
  
  // Simple hash for demo (DO NOT USE IN PRODUCTION!)
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // In production: use bcrypt
  // return await bcrypt.compare(password, hash);
  
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// =============================================================================
// AUTHENTICATION HELPERS
// =============================================================================

/**
 * Extract session from request headers
 */
export function getSessionFromHeaders(headers: Headers): string | null {
  const authHeader = headers.get('Authorization');
  
  if (!authHeader) {
    return null;
  }

  // Support both "Bearer TOKEN" and just "TOKEN"
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return authHeader;
}

/**
 * Extract session from cookies
 */
export function getSessionFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';').map(c => c.trim());
  const sessionCookie = cookies.find(c => c.startsWith('session='));
  
  if (!sessionCookie) {
    return null;
  }

  return sessionCookie.substring('session='.length);
}

/**
 * Require authentication (middleware helper)
 */
export async function requireAuth(request: Request): Promise<Session> {
  // Try to get token from headers
  let token = getSessionFromHeaders(request.headers);
  
  // If not in headers, try cookies
  if (!token) {
    const cookieHeader = request.headers.get('Cookie');
    token = getSessionFromCookies(cookieHeader);
  }

  if (!token) {
    throw new Error('No authentication token provided');
  }

  const session = await verifySession(token);
  
  if (!session) {
    throw new Error('Invalid or expired session');
  }

  return session;
}

/**
 * Optional authentication (returns null if not authenticated)
 */
export async function optionalAuth(request: Request): Promise<Session | null> {
  try {
    return await requireAuth(request);
  } catch {
    return null;
  }
}

// =============================================================================
// SESSION UTILITIES
// =============================================================================

/**
 * Check if session is about to expire (within 1 hour)
 */
export function isSessionExpiringSoon(session: Session): boolean {
  const ONE_HOUR_MS = 60 * 60 * 1000;
  const timeUntilExpiry = session.expiresAt - Date.now();
  return timeUntilExpiry < ONE_HOUR_MS;
}

/**
 * Get session info for display
 */
export function getSessionInfo(session: Session): {
  operator: string;
  role: string;
  expiresIn: string;
  expiringSoon: boolean;
} {
  const expiresInMs = session.expiresAt - Date.now();
  const expiresInHours = Math.floor(expiresInMs / (60 * 60 * 1000));
  const expiresInMinutes = Math.floor((expiresInMs % (60 * 60 * 1000)) / (60 * 1000));

  return {
    operator: session.operatorName,
    role: session.role,
    expiresIn: `${expiresInHours}h ${expiresInMinutes}m`,
    expiringSoon: isSessionExpiringSoon(session),
  };
}
