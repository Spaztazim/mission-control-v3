'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorBoxProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBox({ message, onRetry }: ErrorBoxProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertTriangle size={40} className="text-danger mb-3" />
      <h3 className="text-foreground font-medium mb-1">Connection Error</h3>
      <p className="text-muted text-sm max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw size={14} />
          Retry
        </Button>
      )}
    </div>
  );
}
