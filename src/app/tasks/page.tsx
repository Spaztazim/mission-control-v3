'use client';

import { useState, useEffect, useCallback } from 'react';
import { ListChecks, Layers, ShieldCheck } from 'lucide-react';
import { fetchApi, cn } from '@/lib/utils';
import { mockTasks, mockApprovals } from '@/lib/mock-data';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { PipelineBoard } from '@/components/tasks/PipelineBoard';
import { ApprovalsPanel } from '@/components/tasks/ApprovalsPanel';
import type { Task, Approval } from '@/lib/types';

type Tab = 'pipeline' | 'approvals';

interface TasksResponse {
  ok: boolean;
  data?: { tasks: Task[]; approvals: Approval[] };
  error?: string;
}

export default function TasksPage() {
  const [tab, setTab] = useState<Tab>('pipeline');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetchApi<TasksResponse>('/api/tasks');
      if (res.ok && res.data) {
        setTasks(res.data.tasks as Task[]);
        setApprovals(res.data.approvals as Approval[]);
      } else {
        setTasks(mockTasks);
        setApprovals(mockApprovals);
      }
    } catch {
      setTasks(mockTasks);
      setApprovals(mockApprovals);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tabs: { key: Tab; label: string; icon: typeof Layers }[] = [
    { key: 'pipeline', label: 'Pipeline', icon: Layers },
    { key: 'approvals', label: 'Approvals', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-foreground text-xl font-bold flex items-center gap-2">
          <ListChecks size={22} className="text-primary" />
          Tasks
        </h2>
        <p className="text-muted text-sm mt-1">Pipeline board and approval queue</p>
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {tab === 'pipeline' && <PipelineBoard tasks={tasks} />}
          {tab === 'approvals' && <ApprovalsPanel approvals={approvals} />}
        </>
      )}
    </div>
  );
}
