'use client';

import { DollarSign, TrendingUp, Database, Gauge } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCost } from '@/lib/utils';
import type { UsageSummary } from '@/lib/types';

interface TokenBurnProps {
  usage: UsageSummary | null;
  loading: boolean;
}

export function TokenBurn({ usage, loading }: TokenBurnProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-28" />
        </CardHeader>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-6 w-full rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Card>
    );
  }

  const todaySpend = usage?.todaySpend ?? 0;
  const monthlySpend = usage?.monthlySpend ?? 0;
  const monthlyBudget = usage?.monthlyBudget ?? 5000;
  const cacheHitRatio = usage?.cacheHitRatio ?? 0;
  const budgetPercent = monthlyBudget > 0 ? Math.min((monthlySpend / monthlyBudget) * 100, 100) : 0;

  const budgetBarColor =
    budgetPercent >= 90 ? 'bg-danger' :
    budgetPercent >= 70 ? 'bg-warning' :
    'bg-primary';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Burn</CardTitle>
      </CardHeader>

      <div className="space-y-5">
        {/* Today's spend */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <DollarSign size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-muted text-xs uppercase tracking-wide">Today</p>
            <p className="text-foreground font-semibold">{formatCost(todaySpend)}</p>
          </div>
        </div>

        {/* Monthly spend */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-muted text-xs uppercase tracking-wide">This Month</p>
            <p className="text-foreground font-semibold">{formatCost(monthlySpend)}</p>
          </div>
        </div>

        {/* Budget gauge */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gauge size={14} className="text-muted" />
              <span className="text-muted text-xs uppercase tracking-wide">Budget</span>
            </div>
            <span className="text-dim text-xs">
              {formatCost(monthlySpend)} / {formatCost(monthlyBudget)}
            </span>
          </div>
          <div className="h-2 bg-highlight rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${budgetBarColor}`}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
          <p className="text-muted text-xs mt-1">{budgetPercent.toFixed(0)}% used</p>
        </div>

        {/* Cache hit ratio */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/10">
            <Database size={16} className="text-success" />
          </div>
          <div>
            <p className="text-muted text-xs uppercase tracking-wide">Cache Hit Ratio</p>
            <p className="text-foreground font-semibold">{(cacheHitRatio * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
