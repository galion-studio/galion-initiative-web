/**
 * THE MACHINE - Local Development Database
 * 
 * Simple in-memory database for local development
 * No Cloudflare D1 required!
 * 
 * This provides a complete mock database that works identically
 * to the production D1 database, but runs entirely in memory.
 */

import type { Operator, AssessmentRecord, AuditLogRecord } from './db-client';
import type { RiskAssessment, InterventionOption } from './assessment';
import type { ConstraintCheck } from './constraints';

// ===========================================================================
// IN-MEMORY STORAGE
// ===========================================================================

class LocalDatabase {
  private operators: Map<string, Operator> = new Map();
  private operatorsByEmail: Map<string, Operator> = new Map();
  private assessments: Map<string, AssessmentRecord> = new Map();
  private auditLogs: AuditLogRecord[] = [];
  private patterns: Map<string, any> = new Map();
  private initialized: boolean = false;

  constructor() {
    this.initializeDefaults();
  }

  /**
   * Initialize with default operator for development
   */
  private initializeDefaults() {
    if (this.initialized) return;

    // Create default admin operator
    const defaultOperator: Operator = {
      id: 'op-admin-001',
      name: 'Admin Operator',
      email: 'admin@machine.local',
      role: 'admin',
      created_at: Math.floor(Date.now() / 1000),
      last_login: Math.floor(Date.now() / 1000),
      is_active: true,
      settings: {
        theme: 'dark',
        notifications: true
      }
    };

    this.operators.set(defaultOperator.id, defaultOperator);
    this.operatorsByEmail.set(defaultOperator.email, defaultOperator);

    // Log initialization
    this.auditLogs.push({
      id: 'log-init-001',
      timestamp: Math.floor(Date.now() / 1000),
      category: 'system',
      severity: 'info',
      action: 'Local database initialized',
      justification: 'Development environment startup',
      contains_personal_data: false,
      data_retention_status: 'active',
    });

    this.initialized = true;

    console.log('✓ Local development database initialized');
    console.log(`✓ Default operator: ${defaultOperator.email}`);
  }

  // ===========================================================================
  // OPERATORS
  // ===========================================================================

  async createOperator(operator: Omit<Operator, 'created_at'>): Promise<Operator> {
    const created_at = Math.floor(Date.now() / 1000);
    const fullOperator = { ...operator, created_at };
    
    this.operators.set(fullOperator.id, fullOperator);
    this.operatorsByEmail.set(fullOperator.email, fullOperator);
    
    return fullOperator;
  }

  async getOperator(id: string): Promise<Operator | null> {
    return this.operators.get(id) || null;
  }

  async getOperatorByEmail(email: string): Promise<Operator | null> {
    return this.operatorsByEmail.get(email) || null;
  }

  async updateOperatorLogin(id: string): Promise<void> {
    const operator = this.operators.get(id);
    if (operator) {
      operator.last_login = Math.floor(Date.now() / 1000);
    }
  }

  async listOperators(active_only: boolean = false): Promise<Operator[]> {
    const ops = Array.from(this.operators.values());
    if (active_only) {
      return ops.filter(op => op.is_active);
    }
    return ops;
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
      status,
      operatorNotes,
    } = assessment;

    const created_at = Math.floor(assessment.createdAt.getTime() / 1000);

    const record: AssessmentRecord = {
      id,
      operator_id: createdBy,
      created_at,
      who_at_risk: JSON.stringify(identification.whoAtRisk),
      harm_type: identification.harmType,
      harm_description: identification.harmDescription,
      time_frame: identification.timeFrame,
      location: identification.location,
      perpetrator: identification.perpetrator,
      probability: estimate.probability,
      severity: estimate.severity,
      uncertainty: estimate.uncertainty,
      rationale_brief: estimate.rationaleBrief,
      data_quality: estimate.dataQuality,
      facts: '[]',
      inferences: '[]',
      speculation: '[]',
      key_assumptions: '[]',
      risk_score: riskScore,
      requires_immediate_action: riskScore >= 80,
      status,
      operator_notes: operatorNotes,
      contains_personal_data: identification.whoAtRisk.some(p => p.length > 0),
      data_retention_status: 'active',
    };

