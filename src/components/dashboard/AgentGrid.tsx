'use client';

import { Bot } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusDot } from '@/components/ui/StatusDot';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn, truncate } from '@/lib/utils';
import type { AgentSession } from '@/lib/types';

interface AgentGridProps {
  sessions: AgentSession[];
  loading: boolean;
}

function statusToDot(status: AgentSession['status']): 'active' | 'idle' | 'online' | 'error' {
  switch (status) {
    case 'active': return 'active';
    case 'idle': return 'idle';
    case 'completed': return 'online';
    case 'error': return 'error';
  }
}

function statusBadgeVariant(status: AgentSession['status']): 'success' | 'warning' | 'default' | 'danger' {
  switch (status) {
    case 'active': return 'success';
    case 'idle': return 'warning';
    case 'completed': return 'default';
    case 'error': return 'danger';
  }
}

export function AgentGrid({ sessions, loading }: AgentGridProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agents</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agents</CardTitle>
        <Badge>{sessions.length} sessions</Badge>
      </CardHeader>

      {sessions.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="No active sessions"
          description="All agents are currently idle."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                'bg-surface border border-edge rounded-lg p-4',
                'hover:border-primary/40 hover:bg-highlight transition-colors duration-200'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StatusDot status={statusToDot(session.status)} size="sm" />
                  <span className="text-foreground font-semibold text-sm">{session.agent}</span>
                </div>
                <Badge variant={statusBadgeVariant(session.status)}>
                  {session.status}
                </Badge>
              </div>

              <p className="text-muted text-xs mb-2">{session.model}</p>

              {session.lastMessage && (
                <p className="text-dim text-xs leading-relaxed border-t border-edge pt-2 mt-2">
                  {truncate(session.lastMessage, 80)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
