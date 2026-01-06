import { TrendingUp, ExternalLink, Database } from 'lucide-react';

interface MarketReferenceCardProps {
  productName?: string;
  minPrice?: number;
  maxPrice?: number;
}

const sources = [
  { name: 'Amazon Business', type: 'referencia' },
  { name: 'Alibaba', type: 'promedio de exportación' },
  { name: 'TradeData.com', type: 'precios históricos' },
];

export function MarketReferenceCard({ 
  productName = 'Producto', 
  minPrice = 550, 
  maxPrice = 620 
}: MarketReferenceCardProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Referencia de Mercado</h3>
      </div>

      {/* Price range */}
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 mb-4">
        <p className="text-xs text-muted-foreground mb-2">Rango de mercado estimado</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">
            USD {minPrice.toLocaleString()} – {maxPrice.toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Precio unitario promedio para {productName}
        </p>
      </div>

      {/* Sources */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-medium">Fuentes consultadas</p>
        </div>
        <div className="space-y-2">
          {sources.map((source, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3 h-3 text-primary" />
                <span className="text-sm font-medium">{source.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{source.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
