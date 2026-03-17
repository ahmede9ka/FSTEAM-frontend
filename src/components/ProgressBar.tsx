import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  className?: string;
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, className, size = 'sm' }: ProgressBarProps) {
  const color = value >= 100 ? 'bg-success' : value >= 50 ? 'bg-primary' : value >= 25 ? 'bg-warning' : 'bg-destructive';
  return (
    <div className={cn('w-full bg-muted rounded-full overflow-hidden', size === 'sm' ? 'h-2' : 'h-3', className)}>
      <div className={cn('h-full rounded-full transition-all duration-500', color)} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}
