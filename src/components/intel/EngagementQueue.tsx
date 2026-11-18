'use client';

import { useState } from 'react';
import { Send, Pencil, SkipForward, MessageCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatRelativeTime, cn } from '@/lib/utils';
import type { EngagementDraft } from '@/lib/types';

interface EngagementQueueProps {
  drafts: EngagementDraft[];
}

export function EngagementQueue({ drafts }: EngagementQueueProps) {
  const [actions, setActions] = useState<Record<string, 'sent' | 'skipped'>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleSend = (id: string) => {
    setActions((prev) => ({ ...prev, [id]: 'sent' }));
  };

  const handleSkip = (id: string) => {
    setActions((prev) => ({ ...prev, [id]: 'skipped' }));
  };

  const handleEditStart = (draft: EngagementDraft) => {
    setEditing(draft.id);
    setEditContent(draft.content);
  };

  const handleEditSave = () => {
    setEditing(null);
    setEditContent('');
  };

  const activeDrafts = drafts.filter(
    (d) => d.status === 'draft' && !actions[d.id]
  );
  const processedDrafts = drafts.filter(
    (d) => d.status !== 'draft' || actions[d.id]
  );

  if (drafts.length === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="No engagement drafts"
        description="Drafted replies and posts will appear here for review before sending."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Active drafts */}
      {activeDrafts.length > 0 && (
        <div className="space-y-3">
          {activeDrafts.map((draft) => (
            <Card key={draft.id}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="accent">{draft.platform}</Badge>
                  {draft.inReplyTo && (
                    <span className="text-muted text-xs">
                      reply to: {draft.inReplyTo}
                    </span>
                  )}
                </div>
                <span className="text-muted text-xs">
                  {formatRelativeTime(draft.createdAt)}
                </span>
              </div>

              {/* Content or edit mode */}
              {editing === draft.id ? (
                <div className="space-y-2 mb-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    className="w-full bg-surface border border-edge rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                  <div className="flex justify-end gap-1.5">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleEditSave}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-dim text-sm leading-relaxed mb-3 whitespace-pre-wrap bg-surface border border-edge rounded-lg p-3">
                  {draft.content}
                </p>
              )}

              {/* Actions */}
              {editing !== draft.id && (
                <div className="flex items-center justify-end gap-1.5">
                  <Button variant="ghost" size="sm" onClick={() => handleSkip(draft.id)}>
                    <SkipForward size={14} />
                    Skip
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditStart(draft)}>
                    <Pencil size={14} />
                    Edit
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleSend(draft.id)}>
                    <Send size={14} />
                    Send
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Processed */}
      {processedDrafts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processed</CardTitle>
            <Badge variant="success">{processedDrafts.length}</Badge>
          </CardHeader>

          <div className="divide-y divide-edge">
            {processedDrafts.map((draft) => {
              const action = actions[draft.id] || draft.status;
              return (
                <div key={draft.id} className="py-2.5 first:pt-0 last:pb-0 opacity-60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="accent">{draft.platform}</Badge>
                      <span className="text-foreground text-sm truncate max-w-xs">
                        {draft.content.slice(0, 60)}…
                      </span>
                    </div>
                    <Badge variant={action === 'sent' ? 'success' : 'default'}>
                      {action}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {activeDrafts.length === 0 && processedDrafts.length > 0 && (
        <p className="text-muted text-sm text-center py-4">
          All drafts have been processed ✓
        </p>
      )}
    </div>
  );
}
