/**
 * The Machine - PostgreSQL Database Access Layer
 */

import { Pool, QueryResult } from 'pg';
import type { RiskAssessment } from './assessment';

export interface AuditLog { id: string; timestamp: Date; operator: string; action: string; category: 'assessment' | 'intervention' | 'system' | 'constraint-check'; severity: 'info' | 'warning' | 'critical'; details: string; metadata?: Record<string, unknown>; assessment_id?: string; constraint_check_passed?: boolean; constraint_violations?: string; }
export interface Setting { key: string; value: string; updated_at: Date; updated_by: string; description?: string; value_type: 'number' | 'boolean' | 'string' | 'json'; is_locked: boolean; previous_value?: string; change_reason?: string; }
export interface OperatorSession { id: string; operator_id: string; operator_email?: string; operator_name?: string; started_at: Date; last_activity: Date; ended_at?: Date; ip_address?: string; user_agent?: string; session_token: string; is_active: boolean; }

let pool: Pool | null = null;
export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL environment variable is not set');
    pool = new Pool({ connectionString, max: 10, idleTimeoutMillis: 30000, connectionTimeoutMillis: 2000 });
    pool.on('error', (err: any) => console.error('Unexpected error on idle PostgreSQL client', err));
  }
  return pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  try { return await getPool().query<T>(text, params); }
  catch (error) { console.error('Query error:', error); throw error; }
}
export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> { return (await query<T>(text, params)).rows[0] || null; }
export async function queryAll<T = any>(text: string, params?: any[]): Promise<T[]> { return (await query<T>(text, params)).rows; }

export async function createAssessment(assessment: RiskAssessment): Promise<void> {
  await query('INSERT INTO machine_assessments (id, created_at, created_by, who_at_risk, harm_type, harm_description, time_frame, location, perpetrator, probability, severity, uncertainty, data_quality, rationale, risk_score, risk_level, options, recommendation, flags, status, operator_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)', [assessment.id, assessment.createdAt.toISOString(), assessment.createdBy, JSON.stringify(assessment.identification.whoAtRisk), assessment.identification.harmType, assessment.identification.harmDescription, assessment.identification.timeFrame, assessment.identification.location || null, assessment.identification.perpetrator || null, assessment.estimate.probability, assessment.estimate.severity, assessment.estimate.uncertainty, assessment.estimate.dataQuality, assessment.estimate.rationaleBrief, calculateRiskScore(assessment), getRiskLevel(calculateRiskScore(assessment)), JSON.stringify(assessment.options), assessment.recommendation || null, JSON.stringify(assessment.flags), assessment.status, assessment.operatorNotes || null]);
}

export async function getAssessment(id: string): Promise<RiskAssessment | null> {
  const r = await queryOne<any>('SELECT * FROM machine_assessments WHERE id = $1', [id]);
  return r ? dbRowToAssessment(r) : null;
}

export async function listAssessments(opts: { limit?: number; offset?: number; status?: string; riskLevel?: string; createdBy?: string; } = {}): Promise<RiskAssessment[]> {
  let q = 'SELECT * FROM machine_assessments WHERE 1=1', p: any[] = [], i = 1;
  if (opts.status) { q += ' AND status = $' + i; p.push(opts.status); i++; }
  if (opts.riskLevel) { q += ' AND risk_level = $' + i; p.push(opts.riskLevel); i++; }
  if (opts.createdBy) { q += ' AND created_by = $' + i; p.push(opts.createdBy); i++; }
  q += ' ORDER BY created_at DESC';
  if (opts.limit) { q += ' LIMIT $' + i; p.push(opts.limit); i++; }
  if (opts.offset) { q += ' OFFSET $' + i; p.push(opts.offset); }
  return (await queryAll<any>(q, p)).map(dbRowToAssessment);
}

export async function updateAssessmentStatus(id: string, status: string, notes?: string): Promise<void> {
  await query('UPDATE machine_assessments SET status = $1, operator_notes = $2 WHERE id = $3', [status, notes || null, id]);
}

function dbRowToAssessment(r: any): RiskAssessment {
  return { id: r.id, createdAt: new Date(r.created_at), createdBy: r.created_by, identification: { whoAtRisk: typeof r.who_at_risk === 'string' ? JSON.parse(r.who_at_risk) : r.who_at_risk, harmType: r.harm_type, harmDescription: r.harm_description, timeFrame: r.time_frame, location: r.location || undefined, perpetrator: r.perpetrator || undefined }, estimate: { probability: r.probability, severity: r.severity, uncertainty: r.uncertainty, dataQuality: r.data_quality, rationaleBrief: r.rationale }, options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options, recommendation: r.recommendation || undefined, flags: typeof r.flags === 'string' ? JSON.parse(r.flags) : r.flags, status: r.status, operatorNotes: r.operator_notes || undefined };
}

