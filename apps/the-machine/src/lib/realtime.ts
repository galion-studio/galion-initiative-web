/**
 * THE MACHINE v2.0 - Real-Time Monitoring System
 * 
 * WebSocket-based live monitoring for operators
 * Provides real-time threat alerts and system updates
 * 
 * Finch Protocol Compliance:
 * - No autonomous action (alerts only notify, operators decide)
 * - Complete audit trail (all events logged)
 * - Privacy-by-design (no personal data in alerts)
 */

// =============================================================================
// TYPES
// =============================================================================

export type EventType =
  | 'assessment-created'
  | 'assessment-updated'
  | 'pattern-match'
  | 'critical-alert'
  | 'constraint-violation'
  | 'operator-joined'
  | 'operator-left'
  | 'system-event';

export type AlertLevel = 'info' | 'warning' | 'critical';

export interface RealtimeEvent {
  id: string;
  type: EventType;
  level: AlertLevel;
  timestamp: number;
  
  // Event data
  title: string;
  message: string;
  data: Record<string, any>;
  
  // Operator targeting
  targetOperators?: string[]; // If undefined, broadcast to all
  excludeOperators?: string[];
}

export interface AssessmentEvent extends RealtimeEvent {
  type: 'assessment-created' | 'assessment-updated';
  data: {
    assessment_id: string;
    harm_type: string;
    risk_score: number;
    status: string;
    operator_id: string;
  };
}

export interface PatternMatchEvent extends RealtimeEvent {
  type: 'pattern-match';
  data: {
    assessment_id: string;
    pattern_id: string;
    pattern_name: string;
    confidence: number;
    matched_keywords: string[];
    matched_indicators: string[];
  };
}

export interface CriticalAlertEvent extends RealtimeEvent {
  type: 'critical-alert';
  level: 'critical';
  data: {
    assessment_id: string;
    risk_score: number;
    harm_description: string;
    requires_immediate_action: boolean;
  };
}

// =============================================================================
// EVENT CREATION
// =============================================================================

/**
 * Create assessment event
 */
export function createAssessmentEvent(
  eventType: 'assessment-created' | 'assessment-updated',
  assessment: {
    id: string;
    harm_type: string;
    harm_description: string;
    risk_score: number;
    status: string;
    operator_id: string;
  }
): AssessmentEvent {
  const level: AlertLevel = assessment.risk_score >= 80 ? 'critical' : 
                           assessment.risk_score >= 60 ? 'warning' : 'info';

  return {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: eventType,
    level,
    timestamp: Date.now(),
    title: eventType === 'assessment-created' ? 'New Assessment' : 'Assessment Updated',
    message: `${assessment.harm_type} threat (Risk: ${assessment.risk_score})`,
    data: {
      assessment_id: assessment.id,
      harm_type: assessment.harm_type,
      risk_score: assessment.risk_score,
      status: assessment.status,
      operator_id: assessment.operator_id,
    },
  };
}

/**
 * Create pattern match event
 */
export function createPatternMatchEvent(
  assessmentId: string,
  match: {
    pattern_id: string;
    pattern_name: string;
    confidence: number;
    matched_keywords: string[];
    matched_indicators: string[];
  }
): PatternMatchEvent {
  const level: AlertLevel = match.confidence >= 0.7 ? 'critical' :
                            match.confidence >= 0.5 ? 'warning' : 'info';

  return {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'pattern-match',
    level,
    timestamp: Date.now(),
    title: 'Pattern Match Detected',
    message: `${Math.round(match.confidence * 100)}% confidence: ${match.pattern_name}`,
    data: {
      assessment_id: assessmentId,
      pattern_id: match.pattern_id,
      pattern_name: match.pattern_name,
      confidence: match.confidence,
      matched_keywords: match.matched_keywords,
      matched_indicators: match.matched_indicators,
    },
  };
}

/**
 * Create critical alert event
 */
