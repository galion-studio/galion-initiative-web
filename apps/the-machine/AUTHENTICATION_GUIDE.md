# THE MACHINE v2.0 - Authentication System Guide

**Status**: ✅ Complete  
**Version**: 2.0.0  
**Security**: JWT-based sessions with role-based access control

---

## 🎯 Quick Start

### 1. Install Dependencies

```bash
cd apps/the-machine
npm install
```

This installs `jose` (JWT library) added to package.json.

### 2. Set JWT Secret (Environment Variable)

```bash
# Create .env.local
echo "JWT_SECRET=your-secret-key-change-in-production" > .env.local
```

**IMPORTANT**: Change this in production! Use a strong random string.

### 3. Create First Operator

```bash
# Make sure database is set up first (see DATABASE_SETUP_v2.md)
npx wrangler d1 execute the-machine-db --command="
  INSERT INTO operators (id, name, email, role, created_at, is_active)
  VALUES (
    'admin-001',
    'Admin User',
    'admin@example.com',
    'admin',
    strftime('%s', 'now'),
    1
  )
"
```

### 4. Test Login

```bash
# Start dev server
npm run dev

# Visit http://localhost:4200/login
# Email: admin@example.com
# Password: (any password works in dev mode)
```

---

## 📋 Features

### ✅ Implemented

**1. JWT-Based Sessions**
- 8-hour session duration
- Automatic expiration
- Secure HTTP-only cookies
- Token refresh capability

**2. Role-Based Access Control (RBAC)**
- **Admin**: Full access to everything
- **Operator**: Can create assessments, view data
- **Viewer**: Read-only access

**3. API Routes**
- `POST /api/auth/login` - Authenticate operator
- `POST /api/auth/logout` - End session
- `GET /api/auth/session` - Check current session
- `POST /api/auth/refresh` - Extend session

**4. Complete Audit Trail**
- All login attempts logged
- All logout events logged
- Session refresh logged
- Failed login attempts tracked

**5. Security Features**
- HTTP-only cookies (XSS protection)
- Secure flag (HTTPS only)
- SameSite=Strict (CSRF protection)
- 8-hour session timeout
- Inactive account detection

---

## 🔑 Authentication Flow

### Login Process

```
1. User submits email + password
   ↓
2. System looks up operator by email
   ↓
3. Verify operator is active
   ↓
4. Create JWT token with operator info
   ↓
5. Set secure HTTP-only cookie
   ↓
6. Log login event to audit trail
   ↓
7. Return session info to client
```

### Session Verification

```
1. Client makes request with token
   ↓
2. Extract token from Authorization header or cookie
   ↓
3. Verify JWT signature
   ↓
4. Check expiration
   ↓
5. Return session data
```

### Logout Process

```
1. Client sends logout request
   ↓
2. Verify current session
   ↓
3. Log logout event
   ↓
4. Clear session cookie
   ↓
5. Confirm logout
```

---

## 👥 Operator Roles

### Admin
**Full system access. Can do everything.**

Permissions:
- ✅ Create/view/approve/delete assessments
- ✅ Create/view/modify/delete operators
- ✅ View/export audit logs
- ✅ Modify system settings
- ✅ Authorize data retention
- ✅ Shutdown system

Use cases:
- System administrators
- Security team leads
- Primary operators with full authority

### Operator
**Can assess threats and manage their own work.**

Permissions:
- ✅ Create/view/approve assessments
- ✅ View operators (list only)
- ✅ View audit logs (own logs only)
- ❌ Cannot delete assessments
- ❌ Cannot modify other operators
- ❌ Cannot export audit logs
- ❌ Cannot modify settings
- ❌ Cannot shutdown system

Use cases:
- Threat analysts
- Regular operators
- Team members doing assessments

### Viewer
**Read-only access. Cannot modify anything.**

