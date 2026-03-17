import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 'Planifié' | 'En cours' | 'Terminé' | 'En Retard' | 'Non commencée' | 'En retard';

const statusConfig: Record<string, string> = {
  'Planifié': 'bg-info/10 text-info border-info/20',
  'En cours': 'bg-primary/10 text-primary border-primary/20',
  'Terminé': 'bg-success/10 text-success border-success/20',
  'Terminée': 'bg-success/10 text-success border-success/20',
  'En Retard': 'bg-destructive/10 text-destructive border-destructive/20',
  'En retard': 'bg-destructive/10 text-destructive border-destructive/20',
  'Non commencée': 'bg-muted text-muted-foreground border-border',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn('text-xs font-medium', statusConfig[status] || statusConfig['Planifié'])}>
      {status}
    </Badge>
  );
}

const priorityConfig = {
  Low: 'bg-muted text-muted-foreground',
  Medium: 'bg-warning/10 text-warning',
  High: 'bg-destructive/10 text-destructive',
};

export function PriorityBadge({ priority }: { priority: 'Low' | 'Medium' | 'High' }) {
  return (
    <Badge variant="outline" className={cn('text-xs font-medium', priorityConfig[priority])}>
      {priority}
    </Badge>
  );
}
