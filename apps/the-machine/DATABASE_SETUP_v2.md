# THE MACHINE v2.0 - Database Setup Guide

**Status**: Production-Ready Database Layer  
**Database**: Cloudflare D1 (SQLite)  
**Version**: 2.0.0

---

## 🎯 Quick Setup (5 Minutes)

### 1. Create D1 Database

```bash
# Navigate to The Machine directory
cd apps/the-machine

# Create the database
npx wrangler d1 create the-machine-db
```

**Expected Output:**
```
✅ Successfully created DB 'the-machine-db'

[[d1_databases]]
binding = "DB"
database_name = "the-machine-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 2. Update wrangler.toml

Copy the `database_id` from the output and add it to `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "the-machine-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Paste the ID you got
```

### 3. Run Database Migrations

```bash
# Apply the schema
npx wrangler d1 execute the-machine-db --file=./database/schema-v2.sql

# Verify schema
npx wrangler d1 execute the-machine-db --command="SELECT * FROM schema_version"
```

**Expected Output:**
```
version | applied_at
--------|------------
2.0.0   | 1701878400
```

### 4. Create First Operator (You!)

```bash
# Create your operator account
npx wrangler d1 execute the-machine-db --command="
  INSERT INTO operators (id, name, email, role, created_at, is_active)
  VALUES (
    'admin-001',
    'Admin Name',
    'admin@example.com',
    'admin',
    strftime('%s', 'now'),
    1
  )
"
```

### 5. Verify Setup

```bash
# Check that operator was created
npx wrangler d1 execute the-machine-db --command="SELECT * FROM operators"

# Check system settings
npx wrangler d1 execute the-machine-db --command="SELECT * FROM system_settings"
```

### 6. Test Locally

```bash
# Start development server with local D1
npm run dev

# The Machine will now use the database!
```

---

## 📋 Database Schema Overview

### Core Tables

**1. operators** - Human operators who use The Machine
- Tracks admin, operator, and viewer roles
- Session management
- Settings per operator

**2. assessments** - Risk assessments (4-step Finch protocol)
- Complete IDENTIFY → ESTIMATE → PROPOSE → FLAG workflow
- Privacy tracking
- Operator decisions

**3. intervention_options** - Proposed interventions
- Risk-benefit analysis
- Constraint checking
- Legal status

**4. audit_logs** - Complete audit trail
- Every action logged
- Justification required (Finch protocol!)
- Privacy compliance

**5. data_access_logs** - Personal data access tracking
- Justification for all data access
- Threat relevance documentation
- Anonymized individual tracking

**6. personal_data_records** - Privacy management
- Retention policies
- Auto-anonymization
- Profile prevention

**7. constraint_violations** - Security tracking
- All violation attempts logged
- Blocked actions recorded
- Pattern analysis

**8. shutdown_events** - Shutdown compliance
- Immediate acknowledgment
- Emergency shutdown tracking
- Operator audit

**9. threat_patterns** (NEW v2.0) - Pattern recognition
- Recognized threat patterns
- Statistics and confidence scores
- Active pattern matching

**10. system_settings** - Configuration
- Hard constraints (read-only!)
- Configurable thresholds
- Privacy settings

---

## 🔒 Privacy & Security Features

### Automatic Data Minimization
```sql
-- Data scheduled for deletion after retention period
SELECT * FROM privacy_overview;
```

### Audit Trail
```sql
-- All actions logged with justification
SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 10;
```

### Constraint Violations
```sql
-- Track all violation attempts
SELECT * FROM constraint_violations ORDER BY timestamp DESC;
```

---

## 📊 Useful Queries

### View Active Assessments
```sql
SELECT * FROM active_assessments;
```

### Critical Logs Needing Review
```sql
SELECT * FROM critical_audit_logs;
```

### Privacy Compliance Status
```sql
SELECT * FROM privacy_overview;
```

### High-Risk Assessments
```sql
SELECT 
  id, harm_description, risk_score, status
FROM assessments 
WHERE risk_score >= 60 
ORDER BY risk_score DESC;
```

### Operator Activity
```sql
SELECT 
  o.name,
  COUNT(a.id) as assessments_created,
  MAX(a.created_at) as last_assessment
FROM operators o
LEFT JOIN assessments a ON o.id = a.operator_id
GROUP BY o.id;
```

---

## 🚀 Production Deployment

### 1. Deploy Database to Production

```bash
# Database is automatically deployed with your Pages project
# Just make sure wrangler.toml has the correct database_id
```

### 2. Run Migrations on Production

```bash
# Apply schema to production database
npx wrangler d1 execute the-machine-db --remote --file=./database/schema-v2.sql
```

### 3. Create Production Operators

```bash
# Create operator accounts for your team
npx wrangler d1 execute the-machine-db --remote --command="
  INSERT INTO operators (id, name, email, role, created_at, is_active)
  VALUES 
    ('op-001', 'John Doe', 'john@example.com', 'operator', strftime('%s', 'now'), 1),
    ('op-002', 'Jane Smith', 'jane@example.com', 'operator', strftime('%s', 'now'), 1)
"
```

---

## 🔧 Maintenance

### Backup Database

```bash
# Export all data
npx wrangler d1 export the-machine-db --output=backup.sql
```

### Check Database Size

```bash
npx wrangler d1 execute the-machine-db --command="
  SELECT 
    (SELECT COUNT(*) FROM assessments) as assessments,
    (SELECT COUNT(*) FROM audit_logs) as audit_logs,
    (SELECT COUNT(*) FROM personal_data_records) as personal_data
"
```

### Clean Old Data (Privacy Compliance)

```bash
# Anonymize old personal data records
npx wrangler d1 execute the-machine-db --command="
  UPDATE personal_data_records 
  SET 
    retention_status = 'anonymized',
    anonymized_at = strftime('%s', 'now'),
    individual_ids = '[]'
  WHERE 
    scheduled_deletion_at < strftime('%s', 'now')
    AND retention_authorized = 0
"
```

---

## 📖 Migration from v1.0

The Machine v1.0 used in-memory storage. To migrate:

**1. Export existing in-memory data** (if any)
- This would require custom export scripts
- v1.0 data was not persistent

**2. Fresh v2.0 start recommended**
- v2.0 is a fresh start with persistent database
- No migration needed (v1.0 had no persistent data)

**3. Operators must be recreated**
- Use the operator creation command above
- Each operator gets a new ID

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Database created (`the-machine-db`)
- [ ] Schema applied (v2.0.0)
- [ ] At least one operator created
- [ ] System settings initialized
- [ ] Local development server connects to DB
- [ ] Can create test assessment
- [ ] Audit logs being created
- [ ] Privacy features active

---

## 🆘 Troubleshooting

### Error: "Database not configured"

**Solution**: Make sure `wrangler.toml` has the correct `database_id`

### Error: "Table doesn't exist"

**Solution**: Run the schema migration again
```bash
npx wrangler d1 execute the-machine-db --file=./database/schema-v2.sql
```

### Local dev not connecting to DB

**Solution**: Wrangler automatically provides a local D1 instance. Just run `npm run dev`

### Need to reset database

**Solution**: Delete and recreate
```bash
npx wrangler d1 delete the-machine-db
npx wrangler d1 create the-machine-db
# Then re-run setup steps
```

---

## 📚 Next Steps

1. **Read**: Review the database client code (`src/lib/db-client.ts`)
2. **Test**: Create a test assessment via the API
3. **Monitor**: Check audit logs to see activity
4. **Deploy**: Push to production when ready

---

**The Machine v2.0 - Database Layer Complete** 🛡️

*Persistent. Auditable. Privacy-by-design.*
