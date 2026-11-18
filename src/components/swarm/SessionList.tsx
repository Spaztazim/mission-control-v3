'use client';

import { Bug, Clock, MessageSquare, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusDot } from '@/components/ui/StatusDot';
import { Badge } from '@/components/ui/Badge';
import { formatDuration, formatTokens, cn } from '@/lib/utils';
import type { AgentSession } from '@/lib/types';

type DotStatus = 'online' | 'offline' | 'busy' | 'active' | 'idle' | 'error' | 'running' | 'stopped' | 'printing';

function sessionDotStatus(status: AgentSession['status']): DotStatus {
  if (status === 'completed') return 'offline';
  return status;
}

interface SessionListProps {
  sessions: AgentSession[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SessionList({ sessions, selectedId, onSelect }: SessionListProps) {
  return (
    <Card padding={false}>
      <CardHeader className="px-5 pt-5">
        <CardTitle>
          <Bug size={16} className="inline mr-2" />
          Active Sessions
        </CardTitle>
        <Badge variant="accent">{sessions.length}</Badge>
      </CardHeader>

      <div className="divide-y divide-edge">
        {sessions.map((session) => {
          const isSelected = session.id === selectedId;
          const elapsed = Math.floor(
            (Date.now() - new Date(session.startedAt).getTime()) / 1000
          );

          return (
            <button
              key={session.id}
              onClick={() => onSelect(session.id)}
              className={cn(
                'w-full text-left px-5 py-3.5 transition-all duration-200 cursor-pointer',
                isSelected
                  ? 'bg-highlight border-l-2 border-primary'
                  : 'hover:bg-highlight/50 border-l-2 border-transparent'
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <StatusDot status={sessionDotStatus(session.status)} />
                  <span className="text-foreground font-medium text-sm">
                    {session.agent}
                  </span>
                </div>
                <span className="text-muted text-xs">{session.model}</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-dim">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatDuration(elapsed)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} />
                  {session.messageCount} msgs
                </span>
                <span className="flex items-center gap-1">
                  <Zap size={12} />
                  {formatTokens(session.tokenUsage)}
                </span>
              </div>

              {session.lastMessage && (
                <p className="text-muted text-xs mt-1.5 truncate">
                  {session.lastMessage}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
