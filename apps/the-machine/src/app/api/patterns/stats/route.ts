/**
 * Pattern Statistics API Route
 *
 * Returns statistics and insights for threat patterns
 * Includes historical performance metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, hasPermission } from '@/lib/auth';
import { createDatabaseClient } from '@/lib/db-client';
import { getPatternInsights } from '@/lib/pattern-recognition';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth(request);

    // Check permission
    const permCheck = hasPermission(session.role, 'viewAssessments');
    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: permCheck.reason },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const patternId = searchParams.get('patternId');

    // Get database client
    const client = createDatabaseClient();

    if (patternId) {
      // Get statistics for specific pattern
      const insights = await getPatternInsights(patternId, client);

      if (!insights) {
        return NextResponse.json(
          { error: 'Pattern not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        pattern_id: patternId,
        insights,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Get overall pattern statistics
      const stats = await client.getStatistics();

      return NextResponse.json({
        success: true,
        statistics: {
          total_patterns: stats.totalPatterns,
          recent_pattern_matches_24h: stats.recentPatternMatches,
          total_assessments: stats.totalAssessments,
          critical_assessments: stats.criticalAssessments,
        },
        timestamp: new Date().toISOString(),
      });
    }

  } catch (error) {
    console.error('Pattern statistics error:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve pattern statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
