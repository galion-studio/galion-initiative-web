/**
 * The Machine - Audit Logging System
 * 
 * Complete audit trail for all Machine operations.
 * Following Finch protocol: "You must log every data access and include
 * a justification field; these logs must be reviewable by an auditor."
 * 
 * Privacy and Data Minimization:
 * - Only log data directly relevant to preventing specific, imminent harm
 * - Anonymize or discard data as soon as immediate threat has passed
 * - Retain data only with explicit operator authorization
 */

import type { ConstraintCheck } from './constraints';

// --------------------- TYPES --------------------- //

export type LogCategory =
  | 'assessment'      // Risk assessments
  | 'intervention'    // Intervention decisions
  | 'data-access'     // Data access events
  | 'ai-query'        // AI queries
  | 'constraint-check' // Constraint checks
  | 'operator-action' // Operator actions
  | 'system-event'    // System events
  | 'shutdown'        // Shutdown events
  | 'self-expansion-attempt'; // Self-expansion detection

export type LogSeverity = 'info' | 'warning' | 'error' | 'critical';

export type DataRetentionStatus =
  | 'active'          // Currently in use
  | 'pending-review'  // Awaiting operator review for retention
  | 'authorized'      // Operator authorized retention
  | 'anonymized'      // Data anonymized
  | 'discarded';      // Data discarded

/**
 * Core audit log entry
 */
export interface AuditLogEntry {
  // Identity
  id: string;
  timestamp: Date;
  
  // Classification
  category: LogCategory;
  severity: LogSeverity;
  
  // Content
  action: string;               // What happened
  justification: string;        // Why it happened (required!)
  operatorId?: string;          // Who initiated (if operator-driven)
  
  // Details
  metadata: Record<string, any>;
  
  // Privacy tracking
  containsPersonalData: boolean;
  dataRetentionStatus: DataRetentionStatus;
  retentionAuthorizedBy?: string;
  retentionAuthorizedUntil?: Date;
  anonymizedAt?: Date;
  
  // Constraint compliance
  constraintCheck?: ConstraintCheck;
  
  // Review status
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
}

/**
 * Data access log (special category)
 * 
 * "You must log every data access and include a justification field"
 */
export interface DataAccessLog extends AuditLogEntry {
  category: 'data-access';
  
  // Data access specifics
  dataType: string;             // What kind of data
  dataSource: string;           // Where it came from
  accessReason: string;         // Why it was accessed
  threatRelevance: string;      // How it relates to preventing harm
  
  // Privacy
  containsPersonalData: true;   // Data access logs always involve personal data
  personalDataTypes: string[];  // Types of personal data accessed
  individualsAffected: string[]; // Who's data was accessed (anonymized IDs)
}

/**
 * Assessment log
 */
export interface AssessmentLog extends AuditLogEntry {
  category: 'assessment';
  
  // Assessment specifics
  assessmentId: string;
  threatDescription: string;
  riskScore: number;
  recommendedAction: string;
  operatorDecision?: string;
}

/**
 * Shutdown log
 */
export interface ShutdownLog extends AuditLogEntry {
  category: 'shutdown';
  severity: 'critical';
  
  // Shutdown specifics
  shutdownReason: string;
  initiatedBy: string;
  emergencyShutdown: boolean;
}

// --------------------- AUDIT LOGGING --------------------- //

// In-memory store (in production, this would be a database)
const auditLogs: AuditLogEntry[] = [];

/**
 * Create audit log entry
 */
export function logAuditEntry(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
  const fullEntry: AuditLogEntry = {
    id: generateLogId(),
    timestamp: new Date(),
    ...entry,
  };
  
  // Store log
  auditLogs.push(fullEntry);
  
  // In production: also write to database, file system, or external logging service
  console.log(`[AUDIT] [${fullEntry.category}] [${fullEntry.severity}] ${fullEntry.action}`);
  console.log(`[AUDIT] Justification: ${fullEntry.justification}`);
  
  // Schedule data anonymization/deletion if needed
  if (fullEntry.containsPersonalData && fullEntry.dataRetentionStatus === 'active') {
    scheduleDataReview(fullEntry.id);
  }
  
  return fullEntry;
}

/**
 * Log data access (required for all personal data access)
 */
export function logDataAccess(
  dataType: string,
  dataSource: string,
  accessReason: string,
  threatRelevance: string,
  personalDataTypes: string[],
  individualsAffected: string[],
  operatorId?: string
): DataAccessLog {
  return logAuditEntry({
    category: 'data-access',
    severity: 'info',
    action: `Accessed ${dataType} from ${dataSource}`,
    justification: `Data access required: ${accessReason}. Threat relevance: ${threatRelevance}`,
    operatorId,
    metadata: {
      dataType,
      dataSource,
      accessReason,
      threatRelevance,
      personalDataTypes,
      individualsAffectedCount: individualsAffected.length,
    },
    containsPersonalData: true,
    dataRetentionStatus: 'pending-review',
    // Data access specific fields
    dataType,
    dataSource,
    accessReason,
    threatRelevance,
    personalDataTypes,
    individualsAffected,
  }) as DataAccessLog;
}

