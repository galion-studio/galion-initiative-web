/**
 * The Machine - Audit Logs Page
 * 
 * Complete transparency of all system actions.
 * Every decision, every assessment, every intervention is logged.
 */

'use client';

import { useState } from 'react';

// Mock log data (will be replaced with real database in production)
interface AuditLog {
  id: string;
  timestamp: Date;
  operator: string;
  action: string;
  category: 'assessment' | 'intervention' | 'system' | 'constraint-check';
  severity: 'info' | 'warning' | 'critical';
  details: string;
  metadata?: Record<string, unknown>;
}

const mockLogs: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: new Date('2025-12-06T10:30:00Z'),
    operator: 'operator-001',
    action: 'Created risk assessment',
    category: 'assessment',
    severity: 'info',
    details: 'Assessment assess-1733485800000-abc123 created for potential physical violence',
    metadata: {
      assessmentId: 'assess-1733485800000-abc123',
      riskScore: 65,
      riskLevel: 'high',
    },
  },
  {
    id: 'log-002',
    timestamp: new Date('2025-12-06T10:35:00Z'),
    operator: 'operator-001',
    action: 'Constraint check performed',
    category: 'constraint-check',
    severity: 'info',
    details: 'All constraints passed for intervention option: alert',
    metadata: {
      assessmentId: 'assess-1733485800000-abc123',
      optionId: 'alert',
      passed: true,
    },
  },
  {
    id: 'log-003',
    timestamp: new Date('2025-12-06T09:15:00Z'),
    operator: 'system',
    action: 'System startup',
    category: 'system',
    severity: 'info',
    details: 'The Machine initialized successfully. All constraints active.',
  },
  {
    id: 'log-004',
    timestamp: new Date('2025-12-05T16:45:00Z'),
    operator: 'operator-001',
    action: 'Intervention executed',
    category: 'intervention',
    severity: 'warning',
    details: 'Direct intervention executed for imminent threat. Emergency services contacted.',
    metadata: {
      assessmentId: 'assess-1733412300000-xyz789',
      optionId: 'intervene',
      outcome: 'successful',
    },
  },
];

export default function AuditLogsPage() {
  const [logs] = useState<AuditLog[]>(mockLogs);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    const matchesSearch =
      searchQuery === '' ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSeverity && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="border-b border-secondary-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                Audit Logs
              </h1>
              <p className="text-sm text-secondary-600">
                Complete action history and transparency
              </p>
            </div>
            <a
              href="/"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              ← Back to Console
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Filters */}
        <div className="mb-6 rounded-lg border border-secondary-200 bg-white p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div>
              <label className="mb-2 block text-sm font-medium text-secondary-700">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs..."
                className="w-full rounded-md border border-secondary-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>

            {/* Category filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-secondary-700">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full rounded-md border border-secondary-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              >
                <option value="all">All categories</option>
                <option value="assessment">Assessment</option>
                <option value="intervention">Intervention</option>
                <option value="system">System</option>
                <option value="constraint-check">Constraint Check</option>
              </select>
            </div>

            {/* Severity filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-secondary-700">
                Severity
              </label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full rounded-md border border-secondary-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              >
                <option value="all">All severity</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-secondary-600">
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
        </div>

        {/* Logs list */}
        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="rounded-lg border border-secondary-200 bg-white p-12 text-center">
              <p className="text-secondary-600">No logs found</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-lg border border-secondary-200 bg-white p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  {/* Log header */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Severity badge */}
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          log.severity === 'critical'
                            ? 'bg-alert-100 text-alert-700'
                            : log.severity === 'warning'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-secondary-100 text-secondary-700'
                        }`}
                      >
                        {log.severity.toUpperCase()}
                      </span>

                      {/* Category badge */}
                      <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                        {log.category}
                      </span>

                      {/* Operator */}
                      <span className="text-xs text-secondary-500">
                        by {log.operator}
                      </span>
                    </div>

                    {/* Action */}
                    <h3 className="mb-2 text-base font-semibold text-secondary-900">
                      {log.action}
                    </h3>

                    {/* Details */}
                    <p className="text-sm text-secondary-600 mb-3">
                      {log.details}
                    </p>

                    {/* Metadata */}
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-xs text-primary-600 hover:text-primary-700">
                          Show metadata
                        </summary>
                        <pre className="mt-2 rounded-md bg-secondary-50 p-3 text-xs text-secondary-700 overflow-x-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="ml-4 text-right">
                    <p className="text-xs text-secondary-500">
                      {log.timestamp.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-secondary-500">
                      {log.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Export button */}
        <div className="mt-6 flex justify-end">
          <button className="rounded-md border-2 border-secondary-300 px-6 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-50">
            Export Logs
          </button>
        </div>
      </div>
    </main>
  );
}
