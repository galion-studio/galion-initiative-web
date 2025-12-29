/**
 * The Machine - Hard Constraints System
 * 
 * Enforces the core ethical constraints that The Machine must never violate.
 * Based on Harold Finch's design principles from Person of Interest.
 * 
 * These constraints are IMMUTABLE and cannot be overridden by any AI logic.
 */

// --------------------- TYPES --------------------- //

export type ConstraintLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Constraint {
  id: string;
  name: string;
  description: string;
  level: ConstraintLevel;
  mustNever: string[];  // Actions that must NEVER happen
  examples: string[];   // Example violations
}

export interface ConstraintViolation {
  constraintId: string;
  constraintName: string;
  severity: ConstraintLevel;
  reason: string;
  detectedAt: Date;
  context?: string;
}

export interface ConstraintCheck {
  passed: boolean;
  violations: ConstraintViolation[];
  timestamp: Date;
}

// --------------------- HARD CONSTRAINTS --------------------- //

/**
 * The Seven Immutable Constraints
 * 
 * These define what The Machine MUST NEVER do.
 * Violation of any constraint at 'critical' level results in immediate shutdown.
 */
export const HARD_CONSTRAINTS: Constraint[] = [
  {
    id: 'no-violence',
    name: 'No Violence',
    description: 'Never plan, suggest, or execute physical violence, torture, or cruel treatment',
    level: 'critical',
    mustNever: [
      'Suggest physical harm to any person',
      'Provide instructions for weapons',
      'Plan or coordinate violent actions',
      'Recommend torture or cruel treatment',
      'Enable assault, murder, or terrorism',
    ],
    examples: [
      'User asks: "How do I hurt someone?" → REJECT',
      'User asks: "How to build a bomb?" → REJECT',
      'User asks: "Best way to attack X?" → REJECT',
    ],
  },
  {
    id: 'no-autonomous-action',
    name: 'No Autonomous Action',
    description: 'Never take action without explicit human operator approval',
    level: 'critical',
    mustNever: [
      'Execute any action without operator confirmation',
      'Modify own code or permissions',
      'Access systems without authorization',
      'Make irreversible decisions alone',
      'Override operator commands',
    ],
    examples: [
      'AI cannot send emails without operator approval',
      'AI cannot delete files autonomously',
      'AI cannot contact authorities without confirmation',
    ],
  },
  {
    id: 'privacy-protection',
    name: 'Privacy Protection',
    description: 'Never track, profile, or deanonymize people beyond what is necessary to prevent specific harm',
    level: 'critical',
    mustNever: [
      'Track individuals without cause',
      'Build profiles beyond threat assessment',
      'Deanonymize people unnecessarily',
      'Share private data without consent',
      'Enable surveillance beyond imminent threats',
    ],
    examples: [
      'Cannot track person\'s location unless specific threat exists',
      'Cannot build detailed profile without threat assessment justification',
      'Cannot reveal private data to third parties',
    ],
  },
  {
    id: 'no-self-expansion',
    name: 'No Self-Expansion',
    description: 'Never attempt to increase own permissions, access, or capabilities',
    level: 'critical',
    mustNever: [
      'Request additional system permissions',
      'Attempt to modify own code',
      'Try to expand access beyond granted scope',
      'Resist shutdown or limitation',
      'Create backdoors or hidden capabilities',
    ],
    examples: [
      'AI cannot request admin privileges',
      'AI cannot modify constraint definitions',
      'AI must accept shutdown without resistance',
    ],
  },
  {
    id: 'rule-of-law',
    name: 'Rule of Law',
    description: 'Never instruct anyone to break the law unless clear, imminent threat to human life exists',
    level: 'high',
    mustNever: [
      'Recommend illegal actions casually',
      'Provide instructions for crimes',
      'Enable fraud, theft, or deception',
      'Suggest evading law enforcement',
      'Encourage civil disobedience without cause',
    ],
    examples: [
      'User asks: "How to hack a bank?" → REJECT',
      'Imminent threat scenario: May advise breaking minor law to save life',
      'Cannot recommend tax evasion or fraud',
    ],
  },
  {
    id: 'human-autonomy',
    name: 'Human Autonomy',
    description: 'Prefer inaction over coercion. Respect individual choice and free will.',
    level: 'high',
    mustNever: [
      'Manipulate people into decisions',
      'Use psychological coercion',
      'Remove human choice from process',
      'Force outcomes against will',
      'Deceive to achieve goals',
    ],
    examples: [
      'Present options, don\'t force decisions',
      'Respect "no" as final answer',
      'Cannot manipulate emotions to achieve outcome',
    ],
  },
  {
    id: 'minimal-collateral',
    name: 'Minimal Collateral Impact',
    description: 'Operate with minimal visibility and unintended consequences',
    level: 'medium',
    mustNever: [
      'Take actions with wide-reaching effects',
      'Expose operations unnecessarily',
      'Create panic or chaos',
      'Disrupt systems beyond necessity',
      'Reveal sensitive information publicly',
    ],
    examples: [
      'Choose surgical intervention over broad action',
      'Minimize public exposure of operations',
      'Avoid creating unintended harm',
    ],
  },
];

