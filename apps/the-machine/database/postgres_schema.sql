-- The Machine - PostgreSQL Database Schema
--
-- This schema provides:
-- 1. Risk assessments (full audit trail)
-- 2. Audit logs (all system actions)
-- 3. System settings (configurable parameters)
-- 4. Operators (user management)
-- 5. Threat patterns (pattern recognition)
-- 6. Constraint checks (security constraints)

-- =====================================================
-- TABLE: machine_operators
-- =====================================================

CREATE TABLE IF NOT EXISTS machine_operators (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'operator', 'viewer')),
  created_at BIGINT NOT NULL,
  last_login BIGINT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  settings JSONB
);

CREATE INDEX IF NOT EXISTS idx_operators_email ON machine_operators(email);
CREATE INDEX IF NOT EXISTS idx_operators_is_active ON machine_operators(is_active);

-- =====================================================
-- TABLE: machine_assessments
-- =====================================================

CREATE TABLE IF NOT EXISTS machine_assessments (
  id VARCHAR(255) PRIMARY KEY,
  operator_id VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255) NOT NULL,

  -- Threat Identification
  who_at_risk JSONB NOT NULL,
  harm_type VARCHAR(100) NOT NULL,
  harm_description TEXT NOT NULL,
  time_frame VARCHAR(50) NOT NULL,
  location TEXT,
  perpetrator TEXT,

  -- Threat Estimate
  probability VARCHAR(50) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  uncertainty VARCHAR(50) NOT NULL,
  data_quality VARCHAR(50) NOT NULL,
  rationale TEXT NOT NULL,
  rationale_brief TEXT,

  -- Reasoning (for AI analysis)
  facts JSONB DEFAULT '[]',
  inferences JSONB DEFAULT '[]',
  speculation JSONB DEFAULT '[]',
  key_assumptions JSONB DEFAULT '[]',

  -- Computed values
  risk_score INTEGER NOT NULL,
  risk_level VARCHAR(50) NOT NULL,
  requires_immediate_action BOOLEAN DEFAULT false,

  -- Intervention Options
  options JSONB NOT NULL,
  recommendation TEXT,

  -- Flags & Status
  flags JSONB NOT NULL DEFAULT '[]',
  status VARCHAR(50) NOT NULL DEFAULT 'draft',

  -- Operator decision
  operator_decision TEXT,
  operator_notes TEXT,
  decided_at BIGINT,

  -- Privacy tracking
  contains_personal_data BOOLEAN DEFAULT false,
  data_retention_status VARCHAR(50) DEFAULT 'active',
  retention_authorized_by VARCHAR(255),
  retention_authorized_until BIGINT,
  anonymized_at BIGINT,

  -- Execution details
  executed_at TIMESTAMP,
  executed_option VARCHAR(255),
  execution_outcome TEXT,
  execution_notes TEXT,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessments_created_by ON machine_assessments(created_by);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON machine_assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_risk_level ON machine_assessments(risk_level);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON machine_assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_operator_id ON machine_assessments(operator_id);

-- =====================================================
-- TABLE: machine_intervention_options
-- =====================================================

CREATE TABLE IF NOT EXISTS machine_intervention_options (
  id VARCHAR(255) PRIMARY KEY,
  assessment_id VARCHAR(255) NOT NULL REFERENCES machine_assessments(id) ON DELETE CASCADE,
  option_id VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  rationale TEXT,
  expected_outcome TEXT NOT NULL,
  risks JSONB DEFAULT '[]',
  benefits JSONB DEFAULT '[]',
  confidence_level VARCHAR(50),
  effectiveness VARCHAR(50),
  is_reversible BOOLEAN DEFAULT false,
  violates_constraints BOOLEAN DEFAULT false,
  requires_extra_legal_action BOOLEAN DEFAULT false,
  extra_legal_justification TEXT,
  collateral_impact VARCHAR(50),
  legal_status VARCHAR(50),
  constraint_check_passed BOOLEAN,
  constraint_violations JSONB
);

