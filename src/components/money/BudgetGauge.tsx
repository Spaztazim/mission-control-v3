'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Gauge } from 'lucide-react';
import { formatCost } from '@/lib/utils';

interface BudgetGaugeProps {
  spent: number;
  budget: number;
}

export function BudgetGauge({ spent, budget }: BudgetGaugeProps) {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  const getColor = (pct: number): string => {
    if (pct >= 90) return 'bg-danger';
    if (pct >= 70) return 'bg-warning';
    return 'bg-success';
  };

  const getTextColor = (pct: number): string => {
    if (pct >= 90) return 'text-danger';
    if (pct >= 70) return 'text-warning';
    return 'text-success';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <Gauge size={16} className="text-primary" />
            Monthly Budget
          </span>
        </CardTitle>
        <span className={`text-sm font-mono font-bold ${getTextColor(percentage)}`}>
          {percentage.toFixed(1)}%
        </span>
      </CardHeader>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-dim">Spent</span>
          <span className="text-foreground font-mono">{formatCost(spent)}</span>
        </div>

        <div className="w-full h-3 bg-surface rounded-full border border-edge overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getColor(percentage)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-dim">Budget</span>
          <span className="text-foreground font-mono">{formatCost(budget)}</span>
        </div>

        <div className="flex justify-between text-xs text-muted pt-1 border-t border-edge">
          <span>Remaining</span>
          <span className="font-mono">{formatCost(Math.max(budget - spent, 0))}</span>
        </div>
      </div>
    </Card>
  );
}
