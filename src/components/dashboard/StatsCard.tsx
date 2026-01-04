import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  default: 'bg-secondary/50',
  primary: 'bg-primary/10',
  success: 'bg-success/10',
  warning: 'bg-warning/10',
  danger: 'bg-destructive/10',
};

const iconStyles = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
};

export function StatsCard({ title, value, icon: Icon, trend, variant = 'default' }: StatsCardProps) {
  return (
    <div className="glass-card p-6 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs mt-2 flex items-center gap-1",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              <span className="text-muted-foreground ml-1">vs. mes anterior</span>
            </p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          variantStyles[variant]
        )}>
          <Icon className={cn("w-6 h-6", iconStyles[variant])} />
        </div>
      </div>
    </div>
  );
}
