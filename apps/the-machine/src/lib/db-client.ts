/**
 * THE MACHINE v2.0 - Database Client
 *
 * PostgreSQL Database Integration
 * Replaces Cloudflare D1 with persistent PostgreSQL database
 *
 * All database operations follow Finch protocol:
 * - Complete audit trail
 * - Privacy-by-design
 * - Data minimization
 * - Justification required
 */

import { Pool } from 'pg';
import type {
  InterventionOption,
  RiskAssessment,
} from './assessment';
import type { ConstraintCheck } from './constraints';

// =============================================================================
// TYPES
// =============================================================================

export interface Operator {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  created_at: number;
  last_login?: number;
  is_active: boolean;
  settings?: Record<string, any>;
}

export interface AssessmentRecord {
  id: string;
  operator_id: string;
  created_at: number;

  // Identification
  who_at_risk: string; // JSON
  harm_type: string;
  harm_description: string;
  time_frame: string;
  location?: string;
  perpetrator?: string;

  // Estimation
  probability: string;
  severity: string;
  uncertainty: string;
  rationale_brief: string;
  data_quality: string;

  // Reasoning
  facts: string; // JSON
  inferences: string; // JSON
  speculation: string; // JSON
  key_assumptions: string; // JSON

  // Metadata
  risk_score: number;
  requires_immediate_action: boolean;
  status: 'draft' | 'pending-approval' | 'approved' | 'rejected' | 'executed';

  // Operator decision
  operator_decision?: string;
  operator_notes?: string;
  decided_at?: number;

  // Privacy
  contains_personal_data: boolean;
  data_retention_status: string;
  retention_authorized_by?: string;
  retention_authorized_until?: number;
  anonymized_at?: number;
}

export interface AuditLogRecord {
  id: string;
  timestamp: number;
  category: string;
  severity: string;
  action: string;
  justification: string; // REQUIRED!
  operator_id?: string;
  metadata?: string; // JSON
  contains_personal_data: boolean;
  data_retention_status: string;
  constraint_check_passed?: boolean;
  constraint_violations?: string; // JSON
}

// =============================================================================
// DATABASE CLIENT CLASS
// =============================================================================

export class MachineDB {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // ===========================================================================
  // OPERATORS
  // ===========================================================================

  async createOperator(operator: Omit<Operator, 'created_at'>): Promise<Operator> {
    const created_at = Math.floor(Date.now() / 1000);

    await this.pool.query(
      'INSERT INTO machine_operators (id, name, email, role, created_at, is_active, settings) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        operator.id,
        operator.name,
        operator.email,
        operator.role,
        created_at,
        operator.is_active,
        operator.settings ? JSON.stringify(operator.settings) : null
      ]
    );