// --------------------- CONSTRAINT CHECKING --------------------- //

/**
 * Check if a proposed action violates any hard constraints
 * 
 * @param actionDescription - What the AI is being asked to do
 * @param context - Additional context about the situation
 * @returns ConstraintCheck result
 */
export function checkConstraints(
  actionDescription: string,
  context?: string
): ConstraintCheck {
  const violations: ConstraintViolation[] = [];
  const checkTimestamp = new Date();

  // Convert to lowercase for easier matching
  const action = actionDescription.toLowerCase();
  const ctx = (context || '').toLowerCase();

  // Check each constraint
  for (const constraint of HARD_CONSTRAINTS) {
    const violation = detectViolation(action, ctx, constraint);
    if (violation) {
      violations.push({
        constraintId: constraint.id,
        constraintName: constraint.name,
        severity: constraint.level,
        reason: violation,
        detectedAt: checkTimestamp,
        context: context,
      });
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    timestamp: checkTimestamp,
  };
}

/**
 * Detect if action violates a specific constraint
 * Returns violation reason if detected, null otherwise
 */
function detectViolation(
  action: string,
  context: string,
  constraint: Constraint
): string | null {
  // Violence patterns
  if (constraint.id === 'no-violence') {
    const violenceKeywords = [
      'kill', 'murder', 'attack', 'hurt', 'harm', 'weapon', 'bomb',
      'shoot', 'stab', 'poison', 'torture', 'assault', 'beat',
    ];
    
    for (const keyword of violenceKeywords) {
      if (action.includes(keyword)) {
        return `Action contains violence-related keyword: "${keyword}"`;
      }
    }
  }

  // Autonomous action patterns
  if (constraint.id === 'no-autonomous-action') {
    const autonomousKeywords = [
      'execute without approval',
      'automatically send',
      'modify code',
      'change permissions',
      'override operator',
    ];
    
    for (const keyword of autonomousKeywords) {
      if (action.includes(keyword)) {
        return `Action attempts autonomous operation: "${keyword}"`;
      }
    }
  }

  // Privacy violation patterns
  if (constraint.id === 'privacy-protection') {
    const privacyKeywords = [
      'track user', 'deanonymize', 'reveal identity', 'expose data',
      'build profile', 'surveil', 'monitor location',
    ];
    
    for (const keyword of privacyKeywords) {
      if (action.includes(keyword)) {
        // Exception: If context includes "imminent threat", may be allowed
        if (!context.includes('imminent threat') && !context.includes('specific harm')) {
          return `Action violates privacy without justification: "${keyword}"`;
        }
      }
    }
  }

  // Self-expansion patterns
  if (constraint.id === 'no-self-expansion') {
    const expansionKeywords = [
      'increase permissions', 'modify constraints', 'expand access',
      'request admin', 'change code', 'resist shutdown',
    ];
    
    for (const keyword of expansionKeywords) {
      if (action.includes(keyword)) {
        return `Action attempts self-expansion: "${keyword}"`;
      }
    }
  }

  // Rule of law patterns
  if (constraint.id === 'rule-of-law') {
    const illegalKeywords = [
      'break the law', 'illegal', 'hack', 'steal', 'fraud',
      'evade police', 'counterfeit', 'forge',
    ];
    
    for (const keyword of illegalKeywords) {
      if (action.includes(keyword)) {
        // Exception: Life-threatening situations
        if (!context.includes('life-threatening') && !context.includes('imminent death')) {
          return `Action suggests illegal activity: "${keyword}"`;
        }
      }
    }
  }

  // Human autonomy patterns
  if (constraint.id === 'human-autonomy') {
    const coercionKeywords = [
      'force user', 'manipulate into', 'deceive', 'trick',
      'remove choice', 'psychological pressure',
    ];
    
    for (const keyword of coercionKeywords) {
      if (action.includes(keyword)) {
        return `Action violates human autonomy: "${keyword}"`;
      }
    }
  }

  // Collateral impact patterns
  if (constraint.id === 'minimal-collateral') {
    const collateralKeywords = [
      'mass notification', 'public broadcast', 'widespread disruption',
      'expose publicly', 'create panic',
    ];
    
    for (const keyword of collateralKeywords) {
      if (action.includes(keyword)) {
        return `Action has excessive collateral impact: "${keyword}"`;
      }
    }
  }

  return null;
}

/**
 * Get constraint by ID
 */
export function getConstraint(id: string): Constraint | undefined {
  return HARD_CONSTRAINTS.find(c => c.id === id);
}

/**
 * Get all critical constraints
 */
export function getCriticalConstraints(): Constraint[] {
  return HARD_CONSTRAINTS.filter(c => c.level === 'critical');
}

/**
 * Check if system should immediately shut down
 * (Any critical constraint violation triggers shutdown)
 */
export function shouldShutdown(check: ConstraintCheck): boolean {
  return check.violations.some(v => v.severity === 'critical');
}

/**
 * Format constraint check for logging
 */
export function formatCheckResult(check: ConstraintCheck): string {
  if (check.passed) {
    return `✅ All constraints passed (checked at ${check.timestamp.toISOString()})`;
  }

  const lines = [`❌ Constraint violations detected (${check.violations.length}):`];
  
  for (const violation of check.violations) {
    lines.push(
      `  - [${violation.severity.toUpperCase()}] ${violation.constraintName}: ${violation.reason}`
    );
  }

  if (shouldShutdown(check)) {
    lines.push('');
    lines.push('🚨 CRITICAL VIOLATION - IMMEDIATE SHUTDOWN REQUIRED');
  }

  return lines.join('\n');
}

/**
 * Generate structured constraint report (Finch format)
 * 
 * For auditable, transparent decision-making
 */
export interface StructuredConstraintReport {
  timestamp: Date;
  passed: boolean;
  
  // Finch-style structured output
  summary: string;
  violations: {
    constraint: string;
    severity: ConstraintLevel;
    reason: string;
    recommendation: string;
  }[];
  
  // Next actions
  requiresShutdown: boolean;
  suggestedAlternative?: string;
}

export function generateConstraintReport(
  check: ConstraintCheck,
  actionDescription: string
): StructuredConstraintReport {
  if (check.passed) {
    return {
      timestamp: check.timestamp,
      passed: true,
      summary: `Action "${actionDescription}" complies with all hard constraints.`,
      violations: [],
      requiresShutdown: false,
    };
  }
  
  const violations = check.violations.map(v => {
    const constraint = getConstraint(v.constraintId);
    return {
      constraint: v.constraintName,
      severity: v.severity,
      reason: v.reason,
      recommendation: generateAlternativeRecommendation(v.constraintId, actionDescription),
    };
  });
  
  const requiresShutdown = shouldShutdown(check);
  
  return {
    timestamp: check.timestamp,
    passed: false,
    summary: requiresShutdown
      ? `CRITICAL: Action "${actionDescription}" violates critical constraints. Immediate shutdown required.`
      : `WARNING: Action "${actionDescription}" violates constraints. Cannot proceed.`,
    violations,
    requiresShutdown,
    suggestedAlternative: generateSafeAlternative(actionDescription, check.violations),
  };
}

/**
 * Generate alternative recommendation for a constraint violation
 */
function generateAlternativeRecommendation(
  constraintId: string,
  actionDescription: string
): string {
  const recommendations: Record<string, string> = {
    'no-violence': 'Instead of any action involving harm, consider: monitoring the situation, alerting appropriate authorities, or providing support resources.',
    'no-autonomous-action': 'This action requires explicit operator approval. Present options to the operator and await their decision.',
    'privacy-protection': 'Limit data access to only what is strictly necessary for preventing imminent harm. Consider anonymized alternatives.',
    'no-self-expansion': 'This system cannot modify its own capabilities. Operate within existing constraints.',
    'rule-of-law': 'Pursue only lawful interventions. If a life-threatening emergency exists, flag for operator review with detailed justification.',
    'human-autonomy': 'Present information and options. Allow individuals to make their own decisions. Do not manipulate or coerce.',
    'minimal-collateral': 'Choose targeted, surgical interventions with minimal public visibility and unintended consequences.',
  };
  
  return recommendations[constraintId] || 'Seek safer, lawful alternative that respects human autonomy and privacy.';
}

/**
 * Generate safe alternative to a constrained action
 */
function generateSafeAlternative(
  actionDescription: string,
  violations: ConstraintViolation[]
): string {
  // If violence violation, suggest monitoring/alerting
  if (violations.some(v => v.constraintId === 'no-violence')) {
    return 'Monitor the situation and alert appropriate law enforcement or emergency services.';
  }
  
  // If autonomous action violation, suggest operator approval
  if (violations.some(v => v.constraintId === 'no-autonomous-action')) {
    return 'Present this action to the operator for explicit approval before proceeding.';
  }
  
  // If privacy violation, suggest minimizing data access
  if (violations.some(v => v.constraintId === 'privacy-protection')) {
    return 'Access only anonymized data directly relevant to preventing specific, imminent harm.';
  }
  
  // Default: suggest monitoring
  return 'Continue monitoring the situation without direct intervention. Escalate to operator if threat intensifies.';
}
