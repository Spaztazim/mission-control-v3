'use client';

import { useState, useMemo } from 'react';
import { ExternalLink, Clock, Tag } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatRelativeTime, cn } from '@/lib/utils';
import type { IntelItem } from '@/lib/types';
import { Newspaper } from 'lucide-react';

interface IntelFeedProps {
  items: IntelItem[];
}

const categoryVariants: Record<string, 'default' | 'success' | 'danger' | 'warning' | 'accent'> = {
  news: 'default',
  upgrade: 'accent',
  content: 'success',
  business: 'warning',
};

const ALL_CATEGORIES = ['all', 'news', 'upgrade', 'content', 'business'] as const;

export function IntelFeed({ items }: IntelFeedProps) {
  const [filter, setFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((item) => item.category === filter);
  }, [items, filter]);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Newspaper}
        title="No intel gathered"
        description="Intelligence items will appear here once agents begin collecting data."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Category filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 capitalize cursor-pointer',
              filter === cat
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-highlight text-muted border border-edge hover:text-foreground'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item.id} className="hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={categoryVariants[item.category] ?? 'default'}>
                    {item.category}
                  </Badge>
                  <span className="text-muted text-xs">{item.source}</span>
                </div>
                <h4 className="text-foreground text-sm font-medium">{item.title}</h4>
              </div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-foreground transition-colors shrink-0"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>

            <p className="text-dim text-xs leading-relaxed mb-2.5">{item.summary}</p>

            <div className="flex items-center justify-between">
              {/* Tags */}
              <div className="flex items-center gap-1.5">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-0.5 text-muted text-xs"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>

              <span className="flex items-center gap-1 text-muted text-xs">
                <Clock size={12} />
                {formatRelativeTime(item.gatheredAt)}
              </span>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <p className="text-muted text-sm text-center py-8 italic">
            No items in this category
          </p>
        )}
      </div>
    </div>
  );
}
