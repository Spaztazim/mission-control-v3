'use client';

import { useState, useCallback } from 'react';
import { Rocket } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/utils';

interface SpawnPanelProps {
  open: boolean;
  onClose: () => void;
  onSpawned: () => void;
}

const MODELS = [
  'claude-sonnet-4-20250514',
  'claude-opus-4-20250514',
  'gpt-4o',
  'gpt-4o-mini',
  'gemini-2.0-flash',
];

export function SpawnPanel({ open, onClose, onSpawned }: SpawnPanelProps) {
  const [task, setTask] = useState('');
  const [model, setModel] = useState(MODELS[0]);
  const [label, setLabel] = useState('');
  const [spawning, setSpawning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSpawn = useCallback(async () => {
    if (!task.trim()) return;
    setSpawning(true);
    setError(null);
    try {
      await fetchApi<{ ok: boolean }>('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'spawn', task, model, label: label || undefined }),
      });
      setTask('');
      setLabel('');
      onSpawned();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to spawn session');
    } finally {
      setSpawning(false);
    }
  }, [task, model, label, onSpawned, onClose]);

  return (
    <Modal open={open} onClose={onClose} title="Spawn Moth">
      <div className="space-y-4">
        {/* Task */}
        <div>
          <label className="block text-muted text-xs mb-1.5">Task / Prompt</label>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Describe what this moth should do…"
            rows={3}
            className="w-full bg-surface border border-edge rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-muted text-xs mb-1.5">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-surface border border-edge rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
          >
            {MODELS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Label */}
        <div>
          <label className="block text-muted text-xs mb-1.5">Label (optional)</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. research-agent, code-reviewer"
            className="w-full bg-surface border border-edge rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-danger text-xs">{error}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSpawn}
            disabled={!task.trim() || spawning}
          >
            <Rocket size={14} />
            {spawning ? 'Spawning…' : 'Spawn'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
