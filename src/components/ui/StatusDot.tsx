import { cn } from '@/lib/utils';

interface StatusDotProps {
  status: 'online' | 'offline' | 'busy' | 'active' | 'idle' | 'error' | 'running' | 'stopped' | 'printing';
  pulse?: boolean;
  size?: 'sm' | 'md';
}

const statusColors: Record<string, string> = {
  online: 'bg-success',
  active: 'bg-success',
  running: 'bg-success',
  idle: 'bg-primary',
  busy: 'bg-warning',
  printing: 'bg-warning',
  offline: 'bg-danger',
  error: 'bg-danger',
  stopped: 'bg-danger',
};

export function StatusDot({ status, pulse = true, size = 'sm' }: StatusDotProps) {
  const color = statusColors[status] ?? 'bg-muted';
  const sizeClass = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';

  return (
    <span
      className={cn('rounded-full inline-block', sizeClass, color, pulse && status !== 'offline' && status !== 'stopped' && 'animate-pulse-glow')}
      title={status}
    />
  );
}
