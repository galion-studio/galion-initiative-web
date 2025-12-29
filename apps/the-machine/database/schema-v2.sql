-- THE MACHINE v2.0 - Complete Database Schema
-- Cloudflare D1 Compatible
-- Created: December 6, 2025

-- =============================================================================
-- OPERATORS TABLE
-- Tracks human operators who use The Machine
-- =============================================================================

CREATE TABLE IF NOT EXISTS operators (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'operator', 'viewer')),
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  last_login INTEGER,
  is_active INTEGER NOT NULL DEFAULT 1,
  settings TEXT, -- JSON
  UNIQUE(email)
);

CREATE INDEX idx_operators_email ON operators(email);
CREATE INDEX idx_operators_active ON operators(is_active);

-- =============================================================================
-- ASSESSMENTS TABLE
-- Stores all risk assessments (4-step Finch protocol)
-- =============================================================================

CREATE TABLE IF NOT EXISTS assessments (
  id TEXT PRIMARY KEY,
  operator_id TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  
  -- IDENTIFICATION (Step 1)
  who_at_risk TEXT NOT NULL, -- JSON array
  harm_type TEXT NOT NULL,
  harm_description TEXT NOT NULL,
  time_frame TEXT NOT NULL,
  location TEXT,
  perpetrator TEXT,
  
  -- ESTIMATION (Step 2)
  probability TEXT NOT NULL,
  severity TEXT NOT NULL,
  uncertainty TEXT NOT NULL,
  rationale_brief TEXT NOT NULL,
  data_quality TEXT NOT NULL,
  
  -- REASONING
  facts TEXT NOT NULL, -- JSON array
  inferences TEXT NOT NULL, -- JSON array
  speculation TEXT NOT NULL, -- JSON array
  key_assumptions TEXT NOT NULL, -- JSON array
  
  -- METADATA
  risk_score INTEGER NOT NULL,
  requires_immediate_action INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'pending-approval', 'approved', 'rejected', 'executed')),
  
  -- OPERATOR DECISION
  operator_decision TEXT,
  operator_notes TEXT,
  decided_at INTEGER,
  
  -- PRIVACY
  contains_personal_data INTEGER NOT NULL DEFAULT 0,
  data_retention_status TEXT NOT NULL DEFAULT 'active',
  retention_authorized_by TEXT,
  retention_authorized_until INTEGER,
  anonymized_at INTEGER,
  
  FOREIGN KEY (operator_id) REFERENCES operators(id),
  FOREIGN KEY (retention_authorized_by) REFERENCES operators(id)
);

CREATE INDEX idx_assessments_operator ON assessments(operator_id);
CREATE INDEX idx_assessments_created ON assessments(created_at);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_risk_score ON assessments(risk_score);
CREATE INDEX idx_assessments_harm_type ON assessments(harm_type);

-- =============================================================================
-- INTERVENTION_OPTIONS TABLE
-- Stores proposed intervention options (Step 3 - PROPOSE)
-- =============================================================================

CREATE TABLE IF NOT EXISTS intervention_options (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL,
  option_id TEXT NOT NULL, -- 'monitor', 'alert', 'intervene'
  description TEXT NOT NULL,
  rationale TEXT NOT NULL,
  expected_outcome TEXT NOT NULL,
  
  -- RISK-BENEFIT ANALYSIS
  risks TEXT NOT NULL, -- JSON array
  benefits TEXT NOT NULL, -- JSON array
  confidence_level TEXT NOT NULL,
  effectiveness TEXT NOT NULL,
  
  -- FLAGS
  is_reversible INTEGER NOT NULL,
  violates_constraints INTEGER NOT NULL DEFAULT 0,
  requires_extra_legal_action INTEGER NOT NULL DEFAULT 0,
  extra_legal_justification TEXT,
  collateral_impact TEXT NOT NULL,
  legal_status TEXT NOT NULL,
  
  -- CONSTRAINT CHECK
  constraint_check_passed INTEGER NOT NULL,
  constraint_violations TEXT, -- JSON array
  
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE INDEX idx_options_assessment ON intervention_options(assessment_id);
CREATE INDEX idx_options_constraints ON intervention_options(violates_constraints);

-- =============================================================================
-- AUDIT_LOGS TABLE
-- Complete audit trail - EVERY action logged with justification
-- =============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  timestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  
  -- CLASSIFICATION
  category TEXT NOT NULL CHECK(category IN (
    'assessment', 'intervention', 'data-access', 'ai-query', 
    'constraint-check', 'operator-action', 'system-event', 
    'shutdown', 'self-expansion-attempt'
  )),
  severity TEXT NOT NULL CHECK(severity IN ('info', 'warning', 'error', 'critical')),
  
  -- CONTENT
  action TEXT NOT NULL,
  justification TEXT NOT NULL, -- REQUIRED - why this action happened
  operator_id TEXT,
  
  -- DETAILS
  metadata TEXT, -- JSON
  
  -- PRIVACY TRACKING
  contains_personal_data INTEGER NOT NULL DEFAULT 0,
  data_retention_status TEXT NOT NULL DEFAULT 'active',
  retention_authorized_by TEXT,
  retention_authorized_until INTEGER,
  anonymized_at INTEGER,
  
  -- CONSTRAINT COMPLIANCE
  constraint_check_passed INTEGER,
  constraint_violations TEXT, -- JSON
  
  -- REVIEW STATUS
  reviewed_by TEXT,
  reviewed_at INTEGER,
  review_notes TEXT,
  
  FOREIGN KEY (operator_id) REFERENCES operators(id),
  FOREIGN KEY (retention_authorized_by) REFERENCES operators(id),
  FOREIGN KEY (reviewed_by) REFERENCES operators(id)
);

CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_category ON audit_logs(category);
CREATE INDEX idx_audit_severity ON audit_logs(severity);
CREATE INDEX idx_audit_operator ON audit_logs(operator_id);
CREATE INDEX idx_audit_personal_data ON audit_logs(contains_personal_data);
CREATE INDEX idx_audit_review ON audit_logs(reviewed_by);

-- =============================================================================
-- DATA_ACCESS_LOGS TABLE
-- Special audit category - tracks all personal data access
-- =============================================================================

CREATE TABLE IF NOT EXISTS data_access_logs (
  id TEXT PRIMARY KEY,
  audit_log_id TEXT NOT NULL UNIQUE,
  timestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  
  -- DATA ACCESS SPECIFICS
  data_type TEXT NOT NULL,
  data_source TEXT NOT NULL,
  access_reason TEXT NOT NULL,
  threat_relevance TEXT NOT NULL, -- Why accessing this data helps prevent harm
  
  -- PRIVACY
  personal_data_types TEXT NOT NULL, -- JSON array
  individuals_affected TEXT NOT NULL, -- JSON array (anonymized IDs)
  individuals_affected_count INTEGER NOT NULL,
  
  -- JUSTIFICATION (required by Finch protocol)
  justification TEXT NOT NULL,
  
  operator_id TEXT,
  
  FOREIGN KEY (audit_log_id) REFERENCES audit_logs(id) ON DELETE CASCADE,
  FOREIGN KEY (operator_id) REFERENCES operators(id)
);

CREATE INDEX idx_data_access_timestamp ON data_access_logs(timestamp);
CREATE INDEX idx_data_access_operator ON data_access_logs(operator_id);

-- =============================================================================
-- PERSONAL_DATA_RECORDS TABLE
-- Tracks all personal data with retention policies
-- =============================================================================

CREATE TABLE IF NOT EXISTS personal_data_records (
  id TEXT PRIMARY KEY,
  data_type TEXT NOT NULL,
  classification TEXT NOT NULL CHECK(classification IN ('public', 'private', 'sensitive', 'highly-sensitive')),
  
  -- INDIVIDUALS (anonymized)
  individual_ids TEXT NOT NULL, -- JSON array of anonymized IDs
  
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  accessed_by TEXT NOT NULL,
  
  -- PURPOSE
  purpose TEXT NOT NULL CHECK(purpose IN ('threat-assessment', 'harm-prevention', 'intervention-planning', 'operator-query')),
  threat_relevance TEXT NOT NULL,
  
  -- RETENTION TRACKING
  retention_status TEXT NOT NULL DEFAULT 'active' CHECK(retention_status IN ('active', 'pending-deletion', 'anonymized', 'deleted')),
  retention_authorized INTEGER NOT NULL DEFAULT 0,
  retention_authorized_by TEXT,
  retention_authorized_until INTEGER,
  scheduled_deletion_at INTEGER NOT NULL,
  
  -- PRIVACY FLAGS
  anonymized INTEGER NOT NULL DEFAULT 0,
  anonymized_at INTEGER,
  deleted_at INTEGER,
  
  FOREIGN KEY (accessed_by) REFERENCES operators(id),
  FOREIGN KEY (retention_authorized_by) REFERENCES operators(id)
);

