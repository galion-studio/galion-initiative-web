/**
 * THE MACHINE v2.0 - Pattern Recognition Engine
 * 
 * Identifies recurring threat patterns from historical assessments
 * Enables learning from past cases to improve future threat detection
 * 
 * Finch Protocol Compliance:
 * - No autonomous action (patterns only suggest, operators decide)
 * - Complete audit trail (all pattern matches logged)
 * - Privacy-by-design (patterns use anonymized data)
 * - Transparent reasoning (pattern matches explained)
 */

import type { ThreatIdentification, RiskAssessment } from './assessment';
import type { MachineDB } from './db-client';

// =============================================================================
// TYPES
// =============================================================================

export interface ThreatPattern {
  id: string;
  created_at: number;
  pattern_name: string;
  pattern_description: string;
  
  // Pattern characteristics
  harm_type: string;
  typical_timeframe: string;
  typical_severity: string;
  
  // Indicators
  indicators: string[];       // Warning signs that match this pattern
  keywords: string[];         // Keywords that suggest this pattern
  
  // Statistics
  times_detected: number;
  times_confirmed: number;
  false_positive_rate: number;
  
  // Metadata
  created_by: string;
  is_active: boolean;
}

export interface PatternMatch {
  pattern_id: string;
  pattern_name: string;
  confidence: number;        // 0.0 to 1.0
  matched_indicators: string[];
  matched_keywords: string[];
  reasoning: string;
}

export interface PatternAnalysis {
  assessment_id: string;
  matches: PatternMatch[];
  highest_confidence_match?: PatternMatch;
  recommendation: string;
  timestamp: number;
}

export interface HistoricalInsight {
  pattern_id: string;
  pattern_name: string;
  total_occurrences: number;
  successful_interventions: number;
  average_risk_score: number;
  most_effective_intervention: string;
  trends: {
    increasing: boolean;
    recent_count_last_30_days: number;
    recent_count_last_90_days: number;
  };
}

// =============================================================================
// BUILT-IN THREAT PATTERNS
// =============================================================================

/**
 * Pre-defined threat patterns based on common scenarios
 * These serve as a starting point for pattern recognition
 */
export const BUILT_IN_PATTERNS: Omit<ThreatPattern, 'id' | 'created_at' | 'times_detected' | 'times_confirmed' | 'false_positive_rate' | 'created_by' | 'is_active'>[] = [
  {
    pattern_name: 'Self-Harm Risk Escalation',
    pattern_description: 'Pattern of increasing self-harm ideation with concerning behavioral changes',
    harm_type: 'self-harm',
    typical_timeframe: 'near-term',
    typical_severity: 'severe',
    indicators: [
      'Expressions of hopelessness',
      'Giving away possessions',
      'Withdrawing from social contact',
      'Sudden mood improvement after prolonged depression',
      'Making final arrangements',
      'Previous suicide attempts',
    ],
    keywords: [
      'no reason to live',
      'better off without me',
      'can\'t go on',
      'end it all',
      'goodbye',
      'suicide',
      'kill myself',
      'want to die',
    ],
  },
  {
    pattern_name: 'Domestic Violence Escalation',
    pattern_description: 'Pattern of escalating domestic violence with increasing frequency and severity',
    harm_type: 'physical-violence',
    typical_timeframe: 'imminent',
    typical_severity: 'critical',
    indicators: [
      'Increasing frequency of violent incidents',
      'Escalating severity of injuries',
      'Access to weapons',
      'Threats to kill',
      'Forced isolation from support network',
      'Stalking or obsessive behavior',
    ],
    keywords: [
      'going to kill',
      'hurt',
      'hit',
      'beaten',
      'afraid',
      'threatening',
      'weapon',
      'can\'t escape',
    ],
  },
  {
    pattern_name: 'Child Neglect Pattern',
    pattern_description: 'Ongoing pattern of child neglect with inadequate supervision or care',
    harm_type: 'neglect',
    typical_timeframe: 'medium-term',
    typical_severity: 'serious',
    indicators: [
      'Unsupervised children',
      'Inadequate food or shelter',
      'Missing school frequently',
      'Untreated medical conditions',
      'Poor hygiene',
      'Leaving children alone for extended periods',
    ],
    keywords: [
      'left alone',
      'no food',
      'dirty',
      'not going to school',
      'no supervision',
      'neglected',
      'abandoned',
    ],
  },
  {
    pattern_name: 'Elder Abuse Pattern',
    pattern_description: 'Pattern of elder abuse including physical, emotional, or financial exploitation',
    harm_type: 'exploitation',
    typical_timeframe: 'medium-term',
    typical_severity: 'serious',
    indicators: [
      'Unexplained injuries',
      'Sudden financial changes',
      'Isolation from family/friends',
      'Poor living conditions',
      'Caregiver preventing contact',
      'Signs of overmedication',
    ],
    keywords: [
      'taking money',
      'won\'t let me',
      'locked in',
      'scared of',
      'controlling',
      'stealing',
      'abusing',
    ],
  },
  {
    pattern_name: 'School Violence Threat',
    pattern_description: 'Pattern indicating potential school violence or mass casualty event',
    harm_type: 'physical-violence',
    typical_timeframe: 'near-term',
    typical_severity: 'critical',
    indicators: [
      'Specific threats against school',
      'Fascination with past school shootings',
      'Access to weapons',
      'Social isolation and bullying',
      'Concerning social media posts',
      'Detailed plans or manifestos',
    ],
    keywords: [
      'shoot up',
      'going to show them',
      'bring a gun',
      'make them pay',
      'last day',
      'won\'t forget',
    ],
  },
  {
    pattern_name: 'Human Trafficking Indicators',
    pattern_description: 'Pattern of indicators suggesting human trafficking or exploitation',
    harm_type: 'exploitation',
    typical_timeframe: 'medium-term',
    typical_severity: 'severe',
    indicators: [
      'Not in control of own identification',
      'Not free to come and go',
      'Owes large debt to employer',
      'Works excessive hours',
      'Lives at workplace',
      'Shows signs of physical abuse',
    ],
    keywords: [
      'can\'t leave',
      'passport taken',
      'forced to',
      'owe money',
      'trapped',
      'sold',
      'trafficked',
    ],
  },
];

