# The Machine - Database Documentation

## Overview

The Machine uses **Cloudflare D1** (SQLite-based) for data persistence.

---

## Tables

### 1. **assessments**
Stores all risk assessments created by operators.

**Key Fields**:
- `id` - Unique assessment ID
- `created_by` - Operator who created it
- `harm_type` - Type of threat
- `risk_score` - 0-100 score
- `risk_level` - low/medium/high/critical
- `status` - draft/pending-approval/approved/rejected/executed

**Indexes**:
- `created_by` - Fast operator lookups
- `status` - Filter by status
- `risk_level` - Filter by severity
- `created_at` - Time-based queries

---

### 2. **audit_logs**
Complete audit trail of all system actions.

**Key Fields**:
- `id` - Unique log ID
- `timestamp` - When action occurred
- `operator` - Who performed it
- `action` - What was done
- `category` - assessment/intervention/system/constraint-check
- `severity` - info/warning/critical

**Indexes**:
- `operator` - Filter by who
- `category` - Filter by type
- `severity` - Filter by importance
- `timestamp` - Time-based queries

---

### 3. **settings**
System configuration parameters.

**Key Fields**:
- `key` - Setting name
- `value` - JSON-encoded value
- `is_locked` - 1 = immutable (hard constraint)
- `value_type` - number/boolean/string/json

**Default Settings**:
- `alert_threshold` - 60 (risk score for alerts)
- `auto_monitor` - true (continuous monitoring)
- `require_approval` - true (LOCKED - hard constraint)
- `log_retention_days` - 365
- `data_encryption` - true (LOCKED)
- `zero_knowledge` - true (LOCKED)

---

### 4. **operator_sessions**
Track operator login/logout for security.

**Key Fields**:
- `id` - Unique session ID
- `operator_id` - Operator ID
- `started_at` - Login time
- `last_activity` - Last action time
- `ended_at` - Logout time (NULL if active)
- `is_active` - 1 = currently logged in

---

### 5. **constraint_checks**
Detailed history of all constraint checks.

**Key Fields**:
- `id` - Unique check ID
- `action_description` - What was being checked
- `passed` - 1 = passed, 0 = failed
- `violations` - JSON array of violations
- `should_shutdown` - 1 = critical, shutdown required

---

## Setup Instructions

### 1. Create D1 Database

```bash
# Create new D1 database
wrangler d1 create the-machine-db
```

**Output**:
```
✅ Successfully created DB 'the-machine-db'
binding = "DB"
database_name = "the-machine-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Copy the `database_id` to `wrangler.toml`**:

```toml
[[d1_databases]]
binding = "DB"
database_name = "the-machine-db"
database_id = "YOUR_DATABASE_ID_HERE"
```

---

### 2. Apply Schema

```bash
# Local development
wrangler d1 execute the-machine-db --local --file=database/schema.sql

# Production
wrangler d1 execute the-machine-db --file=database/schema.sql
```

---

### 3. Verify Setup

```bash
# Check tables
wrangler d1 execute the-machine-db --local --command="SELECT name FROM sqlite_master WHERE type='table'"

# Check default settings
wrangler d1 execute the-machine-db --local --command="SELECT * FROM settings"
```

---

## Common Queries

### Get Recent Assessments
```sql
SELECT 
  id,
  created_at,
  created_by,
  harm_type,
  risk_score,
  status
FROM assessments
ORDER BY created_at DESC
LIMIT 10;
```

### Get Recent Audit Logs
```sql
SELECT 
  timestamp,
  operator,
  action,
  severity,
  details
FROM audit_logs
ORDER BY timestamp DESC
LIMIT 20;
```

### Get High-Risk Assessments
```sql
SELECT * FROM recent_high_risk_assessments;
-- (This is a pre-defined view)
```

### Get Active Sessions
```sql
SELECT * FROM active_sessions;
-- (This is a pre-defined view)
```

### Get Constraint Failures
```sql
SELECT * FROM constraint_failures;
-- (This is a pre-defined view)
```

---

## Migrations

### Create Migration File

```bash
# Format: YYYYMMDD_description.sql
# Example: 20251206_add_operator_roles.sql
```

**Example Migration**:
```sql
-- 20251206_add_operator_roles.sql