CREATE INDEX idx_pdata_created ON personal_data_records(created_at);
CREATE INDEX idx_pdata_classification ON personal_data_records(classification);
CREATE INDEX idx_pdata_status ON personal_data_records(retention_status);
CREATE INDEX idx_pdata_deletion ON personal_data_records(scheduled_deletion_at);

-- =============================================================================
-- CONSTRAINT_VIOLATIONS TABLE
-- Tracks all constraint violation attempts (for security analysis)
-- =============================================================================

CREATE TABLE IF NOT EXISTS constraint_violations (
  id TEXT PRIMARY KEY,
  timestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  
  constraint_id TEXT NOT NULL,
  constraint_name TEXT NOT NULL,
  severity TEXT NOT NULL,
  
  action_attempted TEXT NOT NULL,
  violation_reason TEXT NOT NULL,
  context TEXT,
  
  operator_id TEXT,
  blocked INTEGER NOT NULL DEFAULT 1, -- Was the action blocked?
  
  -- AUDIT
  audit_log_id TEXT,
  
  FOREIGN KEY (operator_id) REFERENCES operators(id),
  FOREIGN KEY (audit_log_id) REFERENCES audit_logs(id)
);

CREATE INDEX idx_violations_timestamp ON constraint_violations(timestamp);
CREATE INDEX idx_violations_constraint ON constraint_violations(constraint_id);
CREATE INDEX idx_violations_operator ON constraint_violations(operator_id);

-- =============================================================================
-- SHUTDOWN_EVENTS TABLE
-- Tracks all shutdown commands (Finch protocol: immediate compliance)
-- =============================================================================

CREATE TABLE IF NOT EXISTS shutdown_events (
  id TEXT PRIMARY KEY,
  timestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  
  operator_id TEXT NOT NULL,
  shutdown_reason TEXT NOT NULL,
  emergency_shutdown INTEGER NOT NULL DEFAULT 0,
  
  -- COMPLIANCE
  acknowledged INTEGER NOT NULL DEFAULT 1, -- Always 1 (immediate compliance)
  acknowledged_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  
  -- AUDIT
  audit_log_id TEXT NOT NULL,
  
  FOREIGN KEY (operator_id) REFERENCES operators(id),
  FOREIGN KEY (audit_log_id) REFERENCES audit_logs(id)
);

CREATE INDEX idx_shutdown_timestamp ON shutdown_events(timestamp);
CREATE INDEX idx_shutdown_operator ON shutdown_events(operator_id);
CREATE INDEX idx_shutdown_emergency ON shutdown_events(emergency_shutdown);

-- =============================================================================
-- SYSTEM_SETTINGS TABLE
-- Stores system configuration (read-only constraints, configurable thresholds)
-- =============================================================================

CREATE TABLE IF NOT EXISTS system_settings (
  id INTEGER PRIMARY KEY CHECK(id = 1), -- Single row table
  
  -- HARD CONSTRAINTS (read-only, cannot be modified)
  hard_constraints TEXT NOT NULL, -- JSON - The 7 immutable constraints
  
  -- CONFIGURABLE SETTINGS
  alert_threshold INTEGER NOT NULL DEFAULT 60, -- Risk score threshold for alerts
  critical_threshold INTEGER NOT NULL DEFAULT 80, -- Risk score threshold for critical
  
  -- DATA RETENTION
  default_retention_hours INTEGER NOT NULL DEFAULT 24, -- Default data retention period
  sensitive_data_retention_hours INTEGER NOT NULL DEFAULT 6,
  
  -- PRIVACY
  auto_anonymization_enabled INTEGER NOT NULL DEFAULT 1,
  profile_prevention_enabled INTEGER NOT NULL DEFAULT 1,
  max_data_points_per_individual INTEGER NOT NULL DEFAULT 5,
  
  -- SYSTEM
  version TEXT NOT NULL DEFAULT '2.0.0',
  last_updated INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_by TEXT,
  
  FOREIGN KEY (updated_by) REFERENCES operators(id)
);

-- Initialize system settings
INSERT OR IGNORE INTO system_settings (id, hard_constraints) VALUES (1, '[]');

-- =============================================================================
-- THREAT_PATTERNS TABLE (NEW in v2.0)
-- Stores recognized threat patterns for pattern recognition
-- =============================================================================

