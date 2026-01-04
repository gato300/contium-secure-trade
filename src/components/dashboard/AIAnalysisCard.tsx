import { Brain, AlertTriangle, CheckCircle, AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { AIAnalysis } from '@/lib/types';
import { getRiskLabel, getRiskBgColor } from '@/lib/aiAnalysis';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AIAnalysisCardProps {
  analysis: AIAnalysis;
}

const riskIcons = {
  LOW: CheckCircle,
  MEDIUM: AlertCircle,
  HIGH: AlertTriangle,
};

const riskVariants = {
  LOW: 'success' as const,
  MEDIUM: 'warning' as const,
  HIGH: 'danger' as const,
};

export function AIAnalysisCard({ analysis }: AIAnalysisCardProps) {
  const RiskIcon = riskIcons[analysis.riskLevel];
  const isNegativeDeviation = analysis.deviationPercent < 0;

  return (
    <div className={cn(
      "glass-card p-5 border-2",
      getRiskBgColor(analysis.riskLevel)
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Análisis IA</h3>
            <p className="text-xs text-muted-foreground">Agente de detección automática</p>
          </div>
        </div>
        <Badge variant={riskVariants[analysis.riskLevel]} className="flex items-center gap-1">
          <RiskIcon className="w-3 h-3" />
          {getRiskLabel(analysis.riskLevel)}
        </Badge>
      </div>

      {/* Deviation indicator */}
      <div className="flex items-center gap-4 mb-4 p-4 rounded-lg bg-background/50">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          isNegativeDeviation ? "bg-destructive/20" : "bg-success/20"
        )}>
          {isNegativeDeviation ? (
            <TrendingDown className="w-6 h-6 text-destructive" />
          ) : (
            <TrendingUp className="w-6 h-6 text-success" />
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Desviación del mercado</p>
          <p className={cn(
            "text-2xl font-bold",
            isNegativeDeviation ? "text-destructive" : "text-success"
          )}>
            {analysis.deviationPercent > 0 ? '+' : ''}{analysis.deviationPercent.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="rounded-lg bg-background/50 p-4">
        <p className="text-sm text-muted-foreground mb-2">Explicación:</p>
        <p className="text-sm">{analysis.explanation}</p>
      </div>

      {/* Timestamp */}
      <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground flex items-center justify-between">
        <span>Análisis realizado automáticamente</span>
        <span>{format(new Date(analysis.analyzedAt), 'dd MMM yyyy, HH:mm', { locale: es })}</span>
      </div>
    </div>
  );
}
