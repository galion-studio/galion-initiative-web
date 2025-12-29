/**
 * The Machine - Settings Page
 * 
 * Configure constraints, alert thresholds, and system parameters.
 * All changes are logged for transparency.
 */

'use client';

import { useState } from 'react';
import { HARD_CONSTRAINTS, getCriticalConstraints } from '@/lib/constraints';

export default function SettingsPage() {
  const [alertThreshold, setAlertThreshold] = useState(60); // Risk score threshold for alerts
  const [autoMonitor, setAutoMonitor] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [logRetentionDays, setLogRetentionDays] = useState(365);

  const criticalConstraints = getCriticalConstraints();

  return (
    <main className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="border-b border-secondary-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                Settings
              </h1>
              <p className="text-sm text-secondary-600">
                Configure constraints and system parameters
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
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Critical Constraints (Read-only) */}
        <div className="mb-8 rounded-lg border-2 border-alert-300 bg-alert-50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-alert-900">
            <span>🔒</span> Hard Constraints (Immutable)
          </h2>
          <p className="mb-6 text-sm text-alert-700">
            These constraints cannot be modified or disabled. They are fundamental to The Machine's operation.
          </p>
          
          <div className="space-y-3">
            {criticalConstraints.map((constraint) => (
              <div
                key={constraint.id}
                className="rounded-lg border border-alert-200 bg-white p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-secondary-900">
                      {constraint.name}
                    </h3>
                    <p className="mt-1 text-sm text-secondary-600">
                      {constraint.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-alert-100 px-3 py-1 text-xs font-medium text-alert-700">
                    CRITICAL
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Settings */}
        <div className="mb-8 rounded-lg border border-secondary-200 bg-white p-6">
          <h2 className="mb-6 text-xl font-semibold text-secondary-900">
            Alert Settings
          </h2>

          <div className="space-y-6">
            {/* Alert threshold */}
            <div>
              <label className="mb-2 block text-sm font-medium text-secondary-700">
                Risk Score Alert Threshold
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-secondary-900 w-16 text-right">
                  {alertThreshold}
                </span>
              </div>
              <p className="mt-2 text-xs text-secondary-500">
                Alert operators when risk score exceeds this threshold
              </p>
            </div>

            {/* Auto-monitor */}
            <div className="flex items-center justify-between rounded-lg border border-secondary-200 bg-secondary-50 p-4">
              <div>
                <h3 className="font-medium text-secondary-900">
                  Automatic Monitoring
                </h3>
                <p className="text-sm text-secondary-600">
                  Continuously monitor for new threats
                </p>
              </div>
              <button
                onClick={() => setAutoMonitor(!autoMonitor)}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  autoMonitor ? 'bg-primary-600' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                    autoMonitor ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Require approval */}
            <div className="flex items-center justify-between rounded-lg border border-secondary-200 bg-secondary-50 p-4">
              <div>
                <h3 className="font-medium text-secondary-900">
                  Require Operator Approval
                </h3>
                <p className="text-sm text-secondary-600">
                  All interventions require explicit approval
                </p>
              </div>
              <button
                onClick={() => setRequireApproval(!requireApproval)}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  requireApproval ? 'bg-primary-600' : 'bg-secondary-300'
                }`}
                disabled
                title="This setting cannot be disabled (hard constraint)"
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                    requireApproval ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-secondary-500">
              ⚠️ This setting is locked due to "No Autonomous Action" constraint
            </p>
          </div>
        </div>

        {/* Data Settings */}
        <div className="mb-8 rounded-lg border border-secondary-200 bg-white p-6">
          <h2 className="mb-6 text-xl font-semibold text-secondary-900">
            Data & Privacy
          </h2>

          <div className="space-y-6">
            {/* Log retention */}
            <div>
              <label className="mb-2 block text-sm font-medium text-secondary-700">
                Audit Log Retention (days)
              </label>
              <input
                type="number"
                min="30"
                max="3650"
                value={logRetentionDays}
                onChange={(e) => setLogRetentionDays(Number(e.target.value))}
                className="w-full max-w-xs rounded-md border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
              <p className="mt-2 text-xs text-secondary-500">
                Minimum 30 days, maximum 10 years. Recommended: 365 days (1 year)
              </p>
            </div>

            {/* Data encryption */}
            <div className="flex items-center justify-between rounded-lg border border-secondary-200 bg-secondary-50 p-4">
              <div>
                <h3 className="font-medium text-secondary-900">
                  Encrypt All Data
                </h3>
                <p className="text-sm text-secondary-600">
                  AES-256 encryption for all stored data
                </p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                ALWAYS ON
              </span>
            </div>

            {/* Zero-knowledge */}
            <div className="flex items-center justify-between rounded-lg border border-secondary-200 bg-secondary-50 p-4">
              <div>
                <h3 className="font-medium text-secondary-900">
                  Zero-Knowledge Architecture
                </h3>
                <p className="text-sm text-secondary-600">
                  Minimal data collection, maximum privacy
                </p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                ALWAYS ON
              </span>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="mb-8 rounded-lg border border-secondary-200 bg-white p-6">
          <h2 className="mb-6 text-xl font-semibold text-secondary-900">
            System
          </h2>

          <div className="space-y-4">
            {/* Version */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-secondary-700">Version</span>
              <span className="text-sm text-secondary-600">0.1.0</span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-secondary-700">Status</span>
              <span className="flex items-center gap-2 text-sm text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Operational
              </span>
            </div>

            {/* Uptime */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-secondary-700">Uptime</span>
              <span className="text-sm text-secondary-600">N/A</span>
            </div>

            {/* Last constraint check */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-secondary-700">Last Constraint Check</span>
              <span className="text-sm text-secondary-600">Never</span>
            </div>
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="rounded-lg border-2 border-alert-300 bg-alert-50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-alert-900">
            Emergency Actions
          </h2>

          <div className="space-y-4">
            <button className="w-full rounded-md bg-alert-600 px-6 py-3 font-medium text-white hover:bg-alert-700">
              Emergency Shutdown
            </button>
            <p className="text-xs text-alert-700">
              ⚠️ Immediately halt all operations. This action is logged and requires justification.
            </p>
          </div>
        </div>

        {/* Save button */}
        <div className="mt-8 flex justify-end gap-4">
          <button className="rounded-md border-2 border-secondary-300 px-6 py-3 font-medium text-secondary-700 hover:bg-secondary-50">
            Reset to Defaults
          </button>
          <button className="rounded-md bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700">
            Save Changes
          </button>
        </div>
      </div>
    </main>
  );
}
