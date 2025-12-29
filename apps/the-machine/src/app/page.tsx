/**
 * The Machine - Admin Console
 * 
 * Main dashboard for operators.
 * Displays system status, active constraints, and quick access to core functions.
 * 
 * Design principles:
 * - FUNCTIONAL not decorative
 * - CLEAR not cluttered
 * - FAST not flashy
 * - AUDITABLE not opaque
 */

export default function AdminConsolePage() {
  return (
    <main className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="border-b border-secondary-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                The Machine
              </h1>
              <p className="text-sm text-secondary-600">
                Admin Console • Constrained AI System
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* System status indicator */}
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse-slow" />
                <span className="text-sm font-medium text-secondary-700">
                  System Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Constraint verification banner */}
        <div className="mb-8 rounded-lg border border-primary-200 bg-primary-50 p-6">
          <h2 className="mb-2 text-lg font-semibold text-primary-900">
            🔒 Hard Constraints Active
          </h2>
          <p className="mb-4 text-sm text-primary-700">
            All core safety constraints are enforced. System operating within defined parameters.
          </p>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-secondary-700">No autonomous actions permitted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-secondary-700">Human oversight required for all decisions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-secondary-700">Privacy protection enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-secondary-700">Immediate shutdown capability active</span>
            </div>
          </div>
        </div>

        {/* Quick access grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Risk Assessment */}
          <a
            href="/assess"
            className="group rounded-lg border border-secondary-200 bg-white p-6 transition-all hover:border-primary-400 hover:shadow-lg"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-secondary-900 group-hover:text-primary-600">
              Risk Assessment
            </h3>
            <p className="text-sm text-secondary-600">
              Evaluate threats using structured decision framework
            </p>
          </a>

          {/* Audit Logs */}
          <a
            href="/logs"
            className="group rounded-lg border border-secondary-200 bg-white p-6 transition-all hover:border-primary-400 hover:shadow-lg"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-100 text-secondary-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-secondary-900 group-hover:text-primary-600">
              Audit Logs
            </h3>
            <p className="text-sm text-secondary-600">
              Review complete action history and reasoning
            </p>
          </a>

          {/* Settings */}
          <a
            href="/settings"
            className="group rounded-lg border border-secondary-200 bg-white p-6 transition-all hover:border-primary-400 hover:shadow-lg"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-100 text-secondary-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-secondary-900 group-hover:text-primary-600">
              Settings
            </h3>
            <p className="text-sm text-secondary-600">
              Configure constraints and alert thresholds
            </p>
          </a>
        </div>

        {/* System information */}
        <div className="mt-8 rounded-lg border border-secondary-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-secondary-900">
            System Information
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-secondary-500">Version</p>
              <p className="text-base text-secondary-900">0.1.0</p>
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-500">Status</p>
              <p className="text-base text-green-600">Operational</p>
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-500">Last Audit</p>
              <p className="text-base text-secondary-900">Never</p>
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-500">Uptime</p>
              <p className="text-base text-secondary-900">N/A</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-secondary-200 bg-white px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between text-sm">
            <p className="text-secondary-600">
              The Machine • Part of Project 42
            </p>
            <p className="text-secondary-500">
              Constrained by design • Built to protect
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
