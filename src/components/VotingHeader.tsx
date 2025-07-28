import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Vote, RotateCcw } from 'lucide-react';
import { VotingState } from '@/hooks/useVoting';

interface VotingHeaderProps {
  votingState: VotingState;
  totalContestants: number;
  onResetVotes: () => void;
  onToggleVoting: () => void;
}

export const VotingHeader: React.FC<VotingHeaderProps> = ({
  votingState,
  totalContestants,
  onResetVotes,
  onToggleVoting,
}) => {
  return (
    <div className="text-center space-y-6">
      {/* Main Title */}
      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          Talent Show
          <span className="bg-gradient-spotlight bg-clip-text text-transparent ml-3">
            Live Vote
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Cast your vote for your favorite contestant! Each person gets one vote per round.
        </p>
      </div>

      {/* Status Indicators */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <Badge 
          variant={votingState.isVotingActive ? "default" : "secondary"}
          className={votingState.isVotingActive 
            ? "bg-success text-success-foreground animate-vote-pulse" 
            : "bg-entertainment-vote-disabled"
          }
        >
          <Clock className="h-3 w-3 mr-1" />
          {votingState.isVotingActive ? "Voting Open" : "Voting Closed"}
        </Badge>

        <Badge variant="outline" className="border-border/50">
          <Users className="h-3 w-3 mr-1" />
          {totalContestants} Contestants
        </Badge>

        <Badge 
          variant={votingState.hasVoted ? "default" : "outline"}
          className={votingState.hasVoted 
            ? "bg-primary text-primary-foreground" 
            : "border-border/50"
          }
        >
          <Vote className="h-3 w-3 mr-1" />
          {votingState.hasVoted 
            ? `Voted for ${votingState.votedFor}` 
            : `${votingState.remainingVotes} Vote${votingState.remainingVotes !== 1 ? 's' : ''} Remaining`
          }
        </Badge>
      </div>

      {/* Admin Controls (for demo purposes) */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={onToggleVoting}
          variant="outline"
          size="sm"
          className="border-border/50"
        >
          {votingState.isVotingActive ? "Close Voting" : "Open Voting"}
        </Button>
        
        <Button
          onClick={onResetVotes}
          variant="outline"
          size="sm"
          className="border-border/50"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset Votes
        </Button>
      </div>
    </div>
  );
};