import { Fuel, DollarSign, Zap } from 'lucide-react';

interface GasInfoCardProps {
  gasUsed?: number;
  txHash?: string;
}

export function GasInfoCard({ gasUsed = 144515, txHash }: GasInfoCardProps) {
  const gasPriceGwei = 12.5;
  const ethPrice = 2450;
  const gasCostEth = (gasUsed * gasPriceGwei * 1e-9);
  const gasCostUsd = gasCostEth * ethPrice;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Fuel className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Información de Gas</h3>
        <span className="text-xs text-muted-foreground ml-auto">Blockchain</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Gas Usado</span>
          </div>
          <p className="text-xl font-bold text-primary">{gasUsed.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            @ {gasPriceGwei} Gwei
          </p>
        </div>

        <div className="p-4 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground">Costo USD aprox</span>
          </div>
          <p className="text-xl font-bold text-success">${gasCostUsd.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {gasCostEth.toFixed(6)} ETH
          </p>
        </div>
      </div>

      {txHash && (
        <div className="mt-4 p-3 rounded-lg bg-background/50">
          <p className="text-xs text-muted-foreground mb-1">TX Hash</p>
          <code className="text-xs font-mono break-all text-primary">{txHash}</code>
        </div>
      )}
    </div>
  );
}
