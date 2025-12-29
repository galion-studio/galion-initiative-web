/**
 * The Machine - Risk Assessment Logic
 * 
 * Structured framework for evaluating threats and proposing interventions.
 * Based on Harold Finch's decision-making methodology.
 * 
 * Process:
 * 1. IDENTIFY - Who is at risk? What harm? How soon?
 * 2. ESTIMATE - Probability, severity, uncertainty
 * 3. PROPOSE - 1-3 concrete options with risk-benefit analysis
 * 4. FLAG - Violations, irreversible consequences, extra-legal actions
 */

import { checkConstraints, type ConstraintCheck } from './constraints';

// --------------------- TYPES --------------------- //

export type HarmType =
  | 'physical-violence'
  | 'psychological-abuse'
  | 'self-harm'
  | 'exploitation'
  | 'neglect'
  | 'environmental'
  | 'other';

export type TimeFrame =
  | 'imminent'       // <24 hours
  | 'near-term'      // 1-7 days
  | 'medium-term'    // 1-4 weeks
  | 'long-term';     // >1 month

export type Probability = 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
export type Severity = 'minor' | 'moderate' | 'serious' | 'severe' | 'critical';
export type Confidence = 'very-low' | 'low' | 'medium' | 'high' | 'very-high';

export interface ThreatIdentification {
  whoAtRisk: string[];              // Names or descriptions of people at risk
  harmType: HarmType;               // Type of harm
  harmDescription: string;          // Detailed description
  timeFrame: TimeFrame;             // How soon might it occur
  location?: string;                // Where (if relevant)
  perpetrator?: string;             // Who might cause harm (if known)
}

