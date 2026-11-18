'use client';

import { useState } from 'react';
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MemoryFile } from '@/lib/types';

interface FileBrowserProps {
  files: MemoryFile[];
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
}

function FileTreeItem({
  file,
  depth,
  selectedPath,
  onSelectFile,
}: {
  file: MemoryFile;
  depth: number;
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 1);
  const isDir = file.type === 'directory';
  const isSelected = file.path === selectedPath;

  function handleClick() {
    if (isDir) {
      setExpanded((prev) => !prev);
    } else {
      onSelectFile(file.path);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer',
          isSelected
            ? 'bg-primary/15 text-primary'
            : 'text-dim hover:text-foreground hover:bg-highlight/50'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isDir ? (
          <>
            {expanded ? (
              <ChevronDown size={14} className="shrink-0 text-muted" />
            ) : (
              <ChevronRight size={14} className="shrink-0 text-muted" />
            )}
            {expanded ? (
              <FolderOpen size={16} className="shrink-0 text-accent" />
            ) : (
              <Folder size={16} className="shrink-0 text-accent" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5 shrink-0" />
            <FileText size={16} className="shrink-0 text-muted" />
          </>
        )}
        <span className="truncate">{file.name}</span>
      </button>

      {isDir && expanded && file.children && file.children.length > 0 && (
        <div>
          {file.children.map((child) => (
            <FileTreeItem
              key={child.path}
              file={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileBrowser({ files, selectedPath, onSelectFile }: FileBrowserProps) {
  return (
    <div className="space-y-0.5">
      {files.map((file) => (
        <FileTreeItem
          key={file.path}
          file={file}
          depth={0}
          selectedPath={selectedPath}
          onSelectFile={onSelectFile}
        />
      ))}
    </div>
  );
}