Permissions:
- ✅ View assessments
- ✅ View operators
- ✅ View audit logs
- ❌ Cannot create/modify/delete anything

Use cases:
- Auditors
- Oversight personnel
- Read-only monitoring

---

## 🔐 Security Features

### JWT Tokens

**Structure:**
```json
{
  "operatorId": "admin-001",
  "operatorName": "Admin User",
  "operatorEmail": "admin@example.com",
  "role": "admin",
  "iat": 1701878400,
  "exp": 1701907200
}
```

**Security:**
- Signed with HS256 algorithm
- Secret key from environment variable
- Includes expiration time (8 hours)
- Cannot be modified without invalidating signature

### Session Cookies

**Configuration:**
```
Name: session
Value: <JWT_TOKEN>
HttpOnly: true      (prevents JavaScript access)
Secure: true        (HTTPS only)
SameSite: Strict    (CSRF protection)
Max-Age: 28800      (8 hours)
```

### Password Hashing

**Current (Development):**
- Simple SHA-256 hash
- **NOT SECURE FOR PRODUCTION**

**Production TODO:**
```typescript
// Use bcrypt or argon2
import bcrypt from 'bcrypt';

// Hash password
const hash = await bcrypt.hash(password, 10);

// Verify password
const valid = await bcrypt.compare(password, hash);
```

---

## 🛡️ Permission System

### Checking Permissions

```typescript
import { hasPermission, requirePermission } from '@/lib/auth';

// Check if operator has permission
const check = hasPermission('operator', 'createAssessment');
if (check.allowed) {
  // Proceed
} else {
  console.log(check.reason); // "Role 'operator' does not have permission..."
}

// Require permission (throws error if denied)
requirePermission('admin', 'deleteOperator');
```

### Permission Types

```typescript
type Permission =
  | 'createAssessment'
  | 'viewAssessments'
  | 'approveAssessment'
  | 'deleteAssessment'
  | 'createOperator'
  | 'viewOperators'
  | 'modifyOperator'
  | 'deleteOperator'
  | 'viewAuditLogs'
  | 'exportAuditLogs'
  | 'modifySettings'
  | 'shutdownSystem'
  | 'authorizeDataRetention';
```

### Permission Matrix

| Permission | Admin | Operator | Viewer |
|-----------|-------|----------|---------|
| Create Assessment | ✅ | ✅ | ❌ |
| View Assessments | ✅ | ✅ | ✅ |
| Approve Assessment | ✅ | ✅ | ❌ |
| Delete Assessment | ✅ | ❌ | ❌ |
| Create Operator | ✅ | ❌ | ❌ |
| View Operators | ✅ | ✅ | ✅ |
| Modify Operator | ✅ | ❌ | ❌ |
| Delete Operator | ✅ | ❌ | ❌ |
| View Audit Logs | ✅ | ✅ (own) | ✅ |
| Export Audit Logs | ✅ | ❌ | ❌ |
| Modify Settings | ✅ | ❌ | ❌ |
| Shutdown System | ✅ | ❌ | ❌ |
| Authorize Data Retention | ✅ | ❌ | ❌ |

---

## 📡 API Usage

### Login

```bash
curl -X POST http://localhost:4200/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-password"
  }'
```

**Response:**
```json
{
  "success": true,
  "session": {
    "operatorId": "admin-001",
    "operatorName": "Admin User",
    "operatorEmail": "admin@example.com",
    "role": "admin",
    "expiresAt": 1701907200000
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Check Session

```bash
curl http://localhost:4200/api/auth/session \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "authenticated": true,
  "operator": {
    "id": "admin-001",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  },
  "session": {
    "expiresAt": 1701907200000,
    "expiresIn": "7h 58m",
    "expiringSoon": false
  }
}
```

### Refresh Session

```bash
curl -X POST http://localhost:4200/api/auth/refresh \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "session": {
    "operatorId": "admin-001",
    "operatorName": "Admin User",
    "operatorEmail": "admin@example.com",
    "role": "admin",
    "expiresAt": 1701936000000
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Logout

