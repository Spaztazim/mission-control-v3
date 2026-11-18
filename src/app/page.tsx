'use client';

import { useEffect, useState, useCallback } from 'react';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { TokenBurn } from '@/components/dashboard/TokenBurn';
import { AgentGrid } from '@/components/dashboard/AgentGrid';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { fetchApi } from '@/lib/utils';
import { mockGatewayStatus, mockSessions, mockUsageSummary, mockActivityEvents } from '@/lib/mock-data';
import type { GatewayStatus, AgentSession, UsageSummary, ActivityEvent } from '@/lib/types';

interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export default function DashboardPage() {
  const [status, setStatus] = useState<GatewayStatus | null>(null);
  const [sessions, setSessions] = useState<AgentSession[]>([]);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [events, setEvents] = useState<ActivityEvent[]>(mockActivityEvents);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statusRes, sessionsRes, usageRes] = await Promise.allSettled([
        fetchApi<ApiResponse<GatewayStatus>>('/api/status'),
        fetchApi<ApiResponse<AgentSession[]>>('/api/sessions'),
        fetchApi<ApiResponse<UsageSummary>>('/api/usage'),
      ]);

      const statusData = statusRes.status === 'fulfilled' ? statusRes.value : null;
      const sessionsData = sessionsRes.status === 'fulfilled' ? sessionsRes.value : null;
      const usageData = usageRes.status === 'fulfilled' ? usageRes.value : null;

      setStatus(statusData?.ok && statusData.data ? statusData.data : mockGatewayStatus);
      setSessions(sessionsData?.ok && sessionsData.data ? sessionsData.data : mockSessions);
      setUsage(usageData?.ok && usageData.data ? usageData.data : mockUsageSummary);
    } catch {
      setStatus(mockGatewayStatus);
      setSessions(mockSessions);
      setUsage(mockUsageSummary);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const activeSessions = sessions.filter((s) => s.status === 'active').length;

  return (
    <div className="grid gap-6">
      {/* Row 1: System Status (full width) */}
      <SystemStatus
        status={status}
        sessionCount={activeSessions}
        loading={loading}
      />

      {/* Row 2: Token Burn (1/3) + Agent Grid (2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TokenBurn usage={usage} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <AgentGrid sessions={sessions} loading={loading} />
        </div>
      </div>

      {/* Row 3: Activity Feed (full width) */}
      <ActivityFeed events={events} loading={loading} />
    </div>
  );
}
