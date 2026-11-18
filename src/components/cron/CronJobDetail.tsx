'use client';

import { Clock, Calendar, AlertTriangle, Settings } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatusDot } from '@/components/ui/StatusDot';
import { formatRelativeTime } from '@/lib/utils';
import type { CronJob } from '@/lib/types';

interface CronJobDetailProps {
  job: CronJob | null;
  open: boolean;
  onClose: () => void;
  onToggle: (id: string, enabled: boolean) => void;
}

export function CronJobDetail({ job, open, onClose, onToggle }: CronJobDetailProps) {
  if (!job) return null;

  return (
    <Modal open={open} onClose={onClose} title={job.name} className="max-w-xl">
      <div className="space-y-5">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusDot status={job.status} size="md" />
            <span className="text-foreground font-medium capitalize">{job.status}</span>
          </div>
          <Badge variant={job.enabled ? 'success' : 'danger'}>
            {job.enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>

        {/* Schedule Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface rounded-lg p-3">
            <div className="flex items-center gap-2 text-muted text-xs mb-1">
              <Clock size={12} />
              Schedule
            </div>
            <p className="text-foreground font-mono text-sm">{job.schedule}</p>
          </div>
          {job.nextRun && (
            <div className="bg-surface rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted text-xs mb-1">
                <Calendar size={12} />
                Next Run
              </div>
              <p className="text-foreground text-sm">{formatRelativeTime(job.nextRun)}</p>
            </div>
          )}
          {job.lastRun && (
            <div className="bg-surface rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted text-xs mb-1">
                <Calendar size={12} />
                Last Run
              </div>
              <p className="text-foreground text-sm">{formatRelativeTime(job.lastRun)}</p>
            </div>
          )}
          <div className="bg-surface rounded-lg p-3">
            <div className="flex items-center gap-2 text-muted text-xs mb-1">
              <AlertTriangle size={12} />
              Errors
            </div>
            <p className={job.errorCount > 0 ? 'text-danger font-medium text-sm' : 'text-foreground text-sm'}>
              {job.errorCount}
            </p>
          </div>
        </div>

        {/* Config JSON */}
        {job.config && Object.keys(job.config).length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-muted text-xs mb-2">
              <Settings size={12} />
              Configuration
            </div>
            <pre className="bg-surface border border-edge rounded-lg p-3 text-xs text-dim font-mono overflow-x-auto max-h-48 overflow-y-auto">
              {JSON.stringify(job.config, null, 2)}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-edge">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant={job.enabled ? 'danger' : 'primary'}
            size="sm"
            onClick={() => {
              onToggle(job.id, !job.enabled);
              onClose();
            }}
          >
            {job.enabled ? 'Disable' : 'Enable'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
