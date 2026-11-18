'use client';

import { useState, useEffect, useCallback } from 'react';
import { Brain, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { FileBrowser } from '@/components/memory/FileBrowser';
import { FileEditor } from '@/components/memory/FileEditor';
import { fetchApi } from '@/lib/utils';
import { mockMemoryFiles } from '@/lib/mock-data';
import type { MemoryFile } from '@/lib/types';

interface FilesResponse {
  ok: boolean;
  data?: { type: 'directory'; files: MemoryFile[] };
  error?: string;
}

export default function MemoryPage() {
  const [files, setFiles] = useState<MemoryFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchApi<FilesResponse>('/api/files?path=');
      if (res.ok && res.data) {
        setFiles(res.data.files);
      } else {
        setFiles(mockMemoryFiles);
      }
    } catch {
      setFiles(mockMemoryFiles);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  function filterFiles(items: MemoryFile[], query: string): MemoryFile[] {
    if (!query) return items;
    const lower = query.toLowerCase();
    return items.reduce<MemoryFile[]>((acc, file) => {
      if (file.name.toLowerCase().includes(lower)) {
        acc.push(file);
      } else if (file.type === 'directory' && file.children) {
        const filtered = filterFiles(file.children, query);
        if (filtered.length > 0) {
          acc.push({ ...file, children: filtered });
        }
      }
      return acc;
    }, []);
  }

  const filteredFiles = filterFiles(files, search);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-foreground text-xl font-bold tracking-wide flex items-center gap-2">
          <Brain size={22} className="text-primary" />
          Memory
        </h2>
        <p className="text-muted text-sm mt-1">Browse and edit agent memory files</p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-200px)] min-h-[500px]">
        {/* File Browser - Left Panel */}
        <Card className="w-1/3 flex flex-col overflow-hidden" padding={false}>
          <CardHeader className="px-4 pt-4 pb-0 shrink-0">
            <CardTitle>Files</CardTitle>
          </CardHeader>
          <div className="px-4 py-3 shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files…"
                className="w-full bg-surface border border-edge rounded-md pl-8 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-4">
            {loading ? (
              <div className="px-2 space-y-2">
                <Skeleton lines={6} />
              </div>
            ) : filteredFiles.length === 0 ? (
              <EmptyState icon={Brain} title="No files found" description={search ? 'Try a different search term' : 'No memory files available'} />
            ) : (
              <FileBrowser files={filteredFiles} selectedPath={selectedFile} onSelectFile={setSelectedFile} />
            )}
          </div>
        </Card>

        {/* File Editor - Right Panel */}
        <Card className="w-2/3 overflow-hidden" padding={false}>
          <FileEditor filePath={selectedFile} />
        </Card>
      </div>
    </div>
  );
}