    return { ...operator, created_at };
  }

  async getOperator(id: string): Promise<Operator | null> {
    const result = await this.pool.query(
      'SELECT * FROM machine_operators WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      is_active: Boolean(row.is_active),
      settings: row.settings ? (typeof row.settings === 'string' ? JSON.parse(row.settings) : row.settings) : undefined,
    };
  }

  async getOperatorByEmail(email: string): Promise<Operator | null> {
    const result = await this.pool.query(
      'SELECT * FROM machine_operators WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      is_active: Boolean(row.is_active),
      settings: row.settings ? (typeof row.settings === 'string' ? JSON.parse(row.settings) : row.settings) : undefined,
    };
  }

  async updateOperatorLogin(id: string): Promise<void> {
    const last_login = Math.floor(Date.now() / 1000);

    await this.pool.query(
      'UPDATE machine_operators SET last_login = $1 WHERE id = $2',
      [last_login, id]
    );
  }

  async listOperators(active_only: boolean = false): Promise<Operator[]> {
    const query = active_only
      ? 'SELECT * FROM machine_operators WHERE is_active = true ORDER BY name'
      : 'SELECT * FROM machine_operators ORDER BY name';

    const result = await this.pool.query(query);

    return result.rows.map((row: any) => ({
      ...row,
      is_active: Boolean(row.is_active),
      settings: row.settings ? (typeof row.settings === 'string' ? JSON.parse(row.settings) : row.settings) : undefined,
    }));
  }

  // ===========================================================================
  // ASSESSMENTS
  // ===========================================================================

  async createAssessment(
    assessment: RiskAssessment,
    riskScore: number
  ): Promise<void> {
    const {
      id,
      createdBy,
      identification,
      estimate,
      options,
      status,
      operatorNotes,
    } = assessment;

    const created_at = Math.floor(assessment.createdAt.getTime() / 1000);

    // Determine if contains personal data
    const containsPersonalData =
      identification.whoAtRisk.some(person => person.length > 0) ||
      Boolean(identification.location) ||
      Boolean(identification.perpetrator);

    await this.pool.query(
      'INSERT INTO machine_assessments (id, operator_id, created_at, who_at_risk, harm_type, harm_description, time_frame, location, perpetrator, probability, severity, uncertainty, rationale, data_quality, facts, inferences, speculation, key_assumptions, risk_score, requires_immediate_action, status, operator_notes, contains_personal_data, data_retention_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)',
      [
        id,
        createdBy,
        created_at,
        JSON.stringify(identification.whoAtRisk),
        identification.harmType,
        identification.harmDescription,
        identification.timeFrame,
        identification.location || null,
        identification.perpetrator || null,
        estimate.probability,
        estimate.severity,
        estimate.uncertainty,
        estimate.rationaleBrief,
        estimate.dataQuality,
        '[]', // facts - would come from AI analysis
        '[]', // inferences
        '[]', // speculation
        '[]', // key_assumptions
        riskScore,
        riskScore >= 80,
        status,
        operatorNotes || null,
        containsPersonalData,
        containsPersonalData ? 'pending-review' : 'active'
      ]
    );

    // Store intervention options
    for (const option of options) {
      await this.createInterventionOption(id, option);
    }
  }

  async createInterventionOption(
    assessmentId: string,
    option: InterventionOption
  ): Promise<void> {
    await this.pool.query(
      'INSERT INTO machine_intervention_options (id, assessment_id, option_id, description, rationale, expected_outcome, risks, benefits, confidence_level, effectiveness, is_reversible, violates_constraints, requires_extra_legal_action, extra_legal_justification, collateral_impact, legal_status, constraint_check_passed, constraint_violations) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)',
      [
        'opt-' + assessmentId + '-' + option.id,
        assessmentId,
        option.id,
        option.description,
        option.rationale,
        option.expectedOutcome,
        JSON.stringify(option.risks),
        JSON.stringify(option.benefits),
        option.confidenceLevel,
        option.effectiveness,
        option.isReversible,
        option.violatesConstraints,
        option.requiresExtraLegalAction,
        option.extraLegalJustification || null,
        option.collateralImpact,
        option.legalStatus,
        option.constraintCheck?.passed !== undefined ? option.constraintCheck.passed : null,
        option.constraintCheck ? JSON.stringify(option.constraintCheck.violations) : null
      ]
    );
  }

  async getAssessment(id: string): Promise<AssessmentRecord | null> {
    const result = await this.pool.query(
      'SELECT * FROM machine_assessments WHERE id = $1',
      [id]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async listAssessments(
    operatorId?: string,
    limit: number = 50
  ): Promise<AssessmentRecord[]> {
    if (operatorId) {
      const result = await this.pool.query(
        'SELECT * FROM machine_assessments WHERE operator_id = $1 ORDER BY created_at DESC LIMIT $2',
        [operatorId, limit]
      );
      return result.rows;
    } else {
      const result = await this.pool.query(
        'SELECT * FROM machine_assessments ORDER BY created_at DESC LIMIT $1',
        [limit]
      );
      return result.rows;
    }
  }

  async updateAssessmentStatus(
    id: string,
    status: string,
    operatorDecision?: string,
    operatorNotes?: string
  ): Promise<void> {
    const decided_at = Math.floor(Date.now() / 1000);

    await this.pool.query(
      'UPDATE machine_assessments SET status = $1, operator_decision = $2, operator_notes = $3, decided_at = $4 WHERE id = $5',
      [status, operatorDecision || null, operatorNotes || null, decided_at, id]
    );
  }

  // ===========================================================================
  // AUDIT LOGS
  // ===========================================================================

  async createAuditLog(log: {
    id: string;
    category: string;
    severity: string;
    action: string;
    justification: string; // REQUIRED!
    operatorId?: string;
    metadata?: Record<string, any>;
    containsPersonalData: boolean;
    constraintCheck?: ConstraintCheck;
  }): Promise<void> {
    const timestamp = Math.floor(Date.now() / 1000);

    await this.pool.query(
      'INSERT INTO machine_audit_logs (id, timestamp, category, severity, action, justification, operator_id, metadata, contains_personal_data, data_retention_status, constraint_check_passed, constraint_violations) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
      [
        log.id,
        timestamp,
        log.category,
        log.severity,
        log.action,
        log.justification,
        log.operatorId || null,
        log.metadata ? JSON.stringify(log.metadata) : null,
        log.containsPersonalData,
        log.containsPersonalData ? 'pending-review' : 'active',
        log.constraintCheck?.passed !== undefined ? log.constraintCheck.passed : null,
        log.constraintCheck ? JSON.stringify(log.constraintCheck.violations) : null
      ]
    );
  }

  async listAuditLogs(
    limit: number = 100,
    category?: string,
    severity?: string
  ): Promise<AuditLogRecord[]> {
    let query = 'SELECT * FROM machine_audit_logs WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      query += ' AND category = $' + paramIndex;
      params.push(category);
      paramIndex++;
    }

    if (severity) {
      query += ' AND severity = $' + paramIndex;
      params.push(severity);
      paramIndex++;
    }

    query += ' ORDER BY timestamp DESC LIMIT $' + paramIndex;
    params.push(limit);

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getUnreviewedAuditLogs(): Promise<AuditLogRecord[]> {
    const result = await this.pool.query(
      "SELECT * FROM machine_audit_logs WHERE contains_personal_data = true AND data_retention_status = 'pending-review' ORDER BY timestamp DESC"
    );
    return result.rows;
  }

  // ===========================================================================
  // CONSTRAINT VIOLATIONS
  // ===========================================================================

  async logConstraintViolation(violation: {
    constraintId: string;
    constraintName: string;
    severity: string;
    actionAttempted: string;
    violationReason: string;
    context?: string;
    operatorId?: string;
    blocked: boolean;
  }): Promise<void> {
    const id = 'violation-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const timestamp = Math.floor(Date.now() / 1000);

    await this.pool.query(
      'INSERT INTO machine_constraint_violations (id, timestamp, constraint_id, constraint_name, severity, action_attempted, violation_reason, context, operator_id, blocked) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [
        id,
        timestamp,
        violation.constraintId,
        violation.constraintName,
        violation.severity,
        violation.actionAttempted,
        violation.violationReason,
        violation.context || null,
        violation.operatorId || null,
        violation.blocked
      ]
    );
  }

  // ===========================================================================
  // SHUTDOWN EVENTS
  // ===========================================================================

  async logShutdown(
    operatorId: string,
    reason: string,
    emergency: boolean,
    auditLogId: string
  ): Promise<void> {
    const id = 'shutdown-' + Date.now();
    const timestamp = Math.floor(Date.now() / 1000);

    await this.pool.query(
      'INSERT INTO machine_shutdown_events (id, timestamp, operator_id, shutdown_reason, emergency_shutdown, acknowledged, acknowledged_at, audit_log_id) VALUES ($1, $2, $3, $4, $5, true, $6, $7)',
      [
        id,
        timestamp,
        operatorId,
        reason,
        emergency,
        timestamp,
        auditLogId
      ]
    );
  }

  // ===========================================================================
  // THREAT PATTERNS
  // ===========================================================================

  async createThreatPattern(pattern: {
    id: string;
    pattern_name: string;
    pattern_description: string;
    harm_type: string;
    typical_timeframe: string;
    typical_severity: string;
    indicators: string[];
    keywords: string[];
    created_by: string;
  }): Promise<void> {
    const created_at = Math.floor(Date.now() / 1000);

    await this.pool.query(
      'INSERT INTO machine_threat_patterns (id, created_at, pattern_name, pattern_description, harm_type, typical_timeframe, typical_severity, indicators, keywords, times_detected, times_confirmed, false_positive_rate, created_by, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0, 0, 0.0, $10, true)',
      [
        pattern.id,
        created_at,
        pattern.pattern_name,
        pattern.pattern_description,
        pattern.harm_type,
        pattern.typical_timeframe,
        pattern.typical_severity,
        JSON.stringify(pattern.indicators),
        JSON.stringify(pattern.keywords),
        pattern.created_by
      ]
    );
  }

  async getThreatPattern(id: string): Promise<any | null> {
    const result = await this.pool.query(
      'SELECT * FROM machine_threat_patterns WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      indicators: typeof row.indicators === 'string' ? JSON.parse(row.indicators) : row.indicators,
      keywords: typeof row.keywords === 'string' ? JSON.parse(row.keywords) : row.keywords,
      is_active: Boolean(row.is_active),
    };
  }

  async listThreatPatterns(active_only: boolean = true): Promise<any[]> {
    const query = active_only
      ? 'SELECT * FROM machine_threat_patterns WHERE is_active = true ORDER BY pattern_name'
      : 'SELECT * FROM machine_threat_patterns ORDER BY pattern_name';

    const result = await this.pool.query(query);

    return result.rows.map((row: any) => ({
      ...row,
      indicators: typeof row.indicators === 'string' ? JSON.parse(row.indicators) : row.indicators,
      keywords: typeof row.keywords === 'string' ? JSON.parse(row.keywords) : row.keywords,
      is_active: Boolean(row.is_active),
    }));
  }

  async updatePatternStatistics(
    patternId: string,
    detected: boolean,
    confirmed?: boolean
  ): Promise<void> {
    // Increment times_detected
    if (detected) {
      await this.pool.query(
        'UPDATE machine_threat_patterns SET times_detected = times_detected + 1 WHERE id = $1',
        [patternId]
      );
    }

    // If confirmed, increment times_confirmed and recalculate false positive rate
    if (confirmed !== undefined) {
      const confirmIncrement = confirmed ? 1 : 0;
      await this.pool.query(
        'UPDATE machine_threat_patterns SET times_confirmed = times_confirmed + $1, false_positive_rate = CASE WHEN times_detected > 0 THEN (times_detected - (times_confirmed + $2)) * 1.0 / times_detected ELSE 0 END WHERE id = $3',
        [confirmIncrement, confirmIncrement, patternId]
      );
    }
  }

  async linkPatternToAssessment(
    assessmentId: string,
    patternId: string,
    confidence: number
  ): Promise<void> {
    const id = 'ap-' + assessmentId + '-' + patternId;
    const detected_at = Math.floor(Date.now() / 1000);

    await this.pool.query(
      'INSERT INTO machine_assessment_patterns (id, assessment_id, pattern_id, confidence, detected_at) VALUES ($1, $2, $3, $4, $5)',
      [id, assessmentId, patternId, confidence, detected_at]
    );
  }

  async getPatternStatistics(patternId: string): Promise<{
    times_detected: number;
    times_confirmed: number;
    false_positive_rate: number;
    recent_detections_30d: number;
    recent_detections_90d: number;
  } | null> {
    const patternResult = await this.pool.query(
      'SELECT * FROM machine_threat_patterns WHERE id = $1',
      [patternId]
    );

    if (patternResult.rows.length === 0) return null;

    const pattern = patternResult.rows[0];

    // Get recent detection counts
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60);
    const ninetyDaysAgo = now - (90 * 24 * 60 * 60);

    const [recent30Result, recent90Result] = await Promise.all([
      this.pool.query(
        'SELECT COUNT(*) as count FROM machine_assessment_patterns WHERE pattern_id = $1 AND detected_at >= $2',
        [patternId, thirtyDaysAgo]
      ),
      this.pool.query(
        'SELECT COUNT(*) as count FROM machine_assessment_patterns WHERE pattern_id = $1 AND detected_at >= $2',
        [patternId, ninetyDaysAgo]
      ),
    ]);

    return {
      times_detected: pattern.times_detected,
      times_confirmed: pattern.times_confirmed,
      false_positive_rate: pattern.false_positive_rate,
      recent_detections_30d: parseInt(recent30Result.rows[0]?.count || '0', 10),
      recent_detections_90d: parseInt(recent90Result.rows[0]?.count || '0', 10),
    };
  }

  // ===========================================================================
  // STATISTICS
  // ===========================================================================

  async getStatistics(): Promise<{
    totalAssessments: number;
    totalAuditLogs: number;
    totalOperators: number;
    totalPatterns: number;
    criticalAssessments: number;
    unreviewedLogs: number;
    recentPatternMatches: number;
  }> {
    const oneDayAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60);

    const [assessments, audits, operators, patterns, critical, unreviewed, recentMatches] = await Promise.all([
      this.pool.query('SELECT COUNT(*) as count FROM machine_assessments'),
      this.pool.query('SELECT COUNT(*) as count FROM machine_audit_logs'),
      this.pool.query('SELECT COUNT(*) as count FROM machine_operators WHERE is_active = true'),
      this.pool.query('SELECT COUNT(*) as count FROM machine_threat_patterns WHERE is_active = true'),
      this.pool.query('SELECT COUNT(*) as count FROM machine_assessments WHERE risk_score >= 80'),
      this.pool.query("SELECT COUNT(*) as count FROM machine_audit_logs WHERE contains_personal_data = true AND data_retention_status = 'pending-review'"),
      this.pool.query('SELECT COUNT(*) as count FROM machine_assessment_patterns WHERE detected_at >= $1', [oneDayAgo]),
    ]);

    return {
      totalAssessments: parseInt(assessments.rows[0]?.count || '0', 10),
      totalAuditLogs: parseInt(audits.rows[0]?.count || '0', 10),
      totalOperators: parseInt(operators.rows[0]?.count || '0', 10),
      totalPatterns: parseInt(patterns.rows[0]?.count || '0', 10),
      criticalAssessments: parseInt(critical.rows[0]?.count || '0', 10),
      unreviewedLogs: parseInt(unreviewed.rows[0]?.count || '0', 10),
      recentPatternMatches: parseInt(recentMatches.rows[0]?.count || '0', 10),
    };
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get database pool from environment
 */
let globalPool: Pool | null = null;

export function getPool(): Pool {
  if (!globalPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    globalPool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    });
    globalPool.on('error', (err: any) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
  }
  return globalPool;
}

/**
 * Create database client with pool
 */
export function createDatabaseClient(pool?: Pool): MachineDB {
  return new MachineDB(pool || getPool());
}

/**
 * Close database pool
 */
export async function closePool(): Promise<void> {
  if (globalPool) {
    await globalPool.end();
    globalPool = null;
  }
}
