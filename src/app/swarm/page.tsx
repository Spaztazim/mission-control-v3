'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bug, Plus } from 'lucide-react';
import { fetchApi } from '@/lib/utils';
import { mockSessions } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { SessionList } from '@/components/swarm/SessionList';
import { SessionDetail } from '@/components/swarm/SessionDetail';
import { SpawnPanel } from '@/components/swarm/SpawnPanel';
import type { AgentSession } from '@/lib/types';

interface SessionsResponse {
  ok: boolean;
  data?: AgentSession[];
  error?: string;
}

export default function SwarmPage() {
  const [sessions, setSessions] = useState<AgentSession[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [spawnOpen, setSpawnOpen] = useState(false);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetchApi<SessionsResponse>('/api/sessions');
      if (res.ok && res.data) {
        setSessions(res.data);
      } else {
        setSessions(mockSessions);
      }
    } catch {
      setSessions(mockSessions);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const selectedSession = sessions.find((s) => s.id === selectedId) ?? null;

  const handleKill = useCallback((sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setSelectedId(null);
  }, []);

  const handleSpawned = useCallback(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-xl font-bold flex items-center gap-2">
            <Bug size={22} className="text-primary" />
            Swarm
          </h2>
          <p className="text-muted text-sm mt-1">Monitor and control agent sessions</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setSpawnOpen(true)}>
          <Plus size={16} />
          Spawn Moth
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {/* Empty */}
      {!loading && sessions.length === 0 && (
        <EmptyState
          icon={Bug}
          title="No active sessions"
          description="Spawn a new moth to get started. Sessions will appear here once running."
        />
      )}

      {/* Content */}
      {!loading && sessions.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <SessionList
            sessions={sessions}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          {selectedSession ? (
            <SessionDetail session={selectedSession} onKill={handleKill} />
          ) : (
            <div className="flex items-center justify-center min-h-[300px] bg-card border border-edge rounded-lg">
              <p className="text-muted text-sm">Select a session to view details</p>
            </div>
          )}
        </div>
      )}

      {/* Spawn Modal */}
      <SpawnPanel
        open={spawnOpen}
        onClose={() => setSpawnOpen(false)}
        onSpawned={handleSpawned}
      />
    </div>
  );
}
