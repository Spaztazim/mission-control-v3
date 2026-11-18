'use client';

import { Wifi, WifiOff, Users, Zap, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusDot } from '@/components/ui/StatusDot';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDuration } from '@/lib/utils';
import type { GatewayStatus } from '@/lib/types';

interface SystemStatusProps {
  status: GatewayStatus | null;
  sessionCount: number;
  loading: boolean;
}

export function SystemStatus({ status, sessionCount, loading }: SystemStatusProps) {
  if (loading) {
    return (
      <Card>
        <div className="flex items-center gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-1">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const online = status?.online ?? false;

  const stats = [
    {
      icon: online ? Wifi : WifiOff,
      label: 'Gateway',
      value: online ? 'Online' : 'Offline',
      statusDot: online ? 'online' as const : 'offline' as const,
    },
    {
      icon: Users,
      label: 'Agents',
      value: String(status?.connectedAgents ?? 0),
      statusDot: null,
    },
    {
      icon: Zap,
      label: 'Active Sessions',
      value: String(sessionCount),
      statusDot: null,
    },
    {
      icon: Clock,
      label: 'Uptime',
      value: status ? formatDuration(status.uptime) : '—',
      statusDot: null,
    },
  ];

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-6 md:gap-10">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 min-w-[140px]">
            <div className="p-2 rounded-lg bg-primary/10">
              <stat.icon size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-muted text-xs uppercase tracking-wide">{stat.label}</p>
              <div className="flex items-center gap-2">
                {stat.statusDot && <StatusDot status={stat.statusDot} size="sm" />}
                <span className="text-foreground font-semibold text-sm">{stat.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
