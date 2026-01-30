import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { LeaderboardEntry } from '@/lib/types';
import { roleLabels } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  className?: string;
}

const rankIcons = {
  1: Crown,
  2: Medal,
  3: Award,
};

const rankColors = {
  1: 'text-yellow-500',
  2: 'text-slate-400',
  3: 'text-amber-600',
};

export function LeaderboardCard({ entries, currentUserId, className }: LeaderboardCardProps) {
  return (
    <div className={cn("glass-card p-6", className)}>
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-warning" />
        <h3 className="font-semibold text-lg">Leaderboard</h3>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => {
          const RankIcon = rankIcons[entry.rank as keyof typeof rankIcons] || Trophy;
          const isCurrentUser = entry.user.id === currentUserId;
          
          return (
            <div 
              key={entry.user.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all",
                isCurrentUser ? "bg-primary/10 border border-primary/30" : "bg-secondary/30 hover:bg-secondary/50"
              )}
            >
              {/* Rank */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                entry.rank <= 3 ? "bg-warning/20" : "bg-secondary"
              )}>
                {entry.rank <= 3 ? (
                  <RankIcon className={cn("w-4 h-4", rankColors[entry.rank as keyof typeof rankColors])} />
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>
                )}
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={cn(
                    "font-medium text-sm truncate",
                    isCurrentUser && "text-primary"
                  )}>
                    {entry.user.name}
                    {isCurrentUser && <span className="text-xs ml-1">(Tú)</span>}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {roleLabels[entry.user.role]}
                </p>
              </div>

              {/* Stats */}
              <div className="text-right shrink-0">
                <p className="font-bold text-lg text-gradient">{entry.verificationsCount}</p>
                <p className="text-xs text-muted-foreground">verificaciones</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          Ranking basado en verificaciones exitosas en Syscoin NEVM
        </p>
      </div>
    </div>
  );
}
