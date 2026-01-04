import { CheckCircle2, XCircle, Shield, Lock, Fingerprint, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ZeroTrustCheck {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  icon: React.ElementType;
}

interface ZeroTrustPanelProps {
  checks?: ZeroTrustCheck[];
  title?: string;
}

const defaultChecks: ZeroTrustCheck[] = [
  {
    id: 'auth',
    name: 'Autenticación Verificada',
    description: 'Identidad del usuario confirmada',
    passed: true,
    icon: Fingerprint,
  },
  {
    id: 'role',
    name: 'Rol Autorizado',
    description: 'Permisos de rol validados para esta acción',
    passed: true,
    icon: Shield,
  },
  {
    id: 'session',
    name: 'Sesión Activa',
    description: 'Token de sesión válido y no expirado',
    passed: true,
    icon: Lock,
  },
  {
    id: 'context',
    name: 'Contexto Verificado',
    description: 'Dispositivo y ubicación dentro de parámetros',
    passed: true,
    icon: Eye,
  },
];

export function ZeroTrustPanel({ checks = defaultChecks, title = 'Verificación Zero Trust' }: ZeroTrustPanelProps) {
  const allPassed = checks.every((check) => check.passed);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
          allPassed ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
        )}>
          {allPassed ? (
            <>
              <CheckCircle2 className="w-3 h-3" />
              Verificado
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3" />
              Fallido
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {checks.map((check) => {
          const Icon = check.icon;
          return (
            <div 
              key={check.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                check.passed ? "bg-success/5" : "bg-destructive/5"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                check.passed ? "bg-success/20" : "bg-destructive/20"
              )}>
                <Icon className={cn(
                  "w-4 h-4",
                  check.passed ? "text-success" : "text-destructive"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{check.name}</p>
                <p className="text-xs text-muted-foreground">{check.description}</p>
              </div>
              {check.passed ? (
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
