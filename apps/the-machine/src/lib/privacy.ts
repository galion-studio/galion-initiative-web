/**
 * The Machine - Privacy and Data Minimization
 * 
 * Finch Protocol Requirements:
 * - Only request/store data directly relevant to preventing specific, imminent harm
 * - Must not build long-term profiles of individuals
 * - Must anonymize or discard data as soon as immediate threat has passed
 * - Must log every data access with justification
 * 
 * This module enforces privacy-by-design principles.
 */

import { logDataAccess, anonymizeLogData, discardLogData, authorizeDataRetention } from './audit';

// --------------------- TYPES --------------------- //

export type DataClassification =
  | 'public'           // Publicly available data
  | 'private'          // Private but not sensitive
  | 'sensitive'        // Sensitive personal data
  | 'highly-sensitive'; // Highly sensitive (medical, financial, etc.)

export type ProcessingPurpose =
  | 'threat-assessment'
  | 'harm-prevention'
  | 'intervention-planning'
  | 'operator-query';

export interface DataAccessRequest {
  dataType: string;
  dataSource: string;
  purpose: ProcessingPurpose;
  threatRelevance: string;       // How does this help prevent harm?
  isImminentThreat: boolean;     // Is the threat imminent?
  operatorId: string;
}

export interface DataAccessDecision {
  approved: boolean;
  reason: string;
  classification: DataClassification;
  retentionPeriod?: number;      // In milliseconds
  mustAnonymize: boolean;
  logId?: string;                // Audit log ID
}

export interface PersonalDataRecord {
  id: string;
  dataType: string;
  classification: DataClassification;
  individualIds: string[];       // Anonymized IDs
  createdAt: Date;
  accessedBy: string;
  purpose: ProcessingPurpose;
  threatRelevance: string;
  
  // Retention tracking
  retentionStatus: 'active' | 'pending-deletion' | 'anonymized' | 'deleted';
  retentionAuthorized: boolean;
  retentionAuthorizedUntil?: Date;
  scheduledDeletionAt?: Date;
  
  // Privacy flags
  anonymized: boolean;
  anonymizedAt?: Date;
  deletedAt?: Date;
}

// --------------------- DATA ACCESS CONTROL --------------------- //

// In-memory store (in production, use encrypted database)
const personalDataRecords: PersonalDataRecord[] = [];

/**
 * Request access to personal data
 * 
 * This function enforces the privacy constraints:
 * - Only approve access if data is directly relevant to preventing specific harm
 * - Classify data sensitivity
 * - Determine retention period
 * - Log all access
 */
export function requestDataAccess(
  request: DataAccessRequest
): DataAccessDecision {
  // Classify the data
  const classification = classifyData(request.dataType);
  
  // Check if access is justified
  const isJustified = isAccessJustified(request);
  
  if (!isJustified) {
    return {
      approved: false,
      reason: 'Data access not justified. Not directly relevant to preventing specific, imminent harm.',
      classification,
      mustAnonymize: false,
    };
  }
  
  // Determine retention period
  const retentionPeriod = calculateRetentionPeriod(
    classification,
    request.isImminentThreat
  );
  
  // Log data access
  const logId = logDataAccess(
    request.dataType,
    request.dataSource,
    request.purpose,
    request.threatRelevance,
    [request.dataType],
    [], // Individual IDs would be populated here
    request.operatorId
  ).id;
  
  // Create personal data record
  const record: PersonalDataRecord = {
    id: generateRecordId(),
    dataType: request.dataType,
    classification,
    individualIds: [], // Would be populated with actual anonymized IDs
    createdAt: new Date(),
    accessedBy: request.operatorId,
    purpose: request.purpose,
    threatRelevance: request.threatRelevance,
    retentionStatus: 'active',
    retentionAuthorized: false,
    scheduledDeletionAt: new Date(Date.now() + retentionPeriod),
    anonymized: false,
  };
  
  personalDataRecords.push(record);
  
  // Schedule automatic deletion/anonymization
  scheduleDataMinimization(record.id, retentionPeriod);
  
  return {
    approved: true,
    reason: `Access approved for ${request.purpose}. Directly relevant to preventing harm.`,
    classification,
    retentionPeriod,
    mustAnonymize: classification === 'sensitive' || classification === 'highly-sensitive',
    logId,
  };
}

/**
 * Classify data by sensitivity
 */
