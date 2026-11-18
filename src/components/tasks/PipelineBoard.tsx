'use client';

import { Layers, ArrowRight, Search, CheckCircle } from 'lucide-react';
import { CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TaskCard } from './TaskCard';
import type { Task } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

interface PipelineBoardProps {
  tasks: Task[];
}

interface Column {
  key: Task['status'];
  label: string;
  icon: LucideIcon;
  variant: 'default' | 'warning' | 'accent' | 'success';
}

const columns: Column[] = [
  { key: 'backlog', label: 'Backlog', icon: Layers, variant: 'default' },
  { key: 'in_progress', label: 'In Progress', icon: ArrowRight, variant: 'warning' },
  { key: 'qa_review', label: 'QA Review', icon: Search, variant: 'accent' },
  { key: 'done', label: 'Done', icon: CheckCircle, variant: 'success' },
];

export function PipelineBoard({ tasks }: PipelineBoardProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title="No tasks yet"
        description="Tasks will appear here once created. Use the pipeline to track work across stages."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {columns.map((col) => {
        const Icon = col.icon;
        const colTasks = tasks.filter((t) => t.status === col.key);

        return (
          <div key={col.key} className="bg-panel border border-edge rounded-lg p-4 min-h-[200px]">
            {/* Column header */}
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center gap-2">
                <Icon size={14} />
                {col.label}
              </CardTitle>
              <Badge variant={col.variant}>{colTasks.length}</Badge>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {colTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            {colTasks.length === 0 && (
              <p className="text-muted text-xs text-center py-6 italic">No tasks</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
