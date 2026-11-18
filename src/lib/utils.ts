export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatTokens(count: number): string {
  if (count < 1000) return String(count);
  if (count < 1_000_000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1_000_000).toFixed(2)}M`;
}

export function formatCost(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, options);
  if (!res.ok) {
    const body = await res.text().catch(() => 'Unknown error');
    throw new Error(`API ${path}: ${res.status} - ${body}`);
  }
  return res.json();
}

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + '\u2026';
}

export function priorityColor(priority: string): string {
  switch (priority) {
    case 'urgent': return 'text-danger';
    case 'high': return 'text-warning';
    case 'medium': return 'text-primary';
    default: return 'text-muted';
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'online':
    case 'running':
    case 'idle':
      return 'bg-success';
    case 'error':
    case 'offline':
    case 'stopped':
      return 'bg-danger';
    case 'busy':
    case 'printing':
      return 'bg-warning';
    default:
      return 'bg-muted';
  }
}
