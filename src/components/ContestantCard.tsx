import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Users } from 'lucide-react';
import { Contestant } from '@/hooks/useVoting';
import { cn } from '@/lib/utils';

interface ContestantCardProps {
  contestant: Contestant;
  voteCount: number;
  hasVoted: boolean;
  hasVotedFor: boolean;
  onVote: (contestantId: string) => void;
  isLoading: boolean;
  isVotingActive: boolean;
}

export const ContestantCard: React.FC<ContestantCardProps> = ({
  contestant,
  voteCount,
  hasVoted,
  hasVotedFor,
  onVote,
  isLoading,
  isVotingActive,
}) => {
  const canVote = !hasVoted && isVotingActive;
  
  return (
    <Card className={cn(
      "relative overflow-hidden bg-gradient-card border-border/50 transition-all duration-300 hover:shadow-card",
      hasVotedFor && "ring-2 ring-primary shadow-glow"
    )}>
      <div className="relative">
        <div className="aspect-[4/3] bg-muted rounded-t-lg overflow-hidden">
          <img 
            src={contestant.imageUrl} 
            alt={contestant.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        
        {hasVotedFor && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary text-primary-foreground animate-glow">
              <Heart className="h-3 w-3 mr-1 fill-current" />
              Voted
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-foreground truncate">
            {contestant.name}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center">
            <Star className="h-3 w-3 mr-1" />
            {contestant.talent}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span className="font-medium">{voteCount}</span>
            <span className="ml-1">votes</span>
          </div>
          
          <Button
            onClick={() => onVote(contestant.id)}
            disabled={!canVote || isLoading}
            size="sm"
            className={cn(
              "transition-all duration-300",
              hasVotedFor 
                ? "bg-success hover:bg-success/90 text-success-foreground" 
                : canVote 
                  ? "bg-gradient-vote hover:opacity-90 hover:scale-105" 
                  : "bg-entertainment-vote-disabled text-muted-foreground cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-2" />
                Voting...
              </div>
            ) : hasVotedFor ? (
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1 fill-current" />
                Voted
              </div>
            ) : canVote ? (
              "Vote"
            ) : !isVotingActive ? (
              "Voting Closed"
            ) : (
              "Already Voted"
            )}
          </Button>
        </div>

        {/* Vote progress indicator */}
        <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-spotlight transition-all duration-500 ease-out"
            style={{ 
              width: `${Math.min((voteCount / Math.max(voteCount, 50)) * 100, 100)}%` 
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};