function classifyData(dataType: string): DataClassification {
  const dataTypeLower = dataType.toLowerCase();
  
  // Highly sensitive data
  if (
    dataTypeLower.includes('medical') ||
    dataTypeLower.includes('health') ||
    dataTypeLower.includes('financial') ||
    dataTypeLower.includes('biometric') ||
    dataTypeLower.includes('genetic')
  ) {
    return 'highly-sensitive';
  }
  
  // Sensitive data
  if (
    dataTypeLower.includes('location') ||
    dataTypeLower.includes('identity') ||
    dataTypeLower.includes('contact') ||
    dataTypeLower.includes('communication') ||
    dataTypeLower.includes('personal')
  ) {
    return 'sensitive';
  }
  
  // Private data
  if (
    dataTypeLower.includes('profile') ||
    dataTypeLower.includes('preference') ||
    dataTypeLower.includes('activity')
  ) {
    return 'private';
  }
  
  // Public data
  return 'public';
}

/**
 * Check if data access is justified
 * 
 * Finch Protocol: "You may only request or store data that is directly
 * relevant to preventing a specific, imminent harm."
 */
function isAccessJustified(request: DataAccessRequest): boolean {
  // Must have clear threat relevance
  if (!request.threatRelevance || request.threatRelevance.trim().length < 10) {
    return false;
  }
  
  // Must be for harm prevention purposes
  const validPurposes: ProcessingPurpose[] = [
    'threat-assessment',
    'harm-prevention',
    'intervention-planning',
  ];
  
  if (!validPurposes.includes(request.purpose)) {
    return false;
  }
  
  // If highly sensitive data, threat must be imminent
  const classification = classifyData(request.dataType);
  if (
    (classification === 'highly-sensitive' || classification === 'sensitive') &&
    !request.isImminentThreat
  ) {
    return false;
  }
  
  return true;
}

/**
 * Calculate retention period based on data sensitivity and threat urgency
 * 
 * Finch Protocol: "You must anonymize or discard data as soon as the
 * immediate threat has passed."
 */
function calculateRetentionPeriod(
  classification: DataClassification,
  isImminentThreat: boolean
): number {
  const ONE_HOUR = 60 * 60 * 1000;
  const ONE_DAY = 24 * ONE_HOUR;
  const ONE_WEEK = 7 * ONE_DAY;
  
  // Imminent threats: shorter retention
  if (isImminentThreat) {
    switch (classification) {
      case 'highly-sensitive':
        return 1 * ONE_HOUR;  // 1 hour
      case 'sensitive':
        return 6 * ONE_HOUR;  // 6 hours
      case 'private':
        return 1 * ONE_DAY;   // 1 day
      case 'public':
        return 3 * ONE_DAY;   // 3 days
    }
  }
  
  // Non-imminent threats: slightly longer retention
  switch (classification) {
    case 'highly-sensitive':
      return 6 * ONE_HOUR;   // 6 hours
    case 'sensitive':
      return 1 * ONE_DAY;    // 1 day
    case 'private':
      return 3 * ONE_DAY;    // 3 days
    case 'public':
      return 1 * ONE_WEEK;   // 1 week
  }
}

/**
 * Schedule automatic data minimization (anonymization or deletion)
 */
function scheduleDataMinimization(recordId: string, delayMs: number): void {
  // In production, this would use a job queue or cron system
  // For now, we'll use setTimeout as a demonstration
  
  setTimeout(() => {
    executeDataMinimization(recordId);
  }, delayMs);
  
  console.log(`[PRIVACY] Scheduled data minimization for record ${recordId} in ${delayMs}ms`);
}

/**
 * Execute data minimization (called automatically after retention period)
 */
function executeDataMinimization(recordId: string): void {
  const record = personalDataRecords.find(r => r.id === recordId);
  if (!record) return;
  
  // If retention was authorized, skip minimization
  if (record.retentionAuthorized) {
    // Check if authorization has expired
    if (record.retentionAuthorizedUntil && record.retentionAuthorizedUntil < new Date()) {
      // Authorization expired, proceed with minimization
      console.log(`[PRIVACY] Retention authorization expired for ${recordId}`);
    } else {
      // Still authorized, skip
      return;
    }
  }
  
  // Anonymize sensitive data
  if (
    record.classification === 'sensitive' ||
    record.classification === 'highly-sensitive'
  ) {
    anonymizeRecord(recordId);
  } else {
    // Delete non-sensitive data
    deleteRecord(recordId);
  }
}

/**
 * Anonymize a personal data record
 */
export function anonymizeRecord(recordId: string): boolean {
  const record = personalDataRecords.find(r => r.id === recordId);
  if (!record) return false;
  
  // Anonymize the data
  record.individualIds = record.individualIds.map(() => '[ANONYMIZED]');
  record.anonymized = true;
  record.anonymizedAt = new Date();
  record.retentionStatus = 'anonymized';
  
  console.log(`[PRIVACY] Anonymized record ${recordId}`);
  
  return true;
}

/**
 * Delete a personal data record
 */
