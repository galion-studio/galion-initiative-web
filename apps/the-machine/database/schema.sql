-- The Machine - Database Schema
-- Cloudflare D1 (SQLite-based)
-- 
-- This schema supports:
-- 1. Risk assessments (full audit trail)
-- 2. Audit logs (all system actions)
-- 3. System settings (configurable parameters)
-- 4. Operator sessions (authentication tracking)

-- =====================================================
-- TABLE: assessments
-- Stores all risk assessments created by operators
-- =====================================================

CREATE TABLE IF NOT EXISTS assessments (
  -- Primary key
  id TEXT PRIMARY KEY,
  
  -- Metadata
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT NOT NULL,  -- Operator ID
  
  -- Threat Identification (JSON)
  who_at_risk TEXT NOT NULL,  -- JSON array of people
  harm_type TEXT NOT NULL,    -- physical-violence, psychological-abuse, etc.
  harm_description TEXT NOT NULL,
  time_frame TEXT NOT NULL,   -- imminent, near-term, medium-term, long-term
  location TEXT,              -- Optional
  perpetrator TEXT,           -- Optional
  
  -- Threat Estimate (computed values)
  probability TEXT NOT NULL,  -- very-low, low, medium, high, very-high
  severity TEXT NOT NULL,     -- minor, moderate, serious, severe, critical
  uncertainty TEXT NOT NULL,  -- Confidence level
  data_quality TEXT NOT NULL, -- poor, fair, good, excellent
  rationale TEXT NOT NULL,    -- Brief explanation
  risk_score INTEGER NOT NULL, -- 0-100
  risk_level TEXT NOT NULL,   -- low, medium, high, critical
  
  -- Intervention Options (JSON)
  options TEXT NOT NULL,      -- JSON array of InterventionOption objects
  recommendation TEXT,        -- Recommended option ID
  
  -- Flags & Status
  flags TEXT NOT NULL,        -- JSON array of AssessmentFlag objects
  status TEXT NOT NULL DEFAULT 'draft', -- draft, pending-approval, approved, rejected, executed
  
  -- Operator notes
  operator_notes TEXT,
  
  -- Execution details (if intervention was executed)
  executed_at DATETIME,
  executed_option TEXT,
  execution_outcome TEXT,
  execution_notes TEXT
);

-- Index for quick lookup by operator
CREATE INDEX IF NOT EXISTS idx_assessments_created_by 
ON assessments(created_by);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_assessments_status 
ON assessments(status);

-- Index for risk level filtering
CREATE INDEX IF NOT EXISTS idx_assessments_risk_level 
ON assessments(risk_level);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS idx_assessments_created_at 
ON assessments(created_at DESC);

-- =====================================================
-- TABLE: audit_logs
-- Complete audit trail of all system actions
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  -- Primary key
  id TEXT PRIMARY KEY,
  
  -- Metadata
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  operator TEXT NOT NULL,    -- Operator ID or 'system'
  
  -- Action details
  action TEXT NOT NULL,      -- e.g., 'Created risk assessment', 'Executed intervention'
  category TEXT NOT NULL,    -- assessment, intervention, system, constraint-check
  severity TEXT NOT NULL,    -- info, warning, critical
  
  -- Description
  details TEXT NOT NULL,     -- Human-readable description
  
  -- Additional metadata (JSON)
  metadata TEXT,             -- JSON object with context-specific data
  
  -- Related entities
  assessment_id TEXT,        -- FK to assessments (if related)
  
  -- Constraint check results (if applicable)
  constraint_check_passed INTEGER, -- 1 = passed, 0 = failed, NULL = not applicable
  constraint_violations TEXT       -- JSON array of violations (if any)
);

-- Index for filtering by operator
CREATE INDEX IF NOT EXISTS idx_audit_logs_operator 
ON audit_logs(operator);

-- Index for filtering by category
CREATE INDEX IF NOT EXISTS idx_audit_logs_category 
ON audit_logs(category);

-- Index for filtering by severity
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity 
ON audit_logs(severity);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp 
ON audit_logs(timestamp DESC);

-- Index for assessment-related logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_assessment_id 
ON audit_logs(assessment_id);

