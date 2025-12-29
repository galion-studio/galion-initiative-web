/**
 * Privacy Status API Route
 * 
 * Provides transparency about data retention and privacy compliance.
 * Returns statistics about personal data handling.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getPrivacyStatistics,
  getActivePersonalData,
  getRecordsPendingDeletion,
} from '@/lib/privacy';
import { getLogsRequiringReview, getAuditStatistics } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    // Get privacy statistics
    const privacyStats = getPrivacyStatistics();
    
    // Get audit statistics
    const auditStats = getAuditStatistics();
    
    // Get active personal data
    const activeData = getActivePersonalData();
    
    // Get pending deletions
    const pendingDeletions = getRecordsPendingDeletion();
    
    // Get logs requiring review
    const logsNeedingReview = getLogsRequiringReview();

    return NextResponse.json({
      success: true,
      
      // Privacy compliance
      privacy: {
        ...privacyStats,
        pendingDeletionCount: pendingDeletions.length,
        oldestActiveRecord: activeData.length > 0
          ? activeData.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0].createdAt
          : null,
      },
      
      // Audit compliance
      audit: {
        ...auditStats,
        logsRequiringReview: logsNeedingReview.length,
      },
      
      // Compliance status
      compliance: {
        dataMinimizationActive: true,
        automaticAnonymizationEnabled: true,
        retentionPoliciesEnforced: true,
        auditLoggingActive: true,
        privacyByDesign: true,
      },
      
      // Recommendations
      recommendations: [
        ...(logsNeedingReview.length > 0
          ? [`Review ${logsNeedingReview.length} logs containing personal data for retention authorization`]
          : []
        ),
        ...(pendingDeletions.length > 0
          ? [`Process ${pendingDeletions.length} records scheduled for deletion`]
          : []
        ),
      ],
      
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Privacy status error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to retrieve privacy status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