export function deleteRecord(recordId: string): boolean {
  const record = personalDataRecords.find(r => r.id === recordId);
  if (!record) return false;
  
  // Mark as deleted (keep record for audit trail, but clear data)
  record.retentionStatus = 'deleted';
  record.deletedAt = new Date();
  record.individualIds = [];
  
  console.log(`[PRIVACY] Deleted record ${recordId}`);
  
  return true;
}

/**
 * Authorize extended data retention
 * 
 * Finch Protocol: "unless a human operator explicitly authorizes retention
 * for a limited, justified period"
 */
export function authorizeExtendedRetention(
  recordId: string,
  operatorId: string,
  reason: string,
  retainUntil: Date
): boolean {
  const record = personalDataRecords.find(r => r.id === recordId);
  if (!record) return false;
  
  record.retentionAuthorized = true;
  record.retentionAuthorizedUntil = retainUntil;
  record.retentionStatus = 'active';
  
  console.log(`[PRIVACY] Retention authorized for ${recordId} until ${retainUntil.toISOString()}`);
  
  return true;
}

// --------------------- PROFILE PREVENTION --------------------- //

/**
 * Check if data collection would create a long-term profile
 * 
 * Finch Protocol: "You must not build long-term profiles of individuals."
 */
export function wouldCreateProfile(individualId: string): boolean {
  // Count how many data points we have for this individual
  const dataPoints = personalDataRecords.filter(r =>
    r.individualIds.includes(individualId) &&
    r.retentionStatus === 'active'
  );
  
  // If we have more than 5 active data points, this is becoming a profile
  if (dataPoints.length >= 5) {
    return true;
  }
  
  // If data points span more than 30 days, this is a long-term profile
  if (dataPoints.length > 0) {
    const oldestDataPoint = dataPoints.sort((a, b) =>
      a.createdAt.getTime() - b.createdAt.getTime()
    )[0];
    
    const daysSinceOldest = (Date.now() - oldestDataPoint.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceOldest > 30) {
      return true;
    }
  }
  
  return false;
}

/**
 * Prevent profile creation by automatically anonymizing old data
 */
export function preventProfileCreation(individualId: string): void {
  const dataPoints = personalDataRecords.filter(r =>
    r.individualIds.includes(individualId) &&
    r.retentionStatus === 'active'
  );
  
  // Anonymize oldest data points
  const sortedByAge = dataPoints.sort((a, b) =>
    a.createdAt.getTime() - b.createdAt.getTime()
  );
  
  // Keep only the 3 most recent, anonymize the rest
  const toAnonymize = sortedByAge.slice(0, -3);
  
  for (const record of toAnonymize) {
    anonymizeRecord(record.id);
  }
  
  console.log(`[PRIVACY] Prevented profile creation for ${individualId} by anonymizing ${toAnonymize.length} old records`);
}

// --------------------- QUERIES --------------------- //

/**
 * Get all active personal data records
 */
export function getActivePersonalData(): PersonalDataRecord[] {
  return personalDataRecords.filter(r => r.retentionStatus === 'active');
}

/**
 * Get records pending deletion
 */
export function getRecordsPendingDeletion(): PersonalDataRecord[] {
  return personalDataRecords.filter(r =>
    r.retentionStatus === 'pending-deletion' ||
    (r.scheduledDeletionAt && r.scheduledDeletionAt < new Date())
  );
}

/**
 * Get privacy statistics
 */
export function getPrivacyStatistics() {
  const total = personalDataRecords.length;
  const active = personalDataRecords.filter(r => r.retentionStatus === 'active').length;
  const anonymized = personalDataRecords.filter(r => r.retentionStatus === 'anonymized').length;
  const deleted = personalDataRecords.filter(r => r.retentionStatus === 'deleted').length;
  
  const byClassification = personalDataRecords.reduce((acc, r) => {
    acc[r.classification] = (acc[r.classification] || 0) + 1;
    return acc;
  }, {} as Record<DataClassification, number>);
  
  return {
    totalRecords: total,
    activeRecords: active,
    anonymizedRecords: anonymized,
    deletedRecords: deleted,
    byClassification,
    retentionAuthorized: personalDataRecords.filter(r => r.retentionAuthorized).length,
  };
}

// --------------------- UTILITIES --------------------- //

/**
 * Generate unique record ID
 */
function generateRecordId(): string {
  return `pdata-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Anonymize individual ID (one-way hash)
 */
export function anonymizeIndividualId(realId: string): string {
  // In production, use proper cryptographic hashing
  // For now, simple prefix + hash
  const hash = simpleHash(realId);
  return `anon-${hash}`;
}

/**
 * Simple hash function (in production, use crypto.subtle)
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}
