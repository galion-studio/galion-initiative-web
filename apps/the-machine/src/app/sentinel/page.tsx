/**
 * THE SENTINEL - Galion Security Monitoring Dashboard
 * 
 * Real-time monitoring for:
 * - Infrastructure integrity (ROM, air-gap, consensus)
 * - AI threat intelligence (public capability tracking)
 * - Watchdog network (rogue AGI detection)
 * - Team protection (social engineering defense)
 */

'use client';

import { useState, useEffect } from 'react';

interface SentinelStatus {
  overall_status: {
    threat_level: 'normal' | 'elevated' | 'high' | 'critical' | 'existential';
    systems_operational: boolean;
    watchdog_active: boolean;
  };
  infrastructure: {
    all_checks_passed: boolean;
    failed_checks: number;
    critical_failures: number;
  };
  ai_intelligence: {
    total_reports: number;
    high_risk_count: number;
  };
  watchdog: {
    total_detections: number;
    existential_threats: number;
    critical_threats: number;
  };
}

export default function SentinelPage() {
  const [status, setStatus] = useState<SentinelStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    fetchStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem('session_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('/api/sentinel/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setStatus(data);
        setLastUpdate(new Date().toLocaleTimeString());
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch Sentinel status:', error);
      setLoading(false);
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'existential': return 'text-red-600 bg-red-900/30 border-red-700';
      case 'critical': return 'text-red-500 bg-red-900/20 border-red-700';
      case 'high': return 'text-orange-500 bg-orange-900/20 border-orange-700';
      case 'elevated': return 'text-yellow-500 bg-yellow-900/20 border-yellow-700';
      default: return 'text-green-500 bg-green-900/20 border-green-700';
    }
  };

  const getThreatLevelIcon = (level: string) => {
    switch (level) {
      case 'existential': return '🚨';
      case 'critical': return '⚠️';
      case 'high': return '🔴';
      case 'elevated': return '🟡';
      default: return '✅';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-gray-400">Loading Sentinel systems...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            🛡️ THE SENTINEL
          </h1>
          <p className="text-gray-400">
            Galion Initiative Security Monitoring
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Last update: {lastUpdate}
          </p>
        </div>

        {/* Overall Threat Level */}
        {status && (
          <div className={`mb-6 p-6 rounded-lg border-2 ${getThreatLevelColor(status.overall_status.threat_level)}`}>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{getThreatLevelIcon(status.overall_status.threat_level)}</span>
              <div>
                <h2 className="text-2xl font-bold uppercase">
                  Threat Level: {status.overall_status.threat_level}
                </h2>
                <p className="text-sm opacity-80 mt-1">
                  {status.overall_status.systems_operational 
                    ? 'All infrastructure systems operational'
                    : 'INFRASTRUCTURE FAILURES DETECTED'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Infrastructure Monitoring */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700 bg-gray-900">
              <h2 className="text-lg font-semibold text-gray-100">
                Infrastructure Monitoring
              </h2>
              <p className="text-sm text-gray-400">ROM, Air-Gap, Consensus, Cognitive Work</p>
            </div>
            
            <div className="p-6">
              {status ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-900 p-4 rounded-md border border-gray-700">
                      <div className="text-sm text-gray-400">Status</div>
                      <div className={`text-xl font-bold ${status.infrastructure.all_checks_passed ? 'text-green-500' : 'text-red-500'}`}>
                        {status.infrastructure.all_checks_passed ? 'PASS' : 'FAIL'}
                      </div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-md border border-gray-700">
                      <div className="text-sm text-gray-400">Failed Checks</div>
                      <div className={`text-xl font-bold ${status.infrastructure.failed_checks > 0 ? 'text-red-500' : 'text-gray-300'}`}>
                        {status.infrastructure.failed_checks}
                      </div>
                    </div>
                  </div>
                  
                  {status.infrastructure.critical_failures > 0 && (
                    <div className="p-4 bg-red-900/20 border border-red-700 rounded-md">
                      <div className="text-sm text-red-400 font-semibold">
                        ⚠️ {status.infrastructure.critical_failures} CRITICAL FAILURE(S)
                      </div>
                      <div className="text-xs text-red-300 mt-1">
                        Immediate operator review required
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <a
                      href="/api/sentinel/infrastructure"
                      target="_blank"
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      View detailed checks →
                    </a>
                  </div>
                </>
              ) : (
                <div className="text-gray-500">No data</div>
              )}
            </div>
          </div>

          {/* AI Threat Intelligence */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700 bg-gray-900">
              <h2 className="text-lg font-semibold text-gray-100">
                AI Threat Intelligence
              </h2>
              <p className="text-sm text-gray-400">Public capability tracking</p>
            </div>
            
            <div className="p-6">
              {status ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-900 p-4 rounded-md border border-gray-700">
                      <div className="text-sm text-gray-400">Total Reports</div>
                      <div className="text-xl font-bold text-gray-300">
                        {status.ai_intelligence.total_reports}
                      </div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-md border border-gray-700">
                      <div className="text-sm text-gray-400">High Risk</div>
                      <div className={`text-xl font-bold ${status.ai_intelligence.high_risk_count > 0 ? 'text-orange-500' : 'text-gray-300'}`}>
                        {status.ai_intelligence.high_risk_count}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-2">
                    Monitoring: arXiv, GitHub, Company Announcements
                  </div>
                  
                  <div className="mt-4">
                    <a
                      href="/api/sentinel/ai-intelligence"
                      target="_blank"
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      View intelligence reports →
                    </a>
                  </div>
                </>
              ) : (
                <div className="text-gray-500">No data</div>
              )}
            </div>
          </div>

          {/* Watchdog Network */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700 bg-gray-900">
              <h2 className="text-lg font-semibold text-gray-100">
                Watchdog Network
              </h2>
              <p className="text-sm text-gray-400">Rogue AGI detection</p>
            </div>
            
            <div className="p-6">
              {status ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-900 p-4 rounded-md border border-gray-700">
                      <div className="text-sm text-gray-400">Detections</div>
                      <div className="text-xl font-bold text-gray-300">
                        {status.watchdog.total_detections}
                      </div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-md border border-gray-700">
                      <div className="text-sm text-gray-400">Critical</div>
                      <div className={`text-xl font-bold ${status.watchdog.critical_threats > 0 ? 'text-red-500' : 'text-gray-300'}`}>
                        {status.watchdog.critical_threats}
                      </div>
                    </div>
                  </div>
                  
                  {status.watchdog.existential_threats > 0 && (
                    <div className="p-4 bg-red-900/30 border-2 border-red-600 rounded-md">
                      <div className="text-sm text-red-400 font-bold">
                        🚨 {status.watchdog.existential_threats} EXISTENTIAL THREAT(S)
                      </div>
                      <div className="text-xs text-red-300 mt-1">
                        EMERGENCY SHUTDOWN MAY BE REQUIRED
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <a
                      href="/api/sentinel/watchdog"
                      target="_blank"
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      View watchdog detections →
                    </a>
                  </div>
                </>
              ) : (
                <div className="text-gray-500">No data</div>
              )}
            </div>
          </div>

          {/* Team Protection */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700 bg-gray-900">
              <h2 className="text-lg font-semibold text-gray-100">
                Team Protection
              </h2>
              <p className="text-sm text-gray-400">Social engineering defense</p>
            </div>
            
            <div className="p-6">
              <div className="text-sm text-gray-400 mb-4">
                Monitoring for:
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Deepfake detection (audio/video)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Phishing attempts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Social manipulation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Impersonation attacks
                </li>
              </ul>
              
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-md">
                <div className="text-xs text-blue-300">
                  💡 To scan content, use: POST /api/sentinel/team-protection
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700 bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-100">
              Quick Actions
            </h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={fetchStatus}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Refresh Status
            </button>
            <a
              href="/api/sentinel/infrastructure"
              target="_blank"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-center rounded-md transition-colors"
            >
              Run Infrastructure Checks
            </a>
            <a
              href="/monitor"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-center rounded-md transition-colors"
            >
              Real-Time Monitor
            </a>
            <a
              href="/"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-center rounded-md transition-colors"
            >
              Main Console
            </a>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="text-center text-sm text-gray-400">
            <strong className="text-gray-300">Mission</strong>: Protect humanity's AI safety infrastructure through defensive monitoring
          </div>
          <div className="text-center text-xs text-gray-500 mt-2">
            THE SENTINEL - Constrained by design. Defensive only. For humanity's future.
          </div>
        </div>
      </div>
    </main>
  );
}
