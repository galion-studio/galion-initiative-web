/**
 * The Machine - Assessments API
 * 
 * GET  /api/assessments - List all assessments
 * POST /api/assessments - Create new assessment
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseForRequest } from '@/lib/db-local';
import { createAssessment, type RiskAssessment, type ThreatIdentification } from '@/lib/assessment';
import { calculateRiskScore } from '@/lib/assessment';

// GET /api/assessments - List assessments
export async function GET(request: NextRequest) {
  try {
    const db = getDatabaseForRequest();
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const createdBy = searchParams.get('createdBy') || undefined;

    // Fetch from database
    const assessments = await db.listAssessments(createdBy, limit);

    return NextResponse.json({
      success: true,
      data: assessments,
      count: assessments.length,
    });
  } catch (error) {
    console.error('Error listing assessments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to list assessments',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/assessments - Create new assessment
export async function POST(request: NextRequest) {
  try {
    const db = getDatabaseForRequest();
    const body = await request.json();

    // Validate request body
    if (!body.identification) {
      return NextResponse.json(
        { success: false, error: 'Missing identification data' },
        { status: 400 }
      );
    }

    if (!body.operatorId) {
      return NextResponse.json(
        { success: false, error: 'Missing operator ID' },
        { status: 400 }
      );
    }

    // Create assessment using assessment logic
    const identification: ThreatIdentification = body.identification;
    const assessment = createAssessment(identification, body.operatorId);

    // Calculate risk score
    const riskScore = calculateRiskScore(assessment);

    // Save to database
    await db.createAssessment(assessment, riskScore);

    // Log to audit trail
    await db.createAuditLog({
      id: `audit-${Date.now()}`,
      category: 'assessment',
      severity: 'info',
      action: 'Assessment created',
      justification: 'Operator created new risk assessment',
      operatorId: body.operatorId,
      containsPersonalData: identification.whoAtRisk.some(p => p.length > 0),
      metadata: { assessmentId: assessment.id },
    });

    return NextResponse.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create assessment',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
