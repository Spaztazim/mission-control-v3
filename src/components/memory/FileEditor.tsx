'use client';

import { useState, useEffect } from 'react';
import { Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorBox } from '@/components/ui/ErrorBox';
import { fetchApi } from '@/lib/utils';
import { mockFileContents } from '@/lib/mock-data';

interface FileEditorProps {
  filePath: string | null;
}

interface FileData {
  type: 'file';
  content: string;
  path: string;
}

export function FileEditor({ filePath }: FileEditorProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!filePath) return;

    async function loadFile() {
      setLoading(true);
      setError(null);
      setDirty(false);
      try {
        const res = await fetchApi<{ ok: boolean; data: FileData; error?: string }>(
          `/api/files?path=${encodeURIComponent(filePath!)}`
        );
        if (res.ok && res.data) {
          setContent(res.data.content);
        } else {
          const mock = mockFileContents[filePath!];
          setContent(mock ?? `# ${filePath!.split('/').pop()}\n\n(Mock data — file not available)`);
        }
      } catch {
        const mock = mockFileContents[filePath!];
        setContent(mock ?? `# ${filePath!.split('/').pop()}\n\n(Mock data — file not available)`);
      } finally {
        setLoading(false);
      }
    }

    loadFile();
  }, [filePath]);

  async function handleSave() {
    if (!filePath) return;
    setSaving(true);
    try {
      await fetchApi<{ ok: boolean }>(`/api/files?path=${encodeURIComponent(filePath)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      setDirty(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save file');
    } finally {
      setSaving(false);
    }
  }

  if (!filePath) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState icon={FileText} title="Select a file" description="Choose a file from the browser to view and edit its contents" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton lines={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorBox message={error} onRetry={() => setError(null)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-edge">
        <div className="flex items-center gap-2 text-sm">
          <FileText size={16} className="text-muted" />
          <span className="text-dim font-mono text-xs">{filePath}</span>
          {dirty && <span className="text-warning text-xs">(unsaved)</span>}
        </div>
        <Button variant="primary" size="sm" onClick={handleSave} disabled={saving || !dirty}>
          <Save size={14} />
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setDirty(true);
        }}
        className="flex-1 w-full bg-surface text-foreground font-mono text-sm p-4 resize-none outline-none border-none"
        spellCheck={false}
      />
    </div>
  );
}
