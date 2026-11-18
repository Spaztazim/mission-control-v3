'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, Puzzle } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { CronJobList } from '@/components/cron/CronJobList';
import { CronJobDetail } from '@/components/cron/CronJobDetail';
import { fetchApi } from '@/lib/utils';
import { mockCronJobs, mockSkills } from '@/lib/mock-data';
import type { CronJob, Skill } from '@/lib/types';

interface CronResponse {
  ok: boolean;
  data?: { jobs: CronJob[]; skills: Skill[] };
  error?: string;
}

export default function CronPage() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<CronJob | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchApi<CronResponse>('/api/cron');
      if (res.ok && res.data) {
        setJobs(res.data.jobs);
        setSkills(res.data.skills);
      } else {
        setJobs(mockCronJobs);
        setSkills(mockSkills);
      }
    } catch {
      setJobs(mockCronJobs);
      setSkills(mockSkills);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleToggleJob(id: string, enabled: boolean) {
    try {
      await fetchApi<{ ok: boolean }>('/api/cron', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled }),
      });
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, enabled } : j))
      );
      if (selectedJob?.id === id) {
        setSelectedJob((prev) => (prev ? { ...prev, enabled } : prev));
      }
    } catch {
      // Toggle failed silently — API may be unavailable
    }
  }

  function handleSelectJob(job: CronJob) {
    setSelectedJob(job);
    setDetailOpen(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-foreground text-xl font-bold tracking-wide flex items-center gap-2">
          <Clock size={22} className="text-primary" />
          Cron
        </h2>
        <p className="text-muted text-sm mt-1">Scheduled jobs and skill management</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Cron Jobs Section */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Cron Jobs</CardTitle>
                <Badge variant="default">{jobs.length} jobs</Badge>
              </CardHeader>
              {jobs.length === 0 ? (
                <EmptyState icon={Clock} title="No cron jobs" description="No scheduled jobs configured" />
              ) : (
                <CronJobList
                  jobs={jobs}
                  selectedJobId={selectedJob?.id ?? null}
                  onSelectJob={handleSelectJob}
                  onToggleJob={handleToggleJob}
                />
              )}
            </Card>
          </section>

          {/* Skills Section */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <Badge variant="default">{skills.length} skills</Badge>
              </CardHeader>
              {skills.length === 0 ? (
                <EmptyState icon={Puzzle} title="No skills" description="No skills registered" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-surface border border-edge rounded-lg p-4 transition-colors hover:border-primary/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-foreground font-medium text-sm">{skill.name}</span>
                        <Badge variant={skill.enabled ? 'success' : 'danger'}>
                          {skill.enabled ? 'Active' : 'Disabled'}
                        </Badge>
                      </div>
                      <p className="text-muted text-xs mb-2 line-clamp-2">{skill.description}</p>
                      <span className="text-dim text-xs font-mono">v{skill.version}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </section>
        </div>
      )}

      {/* Job Detail Modal */}
      <CronJobDetail
        job={selectedJob}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onToggle={handleToggleJob}
      />
    </div>
  );
}
