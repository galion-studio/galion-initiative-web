/**
 * Pattern Analysis API Route
 *
 * Analyzes a threat description for pattern matches
 * Returns matching patterns with confidence scores
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, hasPermission } from '@/lib/auth';
import { createDatabaseClient } from '@/lib/db-client';
import { matchPatterns, BUILT_IN_PATTERNS, type ThreatPattern } from '@/lib/pattern-recognition';
import type { ThreatIdentification } from '@/lib/assessment';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth(request);

    // Check permission
    const permCheck = hasPermission(session.role, 'createAssessment');
    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: permCheck.reason },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { identification } = body;

    // Validate input
    if (!identification || typeof identification !== 'object') {
      return NextResponse.json(
        { error: 'Threat identification data is required' },
        { status: 400 }
      );
    }

    // Get database client
    const client = createDatabaseClient();

    // Get patterns (for now, use built-in patterns)
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
    const matches = matchPatterns(identification as ThreatIdentification, patterns);

    // Log pattern analysis
    await client.createAuditLog({
      id: `pattern-analysis-${Date.now()}`,
      category: 'ai-query',
      severity: 'info',
      action: 'Pattern analysis performed',
      justification: `Analyzing threat for pattern matches: ${identification.harmDescription}`,
      operatorId: session.operatorId,
      metadata: {
        harm_type: identification.harmType,
        matches_found: matches.length,
        highest_confidence: matches[0]?.confidence || 0,
      },
      containsPersonalData: false,
    });

    return NextResponse.json({
      success: true,
      matches,
      summary: {
        total_patterns_checked: patterns.length,
        patterns_matched: matches.length,
        highest_confidence: matches[0]?.confidence || 0,
        highest_match: matches[0]?.pattern_name || 'None',
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Pattern analysis error:', error);

    return NextResponse.json(
      {
        error: 'Pattern analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
