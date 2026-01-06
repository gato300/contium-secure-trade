import { CheckCircle, Clock, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationResultCardProps {
  isValid: boolean;
  verificationTime: number;
  onBlockchain: boolean;
}

export function VerificationResultCard({ 
  isValid, 
  verificationTime, 
  onBlockchain 
}: VerificationResultCardProps) {
  return (
    <div className="glass-card p-5 border-2 border-success/30 bg-success/5">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-success" />
        <h3 className="font-semibold">Resultado de Verificación</h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-background/50">
          <p className="text-xs text-muted-foreground mb-1">Estado</p>
          <p className={cn(
            "font-bold",
            isValid ? "text-success" : "text-destructive"
          )}>
            {isValid ? 'Válida' : 'Inválida'}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-background/50">
          <p className="text-xs text-muted-foreground mb-1">Tiempo Verificación</p>
          <p className="font-bold text-primary">{verificationTime} ms</p>
        </div>

        <div className="p-4 rounded-lg bg-background/50">
          <p className="text-xs text-muted-foreground mb-1">Verificado en Blockchain</p>
          <p className={cn(
            "font-bold",
            onBlockchain ? "text-success" : "text-muted-foreground"
          )}>
            {onBlockchain ? 'Sí' : 'No'}
          </p>
        </div>
      </div>
    </div>
  );
}
