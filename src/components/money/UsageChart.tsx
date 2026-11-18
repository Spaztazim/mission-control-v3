'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTheme } from '@/lib/theme';
import { TrendingUp } from 'lucide-react';
import type { TokenUsage } from '@/lib/types';
import { formatTokens } from '@/lib/utils';

interface UsageChartProps {
  data: TokenUsage[];
  loading: boolean;
}

export function UsageChart({ data, loading }: UsageChartProps) {
  const { theme } = useTheme();

  const inputColor = theme === 'nostalgia' ? '#f5a623' : '#00f5ff';
  const outputColor = theme === 'nostalgia' ? '#7bc67e' : '#ff0090';

  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    input: d.inputTokens,
    output: d.outputTokens,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            Token Usage (30 Days)
          </span>
        </CardTitle>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded" style={{ background: inputColor }} />
            <span className="text-dim">Input</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded" style={{ background: outputColor }} />
            <span className="text-dim">Output</span>
          </span>
        </div>
      </CardHeader>
      {loading ? (
        <Skeleton lines={6} className="h-8" />
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="date"
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border-color)' }}
              />
              <YAxis
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => formatTokens(v)}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: 'var(--text)',
                }}
                formatter={(value: number, name: string) => [
                  formatTokens(value),
                  name === 'input' ? 'Input Tokens' : 'Output Tokens',
                ]}
              />
              <Line
                type="monotone"
                dataKey="input"
                stroke={inputColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: inputColor }}
              />
              <Line
                type="monotone"
                dataKey="output"
                stroke={outputColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: outputColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
