'use client';

import { Clock, AlertTriangle } from 'lucide-react';
import { StatusDot } from '@/components/ui/StatusDot';
import { Badge } from '@/components/ui/Badge';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { CronJob } from '@/lib/types';

interface CronJobListProps {
  jobs: CronJob[];
  selectedJobId: string | null;
  onSelectJob: (job: CronJob) => void;
  onToggleJob: (id: string, enabled: boolean) => void;
}

export function CronJobList({ jobs, selectedJobId, onSelectJob, onToggleJob }: CronJobListProps) {
  return (
    <div className="space-y-2">
      {jobs.map((job) => (
        <button
          key={job.id}
          onClick={() => onSelectJob(job)}
          className={cn(
            'w-full text-left p-4 rounded-lg border transition-all duration-200 cursor-pointer',
            selectedJobId === job.id
              ? 'bg-primary/10 border-primary/30'
              : 'bg-card border-edge hover:border-primary/20 hover:bg-highlight/50'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <StatusDot status={job.status} />
              <span className="text-foreground font-medium text-sm">{job.name}</span>
            </div>
            <label
              className="relative inline-flex items-center cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={job.enabled}
                onChange={() => onToggleJob(job.id, !job.enabled)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-highlight rounded-full peer peer-checked:bg-primary/40 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-muted peer-checked:after:bg-primary after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {job.schedule}
            </span>
            {job.lastRun && (
              <span>Last: {formatRelativeTime(job.lastRun)}</span>
            )}
            {job.errorCount > 0 && (
              <Badge variant="danger">
                <AlertTriangle size={10} className="mr-1" />
                {job.errorCount} errors
              </Badge>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
