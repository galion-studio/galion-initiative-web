/**
 * Audit Log Export API Route
 * 
 * Allows operators to export audit logs for external review.
 * Supports date range filtering.
 */

import { NextRequest, NextResponse } from 'next/server';
import { exportAuditLogs, logOperatorAction } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const operatorId = searchParams.get('operatorId');
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');

    // Validate operator ID
    if (!operatorId) {
      return NextResponse.json(
        { error: 'Operator ID is required' },
        { status: 401 }
      );
    }

    // Parse dates
    const startDate = startDateStr ? new Date(startDateStr) : undefined;
    const endDate = endDateStr ? new Date(endDateStr) : undefined;

    // Export logs
    const logsJson = exportAuditLogs(startDate, endDate);
    
    // Log the export action
    logOperatorAction(
      'Exported audit logs',
      operatorId,
      `Operator requested audit log export${startDate ? ` from ${startDate.toISOString()}` : ''}${endDate ? ` to ${endDate.toISOString()}` : ''}`,
      {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        exportedAt: new Date().toISOString(),
      }
    );

    // Return as downloadable JSON file
    return new NextResponse(logsJson, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString()}.json"`,
      },
    });

  } catch (error) {
    console.error('Audit export error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to export audit logs',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
