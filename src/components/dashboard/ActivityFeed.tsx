'use client';

import { CheckCircle2, Play, Square, AlertTriangle, Clock, MessageSquare } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatRelativeTime } from '@/lib/utils';
import type { ActivityEvent } from '@/lib/types';

interface ActivityFeedProps {
  events: ActivityEvent[];
  loading: boolean;
}

function eventMeta(type: ActivityEvent['type']): { icon: LucideIcon; color: string } {
  switch (type) {
    case 'task_complete':
      return { icon: CheckCircle2, color: 'text-success' };
    case 'cron_run':
      return { icon: Clock, color: 'text-primary' };
    case 'alert':
      return { icon: AlertTriangle, color: 'text-danger' };
    case 'session_start':
      return { icon: Play, color: 'text-success' };
    case 'session_end':
      return { icon: Square, color: 'text-muted' };
    case 'message':
      return { icon: MessageSquare, color: 'text-primary' };
  }
}

export function ActivityFeed({ events, loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-28" />
        </CardHeader>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-5 w-5 rounded-full shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const recent = events.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      {recent.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No recent activity"
          description="Events will appear here as agents work."
        />
      ) : (
        <div className="space-y-1">
          {recent.map((event, idx) => {
            const meta = eventMeta(event.type);
            const Icon = meta.icon;
            const isLast = idx === recent.length - 1;

            return (
              <div key={event.id} className="flex items-start gap-3 group">
                {/* Timeline line + icon */}
                <div className="flex flex-col items-center pt-0.5">
                  <Icon size={16} className={meta.color} />
                  {!isLast && (
                    <div className="w-px flex-1 bg-edge mt-1 min-h-[20px]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-foreground text-sm font-medium leading-tight">
                      {event.title}
                    </p>
                    <span className="text-muted text-xs whitespace-nowrap shrink-0">
                      {formatRelativeTime(event.timestamp)}
                    </span>
                  </div>
                  {event.agent && (
                    <p className="text-dim text-xs mt-0.5">{event.agent}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