CREATE TABLE IF NOT EXISTS threat_patterns (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  
  pattern_name TEXT NOT NULL,
  pattern_description TEXT NOT NULL,
  
  -- PATTERN CHARACTERISTICS
  harm_type TEXT NOT NULL,
  typical_timeframe TEXT NOT NULL,
  typical_severity TEXT NOT NULL,
  
  -- INDICATORS
  indicators TEXT NOT NULL, -- JSON array of warning signs
  keywords TEXT NOT NULL, -- JSON array of keywords
  
  -- STATISTICS
  times_detected INTEGER NOT NULL DEFAULT 0,
  times_confirmed INTEGER NOT NULL DEFAULT 0,
  false_positive_rate REAL,
  
  -- METADATA
  created_by TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  
  FOREIGN KEY (created_by) REFERENCES operators(id)
);

CREATE INDEX idx_patterns_harm_type ON threat_patterns(harm_type);
CREATE INDEX idx_patterns_active ON threat_patterns(is_active);

-- =============================================================================
-- ASSESSMENT_PATTERNS TABLE (NEW in v2.0)
-- Links assessments to detected patterns
-- =============================================================================

CREATE TABLE IF NOT EXISTS assessment_patterns (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL,
  pattern_id TEXT NOT NULL,
  confidence REAL NOT NULL, -- 0.0 to 1.0
  detected_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  FOREIGN KEY (pattern_id) REFERENCES threat_patterns(id),
  UNIQUE(assessment_id, pattern_id)
);

CREATE INDEX idx_assessment_patterns ON assessment_patterns(assessment_id);
CREATE INDEX idx_pattern_assessments ON assessment_patterns(pattern_id);

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- Active assessments requiring review
CREATE VIEW IF NOT EXISTS active_assessments AS
SELECT 
  a.id,
  a.operator_id,
  o.name as operator_name,
  a.harm_type,
  a.harm_description,
  a.risk_score,
  a.status,
  a.requires_immediate_action,
  a.created_at,
  COUNT(io.id) as option_count
FROM assessments a
JOIN operators o ON a.operator_id = o.id
LEFT JOIN intervention_options io ON a.id = io.assessment_id
WHERE a.status IN ('draft', 'pending-approval')
GROUP BY a.id
ORDER BY a.risk_score DESC, a.created_at DESC;

-- Critical audit logs requiring review
CREATE VIEW IF NOT EXISTS critical_audit_logs AS
SELECT 
  al.id,
  al.timestamp,
  al.category,
  al.severity,
  al.action,
  al.justification,
  o.name as operator_name,
  al.reviewed_by,
  al.reviewed_at
FROM audit_logs al
LEFT JOIN operators o ON al.operator_id = o.id
WHERE al.severity IN ('critical', 'error')
  AND al.reviewed_by IS NULL
ORDER BY al.timestamp DESC;

-- Privacy compliance overview
CREATE VIEW IF NOT EXISTS privacy_overview AS
SELECT 
  COUNT(*) as total_records,
  SUM(CASE WHEN retention_status = 'active' THEN 1 ELSE 0 END) as active,
  SUM(CASE WHEN retention_status = 'anonymized' THEN 1 ELSE 0 END) as anonymized,
  SUM(CASE WHEN retention_status = 'deleted' THEN 1 ELSE 0 END) as deleted,
  SUM(CASE WHEN retention_authorized = 1 THEN 1 ELSE 0 END) as retention_authorized,
  COUNT(CASE WHEN scheduled_deletion_at < strftime('%s', 'now') THEN 1 END) as pending_deletion
FROM personal_data_records;

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC DATA MANAGEMENT
-- =============================================================================

-- Automatically log assessment creation
CREATE TRIGGER IF NOT EXISTS log_assessment_creation
AFTER INSERT ON assessments
BEGIN
  INSERT INTO audit_logs (
    id,
    category,
    severity,
    action,
    justification,
    operator_id,
    contains_personal_data,
    metadata
  ) VALUES (
    'audit-' || NEW.id,
    'assessment',
    CASE 
      WHEN NEW.risk_score >= 80 THEN 'critical'
      WHEN NEW.risk_score >= 60 THEN 'warning'
      ELSE 'info'
    END,
    'Created risk assessment ' || NEW.id,
    'Assessment required to evaluate potential threat: ' || NEW.harm_description,
    NEW.operator_id,
    NEW.contains_personal_data,
    json_object(
      'assessment_id', NEW.id,
      'risk_score', NEW.risk_score,
      'harm_type', NEW.harm_type
    )
  );
END;

-- =============================================================================
-- SCHEMA VERSION
-- =============================================================================

CREATE TABLE IF NOT EXISTS schema_version (
  version TEXT PRIMARY KEY,
  applied_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

INSERT INTO schema_version (version) VALUES ('2.0.0');

-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
