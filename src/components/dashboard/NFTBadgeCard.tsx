import { Award, ExternalLink, Sparkles, CheckCircle } from 'lucide-react';
import { NFTBadge } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SYSCOIN_EXPLORER_URL } from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface NFTBadgeCardProps {
  badge: NFTBadge;
  className?: string;
}

const typeConfig = {
  compliance: { label: 'Compliance Badge', color: 'bg-success/20 text-success' },
  verification: { label: 'Verification Badge', color: 'bg-primary/20 text-primary' },
  registration: { label: 'Registration Badge', color: 'bg-warning/20 text-warning' },
};

export function NFTBadgeCard({ badge, className }: NFTBadgeCardProps) {
  const config = typeConfig[badge.type];
  const explorerUrl = `${SYSCOIN_EXPLORER_URL}${badge.txHash}`;

  return (
    <div className={cn(
      "glass-card p-5 relative overflow-hidden",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:pointer-events-none",
      className
    )}>
      {/* NFT Icon with glow effect */}
      <div className="flex items-start justify-between mb-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Award className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-success-foreground" />
          </div>
        </div>
        <Badge className={config.color}>
          <Sparkles className="w-3 h-3 mr-1" />
          NFT ERC-721
        </Badge>
      </div>

      {/* Badge info */}
      <h3 className="font-bold text-lg mb-1">{badge.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{badge.description}</p>

      {/* Type badge */}
      <Badge variant="ghost" className="mb-4">
        {config.label}
      </Badge>

      {/* TX Hash */}
      <div className="p-3 rounded-lg bg-secondary/50 mb-3">
        <p className="text-xs text-muted-foreground mb-1">TX Hash (Mint)</p>
        <code className="text-xs font-mono break-all">{badge.txHash}</code>
      </div>

      {/* Minted date */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>Emitido:</span>
        <span>{format(new Date(badge.mintedAt), 'dd MMM yyyy, HH:mm', { locale: es })}</span>
      </div>

      {/* Explorer link */}
      <Button 
        variant="outline" 
        size="sm"
        className="w-full"
        onClick={() => window.open(explorerUrl, '_blank')}
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Ver en Blockchain
      </Button>
    </div>
  );
}