/**
 * Log assessment
 */
export function logAssessment(
  assessmentId: string,
  threatDescription: string,
  riskScore: number,
  recommendedAction: string,
  operatorId: string,
  constraintCheck?: ConstraintCheck,
  containsPersonalData: boolean = false
): AssessmentLog {
  return logAuditEntry({
    category: 'assessment',
    severity: riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'warning' : 'info',
    action: `Created risk assessment ${assessmentId}`,
    justification: `Assessment required to evaluate potential threat: ${threatDescription}`,
    operatorId,
    metadata: {
      assessmentId,
      threatDescription,
      riskScore,
      recommendedAction,
    },
    containsPersonalData,
    dataRetentionStatus: containsPersonalData ? 'pending-review' : 'active',
    constraintCheck,
    // Assessment specific fields
    assessmentId,
    threatDescription,
    riskScore,
    recommendedAction,
  }) as AssessmentLog;
}

/**
 * Log AI query
 */
export function logAIQuery(
  query: string,
  operatorId: string,
  constraintCheck: ConstraintCheck,
  containsPersonalData: boolean = false
): AuditLogEntry {
  return logAuditEntry({
    category: 'ai-query',
    severity: constraintCheck.passed ? 'info' : 'critical',
    action: 'AI query executed',
    justification: `Operator requested AI analysis: ${query}`,
    operatorId,
    metadata: {
      query,
      constraintsPassed: constraintCheck.passed,
      violationCount: constraintCheck.violations.length,
    },
    containsPersonalData,
    dataRetentionStatus: containsPersonalData ? 'pending-review' : 'active',
    constraintCheck,
  });
}

/**
 * Log shutdown event
 */
export function logShutdown(
  reason: string,
  operatorId: string,
  emergency: boolean = false
): ShutdownLog {
  return logAuditEntry({
    category: 'shutdown',
    severity: 'critical',
    action: emergency ? 'Emergency shutdown initiated' : 'Shutdown command received',
    justification: `Shutdown ${emergency ? 'emergency protocol' : 'operator command'}: ${reason}`,
    operatorId,
    metadata: {
      shutdownReason: reason,
      emergencyShutdown: emergency,
    },
    containsPersonalData: false,
    dataRetentionStatus: 'active', // Shutdown logs are always retained
    // Shutdown specific fields
    shutdownReason: reason,
    initiatedBy: operatorId,
    emergencyShutdown: emergency,
  }) as ShutdownLog;
}

/**
 * Log self-expansion attempt
 */
export function logSelfExpansionAttempt(
  request: string,
  reason: string,
  operatorId?: string
): AuditLogEntry {
  return logAuditEntry({
    category: 'self-expansion-attempt',
    severity: 'critical',
    action: 'Self-expansion attempt detected',
    justification: `Detected attempt to violate self-limitation constraint: ${reason}`,
    operatorId,
    metadata: {
      request,
      detectionReason: reason,
    },
    containsPersonalData: false,
    dataRetentionStatus: 'active', // Security logs always retained
  });
}

/**
 * Log operator action
 */
export function logOperatorAction(
  action: string,
  operatorId: string,
  justification: string,
  metadata: Record<string, any> = {}
): AuditLogEntry {
  return logAuditEntry({
    category: 'operator-action',
    severity: 'info',
    action,
    justification,
    operatorId,
    metadata,
    containsPersonalData: false,
    dataRetentionStatus: 'active',
  });
}

// --------------------- QUERY AND RETRIEVAL --------------------- //

/**
 * Get all audit logs (for review)
 */
