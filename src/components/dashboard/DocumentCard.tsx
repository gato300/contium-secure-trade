import { FileText, Clock, User, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Document } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { truncateHash } from '@/lib/hashUtils';
import { getRiskLabel } from '@/lib/aiAnalysis';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DocumentCardProps {
  document: Document;
  onClick?: () => void;
}

const typeLabels = {
  factura_comercial: 'Factura Comercial',
  packing_list: 'Packing List',
  dam: 'DAM',
};

const statusConfig = {
  registrado: { label: 'Registrado', variant: 'ghost' as const, icon: Clock },
  validado: { label: 'Validado', variant: 'success' as const, icon: CheckCircle },
  observado: { label: 'Observado', variant: 'danger' as const, icon: AlertCircle },
};

const riskConfig = {
  LOW: { variant: 'success' as const, icon: CheckCircle },
  MEDIUM: { variant: 'warning' as const, icon: AlertTriangle },
  HIGH: { variant: 'danger' as const, icon: AlertTriangle },
};

export function DocumentCard({ document, onClick }: DocumentCardProps) {
  const status = statusConfig[document.status];
  const risk = riskConfig[document.riskIndicator];
  const StatusIcon = status.icon;
  const RiskIcon = risk.icon;

  return (
    <div 
      className="glass-card p-5 hover:border-primary/30 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{document.title}</h3>
            <p className="text-xs text-muted-foreground">{typeLabels[document.type]}</p>
          </div>
        </div>
        
        <Badge variant={status.variant} className="flex items-center gap-1">
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </Badge>
      </div>

      {/* Hash */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-1">Hash SHA-256</p>
        <code className="hash-display text-xs block truncate">
          {truncateHash(document.hash, 32)}
        </code>
      </div>

      {/* Risk indicator */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Badge variant={risk.variant} className="flex items-center gap-1">
            <RiskIcon className="w-3 h-3" />
            {getRiskLabel(document.riskIndicator)}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {format(new Date(document.updatedAt), 'dd MMM yyyy', { locale: es })}
        </div>
      </div>

      {/* Version indicator */}
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span>v{document.currentVersion}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {document.registeredBy.name}
        </span>
      </div>
    </div>
  );
}