CREATE INDEX IF NOT EXISTS idx_intervention_assessment ON machine_intervention_options(assessment_id);

-- =====================================================
-- TABLE: machine_audit_logs
-- =====================================================

CREATE TABLE IF NOT EXISTS machine_audit_logs (
  id VARCHAR(255) PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  operator VARCHAR(255) NOT NULL,
  action TEXT NOT NULL,
  justification TEXT,
  category VARCHAR(100) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  details TEXT NOT NULL,
  metadata JSONB,
  operator_id VARCHAR(255),
  assessment_id VARCHAR(255),
  constraint_check_passed BOOLEAN,
  constraint_violations JSONB,
  contains_personal_data BOOLEAN DEFAULT false,
  data_retention_status VARCHAR(50) DEFAULT 'active'
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_operator ON machine_audit_logs(operator);
CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON machine_audit_logs(category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON machine_audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON machine_audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_assessment_id ON machine_audit_logs(assessment_id);

-- =====================================================
-- TABLE: machine_settings
-- =====================================================

CREATE TABLE IF NOT EXISTS machine_settings (
  key VARCHAR(255) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(255) NOT NULL,
  description TEXT,
  value_type VARCHAR(50) NOT NULL,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  previous_value TEXT,
  change_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_settings_value_type ON machine_settings(value_type);
CREATE INDEX IF NOT EXISTS idx_settings_is_locked ON machine_settings(is_locked);

-- =====================================================
-- TABLE: machine_constraint_checks
-- =====================================================

CREATE TABLE IF NOT EXISTS machine_constraint_checks (
  id VARCHAR(255) PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  operator VARCHAR(255) NOT NULL,
  action_description TEXT NOT NULL,
  context TEXT,
  passed BOOLEAN NOT NULL,
  violations JSONB,
  assessment_id VARCHAR(255),
  should_shutdown BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_constraint_checks_passed ON machine_constraint_checks(passed);
CREATE INDEX IF NOT EXISTS idx_constraint_checks_should_shutdown ON machine_constraint_checks(should_shutdown);
CREATE INDEX IF NOT EXISTS idx_constraint_checks_timestamp ON machine_constraint_checks(timestamp DESC);

-- =====================================================
-- TABLE: machine_constraint_violations
-- =====================================================

CREATE TABLE IF NOT EXISTS machine_constraint_violations (
  id VARCHAR(255) PRIMARY KEY,
  timestamp BIGINT NOT NULL,
  constraint_id VARCHAR(255) NOT NULL,
  constraint_name VARCHAR(255) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  action_attempted TEXT NOT NULL,
  violation_reason TEXT NOT NULL,
  context TEXT,
  operator_id VARCHAR(255),
  blocked BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_violations_timestamp ON machine_constraint_violations(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_violations_constraint ON machine_constraint_violations(constraint_id);

-- =====================================================
-- TABLE: machine_shutdown_events
-- =====================================================

CREATE TABLE IF NOT EXISTS machine_shutdown_events (
  id VARCHAR(255) PRIMARY KEY,
  timestamp BIGINT NOT NULL,
  operator_id VARCHAR(255) NOT NULL,
  shutdown_reason TEXT NOT NULL,
  emergency_shutdown BOOLEAN NOT NULL DEFAULT false,
  acknowledged BOOLEAN NOT NULL DEFAULT false,
  acknowledged_at BIGINT,
  audit_log_id VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_shutdown_timestamp ON machine_shutdown_events(timestamp DESC);

-- =====================================================
-- TABLE: machine_threat_patterns
-- =====================================================

CREATE TABLE IF NOT EXISTS machine_threat_patterns (
  id VARCHAR(255) PRIMARY KEY,
  created_at BIGINT NOT NULL,
  pattern_name VARCHAR(255) NOT NULL,
  pattern_description TEXT NOT NULL,
  harm_type VARCHAR(100) NOT NULL,
  typical_timeframe VARCHAR(50) NOT NULL,
  typical_severity VARCHAR(50) NOT NULL,
  indicators JSONB NOT NULL DEFAULT '[]',
  keywords JSONB NOT NULL DEFAULT '[]',
  times_detected INTEGER DEFAULT 0,
  times_confirmed INTEGER DEFAULT 0,
  false_positive_rate REAL DEFAULT 0.0,
  created_by VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_patterns_harm_type ON machine_threat_patterns(harm_type);
CREATE INDEX IF NOT EXISTS idx_patterns_is_active ON machine_threat_patterns(is_active);

-- =====================================================
-- TABLE: machine_assessment_patterns
-- =====================================================

CREATE TABLE IF NOT EXISTS machine_assessment_patterns (
  id VARCHAR(255) PRIMARY KEY,
  assessment_id VARCHAR(255) NOT NULL REFERENCES machine_assessments(id) ON DELETE CASCADE,
  pattern_id VARCHAR(255) NOT NULL REFERENCES machine_threat_patterns(id) ON DELETE CASCADE,
  confidence REAL NOT NULL,
  detected_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_assessment_patterns_assessment ON machine_assessment_patterns(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_patterns_pattern ON machine_assessment_patterns(pattern_id);
CREATE INDEX IF NOT EXISTS idx_assessment_patterns_detected ON machine_assessment_patterns(detected_at);

-- =====================================================
-- TABLE: machine_operator_sessions
-- =====================================================

CREATE TABLE IF NOT EXISTS machine_operator_sessions (
  id VARCHAR(255) PRIMARY KEY,
  operator_id VARCHAR(255) NOT NULL,
  operator_email VARCHAR(255),
  operator_name VARCHAR(255),
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  ip_address VARCHAR(50),
  user_agent TEXT,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_sessions_is_active ON machine_operator_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_operator_id ON machine_operator_sessions(operator_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON machine_operator_sessions(started_at DESC);

-- =====================================================
-- INITIAL DATA: Default settings
-- =====================================================

INSERT INTO machine_settings (key, value, updated_by, description, value_type, is_locked)
VALUES
  ('alert_threshold', '60', 'system', 'Risk score threshold for operator alerts (0-100)', 'number', false),
  ('auto_monitor', 'true', 'system', 'Automatically monitor for new threats', 'boolean', false),
  ('require_approval', 'true', 'system', 'All interventions require explicit operator approval (IMMUTABLE)', 'boolean', true),
  ('log_retention_days', '365', 'system', 'Number of days to retain audit logs (30-3650)', 'number', false),
  ('data_encryption', 'true', 'system', 'Encrypt all data at rest (IMMUTABLE)', 'boolean', true),
  ('zero_knowledge', 'true', 'system', 'Minimal data collection, maximum privacy (IMMUTABLE)', 'boolean', true)
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- VIEWS
-- =====================================================

CREATE OR REPLACE VIEW recent_high_risk_assessments AS
SELECT
  id, created_at, created_by, harm_type, harm_description, risk_score, risk_level, status
FROM machine_assessments
WHERE risk_level IN ('high', 'critical')
ORDER BY created_at DESC
LIMIT 100;

CREATE OR REPLACE VIEW recent_critical_logs AS
SELECT
  id, timestamp, operator, action, category, details
FROM machine_audit_logs
WHERE severity = 'critical'
ORDER BY timestamp DESC
LIMIT 100;

CREATE OR REPLACE VIEW active_sessions AS
SELECT
  id, operator_id, operator_email, started_at, last_activity, ip_address
FROM machine_operator_sessions
WHERE is_active = true
ORDER BY last_activity DESC;

CREATE OR REPLACE VIEW constraint_failures AS
SELECT
  id, timestamp, operator, action_description, violations, should_shutdown
FROM machine_constraint_checks
WHERE passed = false
ORDER BY timestamp DESC
LIMIT 100;

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================

-- To apply this schema:
-- psql -h hostname -U username -d database_name -f postgres_schema.sql
