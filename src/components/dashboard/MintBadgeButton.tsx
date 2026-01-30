import { useState } from 'react';
import { Award, Loader2, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { NFTBadge, Document } from '@/lib/types';
import { generateTxHash, SYSCOIN_EXPLORER_URL } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface MintBadgeButtonProps {
  document: Document;
  onMint: (badge: NFTBadge) => void;
  disabled?: boolean;
  className?: string;
}

export function MintBadgeButton({ document, onMint, disabled, className }: MintBadgeButtonProps) {
  const [isMinting, setIsMinting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mintedBadge, setMintedBadge] = useState<NFTBadge | null>(null);

  const handleMint = async () => {
    setIsMinting(true);
    
    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    const txHash = generateTxHash();
    const newBadge: NFTBadge = {
      id: `nft-${Date.now()}`,
      type: 'compliance',
      name: `Compliance Badge #${document.title.split('#')[1] || document.id}`,
      description: 'NFT de cumplimiento emitido por verificación exitosa en Contium',
      txHash,
      mintedAt: new Date(),
      documentId: document.id,
    };

    setMintedBadge(newBadge);
    setIsMinting(false);
    setShowSuccess(true);
    onMint(newBadge);
  };

  return (
    <>
      <Button
        variant="hero"
        onClick={handleMint}
        disabled={disabled || isMinting || document.nftBadge !== undefined}
        className={cn("relative overflow-hidden", className)}
      >
        {isMinting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Emitiendo NFT...
          </>
        ) : document.nftBadge ? (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            NFT Emitido
          </>
        ) : (
          <>
            <Award className="w-5 h-5 mr-2" />
            Mint Badge
            <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
          </>
        )}
      </Button>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              ¡NFT Emitido Exitosamente!
            </DialogTitle>
            <DialogDescription>
              Tu Compliance Badge ha sido registrado en la blockchain de Syscoin NEVM
            </DialogDescription>
          </DialogHeader>

          {mintedBadge && (
            <div className="space-y-4 pt-4">
              {/* Badge visual */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30 animate-scale-in">
                    <Award className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-success flex items-center justify-center animate-bounce">
                    <CheckCircle className="w-5 h-5 text-success-foreground" />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-bold text-lg">{mintedBadge.name}</h3>
                <p className="text-sm text-muted-foreground">{mintedBadge.description}</p>
              </div>

              {/* TX Hash */}
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">TX Hash</p>
                <code className="text-xs font-mono break-all">{mintedBadge.txHash}</code>
              </div>

              {/* Explorer link */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open(`${SYSCOIN_EXPLORER_URL}${mintedBadge.txHash}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver en Syscoin Explorer
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
