/**
 * List Patterns API Route
 *
 * Returns all available threat patterns
 * Includes built-in and custom patterns
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, hasPermission } from '@/lib/auth';
import { createDatabaseClient } from '@/lib/db-client';
import { BUILT_IN_PATTERNS, type ThreatPattern } from '@/lib/pattern-recognition';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth(request);

    // Check permission (view patterns requires assessment permission)
    const permCheck = hasPermission(session.role, 'viewAssessments');
    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: permCheck.reason },
        { status: 403 }
      );
    }

    // Get database client
    const client = createDatabaseClient();

    // Get patterns from database
    const dbPatterns = await client.listThreatPatterns(true);

    // Merge with built-in patterns (if not in DB)
    const builtInPatterns: ThreatPattern[] = BUILT_IN_PATTERNS.map((p, i) => ({
      ...p,
      id: `pattern-builtin-${i + 1}`,
      created_at: Date.now(),
      times_detected: 0,
      times_confirmed: 0,
      false_positive_rate: 0,
      created_by: 'system',
      is_active: true,
    }));

    const allPatterns = [...dbPatterns, ...builtInPatterns];

    return NextResponse.json({
      success: true,
      patterns: allPatterns,
      statistics: {
        total_patterns: allPatterns.length,
        built_in_patterns: builtInPatterns.length,
        custom_patterns: dbPatterns.length,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('List patterns error:', error);

    return NextResponse.json(
      {
        error: 'Failed to list patterns',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
