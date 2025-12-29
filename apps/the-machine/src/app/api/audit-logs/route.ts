/**
 * The Machine - Audit Logs API
 *
 * GET  /api/audit-logs - List all audit logs
 * POST /api/audit-logs - Create new audit log
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAuditLog, listAuditLogs } from '@/lib/db';

// GET /api/audit-logs - List logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    const category = searchParams.get('category') || undefined;
    const severity = searchParams.get('severity') || undefined;
    const operator = searchParams.get('operator') || undefined;
    const search = searchParams.get('search') || undefined;

    // Fetch from database
    const logs = await listAuditLogs({
      limit,
      offset,
      category,
      severity,
      operator,
      search,
    });

    return NextResponse.json({
      success: true,
      data: logs,
      count: logs.length,
    });
  } catch (error) {
    console.error('Error listing audit logs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to list audit logs',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/audit-logs - Create new log
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    if (!body.operator || !body.action || !body.category || !body.severity || !body.details) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create log
    const logId = await createAuditLog({
      operator: body.operator,
      action: body.action,
      category: body.category,
      severity: body.severity,
      details: body.details,
      metadata: body.metadata,
      assessment_id: body.assessmentId,
      constraint_check_passed: body.constraintCheckPassed,
      constraint_violations: body.constraintViolations,
    });

    return NextResponse.json({
      success: true,
      data: { id: logId },
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create audit log',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
