'use client';

import { User, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { priorityColor, formatRelativeTime, cn } from '@/lib/utils';
import type { Task } from '@/lib/types';

interface TaskCardProps {
  task: Task;
}

const priorityLabels: Record<string, string> = {
  urgent: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🟢',
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="hover:border-primary/30 transition-colors">
      {/* Priority + title */}
      <div className="flex items-start gap-2 mb-2">
        <span className={cn('text-xs mt-0.5', priorityColor(task.priority))} title={task.priority}>
          {priorityLabels[task.priority] ?? '⚪'}
        </span>
        <h4 className="text-foreground text-sm font-medium leading-snug">{task.title}</h4>
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {task.tags.map((tag) => (
            <Badge key={tag} variant="default">{tag}</Badge>
          ))}
        </div>
      )}

      {/* Footer meta */}
      <div className="flex items-center justify-between text-xs text-muted">
        {task.assignee ? (
          <span className="flex items-center gap-1">
            <User size={12} />
            {task.assignee}
          </span>
        ) : (
          <span className="text-dim italic">Unassigned</span>
        )}
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {formatRelativeTime(task.createdAt)}
        </span>
      </div>
    </Card>
  );
}
