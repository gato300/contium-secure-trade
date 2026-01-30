import { ExternalLink, CheckCircle, Clock, XCircle, Fuel, Hash, Box } from 'lucide-react';
import { BlockchainTransaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BlockchainTxCardProps {
  transaction: BlockchainTransaction;
  className?: string;
  compact?: boolean;
}

const statusConfig = {
  pending: { icon: Clock, label: 'Pendiente', variant: 'warning' as const, color: 'text-warning' },
  confirmed: { icon: CheckCircle, label: 'Confirmado', variant: 'success' as const, color: 'text-success' },
  failed: { icon: XCircle, label: 'Fallido', variant: 'danger' as const, color: 'text-destructive' },
};

export function BlockchainTxCard({ transaction, className, compact = false }: BlockchainTxCardProps) {
  const status = statusConfig[transaction.status];
  const StatusIcon = status.icon;

  const truncateTxHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 p-2 rounded-lg bg-secondary/50", className)}>
        <StatusIcon className={cn("w-4 h-4 shrink-0", status.color)} />
        <code className="text-xs font-mono flex-1 truncate">{truncateTxHash(transaction.txHash)}</code>
        <a 
          href={transaction.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div className={cn("glass-card p-5", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Box className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Transacción Blockchain</h3>
            <p className="text-xs text-muted-foreground">Syscoin NEVM</p>
          </div>
        </div>
        <Badge variant={status.variant} className="flex items-center gap-1">
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </Badge>
      </div>

      <div className="space-y-3">
        {/* TX Hash */}
        <div className="p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-2 mb-1">
            <Hash className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">TX Hash</span>
          </div>
          <code className="text-xs font-mono break-all">{transaction.txHash}</code>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-secondary/50">
            <p className="text-xs text-muted-foreground mb-1">Bloque</p>
            <p className="font-mono font-semibold">{transaction.blockNumber.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-1 mb-1">
              <Fuel className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Gas</span>
            </div>
            <p className="font-mono font-semibold">{transaction.gasUsed.toLocaleString()}</p>
          </div>
        </div>

        {/* Gas cost */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
          <span className="text-sm">Costo de Gas</span>
          <span className="font-bold text-primary">${transaction.gasCost.toFixed(4)} USD</span>
        </div>

        {/* Explorer link */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.open(transaction.explorerUrl, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Ver en Syscoin Explorer
        </Button>
      </div>
    </div>
  );
}