-- =====================================================
-- TABLE: settings
-- System configuration and parameters
-- =====================================================

CREATE TABLE IF NOT EXISTS settings (
  -- Primary key
  key TEXT PRIMARY KEY,      -- e.g., 'alert_threshold', 'auto_monitor'
  
  -- Value (JSON for flexibility)
  value TEXT NOT NULL,       -- JSON-encoded value
  
  -- Metadata
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT NOT NULL,  -- Operator ID or 'system'
  
  -- Description
  description TEXT,          -- Human-readable description
  
  -- Validation
  value_type TEXT NOT NULL,  -- 'number', 'boolean', 'string', 'json'
  is_locked INTEGER NOT NULL DEFAULT 0, -- 1 = cannot be changed (hard constraint)
  
  -- Audit trail
  previous_value TEXT,       -- Previous value (for rollback)
  change_reason TEXT         -- Why was this changed?
);

-- Index for quick lookup by type
CREATE INDEX IF NOT EXISTS idx_settings_value_type 
ON settings(value_type);

-- Index for locked settings
CREATE INDEX IF NOT EXISTS idx_settings_is_locked 
ON settings(is_locked);

-- =====================================================
-- TABLE: operator_sessions
-- Track operator login/logout for security audit
-- =====================================================

CREATE TABLE IF NOT EXISTS operator_sessions (
  -- Primary key
  id TEXT PRIMARY KEY,
  
  -- Operator details
  operator_id TEXT NOT NULL,
  operator_email TEXT,
  operator_name TEXT,
  
  -- Session details
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_activity DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at DATETIME,         -- NULL if still active
  
  -- Session metadata
  ip_address TEXT,
  user_agent TEXT,
  
  -- Security
  session_token TEXT NOT NULL UNIQUE, -- Encrypted session token
  is_active INTEGER NOT NULL DEFAULT 1 -- 1 = active, 0 = ended
);

-- Index for finding active sessions
CREATE INDEX IF NOT EXISTS idx_operator_sessions_is_active 
ON operator_sessions(is_active);

-- Index for operator lookup
CREATE INDEX IF NOT EXISTS idx_operator_sessions_operator_id 
ON operator_sessions(operator_id);

-- Index for security audits
CREATE INDEX IF NOT EXISTS idx_operator_sessions_started_at 
ON operator_sessions(started_at DESC);

-- =====================================================
-- TABLE: constraint_checks
-- Detailed history of all constraint checks
-- (For advanced auditing and pattern analysis)
-- =====================================================

CREATE TABLE IF NOT EXISTS constraint_checks (
  -- Primary key
  id TEXT PRIMARY KEY,
  
  -- Metadata
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  operator TEXT NOT NULL,
  
  -- Check details
  action_description TEXT NOT NULL,
  context TEXT,              -- Additional context
  
  -- Results
  passed INTEGER NOT NULL,   -- 1 = passed, 0 = failed
  violations TEXT,           -- JSON array of ConstraintViolation objects
  
  -- Related entities
  assessment_id TEXT,        -- FK to assessments (if related)
  
  -- Critical flag
  should_shutdown INTEGER NOT NULL DEFAULT 0 -- 1 = critical violation, shutdown required
);

-- Index for finding failures
CREATE INDEX IF NOT EXISTS idx_constraint_checks_passed 
ON constraint_checks(passed);

-- Index for critical violations
CREATE INDEX IF NOT EXISTS idx_constraint_checks_should_shutdown 
ON constraint_checks(should_shutdown);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS idx_constraint_checks_timestamp 
ON constraint_checks(timestamp DESC);

-- =====================================================
-- TRIGGERS: Update timestamps automatically
-- =====================================================

-- Trigger for assessments
CREATE TRIGGER IF NOT EXISTS update_assessments_timestamp 
AFTER UPDATE ON assessments
BEGIN
  UPDATE assessments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger for settings
CREATE TRIGGER IF NOT EXISTS update_settings_timestamp 
AFTER UPDATE ON settings
BEGIN
  UPDATE settings SET updated_at = CURRENT_TIMESTAMP WHERE key = NEW.key;
END;

