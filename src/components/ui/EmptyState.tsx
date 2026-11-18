import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon = Inbox, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon size={40} className="text-muted mb-3" />
      <h3 className="text-foreground font-medium mb-1">{title}</h3>
      {description && <p className="text-muted text-sm max-w-sm">{description}</p>}
    </div>
  );
}
