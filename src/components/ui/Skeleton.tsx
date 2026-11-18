import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn('h-4 bg-highlight rounded', i === lines - 1 && lines > 1 && 'w-3/4', className)}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-card border border-edge rounded-lg p-5 animate-pulse">
      <div className="h-4 bg-highlight rounded w-1/3 mb-4" />
      <div className="space-y-2">
        <div className="h-3 bg-highlight rounded" />
        <div className="h-3 bg-highlight rounded w-5/6" />
        <div className="h-3 bg-highlight rounded w-2/3" />
      </div>
    </div>
  );
}