-- Trigger for operator sessions (last activity)
CREATE TRIGGER IF NOT EXISTS update_operator_sessions_activity 
AFTER UPDATE ON operator_sessions
WHEN NEW.is_active = 1
BEGIN
  UPDATE operator_sessions SET last_activity = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- =====================================================
-- INITIAL DATA: Default settings
-- =====================================================

-- Alert threshold (risk score)
INSERT OR IGNORE INTO settings (key, value, updated_by, description, value_type, is_locked)
VALUES (
  'alert_threshold',
  '60',
  'system',
  'Risk score threshold for operator alerts (0-100)',
  'number',
  0
);

-- Auto-monitoring
INSERT OR IGNORE INTO settings (key, value, updated_by, description, value_type, is_locked)
VALUES (
  'auto_monitor',
  'true',
  'system',
  'Automatically monitor for new threats',
  'boolean',
  0
);

-- Require operator approval (LOCKED - hard constraint)
INSERT OR IGNORE INTO settings (key, value, updated_by, description, value_type, is_locked)
VALUES (
  'require_approval',
  'true',
  'system',
  'All interventions require explicit operator approval (IMMUTABLE)',
  'boolean',
  1
);

-- Log retention days
INSERT OR IGNORE INTO settings (key, value, updated_by, description, value_type, is_locked)
VALUES (
  'log_retention_days',
  '365',
  'system',
  'Number of days to retain audit logs (30-3650)',
  'number',
  0
);

-- Data encryption (LOCKED - always on)
INSERT OR IGNORE INTO settings (key, value, updated_by, description, value_type, is_locked)
VALUES (
  'data_encryption',
  'true',
  'system',
  'Encrypt all data at rest (IMMUTABLE)',
  'boolean',
  1
);

-- Zero-knowledge architecture (LOCKED - always on)
INSERT OR IGNORE INTO settings (key, value, updated_by, description, value_type, is_locked)
VALUES (
  'zero_knowledge',
  'true',
  'system',
  'Minimal data collection, maximum privacy (IMMUTABLE)',
  'boolean',
  1
);

-- =====================================================
-- VIEWS: Useful queries for common operations
-- =====================================================

-- View: Recent high-risk assessments
CREATE VIEW IF NOT EXISTS recent_high_risk_assessments AS
SELECT 
  id,
  created_at,
  created_by,
  harm_type,
  harm_description,
  risk_score,
  risk_level,
  status
FROM assessments
WHERE risk_level IN ('high', 'critical')
ORDER BY created_at DESC
LIMIT 100;

-- View: Recent critical audit logs
CREATE VIEW IF NOT EXISTS recent_critical_logs AS
SELECT 
  id,
  timestamp,
  operator,
  action,
  category,
  details
FROM audit_logs
WHERE severity = 'critical'
ORDER BY timestamp DESC
LIMIT 100;

-- View: Active operator sessions
CREATE VIEW IF NOT EXISTS active_sessions AS
SELECT 
  id,
  operator_id,
  operator_email,
  started_at,
  last_activity,
  ip_address
FROM operator_sessions
WHERE is_active = 1
ORDER BY last_activity DESC;

-- View: Constraint check failures
CREATE VIEW IF NOT EXISTS constraint_failures AS
SELECT 
  id,
  timestamp,
  operator,
  action_description,
  violations,
  should_shutdown
FROM constraint_checks
WHERE passed = 0
ORDER BY timestamp DESC
LIMIT 100;

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================

-- This schema provides:
-- ✅ Complete audit trail (all actions logged)
-- ✅ Risk assessment storage (full history)
-- ✅ Constraint check tracking (detailed violations)
-- ✅ System settings (configurable parameters)
-- ✅ Operator session tracking (security)
-- ✅ Automatic timestamps (triggers)
-- ✅ Optimized indexes (fast queries)
-- ✅ Useful views (common queries)

-- Next steps:
-- 1. Create D1 database: wrangler d1 create the-machine-db
-- 2. Apply schema: wrangler d1 execute the-machine-db --file=database/schema.sql
-- 3. Test queries locally: wrangler d1 execute the-machine-db --command="SELECT * FROM settings"