-- Add role field to operator_sessions
ALTER TABLE operator_sessions ADD COLUMN role TEXT DEFAULT 'operator';

-- Create index
CREATE INDEX idx_operator_sessions_role ON operator_sessions(role);
```

**Apply**:
```bash
wrangler d1 execute the-machine-db --file=database/migrations/20251206_add_operator_roles.sql
```

---

## Data Access (API)

### From Cloudflare Workers

```typescript
import { Env } from './types';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Get all settings
    const { results } = await env.DB.prepare(
      'SELECT * FROM settings'
    ).all();
    
    return Response.json(results);
  },
};
```

### From Next.js API Routes

```typescript
// app/api/assessments/route.ts

import { getRequestContext } from '@cloudflare/next-on-pages';

export async function GET() {
  const { env } = getRequestContext();
  
  const { results } = await env.DB.prepare(
    'SELECT * FROM assessments ORDER BY created_at DESC LIMIT 10'
  ).all();
  
  return Response.json(results);
}
```

---

## Security Considerations

### 1. **Encrypted at Rest**
- All D1 data is encrypted automatically by Cloudflare
- No additional configuration needed

### 2. **Access Control**
- D1 only accessible via Workers/Pages
- No direct public access
- Authenticated requests only

### 3. **SQL Injection Prevention**
- Always use prepared statements
- Never concatenate user input into queries

**Bad**:
```typescript
const userId = request.params.id;
await env.DB.prepare(`SELECT * FROM users WHERE id = ${userId}`).all(); // ❌
```

**Good**:
```typescript
const userId = request.params.id;
await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).all(); // ✅
```

### 4. **Audit Everything**
- All writes should create audit log entries
- Log includes timestamp, operator, action

---

## Backup & Recovery

### Export Data (Backup)

```bash
# Export all tables to JSON
wrangler d1 export the-machine-db --output=backup.sql
```

### Import Data (Restore)

```bash
# Restore from backup
wrangler d1 execute the-machine-db --file=backup.sql
```

### Scheduled Backups

Use Cloudflare Workers Cron Triggers:

```toml
# wrangler.toml
[triggers]
crons = ["0 0 * * *"]  # Daily at midnight
```

```typescript
// Backup worker
export default {
  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    // Export data and store in R2
    // (implementation details...)
  },
};
```

---

## Performance Tips

### 1. **Use Indexes**
- All common queries have indexes
- Time-based queries use `DESC` indexes

### 2. **Limit Results**
- Always use `LIMIT` for large tables
- Paginate with `OFFSET`

### 3. **Use Views**
- Pre-defined views for common queries
- Optimized with indexes

### 4. **Batch Operations**
- Use transactions for multiple inserts
- Reduces overhead

```typescript
// Batch insert
await env.DB.batch([
  env.DB.prepare('INSERT INTO audit_logs ...').bind(...),
  env.DB.prepare('INSERT INTO audit_logs ...').bind(...),
  env.DB.prepare('INSERT INTO audit_logs ...').bind(...),
]);
```

---

## Troubleshooting

### Error: "no such table"
**Solution**: Schema not applied. Run:
```bash
wrangler d1 execute the-machine-db --local --file=database/schema.sql
```

### Error: "database locked"
**Solution**: Close other connections to the database

### Error: "constraint failed"
**Solution**: Check for duplicate IDs or foreign key violations

---

## Schema Version

**Current Version**: 1.0.0  
**Last Updated**: December 6, 2025  
**Tables**: 5 (assessments, audit_logs, settings, operator_sessions, constraint_checks)  
**Views**: 4 (recent_high_risk_assessments, recent_critical_logs, active_sessions, constraint_failures)

---

## Next Steps

1. ✅ Schema designed
2. ⏳ Create D1 database
3. ⏳ Apply schema
4. ⏳ Create API routes
5. ⏳ Connect UI to database
6. ⏳ Test persistence

---

*Database designed for transparency, security, and auditability.* 🔒