export async function createAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<string> {
  const id = 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  await query('INSERT INTO machine_audit_logs (id, timestamp, operator, action, category, severity, details, metadata, assessment_id, constraint_check_passed, constraint_violations) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [id, new Date().toISOString(), log.operator, log.action, log.category, log.severity, log.details, log.metadata ? JSON.stringify(log.metadata) : null, log.assessment_id || null, log.constraint_check_passed !== undefined ? log.constraint_check_passed : null, log.constraint_violations || null]);
  return id;
}

export async function listAuditLogs(opts: { limit?: number; offset?: number; category?: string; severity?: string; operator?: string; search?: string; } = {}): Promise<AuditLog[]> {
  let q = 'SELECT * FROM machine_audit_logs WHERE 1=1', p: any[] = [], i = 1;
  if (opts.category) { q += ' AND category = $' + i; p.push(opts.category); i++; }
  if (opts.severity) { q += ' AND severity = $' + i; p.push(opts.severity); i++; }
  if (opts.operator) { q += ' AND operator = $' + i; p.push(opts.operator); i++; }
  if (opts.search) { q += ' AND (action ILIKE $' + i + ' OR details ILIKE $' + i + ')'; p.push('%' + opts.search + '%'); i++; }
  q += ' ORDER BY timestamp DESC';
  if (opts.limit) { q += ' LIMIT $' + i; p.push(opts.limit); i++; }
  if (opts.offset) { q += ' OFFSET $' + i; p.push(opts.offset); }
  return (await queryAll<any>(q, p)).map(dbRowToAuditLog);
}

function dbRowToAuditLog(r: any): AuditLog {
  return { id: r.id, timestamp: new Date(r.timestamp), operator: r.operator, action: r.action, category: r.category, severity: r.severity, details: r.details, metadata: r.metadata ? (typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata) : undefined, assessment_id: r.assessment_id || undefined, constraint_check_passed: r.constraint_check_passed, constraint_violations: r.constraint_violations || undefined };
}

export async function getSetting(key: string): Promise<Setting | null> {
  const r = await queryOne<any>('SELECT * FROM machine_settings WHERE key = $1', [key]);
  return r ? dbRowToSetting(r) : null;
}

export async function listSettings(): Promise<Setting[]> {
  return (await queryAll<any>('SELECT * FROM machine_settings ORDER BY key')).map(dbRowToSetting);
}

export async function updateSetting(key: string, value: string, updatedBy: string, changeReason?: string): Promise<void> {
  const s = await getSetting(key);
  if (s?.is_locked) throw new Error('Setting "' + key + '" is locked');
  await query('UPDATE machine_settings SET value = $1, updated_by = $2, previous_value = $3, change_reason = $4, updated_at = NOW() WHERE key = $5', [value, updatedBy, s?.value || null, changeReason || null, key]);
}

function dbRowToSetting(r: any): Setting {
  return { key: r.key, value: r.value, updated_at: new Date(r.updated_at), updated_by: r.updated_by, description: r.description || undefined, value_type: r.value_type, is_locked: r.is_locked, previous_value: r.previous_value || undefined, change_reason: r.change_reason || undefined };
}

export async function createConstraintCheck(check: { operator: string; actionDescription: string; context?: string; passed: boolean; violations?: string; assessmentId?: string; shouldShutdown: boolean; }): Promise<string> {
  const id = 'check-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  await query('INSERT INTO machine_constraint_checks (id, timestamp, operator, action_description, context, passed, violations, assessment_id, should_shutdown) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [id, new Date().toISOString(), check.operator, check.actionDescription, check.context || null, check.passed, check.violations || null, check.assessmentId || null, check.shouldShutdown]);
  return id;
}

function calculateRiskScore(a: RiskAssessment): number {
  const pv: Record<string, number> = { 'very-low': 10, 'low': 25, 'medium': 50, 'high': 75, 'very-high': 90 };
  const sv: Record<string, number> = { 'minor': 10, 'moderate': 30, 'serious': 50, 'severe': 75, 'critical': 95 };
  return Math.round(((pv[a.estimate.probability] || 50) * 0.4) + ((sv[a.estimate.severity] || 50) * 0.6));
}

function getRiskLevel(s: number): 'low' | 'medium' | 'high' | 'critical' {
  if (s >= 80) return 'critical'; if (s >= 60) return 'high'; if (s >= 40) return 'medium'; return 'low';
}

export async function closePool(): Promise<void> { if (pool) { await pool.end(); pool = null; } }
