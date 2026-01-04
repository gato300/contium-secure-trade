import { Package, ShoppingCart, FileCheck, Shield } from 'lucide-react';
import { UserRole } from '@/lib/types';
import { roleLabels, roleDescriptions } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
}

const roleIcons = {
  exportador: Package,
  importador: ShoppingCart,
  agente_aduanas: FileCheck,
  autoridad: Shield,
};

const roleColors = {
  exportador: 'hover:border-primary group-hover:text-primary group-hover:bg-primary/10',
  importador: 'hover:border-success group-hover:text-success group-hover:bg-success/10',
  agente_aduanas: 'hover:border-warning group-hover:text-warning group-hover:bg-warning/10',
  autoridad: 'hover:border-destructive group-hover:text-destructive group-hover:bg-destructive/10',
};

const selectedColors = {
  exportador: 'border-primary bg-primary/10',
  importador: 'border-success bg-success/10',
  agente_aduanas: 'border-warning bg-warning/10',
  autoridad: 'border-destructive bg-destructive/10',
};

export function RoleSelector({ selectedRole, onSelectRole }: RoleSelectorProps) {
  const roles: UserRole[] = ['exportador', 'importador', 'agente_aduanas', 'autoridad'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {roles.map((role) => {
        const Icon = roleIcons[role];
        const isSelected = selectedRole === role;
        
        return (
          <button
            key={role}
            onClick={() => onSelectRole(role)}
            className={cn(
              "group glass-card p-6 text-left transition-all duration-300 hover:scale-[1.02]",
              roleColors[role],
              isSelected && selectedColors[role]
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                isSelected ? 'bg-foreground/10' : 'bg-secondary',
              )}>
                <Icon className={cn(
                  "w-6 h-6 transition-colors",
                  isSelected ? (
                    role === 'exportador' ? 'text-primary' :
                    role === 'importador' ? 'text-success' :
                    role === 'agente_aduanas' ? 'text-warning' :
                    'text-destructive'
                  ) : 'text-muted-foreground group-hover:text-foreground'
                )} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{roleLabels[role]}</h3>
                <p className="text-sm text-muted-foreground">{roleDescriptions[role]}</p>
              </div>
            </div>
            
            {/* Selection indicator */}
            {isSelected && (
              <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-muted-foreground">Rol seleccionado</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
