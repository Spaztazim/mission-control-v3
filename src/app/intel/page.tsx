'use client';

import { useState, useEffect, useCallback } from 'react';
import { Newspaper, Rss, MessageCircle } from 'lucide-react';
import { fetchApi, cn } from '@/lib/utils';
import { mockIntelItems, mockEngagementDrafts } from '@/lib/mock-data';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { IntelFeed } from '@/components/intel/IntelFeed';
import { EngagementQueue } from '@/components/intel/EngagementQueue';
import type { IntelItem, EngagementDraft } from '@/lib/types';

type Tab = 'feed' | 'engagement';

interface IntelResponse {
  ok: boolean;
  data?: { items: IntelItem[]; drafts: EngagementDraft[] };
  error?: string;
}

export default function IntelPage() {
  const [tab, setTab] = useState<Tab>('feed');
  const [items, setItems] = useState<IntelItem[]>([]);
  const [drafts, setDrafts] = useState<EngagementDraft[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetchApi<IntelResponse>('/api/intel');
      if (res.ok && res.data) {
        setItems(res.data.items ?? []);
        setDrafts(res.data.drafts ?? []);
      } else {
        setItems(mockIntelItems);
        setDrafts(mockEngagementDrafts);
      }
    } catch {
      setItems(mockIntelItems);
      setDrafts(mockEngagementDrafts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tabs: { key: Tab; label: string; icon: typeof Rss }[] = [
    { key: 'feed', label: 'Feed', icon: Rss },
    { key: 'engagement', label: 'Engagement', icon: MessageCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-foreground text-xl font-bold flex items-center gap-2">
          <Newspaper size={22} className="text-primary" />
          Intel
        </h2>
        <p className="text-muted text-sm mt-1">News feed and engagement pipeline</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-edge pb-0">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px cursor-pointer',
              tab === key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-foreground hover:border-edge'
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {tab === 'feed' && <IntelFeed items={items} />}
          {tab === 'engagement' && <EngagementQueue drafts={drafts} />}
        </>
      )}
    </div>
  );
}