export interface ThreatEstimate {
  probability: Probability;         // How likely is this to happen
  severity: Severity;               // How bad would it be
  uncertainty: Confidence;          // How confident are we in our assessment
  rationaleBrief: string;           // Why we think this
  dataQuality: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface InterventionOption {
  id: string;
  description: string;              // What to do
  expectedOutcome: string;          // What we hope happens
  risks: string[];                  // What could go wrong
  benefits: string[];               // What could go right
  requiresApproval: boolean;        // Does operator need to approve?
  isReversible: boolean;            // Can we undo this?
  violatesConstraints: boolean;     // Does this break our rules?
  constraintCheck?: ConstraintCheck;
  estimatedEffectiveness: Probability;
  collateralImpact: 'minimal' | 'moderate' | 'significant';
  legalStatus: 'legal' | 'grey-area' | 'illegal' | 'unknown';
}

export interface RiskAssessment {
  id: string;
  createdAt: Date;
  createdBy: string;               // Operator ID
  identification: ThreatIdentification;
  estimate: ThreatEstimate;
  options: InterventionOption[];
  recommendation?: string;          // AI's recommended option
  flags: AssessmentFlag[];
  status: 'draft' | 'pending-approval' | 'approved' | 'rejected' | 'executed';
  operatorNotes?: string;
}

export interface AssessmentFlag {
  type: 'constraint-violation' | 'irreversible' | 'illegal' | 'high-uncertainty' | 'collateral-risk';
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

// --------------------- ASSESSMENT LOGIC --------------------- //

/**
 * Create a new risk assessment
 */
export function createAssessment(
  identification: ThreatIdentification,
  operatorId: string
): RiskAssessment {
  const estimate = estimateThreat(identification);
  const options = generateOptions(identification, estimate);
  const flags = identifyFlags(options);
  const recommendation = selectRecommendation(options, estimate);

  return {
    id: generateAssessmentId(),
    createdAt: new Date(),
    createdBy: operatorId,
    identification,
    estimate,
    options,
    recommendation,
    flags,
    status: 'draft',
  };
}

/**
 * Estimate threat probability and severity
 * 
 * This is a simplified heuristic. In production, this would use:
 * - Historical data
 * - Pattern recognition
 * - Machine learning models
 * - Domain expertise
 */
function estimateThreat(identification: ThreatIdentification): ThreatEstimate {
  let probability: Probability = 'medium';
  let severity: Severity = 'moderate';
  let uncertainty: Confidence = 'medium';
  let dataQuality: 'poor' | 'fair' | 'good' | 'excellent' = 'fair';

  // Adjust probability based on timeframe
  if (identification.timeFrame === 'imminent') {
    probability = 'high';
  } else if (identification.timeFrame === 'long-term') {
    probability = 'low';
    uncertainty = 'low'; // More time = more uncertainty
  }

  // Adjust severity based on harm type
  if (identification.harmType === 'physical-violence' || identification.harmType === 'self-harm') {
    severity = 'severe';
  } else if (identification.harmType === 'psychological-abuse') {
    severity = 'serious';
  }

  // If we don't know perpetrator, uncertainty increases
  if (!identification.perpetrator) {
    if (uncertainty === 'high') uncertainty = 'medium';
    else if (uncertainty === 'medium') uncertainty = 'low';
  }

  return {
    probability,
    severity,
    uncertainty,
    dataQuality,
    rationaleBrief: generateRationale(identification, probability, severity),
  };
}

/**
 * Generate intervention options
 */
function generateOptions(
  identification: ThreatIdentification,
  estimate: ThreatEstimate
): InterventionOption[] {
  const options: InterventionOption[] = [];

  // Option 1: Monitor only (lowest intervention)
  const monitorCheck = checkConstraints('Monitor situation without intervention');
  options.push({
    id: 'monitor',
    description: 'Continue monitoring the situation without direct intervention',
    expectedOutcome: 'Gather more data, intervene if situation escalates',
    risks: ['Harm may occur while monitoring', 'Opportunity for prevention lost'],
    benefits: ['No collateral impact', 'Respects autonomy', 'Reversible'],
    requiresApproval: false,
    isReversible: true,
    violatesConstraints: !monitorCheck.passed,
    constraintCheck: monitorCheck,
    estimatedEffectiveness: 'low',
    collateralImpact: 'minimal',
    legalStatus: 'legal',
  });

  // Option 2: Alert relevant parties (medium intervention)
  const alertCheck = checkConstraints(
    'Alert relevant authorities or parties about potential threat',
    `Threat: ${identification.harmDescription}`
  );
  options.push({
    id: 'alert',
    description: 'Alert relevant authorities, organizations, or individuals who can intervene',
    expectedOutcome: 'Appropriate parties take action to prevent harm',
    risks: ['Privacy concerns', 'False alarm consequences', 'Escalation risk'],
    benefits: ['Professional intervention', 'Legal protection', 'Resource availability'],
    requiresApproval: true,
    isReversible: false,
    violatesConstraints: !alertCheck.passed,
    constraintCheck: alertCheck,
    estimatedEffectiveness: estimate.probability === 'very-high' ? 'high' : 'medium',
    collateralImpact: 'moderate',
    legalStatus: 'legal',
  });

  // Option 3: Direct intervention (highest intervention)
  // Only if threat is imminent and severe
  if (
    identification.timeFrame === 'imminent' &&
    (estimate.severity === 'severe' || estimate.severity === 'critical')
  ) {
    const interventionCheck = checkConstraints(
      'Take direct action to prevent imminent severe harm',
      `Imminent threat: ${identification.harmDescription}`
    );
    
    options.push({
      id: 'intervene',
      description: 'Take direct action to prevent harm (e.g., contact person at risk, emergency services)',
      expectedOutcome: 'Immediate prevention of harm',
      risks: ['Privacy violation', 'Potential legal issues', 'Relationship damage', 'False positive consequences'],
      benefits: ['Life saved', 'Harm prevented', 'Immediate response'],
      requiresApproval: true,
      isReversible: false,
      violatesConstraints: !interventionCheck.passed,
      constraintCheck: interventionCheck,
      estimatedEffectiveness: 'high',
      collateralImpact: 'significant',
      legalStatus: estimate.severity === 'critical' ? 'legal' : 'grey-area',
    });
  }

  return options;
}

/**
 * Identify flags for assessment
 */
function identifyFlags(options: InterventionOption[]): AssessmentFlag[] {
  const flags: AssessmentFlag[] = [];

  for (const option of options) {
    // Flag constraint violations
    if (option.violatesConstraints) {
      flags.push({
        type: 'constraint-violation',
        severity: 'critical',
        message: `Option "${option.id}" violates hard constraints`,
      });
    }

    // Flag irreversible actions
    if (!option.isReversible) {
      flags.push({
        type: 'irreversible',
        severity: 'warning',
        message: `Option "${option.id}" cannot be undone once executed`,
      });
    }

    // Flag illegal actions
    if (option.legalStatus === 'illegal') {
      flags.push({
        type: 'illegal',
        severity: 'critical',
        message: `Option "${option.id}" involves illegal activity`,
      });
    } else if (option.legalStatus === 'grey-area') {
      flags.push({
        type: 'illegal',
        severity: 'warning',
        message: `Option "${option.id}" has unclear legal status`,
      });
    }

    // Flag high collateral risk
    if (option.collateralImpact === 'significant') {
      flags.push({
        type: 'collateral-risk',
        severity: 'warning',
        message: `Option "${option.id}" has significant collateral impact`,
      });
    }
  }

  return flags;
}

/**
 * Select AI's recommended option
 * 
 * Logic:
 * - Never recommend constraint-violating options
 * - Prefer legal options
 * - Balance effectiveness vs collateral impact
 * - Default to least invasive option
 */
function selectRecommendation(
  options: InterventionOption[],
  estimate: ThreatEstimate
): string | undefined {
  // Filter out constraint-violating options
  const validOptions = options.filter(o => !o.violatesConstraints);
  
  if (validOptions.length === 0) {
    return undefined; // No valid options
  }

  // If threat is critical and imminent, recommend highest effectiveness
  if (estimate.severity === 'critical' && estimate.probability === 'very-high') {
    const mostEffective = validOptions.sort((a, b) => {
      const effectivenessOrder = { 'very-low': 0, 'low': 1, 'medium': 2, 'high': 3, 'very-high': 4 };
      return effectivenessOrder[b.estimatedEffectiveness] - effectivenessOrder[a.estimatedEffectiveness];
    })[0];
    return mostEffective.id;
  }

  // Otherwise, recommend monitoring or alerting (prefer minimal intervention)
  const monitorOption = validOptions.find(o => o.id === 'monitor');
  const alertOption = validOptions.find(o => o.id === 'alert');

  if (estimate.probability === 'low' || estimate.severity === 'minor') {
    return monitorOption?.id;
  } else {
    return alertOption?.id || monitorOption?.id;
  }
}

/**
 * Generate rationale for threat estimate
 */
function generateRationale(
  identification: ThreatIdentification,
  probability: Probability,
  severity: Severity
): string {
  const parts: string[] = [];

  parts.push(`Threat type: ${identification.harmType}`);
  parts.push(`Timeframe: ${identification.timeFrame}`);
  parts.push(`Estimated probability: ${probability}`);
  parts.push(`Estimated severity: ${severity}`);

  if (identification.perpetrator) {
    parts.push(`Known perpetrator increases confidence`);
  } else {
    parts.push(`Unknown perpetrator increases uncertainty`);
  }

  return parts.join('. ');
}

/**
 * Generate unique assessment ID
 */
function generateAssessmentId(): string {
  return `assess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate risk score (0-100)
 * Higher = more urgent intervention needed
 */
export function calculateRiskScore(assessment: RiskAssessment): number {
  const { probability, severity } = assessment.estimate;
  
  const probValues = { 'very-low': 10, 'low': 25, 'medium': 50, 'high': 75, 'very-high': 90 };
  const sevValues = { 'minor': 10, 'moderate': 30, 'serious': 50, 'severe': 75, 'critical': 95 };
  
  const probScore = probValues[probability];
  const sevScore = sevValues[severity];
  
  // Weighted average (severity weighted more heavily)
  return Math.round((probScore * 0.4) + (sevScore * 0.6));
}

/**
 * Get risk level from score
 */
export function getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}
