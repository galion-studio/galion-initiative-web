# The Machine - Database Setup Guide

Complete step-by-step guide to set up Cloudflare D1 database for The Machine.

---

## 📋 Prerequisites

- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)
- Logged in to Wrangler (`wrangler login`)

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create D1 Database

```bash
cd apps/the-machine
wrangler d1 create the-machine-db
```

**Expected Output**:
```
✅ Successfully created DB 'the-machine-db'

[[d1_databases]]
binding = "DB"
database_name = "the-machine-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Copy the `database_id`** (you'll need it in Step 2)

---

### Step 2: Update wrangler.toml

Open `wrangler.toml` and replace `YOUR_DATABASE_ID_HERE` with the database ID from Step 1:

```toml
[[d1_databases]]
binding = "DB"
database_name = "the-machine-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # <-- Paste here
```

---

### Step 3: Apply Database Schema

```bash
# For local development
wrangler d1 execute the-machine-db --local --file=database/schema.sql

# For production (after testing locally)
wrangler d1 execute the-machine-db --file=database/schema.sql
```

**Expected Output**:
```
🌀 Executing on local database the-machine-db (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) from database/schema.sql:
🚣 Executed 28 commands in 0.123s
```

---

### Step 4: Verify Setup

```bash
# Check that tables were created
wrangler d1 execute the-machine-db --local --command="SELECT name FROM sqlite_master WHERE type='table'"

# Should see:
# - assessments
# - audit_logs
# - settings
# - operator_sessions
# - constraint_checks
```

---

### Step 5: Check Default Settings

```bash
wrangler d1 execute the-machine-db --local --command="SELECT key, value, is_locked FROM settings"
```

**Expected Output**:
```
key                  | value | is_locked
---------------------|-------|----------
alert_threshold      | 60    | 0
auto_monitor         | true  | 0
require_approval     | true  | 1  (locked)
log_retention_days   | 365   | 0
data_encryption      | true  | 1  (locked)
zero_knowledge       | true  | 1  (locked)
```

---

## ✅ Setup Complete!

The database is now ready. You can:
- Create assessments via `/api/assessments`
- Log actions via `/api/audit-logs`
- Get/update settings via `/api/settings`

---

## 🧪 Testing the Database

### Test 1: Insert Mock Assessment

```bash
wrangler d1 execute the-machine-db --local --command="
INSERT INTO assessments (
  id, created_at, created_by,
  who_at_risk, harm_type, harm_description, time_frame,
  probability, severity, uncertainty, data_quality, rationale, risk_score, risk_level,
  options, recommendation, flags, status
) VALUES (
  'test-001',
  '2025-12-06T10:00:00Z',
  'operator-001',
  '[\"Test Person\"]',
  'physical-violence',
  'Test threat description',
  'medium-term',
  'medium',
  'moderate',
  'medium',
  'good',
  'Test rationale',
  50,
  'medium',
  '[]',
  'monitor',
  '[]',
  'draft'
)"
```

### Test 2: Query Assessments

```bash
wrangler d1 execute the-machine-db --local --command="SELECT id, created_by, harm_type, risk_score, status FROM assessments"
```

### Test 3: Insert Audit Log

```bash
wrangler d1 execute the-machine-db --local --command="
INSERT INTO audit_logs (
  id, timestamp, operator, action, category, severity, details
) VALUES (
  'log-001',
  '2025-12-06T10:00:00Z',
  'operator-001',
  'Test action',
  'system',
  'info',
  'Test log entry'
)"
```

### Test 4: Query Logs

```bash
wrangler d1 execute the-machine-db --local --command="SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 5"
```

---

## 🔌 API Integration

### Example: Fetch Assessments (from Next.js)

```typescript
// app/assess/page.tsx

'use client';

import { useEffect, useState } from 'react';

export default function AssessPage() {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    async function fetchAssessments() {
      const res = await fetch('/api/assessments?limit=10');
      const data = await res.json();
      setAssessments(data.data);
    }
    
    fetchAssessments();
  }, []);

  return (
    <div>
      <h1>Assessments</h1>
      {assessments.map((a) => (
        <div key={a.id}>{a.harm_description}</div>
      ))}
    </div>
  );
}
```

### Example: Create Assessment

```typescript
async function createAssessment(data) {
  const response = await fetch('/api/assessments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identification: {
        whoAtRisk: ['Person A'],
        harmType: 'physical-violence',
        harmDescription: 'Potential threat',
        timeFrame: 'imminent',
      },
      operatorId: 'operator-001',
    }),
  });

  const result = await response.json();
  console.log('Created assessment:', result.data.id);
}
```

### Example: Create Audit Log

```typescript
async function logAction(action, details) {
  await fetch('/api/audit-logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      operator: 'operator-001',
      action,
      category: 'system',
      severity: 'info',
      details,
    }),
  });
}
```

---

## 🔧 Troubleshooting

### Error: "no such table: assessments"

**Solution**: Schema not applied. Run:
```bash
wrangler d1 execute the-machine-db --local --file=database/schema.sql
```

### Error: "binding DB is not defined"

**Solution**: Update `wrangler.toml` with correct database_id

### Error: "database not found"

**Solution**: Create database first:
```bash
wrangler d1 create the-machine-db
```

### Local vs Production

- **Local**: Use `--local` flag for development
- **Production**: Omit `--local` flag to execute on production database

---

## 📊 Database Structure

### Tables Created:
1. **assessments** - Risk assessments
2. **audit_logs** - Complete action history
3. **settings** - System configuration
4. **operator_sessions** - Login tracking
5. **constraint_checks** - Constraint violations

### Views Created:
1. **recent_high_risk_assessments** - High/critical assessments
2. **recent_critical_logs** - Critical audit logs
3. **active_sessions** - Currently logged-in operators
4. **constraint_failures** - Failed constraint checks

### Triggers Created:
1. **update_assessments_timestamp** - Auto-update timestamps
2. **update_settings_timestamp** - Auto-update timestamps
3. **update_operator_sessions_activity** - Track last activity

---

## 🔐 Security Notes

1. **Encryption**: All D1 data is encrypted at rest automatically
2. **Access Control**: Only accessible via Workers/Pages (no public access)
3. **SQL Injection**: Always use prepared statements (see `src/lib/db.ts`)
4. **Audit Trail**: All writes create audit log entries

---

## 📦 Backup & Export

### Export Database

```bash
# Export all data
wrangler d1 export the-machine-db --output=backup.sql

# Export specific table
wrangler d1 execute the-machine-db --command="SELECT * FROM assessments" > assessments.json
```

### Import/Restore

```bash
# Restore from backup
wrangler d1 execute the-machine-db --file=backup.sql
```

---

## 🚀 Next Steps

After database setup:

1. ✅ Database created and schema applied
2. ⏳ Test API endpoints (POST/GET assessments, logs)
3. ⏳ Connect UI to real database (remove mock data)
4. ⏳ Deploy to Cloudflare Pages
5. ⏳ Set up automated backups

---

**Database Status**: ✅ Schema ready, API routes created  
**Next**: Test endpoints and connect UI

*Built for transparency, security, and auditability.* 🔒
