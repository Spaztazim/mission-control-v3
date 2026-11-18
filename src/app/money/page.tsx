'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DollarSign, Coins, Zap, Database, TrendingUp,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { UsageChart } from '@/components/money/UsageChart';
import { BudgetGauge } from '@/components/money/BudgetGauge';
import { useTheme } from '@/lib/theme';
import { fetchApi, formatCost, formatTokens } from '@/lib/utils';
import type { TokenUsage, UsageSummary } from '@/lib/types';
import { mockDailyUsage, mockUsageSummary } from '@/lib/mock-data';

interface UsageResponse {
  ok: boolean;
  data?: {
    daily?: TokenUsage[];
    summary?: UsageSummary;
  };
  error?: string;
}

interface ModelBreakdown {
  model: string;
  tokens: number;
  cost: number;
}

function StatCard({ icon: Icon, label, value, sub }: {
  icon: typeof DollarSign;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted text-xs uppercase tracking-wider mb-1">{label}</p>
          <p className="text-foreground text-xl font-bold font-mono">{value}</p>
          {sub && <p className="text-dim text-xs mt-1">{sub}</p>}
        </div>
        <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
          <Icon size={18} className="text-primary" />
        </div>
      </div>
    </Card>
  );
}

export default function MoneyPage() {
  const { theme } = useTheme();
  const [daily, setDaily] = useState<TokenUsage[]>([]);
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);


  const primaryColor = theme === 'nostalgia' ? '#f5a623' : '#00f5ff';
  const secondaryColor = theme === 'nostalgia' ? '#7bc67e' : '#ff0090';
  const accentColor = theme === 'nostalgia' ? '#e8d5a3' : '#ffaa00';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchApi<UsageResponse>('/api/usage');
      if (res.ok && res.data) {
        setDaily(res.data.daily || []);
        setSummary(res.data.summary || null);
      } else {
        setDaily(mockDailyUsage);
        setSummary(mockUsageSummary);
      }
    } catch {
      setDaily(mockDailyUsage);
      setSummary(mockUsageSummary);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Derive model breakdown from daily data
  const modelBreakdown: ModelBreakdown[] = (() => {
    const map = new Map<string, { tokens: number; cost: number }>();
    daily.forEach((d) => {
      const existing = map.get(d.model) || { tokens: 0, cost: 0 };
      existing.tokens += d.inputTokens + d.outputTokens;
      existing.cost += d.cost;
      map.set(d.model, existing);
    });
    return Array.from(map.entries())
      .map(([model, vals]) => ({ model, ...vals }))
      .sort((a, b) => b.cost - a.cost);
  })();

  // Derive cache stats
  const cacheStats = (() => {
    const totalHits = daily.reduce((s, d) => s + d.cacheHits, 0);
    const totalTokens = daily.reduce((s, d) => s + d.inputTokens + d.outputTokens, 0);
    const ratio = totalTokens > 0 ? (totalHits / totalTokens) * 100 : 0;
    return { totalHits, ratio };
  })();

  // Cost projection (simple linear extrapolation)
  const projection = (() => {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const monthlySpend = summary?.monthlySpend || 0;
    const projected = dayOfMonth > 0 ? (monthlySpend / dayOfMonth) * daysInMonth : 0;
    return projected;
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <DollarSign size={24} className="text-primary" />
        <div>
          <h2 className="text-foreground text-xl font-bold">Money</h2>
          <p className="text-muted text-sm">Token economics and cost tracking</p>
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={DollarSign}
            label="Today's Spend"
            value={formatCost(summary?.todaySpend || 0)}
          />
          <StatCard
            icon={Coins}
            label="Monthly Spend"
            value={formatCost(summary?.monthlySpend || 0)}
            sub={`Budget: ${formatCost(summary?.monthlyBudget || 5000)}`}
          />
          <StatCard
            icon={Zap}
            label="Tokens Today"
            value={formatTokens(summary?.totalTokensToday || 0)}
          />
          <StatCard
            icon={Database}
            label="Cache Hit Ratio"
            value={`${(summary?.cacheHitRatio || cacheStats.ratio).toFixed(1)}%`}
            sub={`${formatTokens(cacheStats.totalHits)} cached tokens`}
          />
        </div>
      )}

      {/* Usage Chart */}
      <UsageChart data={daily} loading={loading} />

      {/* Model Breakdown + Budget Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                Model Breakdown
              </span>
            </CardTitle>
          </CardHeader>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 bg-highlight rounded animate-pulse" />
              ))}
            </div>
          ) : modelBreakdown.length === 0 ? (
            <EmptyState icon={TrendingUp} title="No model data" description="Usage data will appear here once available" />
          ) : (
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelBreakdown} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <XAxis
                    type="number"
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => formatTokens(v)}
                  />
                  <YAxis
                    type="category"
                    dataKey="model"
                    tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                      fontSize: 12,
                      color: 'var(--text)',
                    }}
                    formatter={(value: number) => [formatTokens(value), 'Tokens']}
                  />
                  <Bar dataKey="tokens" fill={primaryColor} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <BudgetGauge
          spent={summary?.monthlySpend || 0}
          budget={summary?.monthlyBudget || 5000}
        />
      </div>

      {/* Cache Stats + Cost Projection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex items-center gap-2">
                <Database size={16} className="text-primary" />
                Cache Stats
              </span>
            </CardTitle>
          </CardHeader>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-5 bg-highlight rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <div style={{ width: 120, height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Hits', value: cacheStats.ratio },
                        { name: 'Misses', value: 100 - cacheStats.ratio },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      <Cell fill={primaryColor} />
                      <Cell fill="var(--bg-hover)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-muted text-xs uppercase tracking-wider">Hit Ratio</p>
                  <p className="text-foreground text-lg font-bold font-mono">{cacheStats.ratio.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-muted text-xs uppercase tracking-wider">Cached Tokens</p>
                  <p className="text-dim text-sm font-mono">{formatTokens(cacheStats.totalHits)}</p>
                </div>
                <div>
                  <p className="text-muted text-xs uppercase tracking-wider">Est. Savings</p>
                  <p className="text-success text-sm font-mono">
                    {formatCost(Math.round(cacheStats.totalHits * 0.001))}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                Cost Projection
              </span>
            </CardTitle>
          </CardHeader>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-5 bg-highlight rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-muted text-xs uppercase tracking-wider mb-1">Projected Monthly</p>
                <p className="text-foreground text-2xl font-bold font-mono">{formatCost(Math.round(projection))}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted text-xs uppercase tracking-wider mb-1">Current</p>
                  <p className="text-dim text-sm font-mono">{formatCost(summary?.monthlySpend || 0)}</p>
                </div>
                <div>
                  <p className="text-muted text-xs uppercase tracking-wider mb-1">Budget</p>
                  <p className="text-dim text-sm font-mono">{formatCost(summary?.monthlyBudget || 5000)}</p>
                </div>
              </div>
              {projection > (summary?.monthlyBudget || 5000) && (
                <div className="bg-danger/10 border border-danger/30 rounded-lg p-3 text-danger text-xs">
                  ⚠ Projected spend exceeds monthly budget by{' '}
                  <span className="font-mono font-bold">
                    {formatCost(Math.round(projection - (summary?.monthlyBudget || 5000)))}
                  </span>
                </div>
              )}
              {projection <= (summary?.monthlyBudget || 5000) && (
                <div className="bg-success/10 border border-success/30 rounded-lg p-3 text-success text-xs">
                  ✓ On track — projected to stay{' '}
                  <span className="font-mono font-bold">
                    {formatCost(Math.round((summary?.monthlyBudget || 5000) - projection))}
                  </span>{' '}
                  under budget
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
