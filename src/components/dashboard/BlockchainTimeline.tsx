import { Link2, FileText, Clock, User } from 'lucide-react';
import { DocumentVersion } from '@/lib/types';
import { truncateHash } from '@/lib/hashUtils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface BlockchainTimelineProps {
  versions: DocumentVersion[];
  title?: string;
}

export function BlockchainTimeline({ versions, title = 'Historial Inmutable' }: BlockchainTimelineProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-6">
        <Link2 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs text-muted-foreground ml-auto">Tipo Blockchain</span>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />

        <div className="space-y-6">
          {versions.map((version, index) => (
            <div key={version.version} className="relative flex gap-4">
              {/* Node */}
              <div className={cn(
                "relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                index === 0 
                  ? "bg-primary animate-pulse-glow" 
                  : "bg-secondary border-2 border-primary/30"
              )}>
                <FileText className={cn(
                  "w-4 h-4",
                  index === 0 ? "text-primary-foreground" : "text-primary"
                )} />
              </div>

              {/* Content */}
              <div className={cn(
                "flex-1 rounded-lg p-4 transition-colors",
                index === 0 ? "bg-primary/10 border border-primary/20" : "bg-secondary/50"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">Versión {version.version}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {format(new Date(version.timestamp), 'dd MMM yyyy, HH:mm', { locale: es })}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{version.changes}</p>

                {/* Hash */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">Hash:</span>
                  <code className="hash-display text-xs">
                    {truncateHash(version.hash, 24)}
                  </code>
                </div>

                {/* Actor */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>{version.actor.name}</span>
                  <span>•</span>
                  <span>{version.actor.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