```bash
curl -X POST http://localhost:4200/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🔧 Implementation Details

### File Structure

```
src/
├── lib/
│   └── auth.ts                 # Authentication library
├── app/
│   ├── login/
│   │   └── page.tsx            # Login UI
│   └── api/
│       └── auth/
│           ├── login/route.ts   # Login endpoint
│           ├── logout/route.ts  # Logout endpoint
│           ├── session/route.ts # Session check
│           └── refresh/route.ts # Session refresh
```

### Using in API Routes

```typescript
import { requireAuth, hasPermission } from '@/lib/auth';

export async function POST(request: Request) {
  // Require authentication
  const session = await requireAuth(request);
  
  // Check permission
  const permCheck = hasPermission(session.role, 'createAssessment');
  if (!permCheck.allowed) {
    return NextResponse.json(
      { error: permCheck.reason },
      { status: 403 }
    );
  }
  
  // Proceed with authenticated request
  // ...
}
```

### Using in Client Components

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function ProtectedPage() {
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/session', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('session_token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.authenticated) {
        setSession(data);
      } else {
        // Redirect to login
        window.location.href = '/login';
      }
    });
  }, []);
  
  if (!session) return <div>Loading...</div>;
  
  return <div>Welcome, {session.operator.name}!</div>;
}
```

---

## ✅ Testing

### Test Login Flow

1. **Create test operator:**
   ```bash
   npx wrangler d1 execute the-machine-db --command="
     INSERT INTO operators (id, name, email, role, created_at, is_active)
     VALUES ('test-op-001', 'Test Operator', 'test@example.com', 'operator', strftime('%s', 'now'), 1)
   "
   ```

2. **Test login:**
   ```bash
   curl -X POST http://localhost:4200/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

3. **Verify session:**
   ```bash
   # Use token from login response
   curl http://localhost:4200/api/auth/session \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

4. **Check audit logs:**
   ```bash
   npx wrangler d1 execute the-machine-db --command="
     SELECT * FROM audit_logs 
     WHERE category = 'operator-action' 
     ORDER BY timestamp DESC 
     LIMIT 5
   "
   ```

---

## 🚧 Production Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to strong random value
- [ ] Implement proper password hashing (bcrypt/argon2)
- [ ] Enable HTTPS (Cloudflare Pages does this automatically)
- [ ] Add rate limiting to login endpoint
- [ ] Implement account lockout after failed attempts
- [ ] Add 2FA/MFA support
- [ ] Set up session blacklist for logout
- [ ] Configure CORS properly
- [ ] Add IP logging for login attempts
- [ ] Set up monitoring for failed logins
- [ ] Create operator management UI
- [ ] Add password reset flow
- [ ] Implement password complexity requirements
- [ ] Add session timeout warnings to UI

---

## 🆘 Troubleshooting

### "Invalid or expired session"

**Cause**: Token expired or invalid JWT secret

**Solution**: 
- Check JWT_SECRET is set correctly
- Session may have expired (8 hour limit)
- Try logging in again

### "Account is inactive"

**Cause**: Operator's `is_active` flag is 0

**Solution**:
```bash
npx wrangler d1 execute the-machine-db --command="
  UPDATE operators 
  SET is_active = 1 
  WHERE email = 'operator@example.com'
"
```

### "Permission denied"

**Cause**: Operator role doesn't have required permission

**Solution**: Check permission matrix above and assign appropriate role

---

## 📚 Next Steps

1. ✅ **Multi-Operator Auth** - COMPLETE
2. **API Integration** - Connect routes to use auth
3. **Pattern Recognition** - Threat pattern matching
4. **Real-time Dashboard** - Live monitoring

---

**The Machine v2.0 - Authentication System Complete** 🛡️

*Secure. Auditable. Role-based access control.*