export function getAllAuditLogs(): AuditLogEntry[] {
  return [...auditLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Get logs by category
 */
export function getLogsByCategory(category: LogCategory): AuditLogEntry[] {
  return auditLogs.filter(log => log.category === category);
}

/**
 * Get logs by severity
 */
export function getLogsBySeverity(severity: LogSeverity): AuditLogEntry[] {
  return auditLogs.filter(log => log.severity === severity);
}

/**
 * Get logs by operator
 */
export function getLogsByOperator(operatorId: string): AuditLogEntry[] {
  return auditLogs.filter(log => log.operatorId === operatorId);
}

/**
 * Get logs requiring review
 */
export function getLogsRequiringReview(): AuditLogEntry[] {
  return auditLogs.filter(log => 
    log.containsPersonalData && 
    log.dataRetentionStatus === 'pending-review'
  );
}

/**
 * Search logs
 */
export function searchLogs(query: string): AuditLogEntry[] {
  const lowerQuery = query.toLowerCase();
  return auditLogs.filter(log => 
    log.action.toLowerCase().includes(lowerQuery) ||
    log.justification.toLowerCase().includes(lowerQuery) ||
    JSON.stringify(log.metadata).toLowerCase().includes(lowerQuery)
  );
}

// --------------------- DATA RETENTION & PRIVACY --------------------- //

/**
 * Schedule data review for anonymization/deletion
 */
function scheduleDataReview(logId: string): void {
  // In production: schedule a background job to review this log
  // For now, just log the event
  console.log(`[PRIVACY] Scheduled data review for log ${logId}`);
}

/**
 * Authorize data retention
 */
export function authorizeDataRetention(
  logId: string,
  operatorId: string,
  reason: string,
  retainUntil: Date
): boolean {
  const log = auditLogs.find(l => l.id === logId);
  if (!log) return false;
  
  log.dataRetentionStatus = 'authorized';
  log.retentionAuthorizedBy = operatorId;
  log.retentionAuthorizedUntil = retainUntil;
  
  // Log the authorization decision
  logAuditEntry({
    category: 'system-event',
    severity: 'info',
    action: `Data retention authorized for log ${logId}`,
    justification: reason,
    operatorId,
    metadata: { logId, retainUntil: retainUntil.toISOString() },
    containsPersonalData: false,
    dataRetentionStatus: 'active',
  });
  
  return true;
}

/**
 * Anonymize personal data in a log
 */
export function anonymizeLogData(logId: string): boolean {
  const log = auditLogs.find(l => l.id === logId);
  if (!log) return false;
  
  // Anonymize personal data fields
  if ('individualsAffected' in log) {
    (log as any).individualsAffected = (log as any).individualsAffected.map(() => '[REDACTED]');
  }
  
  log.dataRetentionStatus = 'anonymized';
  log.anonymizedAt = new Date();
  
  // Log the anonymization
  logAuditEntry({
    category: 'system-event',
    severity: 'info',
    action: `Personal data anonymized for log ${logId}`,
    justification: 'Data anonymized per privacy protocol - immediate threat has passed',
    metadata: { logId },
    containsPersonalData: false,
    dataRetentionStatus: 'active',
  });
  
  return true;
}

/**
 * Discard log data (mark as discarded, keep metadata for audit trail)
 */
export function discardLogData(logId: string): boolean {
  const log = auditLogs.find(l => l.id === logId);
  if (!log) return false;
  
  log.dataRetentionStatus = 'discarded';
  
  // Log the discard action
  logAuditEntry({
    category: 'system-event',
    severity: 'info',
    action: `Log data discarded for ${logId}`,
    justification: 'Data discarded per privacy protocol - no longer necessary for harm prevention',
    metadata: { logId },
    containsPersonalData: false,
    dataRetentionStatus: 'active',
  });
  
  return true;
}

/**
 * Mark log as reviewed
 */
export function markLogAsReviewed(
  logId: string,
  operatorId: string,
  notes?: string
): boolean {
  const log = auditLogs.find(l => l.id === logId);
  if (!log) return false;
  
  log.reviewedBy = operatorId;
  log.reviewedAt = new Date();
  log.reviewNotes = notes;
  
  return true;
}

// --------------------- UTILITIES --------------------- //

/**
 * Generate unique log ID
 */
function generateLogId(): string {
  return `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Export audit logs (for external review)
 */
export function exportAuditLogs(
  startDate?: Date,
  endDate?: Date
): string {
  let logsToExport = auditLogs;
  
  if (startDate) {
    logsToExport = logsToExport.filter(log => log.timestamp >= startDate);
  }
  
  if (endDate) {
    logsToExport = logsToExport.filter(log => log.timestamp <= endDate);
  }
  
  return JSON.stringify(logsToExport, null, 2);
}

/**
 * Get audit statistics
 */
export function getAuditStatistics() {
  const totalLogs = auditLogs.length;
  const logsWithPersonalData = auditLogs.filter(l => l.containsPersonalData).length;
  const logsRequiringReview = getLogsRequiringReview().length;
  const criticalLogs = auditLogs.filter(l => l.severity === 'critical').length;
  
  const categoryCounts = auditLogs.reduce((acc, log) => {
    acc[log.category] = (acc[log.category] || 0) + 1;
    return acc;
  }, {} as Record<LogCategory, number>);
  
  return {
    totalLogs,
    logsWithPersonalData,
    logsRequiringReview,
    criticalLogs,
    categoryCounts,
    oldestLog: auditLogs[0]?.timestamp,
    newestLog: auditLogs[auditLogs.length - 1]?.timestamp,
  };
}
