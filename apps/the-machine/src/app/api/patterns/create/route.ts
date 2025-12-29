/**
 * Create Pattern API Route
 *
 * Allows operators to create custom threat patterns
 * Requires admin permission
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, hasPermission } from '@/lib/auth';
import { createDatabaseClient } from '@/lib/db-client';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth(request);

    // Check permission (only admins can create patterns)
    const permCheck = hasPermission(session.role, 'modifySettings');
    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: 'Only admins can create threat patterns' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      pattern_name,
      pattern_description,
      harm_type,
      typical_timeframe,
      typical_severity,
      indicators,
      keywords,
    } = body;

    // Validate inputs
    if (!pattern_name || typeof pattern_name !== 'string') {
      return NextResponse.json(
        { error: 'Pattern name is required' },
        { status: 400 }
      );
    }

    if (!pattern_description || typeof pattern_description !== 'string') {
      return NextResponse.json(
        { error: 'Pattern description is required' },
        { status: 400 }
      );
    }

    if (!indicators || !Array.isArray(indicators) || indicators.length === 0) {
      return NextResponse.json(
        { error: 'At least one indicator is required' },
        { status: 400 }
      );
    }

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: 'At least one keyword is required' },
        { status: 400 }
      );
    }

    // Get database client
    const client = createDatabaseClient();

    // Create pattern ID
    const pattern_id = `pattern-custom-${Date.now()}`;

    // Create pattern using the database client
    await client.createThreatPattern({
      id: pattern_id,
      pattern_name,
      pattern_description,
      harm_type: harm_type || 'unknown',
      typical_timeframe: typical_timeframe || 'unknown',
      typical_severity: typical_severity || 'medium',
      indicators,
      keywords,
      created_by: session.operatorId,
    });

    // Log pattern creation
    await client.createAuditLog({
      id: `pattern-create-${Date.now()}`,
      category: 'operator-action',
      severity: 'info',
      action: 'Created threat pattern',
      justification: `Operator ${session.operatorName} created new threat pattern: ${pattern_name}`,
      operatorId: session.operatorId,
      metadata: {
        pattern_id,
        pattern_name,
        harm_type,
      },
      containsPersonalData: false,
    });

    return NextResponse.json({
      success: true,
      pattern: {
        id: pattern_id,
        pattern_name,
        pattern_description,
        harm_type,
        typical_timeframe,
        typical_severity,
        indicators,
        keywords,
        created_by: session.operatorId,
        is_active: true,
      },
      message: 'Threat pattern created successfully',
    });

  } catch (error) {
    console.error('Create pattern error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create pattern',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