export function createCriticalAlertEvent(
  assessment: {
    id: string;
    risk_score: number;
    harm_description: string;
    requires_immediate_action: boolean;
  }
): CriticalAlertEvent {
  return {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'critical-alert',
    level: 'critical',
    timestamp: Date.now(),
    title: '🚨 CRITICAL THREAT ALERT',
    message: `Risk Score: ${assessment.risk_score} - Immediate review required`,
    data: {
      assessment_id: assessment.id,
      risk_score: assessment.risk_score,
      harm_description: assessment.harm_description,
      requires_immediate_action: assessment.requires_immediate_action,
    },
  };
}

/**
 * Create operator presence event
 */
export function createOperatorPresenceEvent(
  eventType: 'operator-joined' | 'operator-left',
  operator: {
    id: string;
    name: string;
    role: string;
  }
): RealtimeEvent {
  return {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: eventType,
    level: 'info',
    timestamp: Date.now(),
    title: eventType === 'operator-joined' ? 'Operator Online' : 'Operator Offline',
    message: `${operator.name} (${operator.role})`,
    data: {
      operator_id: operator.id,
      operator_name: operator.name,
      operator_role: operator.role,
    },
  };
}

// =============================================================================
// EVENT BROADCASTING (Server-Sent Events Implementation)
// =============================================================================

/**
 * In-memory event store (last 100 events)
 * In production, this would use Redis or similar
 */
const recentEvents: RealtimeEvent[] = [];
const MAX_RECENT_EVENTS = 100;

/**
 * Store event in memory
 */
export function storeEvent(event: RealtimeEvent): void {
  recentEvents.unshift(event);
  
  // Keep only last 100 events
  if (recentEvents.length > MAX_RECENT_EVENTS) {
    recentEvents.pop();
  }
}

/**
 * Get recent events
 */
export function getRecentEvents(limit: number = 50): RealtimeEvent[] {
  return recentEvents.slice(0, limit);
}

/**
 * Get events by level
 */
export function getEventsByLevel(level: AlertLevel, limit: number = 50): RealtimeEvent[] {
  return recentEvents
    .filter(e => e.level === level)
    .slice(0, limit);
}

/**
 * Get critical events (last 24 hours)
 */
export function getCriticalEvents(): RealtimeEvent[] {
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
  return recentEvents
    .filter(e => e.level === 'critical' && e.timestamp >= oneDayAgo)
    .slice(0, 50);
}

// =============================================================================
// OPERATOR PRESENCE TRACKING
// =============================================================================

interface OperatorPresence {
  operator_id: string;
  operator_name: string;
  operator_role: string;
  joined_at: number;
  last_seen: number;
}

const activeOperators = new Map<string, OperatorPresence>();

/**
 * Register operator as online
 */
export function registerOperatorPresence(
  operatorId: string,
  operatorName: string,
  operatorRole: string
): void {
  const now = Date.now();
  
  activeOperators.set(operatorId, {
    operator_id: operatorId,
    operator_name: operatorName,
    operator_role: operatorRole,
    joined_at: now,
    last_seen: now,
  });

  // Broadcast operator joined event
  const event = createOperatorPresenceEvent('operator-joined', {
    id: operatorId,
    name: operatorName,
    role: operatorRole,
  });
  
  storeEvent(event);
}

/**
 * Update operator last seen timestamp
 */
export function updateOperatorPresence(operatorId: string): void {
  const presence = activeOperators.get(operatorId);
  if (presence) {
    presence.last_seen = Date.now();
  }
}

/**
 * Remove operator from active list
 */
export function removeOperatorPresence(operatorId: string): void {
  const presence = activeOperators.get(operatorId);
  if (presence) {
    activeOperators.delete(operatorId);
    
    // Broadcast operator left event
    const event = createOperatorPresenceEvent('operator-left', {
      id: presence.operator_id,
      name: presence.operator_name,
      role: presence.operator_role,
    });
    
    storeEvent(event);
  }
}

/**
 * Get all active operators
 */
export function getActiveOperators(): OperatorPresence[] {
  // Remove stale operators (not seen in 5 minutes)
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
  
  for (const [operatorId, presence] of activeOperators.entries()) {
    if (presence.last_seen < fiveMinutesAgo) {
      removeOperatorPresence(operatorId);
    }
  }
  
  return Array.from(activeOperators.values());
}

/**
 * Get operator count
 */
export function getActiveOperatorCount(): number {
  return getActiveOperators().length;
}