// =============================================================================
// PATTERN MATCHING ENGINE
// =============================================================================

/**
 * Match a threat assessment against known patterns
 * 
 * Returns confidence scores for each pattern that matches
 */
export function matchPatterns(
  identification: ThreatIdentification,
  availablePatterns: ThreatPattern[]
): PatternMatch[] {
  const matches: PatternMatch[] = [];
  
  // Convert description to lowercase for case-insensitive matching
  const description = identification.harmDescription.toLowerCase();
  const perpetrator = (identification.perpetrator || '').toLowerCase();
  const location = (identification.location || '').toLowerCase();
  const fullContext = `${description} ${perpetrator} ${location}`;

  for (const pattern of availablePatterns) {
    // Skip inactive patterns
    if (!pattern.is_active) continue;

    // Check if harm type matches (or is compatible)
    if (pattern.harm_type !== identification.harmType && 
        pattern.harm_type !== 'other') {
      continue;
    }

    const matchedKeywords: string[] = [];
    const matchedIndicators: string[] = [];
    let totalScore = 0;

    // Check keyword matches (each keyword worth 10 points)
    for (const keyword of pattern.keywords) {
      if (fullContext.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword);
        totalScore += 10;
      }
    }

    // Check indicator matches (each indicator worth 15 points)
    for (const indicator of pattern.indicators) {
      // Check if indicator words appear in description
      const indicatorWords = indicator.toLowerCase().split(' ');
      const matchesIndicator = indicatorWords.some(word => 
        word.length > 4 && fullContext.includes(word)
      );
      
      if (matchesIndicator) {
        matchedIndicators.push(indicator);
        totalScore += 15;
      }
    }

    // Calculate confidence (0.0 to 1.0)
    // Max possible score: (keywords * 10) + (indicators * 15)
    const maxPossibleScore = (pattern.keywords.length * 10) + (pattern.indicators.length * 15);
    const confidence = maxPossibleScore > 0 ? Math.min(totalScore / maxPossibleScore, 1.0) : 0;

    // Only include if confidence > 0.2 (20%)
    if (confidence > 0.2) {
      matches.push({
        pattern_id: pattern.id,
        pattern_name: pattern.pattern_name,
        confidence,
        matched_keywords: matchedKeywords,
        matched_indicators: matchedIndicators,
        reasoning: generateMatchReasoning(
          pattern,
          confidence,
          matchedKeywords,
          matchedIndicators
        ),
      });
    }
  }

  // Sort by confidence (highest first)
  return matches.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Generate human-readable reasoning for pattern match
 */
function generateMatchReasoning(
  pattern: ThreatPattern,
  confidence: number,
  matchedKeywords: string[],
  matchedIndicators: string[]
): string {
  const parts: string[] = [];
  
  const confidencePercent = Math.round(confidence * 100);
  parts.push(`${confidencePercent}% confidence match for "${pattern.pattern_name}"`);

  if (matchedKeywords.length > 0) {
    parts.push(`Matched ${matchedKeywords.length} keywords: ${matchedKeywords.slice(0, 3).join(', ')}${matchedKeywords.length > 3 ? '...' : ''}`);
  }

  if (matchedIndicators.length > 0) {
    parts.push(`Matched ${matchedIndicators.length} indicators: ${matchedIndicators.slice(0, 2).join(', ')}${matchedIndicators.length > 2 ? '...' : ''}`);
  }

  parts.push(`Typical severity: ${pattern.typical_severity}`);
  parts.push(`Typical timeframe: ${pattern.typical_timeframe}`);

  return parts.join('. ');
}

