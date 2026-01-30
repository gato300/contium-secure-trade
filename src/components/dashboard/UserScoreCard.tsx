import { Trophy, Award, FileCheck, Sparkles } from 'lucide-react';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';

interface UserScoreCardProps {
  user: User;
  className?: string;
}

export function UserScoreCard({ user, className }: UserScoreCardProps) {
  return (
    <div className={cn("glass-card p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          <span className="font-semibold text-sm">Mi Puntaje</span>
        </div>
        <span className="text-2xl font-bold text-gradient">{user.score || 0}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-2 rounded-lg bg-secondary/50">
          <div className="flex items-center justify-center gap-1 mb-1">
            <FileCheck className="w-3 h-3 text-muted-foreground" />
            <span className="text-lg font-bold">{user.totalDocuments || 0}</span>
          </div>
          <p className="text-xs text-muted-foreground">Documentos</p>
        </div>
        
        <div className="p-2 rounded-lg bg-secondary/50">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Award className="w-3 h-3 text-primary" />
            <span className="text-lg font-bold">{user.nftBadges?.length || 0}</span>
          </div>
          <p className="text-xs text-muted-foreground">NFT Badges</p>
        </div>
      </div>

      {user.nftBadges && user.nftBadges.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Últimos NFTs
          </p>
          <div className="space-y-1.5">
            {user.nftBadges.slice(0, 2).map((badge) => (
              <div 
                key={badge.id} 
                className="flex items-center gap-2 p-1.5 rounded bg-primary/10 text-xs"
              >
                <Award className="w-3 h-3 text-primary shrink-0" />
                <span className="truncate">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