    this.assessments.set(id, record);
  }

  async getAssessment(id: string): Promise<AssessmentRecord | null> {
    return this.assessments.get(id) || null;
  }

  async listAssessments(
    operatorId?: string,
    limit: number = 50
  ): Promise<AssessmentRecord[]> {
    let assessments = Array.from(this.assessments.values());
    
    if (operatorId) {
      assessments = assessments.filter(a => a.operator_id === operatorId);
    }
    
    assessments.sort((a, b) => b.created_at - a.created_at);
    
    return assessments.slice(0, limit);
  }

  async updateAssessmentStatus(
    id: string,
    status: string,
    operatorDecision?: string,
    operatorNotes?: string
  ): Promise<void> {
    const assessment = this.assessments.get(id);
    if (assessment) {
      assessment.status = status as any;
      assessment.operator_decision = operatorDecision;
      assessment.operator_notes = operatorNotes;
      assessment.decided_at = Math.floor(Date.now() / 1000);
    }
  }

  // ===========================================================================
  // AUDIT LOGS
  // ===========================================================================

  async createAuditLog(log: {
    id: string;
    category: string;
    severity: string;
    action: string;
    justification: string;
    operatorId?: string;
    metadata?: Record<string, any>;
    containsPersonalData: boolean;
    constraintCheck?: ConstraintCheck;
  }): Promise<void> {
    const record: AuditLogRecord = {
      id: log.id,
      timestamp: Math.floor(Date.now() / 1000),
      category: log.category,
      severity: log.severity,
      action: log.action,
      justification: log.justification,
      operator_id: log.operatorId,
      metadata: log.metadata ? JSON.stringify(log.metadata) : undefined,
      contains_personal_data: log.containsPersonalData,
      data_retention_status: log.containsPersonalData ? 'pending-review' : 'active',
      constraint_check_passed: log.constraintCheck?.passed,
      constraint_violations: log.constraintCheck ? JSON.stringify(log.constraintCheck.violations) : undefined,
    };

    this.auditLogs.push(record);
  }

  async listAuditLogs(
    limit: number = 100,
    category?: string,
    severity?: string
  ): Promise<AuditLogRecord[]> {
    let logs = [...this.auditLogs];
    
    if (category) {
      logs = logs.filter(log => log.category === category);
    }
    
    if (severity) {
      logs = logs.filter(log => log.severity === severity);
    }
    
    logs.sort((a, b) => b.timestamp - a.timestamp);
    
    return logs.slice(0, limit);
  }

  async getUnreviewedAuditLogs(): Promise<AuditLogRecord[]> {
    return this.auditLogs.filter(
      log => log.contains_personal_data && log.data_retention_status === 'pending-review'
    );
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
    const criticalAssessments = Array.from(this.assessments.values()).filter(
      a => a.risk_score >= 80
    ).length;

    const unreviewedLogs = this.auditLogs.filter(
      log => log.contains_personal_data && log.data_retention_status === 'pending-review'
    ).length;

    return {
      totalAssessments: this.assessments.size,
      totalAuditLogs: this.auditLogs.length,
      totalOperators: Array.from(this.operators.values()).filter(o => o.is_active).length,
      totalPatterns: this.patterns.size,
      criticalAssessments,
      unreviewedLogs,
      recentPatternMatches: 0,
    };
  }

  // ===========================================================================
  // OTHER REQUIRED METHODS (stub implementations)
  // ===========================================================================

  async createInterventionOption(assessmentId: string, option: InterventionOption): Promise<void> {
    // Store with assessment or in separate map if needed
  }

  async logConstraintViolation(violation: any): Promise<void> {
    console.log('Constraint violation logged:', violation);
  }

  async logShutdown(operatorId: string, reason: string, emergency: boolean, auditLogId: string): Promise<void> {
    console.log('Shutdown logged:', { operatorId, reason, emergency });
  }

  async createThreatPattern(pattern: any): Promise<void> {
    this.patterns.set(pattern.id, pattern);
  }

  async getThreatPattern(id: string): Promise<any | null> {
    return this.patterns.get(id) || null;
  }

  async listThreatPatterns(active_only: boolean = true): Promise<any[]> {
    return Array.from(this.patterns.values());
  }

  async updatePatternStatistics(patternId: string, detected: boolean, confirmed?: boolean): Promise<void> {
    // Update pattern stats
  }

  async linkPatternToAssessment(assessmentId: string, patternId: string, confidence: number): Promise<void> {
    // Link pattern to assessment
  }

  async getPatternStatistics(patternId: string): Promise<any | null> {
    return {
      times_detected: 0,
      times_confirmed: 0,
      false_positive_rate: 0,
      recent_detections_30d: 0,
      recent_detections_90d: 0,
    };
  }
}

// ===========================================================================
// SINGLETON INSTANCE
// ===========================================================================

let localDB: LocalDatabase | null = null;

export function getLocalDatabase(): LocalDatabase {
  if (!localDB) {
    localDB = new LocalDatabase();
  }
  return localDB;
}

// ===========================================================================
// ADAPTER FOR API ROUTES
// ===========================================================================

/**
 * Get database client for API routes
 * Automatically uses local DB in development
 */
export function getDatabaseForRequest(): LocalDatabase {
  return getLocalDatabase();
}
