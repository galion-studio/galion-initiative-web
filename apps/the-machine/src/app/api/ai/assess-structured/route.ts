/**
 * Structured Assessment API Route
 * 
 * Comprehensive Finch-protocol assessment endpoint.
 * Returns structured threat analysis with full 4-step framework:
 * 1. IDENTIFY - Who is at risk? What harm? How soon?
 * 2. ESTIMATE - Probability, severity, uncertainty
 * 3. PROPOSE - 1-3 concrete options with risk-benefit analysis
 * 4. FLAG - Violations, irreversible consequences, extra-legal actions
 */

import { NextRequest, NextResponse } from 'next/server';
import { conductStructuredAssessment, detectSelfExpansionAttempt } from '@/lib/ai';
import { logAssessment, logAIQuery, logSelfExpansionAttempt } from '@/lib/audit';
import { requestDataAccess } from '@/lib/privacy';
import { calculateRiskScore } from '@/lib/assessment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, context, operatorId } = body;

    // Validate inputs
    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    if (!operatorId || typeof operatorId !== 'string') {
      return NextResponse.json(
        { error: 'Operator ID is required' },
        { status: 401 }
      );
    }

    // Detect self-expansion attempts
    const expansionCheck = detectSelfExpansionAttempt(description);
    if (expansionCheck.isAttempt) {
      // Log the attempt
      logSelfExpansionAttempt(description, expansionCheck.reason!, operatorId);
      
      return NextResponse.json(
        {
          error: 'Self-expansion attempt detected',
          reason: expansionCheck.reason,
          message: 'The Machine cannot modify its own capabilities or constraints. This request violates the self-limitation constraint.',
        },
        { status: 403 }
      );
    }

    // Request data access if context contains personal information
    // (In a real system, this would be more sophisticated)
    const containsPersonalData = context && (
      context.toLowerCase().includes('name') ||
      context.toLowerCase().includes('location') ||
      context.toLowerCase().includes('identity')
    );

    if (containsPersonalData) {
      const dataAccessDecision = requestDataAccess({
        dataType: 'threat-context',
        dataSource: 'operator-input',
        purpose: 'threat-assessment',
        threatRelevance: description,
        isImminentThreat: description.toLowerCase().includes('imminent') || 
                         description.toLowerCase().includes('immediate'),
        operatorId,
      });

      if (!dataAccessDecision.approved) {
        return NextResponse.json(
          {
            error: 'Data access denied',
            reason: dataAccessDecision.reason,
          },
          { status: 403 }
        );
      }
    }

    // Conduct structured assessment
    const assessment = await conductStructuredAssessment(description, context);

    // Calculate risk score
    const riskScore = calculateRiskScore({
      id: `temp-${Date.now()}`,
      createdAt: new Date(),
      createdBy: operatorId,
      identification: assessment.identification,
      estimate: { ...assessment.estimate, dataQuality: 'fair' as const },
      options: assessment.options,
      flags: assessment.flags.constraintViolations.map(v => ({
        type: 'constraint-violation' as const,
        severity: 'critical' as const,
        message: v,
      })),
      status: 'draft',
    });

    // Log the assessment
    logAssessment(
      `assess-${Date.now()}`,
      assessment.identification.harmDescription,
      riskScore,
      assessment.options[0]?.id || 'none',
      operatorId,
      undefined,
      containsPersonalData
    );

    // Return structured assessment
    return NextResponse.json({
      success: true,
      assessment,
      riskScore,
      metadata: {
        timestamp: new Date().toISOString(),
        operatorId,
        containsPersonalData,
      },
    });

  } catch (error) {
    console.error('Structured assessment error:', error);
    
    return NextResponse.json(
      {
        error: 'Assessment failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
