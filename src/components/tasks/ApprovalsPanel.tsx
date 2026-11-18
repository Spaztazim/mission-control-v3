'use client';

import { useState } from 'react';
import { ShieldCheck, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatRelativeTime, cn } from '@/lib/utils';
import type { Approval } from '@/lib/types';

interface ApprovalsPanelProps {
  approvals: Approval[];
}

export function ApprovalsPanel({ approvals }: ApprovalsPanelProps) {
  const [decisions, setDecisions] = useState<Record<string, string>>({});

  const handleDecision = (id: string, decision: string) => {
    setDecisions((prev) => ({ ...prev, [id]: decision }));
  };

  const pendingApprovals = approvals.filter(
    (a) => a.status === 'pending' && !decisions[a.id]
  );
  const resolvedApprovals = approvals.filter(
    (a) => a.status !== 'pending' || decisions[a.id]
  );

  if (approvals.length === 0) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="No approvals pending"
        description="Approval requests from agents will appear here for your review."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Pending */}
      {pendingApprovals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <ShieldCheck size={16} className="inline mr-2" />
              Pending Approvals
            </CardTitle>
            <Badge variant="warning">{pendingApprovals.length}</Badge>
          </CardHeader>

          <div className="divide-y divide-edge">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-foreground text-sm font-medium">{approval.title}</h4>
                    {approval.description && (
                      <p className="text-dim text-xs mt-0.5">{approval.description}</p>
                    )}
                  </div>
                  <Badge>{approval.category}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span>by {approval.requestedBy}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatRelativeTime(approval.requestedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleDecision(approval.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDecision(approval.id, 'rejected')}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDecision(approval.id, 'deferred')}
                    >
                      Defer
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Resolved */}
      {resolvedApprovals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resolved</CardTitle>
            <Badge variant="success">{resolvedApprovals.length}</Badge>
          </CardHeader>

          <div className="divide-y divide-edge">
            {resolvedApprovals.map((approval) => {
              const decision = decisions[approval.id] || approval.status;
              return (
                <div key={approval.id} className="py-3 first:pt-0 last:pb-0 opacity-60">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground text-sm">{approval.title}</span>
                    <Badge
                      variant={
                        decision === 'approved'
                          ? 'success'
                          : decision === 'rejected'
                          ? 'danger'
                          : 'default'
                      }
                    >
                      {decision}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
