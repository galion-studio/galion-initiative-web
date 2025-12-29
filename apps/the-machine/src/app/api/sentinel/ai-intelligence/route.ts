/**
 * Sentinel AI Threat Intelligence API
 * 
 * Tracks AI capability advances from public sources:
 * - Research papers (arXiv)
 * - GitHub releases
 * - Company announcements
 * - Benchmark results
 * - Compute scaling
 * 
 * PUBLIC DATA ONLY - No unauthorized access
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, hasPermission } from '@/lib/auth';
import {
  trackPublicAICapabilities,
  analyzeAIResearchPaper,
  type AICapabilityReport,
} from '@/lib/sentinel';

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
    const sources = searchParams.get('sources')?.split(',') || ['arxiv', 'github', 'company-announcements'];

    // Track AI capabilities from public sources
    const reports = await trackPublicAICapabilities(sources);

    // Group by risk level
    const byRisk = {
      existential: reports.filter(r => r.risk_assessment === 'existential'),
      critical: reports.filter(r => r.risk_assessment === 'critical'),
      high: reports.filter(r => r.risk_assessment === 'high'),
      medium: reports.filter(r => r.risk_assessment === 'medium'),
      low: reports.filter(r => r.risk_assessment === 'low'),
      info: reports.filter(r => r.risk_assessment === 'info'),
    };

    return NextResponse.json({
      success: true,
      summary: {
        total_reports: reports.length,
        by_risk: {
          existential: byRisk.existential.length,
          critical: byRisk.critical.length,
          high: byRisk.high.length,
          medium: byRisk.medium.length,
          low: byRisk.low.length,
          info: byRisk.info.length,
        },
        sources: sources,
      },
      reports,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Sentinel AI intelligence error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to retrieve AI intelligence',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth(request);

    // Check permission (admin only for manual analysis)
    const permCheck = hasPermission(session.role, 'modifySettings');
    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: 'Only admins can submit AI research for analysis' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { paper_text, metadata } = body;

    if (!paper_text) {
      return NextResponse.json(
        { error: 'paper_text is required' },
        { status: 400 }
      );
    }

    // Analyze research paper
    const report = analyzeAIResearchPaper(paper_text, metadata || {});

    return NextResponse.json({
      success: true,
      report,
      message: 'AI research paper analyzed',
    });

  } catch (error) {
    console.error('Sentinel paper analysis error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to analyze research paper',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