/**
 * Analyze an assessment for pattern matches
 */
export async function analyzeAssessmentPatterns(
  assessment: RiskAssessment,
  db: MachineDB
): Promise<PatternAnalysis> {
  // Get active patterns from database
  // For now, use built-in patterns
  // In production, this would query the database
  const patterns: ThreatPattern[] = BUILT_IN_PATTERNS.map((p, i) => ({
    ...p,
    id: `pattern-${i + 1}`,
    created_at: Date.now(),
    times_detected: 0,
    times_confirmed: 0,
    false_positive_rate: 0,
    created_by: 'system',
    is_active: true,
  }));

  // Match patterns
  const matches = matchPatterns(assessment.identification, patterns);

  // Generate recommendation
  const recommendation = generateRecommendationFromPatterns(matches, assessment);

  return {
    assessment_id: assessment.id,
    matches,
    highest_confidence_match: matches[0],
    recommendation,
    timestamp: Date.now(),
  };
}

/**
 * Generate recommendation based on pattern matches
 */
function generateRecommendationFromPatterns(
  matches: PatternMatch[],
  assessment: RiskAssessment
): string {
  if (matches.length === 0) {
    return 'No known patterns matched. Proceed with standard risk assessment protocol.';
  }

  const topMatch = matches[0];
  const confidencePercent = Math.round(topMatch.confidence * 100);

  const parts: string[] = [];
  
  parts.push(`Strong pattern match: "${topMatch.pattern_name}" (${confidencePercent}% confidence)`);

  if (topMatch.confidence >= 0.7) {
    parts.push('HIGH CONFIDENCE - This threat closely matches a known dangerous pattern.');
    parts.push('Recommend immediate operator review and consideration of alert/intervention options.');
  } else if (topMatch.confidence >= 0.5) {
    parts.push('MODERATE CONFIDENCE - Threat shows similarities to known pattern.');
    parts.push('Recommend careful assessment and monitoring.');
  } else {
    parts.push('LOW-MODERATE CONFIDENCE - Some pattern similarities detected.');
    parts.push('Use pattern insights to inform assessment but rely primarily on current threat details.');
  }

  return parts.join(' ');
}

/**
 * Get historical insights for a specific pattern
 */
export async function getPatternInsights(
  patternId: string,
  db: MachineDB
): Promise<HistoricalInsight | null> {
  // Get pattern statistics from database
  const stats = await db.getPatternStatistics(patternId);
  
  if (!stats) return null;

  // Get pattern details
  const pattern = await db.getThreatPattern(patternId);
  
  if (!pattern) return null;

  // Calculate trends
  const isIncreasing = stats.recent_detections_30d > (stats.recent_detections_90d / 3);

  return {
    pattern_id: patternId,
    pattern_name: pattern.pattern_name,
    total_occurrences: stats.times_detected,
    successful_interventions: stats.times_confirmed,
    average_risk_score: 0, // Would calculate from assessments
    most_effective_intervention: 'alert', // Would calculate from assessments
    trends: {
      increasing: isIncreasing,
      recent_count_last_30_days: stats.recent_detections_30d,
      recent_count_last_90_days: stats.recent_detections_90d,
    },
  };
}

/**
 * Update pattern statistics after assessment confirmation
 */
export async function updatePatternStatistics(
  patternId: string,
  wasConfirmed: boolean,
  db: MachineDB
): Promise<void> {
  // Update pattern statistics in database
  await db.updatePatternStatistics(patternId, true, wasConfirmed);
}

/**
 * Create a new threat pattern from an assessment
 */
export async function createPatternFromAssessment(
  assessment: RiskAssessment,
  patternName: string,
  patternDescription: string,
  operatorId: string,
  db: MachineDB
): Promise<string> {
  // Extract indicators and keywords from assessment
  const keywords = extractKeywordsFromDescription(
    assessment.identification.harmDescription
  );

  const patternId = `pattern-custom-${Date.now()}`;

  // Insert into database
  await db.createThreatPattern({
    id: patternId,
    pattern_name: patternName,
    pattern_description: patternDescription,
    harm_type: assessment.identification.harmType,
    typical_timeframe: assessment.identification.timeFrame,
    typical_severity: assessment.estimate.severity,
    indicators: [], // Operator would add these
    keywords,
    created_by: operatorId,
  });

  return patternId;
}

/**
 * Extract potential keywords from threat description
 */
function extractKeywordsFromDescription(description: string): string[] {
  // Simple keyword extraction (in production, use NLP)
  const words = description.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 4); // Only words longer than 4 chars

  // Remove common words
  const stopWords = ['about', 'after', 'before', 'being', 'could', 'would', 'should', 'their', 'there', 'these', 'those', 'which', 'while'];
  const keywords = words.filter(word => !stopWords.includes(word));

  // Return unique keywords (max 10)
  return [...new Set(keywords)].slice(0, 10);
}
