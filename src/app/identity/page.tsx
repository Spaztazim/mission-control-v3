'use client';

import { useState, useEffect, useCallback } from 'react';
import { Fingerprint, Save, FileText, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { fetchApi } from '@/lib/utils';
import { mockFileContents, mockConfig } from '@/lib/mock-data';

interface FileResponse {
  ok: boolean;
  data?: { type: string; content: string; path: string };
  error?: string;
}

interface ConfigResponse {
  ok: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

function FileEditor({ label, path, icon: Icon }: { label: string; path: string; icon: typeof FileText }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi<FileResponse>(`/api/files?path=${encodeURIComponent(path)}`);
      if (res.ok && res.data) {
        setContent(res.data.content);
      } else {
        const fallback = mockFileContents[path];
        if (fallback) {
          setContent(fallback);
        } else {
          setError(res.error || 'Failed to load file');
        }
      }
    } catch {
      const fallback = mockFileContents[path];
      if (fallback) {
        setContent(fallback);
      } else {
        setError('Failed to load file');
      }
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetchApi<{ ok: boolean; error?: string }>(`/api/files?path=${encodeURIComponent(path)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setError(res.error || 'Failed to save');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <Icon size={16} className="text-primary" />
            {label}
          </span>
        </CardTitle>
        <Button
          variant={saved ? 'outline' : 'primary'}
          size="sm"
          onClick={save}
          disabled={saving || loading}
        >
          <Save size={14} />
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
        </Button>
      </CardHeader>
      {loading ? (
        <Skeleton lines={8} className="h-6" />
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[300px] bg-surface text-foreground border border-edge rounded-lg p-4 font-mono text-sm resize-y focus:outline-none focus:border-primary/50 transition-colors"
          spellCheck={false}
        />
      )}
    </Card>
  );
}

export default function IdentityPage() {
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [configLoading, setConfigLoading] = useState(true);


  const loadConfig = useCallback(async () => {
    setConfigLoading(true);
    try {
      const res = await fetchApi<ConfigResponse>('/api/config');
      if (res.ok && res.data) {
        setConfig(res.data);
      } else {
        setConfig(mockConfig);
      }
    } catch {
      setConfig(mockConfig);
    } finally {
      setConfigLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Fingerprint size={24} className="text-primary" />
        <div>
          <h2 className="text-foreground text-xl font-bold">Identity</h2>
          <p className="text-muted text-sm">Agent soul, directives, and configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FileEditor label="SOUL.md" path="SOUL.md" icon={FileText} />
        <FileEditor label="AGENTS.md" path="AGENTS.md" icon={FileText} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex items-center gap-2">
              <Settings size={16} className="text-primary" />
              OpenClaw Config
            </span>
          </CardTitle>
        </CardHeader>
        {configLoading ? (
          <Skeleton lines={10} className="h-5" />
        ) : (
          <pre className="bg-surface border border-edge rounded-lg p-4 text-sm font-mono text-dim overflow-x-auto max-h-[500px] overflow-y-auto">
            <code>{JSON.stringify(config, null, 2)}</code>
          </pre>
        )}
      </Card>
    </div>
  );
}
