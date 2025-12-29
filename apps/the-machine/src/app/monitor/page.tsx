/**
 * THE MACHINE v2.0 - Real-Time Monitoring Dashboard
 * 
 * Live threat feed with pattern alerts and operator presence
 * Server-Sent Events (SSE) for real-time updates
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import type { RealtimeEvent } from '@/lib/realtime';

export default function MonitorPage() {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [activeOperators, setActiveOperators] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total_events: 0,
    critical_events: 0,
    pattern_matches: 0,
  });
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Get session token
    const token = localStorage.getItem('session_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Connect to real-time event stream
    // Note: EventSource doesn't support custom headers, so we use query param
    const eventSource = new EventSource(`/api/realtime/events?token=${token}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setConnected(true);
      console.log('[Realtime] Connected to event stream');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'connected') {
          console.log('[Realtime] Connection established:', data.message);
          return;
        }

        if (data.type === 'heartbeat') {
          console.log('[Realtime] Heartbeat received');
          return;
        }

        // Add event to list
        setEvents(prev => [data, ...prev].slice(0, 100));

        // Update stats
        setStats(prev => ({
          total_events: prev.total_events + 1,
          critical_events: data.level === 'critical' ? prev.critical_events + 1 : prev.critical_events,
          pattern_matches: data.type === 'pattern-match' ? prev.pattern_matches + 1 : prev.pattern_matches,
        }));

      } catch (error) {
        console.error('[Realtime] Parse error:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('[Realtime] Connection error:', error);
      setConnected(false);
    };

    // Fetch initial status
    fetchStatus(token);

    // Poll for active operators every 30 seconds
    const statusInterval = setInterval(() => fetchStatus(token), 30000);

    // Cleanup on unmount
    return () => {
      eventSource.close();
      clearInterval(statusInterval);
    };
  }, []);

  const fetchStatus = async (token: string) => {
    try {
      const response = await fetch('/api/realtime/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setActiveOperators(data.realtime.operators || []);
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-700';
      case 'warning': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      default: return 'text-blue-400 bg-blue-900/20 border-blue-700';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Real-Time Monitoring
          </h1>
          <p className="text-gray-400">
            Live threat feed and operator presence
          </p>
        </div>

        {/* Connection Status */}
        <div className="mb-6 flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            connected 
              ? 'bg-green-900/20 border border-green-700' 
              : 'bg-red-900/20 border border-red-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className={connected ? 'text-green-400' : 'text-red-400'}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <div className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md">
            <span className="text-gray-400">Active Operators: </span>
            <span className="text-gray-100 font-medium">{activeOperators.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Event Feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Total Events</div>
                <div className="text-2xl font-bold text-gray-100">{stats.total_events}</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Critical</div>
                <div className="text-2xl font-bold text-red-400">{stats.critical_events}</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Pattern Matches</div>
                <div className="text-2xl font-bold text-blue-400">{stats.pattern_matches}</div>
              </div>
            </div>

            {/* Event Feed */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-gray-100">Live Event Feed</h2>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {events.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No events yet. Waiting for activity...
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className={`p-4 border-l-4 ${getLevelColor(event.level)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getLevelIcon(event.level)}</span>
                            <h3 className="font-medium text-gray-100">{event.title}</h3>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-300 mb-2">{event.message}</p>
                        
                        {/* Event metadata */}
                        <div className="text-xs text-gray-500">
                          <span className="font-mono">{event.type}</span>
                          {event.data.assessment_id && (
                            <span className="ml-2">• ID: {event.data.assessment_id}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Active Operators & System Status */}
          <div className="space-y-4">
            {/* Active Operators */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-gray-100">Active Operators</h2>
              </div>
              
              <div className="p-4 space-y-3">
                {activeOperators.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No operators online
                  </div>
                ) : (
                  activeOperators.map((op) => (
                    <div
                      key={op.id}
                      className="flex items-center gap-3 p-3 bg-gray-900 rounded-md border border-gray-700"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-100">
                          {op.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {op.role} • Online {Math.floor(op.online_for / 60)}m
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-gray-100">System Status</h2>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Real-Time Feed</span>
                  <span className={connected ? 'text-green-400' : 'text-red-400'}>
                    {connected ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Pattern Matching</span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Audit Logging</span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Privacy Protection</span>
                  <span className="text-green-400">Active</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-gray-100">Quick Actions</h2>
              </div>
              
              <div className="p-4 space-y-2">
                <a
                  href="/assess"
                  className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md transition-colors"
                >
                  New Assessment
                </a>
                <a
                  href="/logs"
                  className="block w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-center rounded-md transition-colors"
                >
                  View Audit Logs
                </a>
                <a
                  href="/"
                  className="block w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-center rounded-md transition-colors"
                >
                  Main Console
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
