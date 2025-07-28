import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface Contestant {
  id: string;
  name: string;
  talent: string;
  imageUrl: string;
  votes: number;
}

export interface VotingState {
  hasVoted: boolean;
  votedFor: string | null;
  remainingVotes: number;
  isVotingActive: boolean;
}

const MAX_VOTES = 1; // One vote per user
const VOTING_STORAGE_KEY = 'talent-voting-state';

export const useVoting = (contestants: Contestant[]) => {
  const [votingState, setVotingState] = useState<VotingState>({
    hasVoted: false,
    votedFor: null,
    remainingVotes: MAX_VOTES,
    isVotingActive: true,
  });

  const [contestantVotes, setContestantVotes] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load voting state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(VOTING_STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setVotingState(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse voting state from localStorage:', error);
      }
    }

    // Initialize contestant votes
    const initialVotes: Record<string, number> = {};
    contestants.forEach(contestant => {
      initialVotes[contestant.id] = contestant.votes;
    });
    setContestantVotes(initialVotes);
  }, [contestants]);

  // Save voting state to localStorage whenever it changes
  const saveVotingState = useCallback((newState: Partial<VotingState>) => {
    const updatedState = { ...votingState, ...newState };
    setVotingState(updatedState);
    
    localStorage.setItem(VOTING_STORAGE_KEY, JSON.stringify({
      hasVoted: updatedState.hasVoted,
      votedFor: updatedState.votedFor,
      remainingVotes: updatedState.remainingVotes,
    }));
  }, [votingState]);

  const castVote = useCallback(async (contestantId: string) => {
    if (!votingState.isVotingActive) {
      toast({
        title: "Voting Closed",
        description: "The voting window has ended.",
        variant: "destructive",
      });
      return false;
    }

    if (votingState.hasVoted) {
      toast({
        title: "Already Voted",
        description: "You've already cast your vote for this round.",
        variant: "destructive",
      });
      return false;
    }

    if (votingState.remainingVotes <= 0) {
      toast({
        title: "No Votes Remaining",
        description: "You've used all your votes for this round.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update local vote count
      setContestantVotes(prev => ({
        ...prev,
        [contestantId]: (prev[contestantId] || 0) + 1
      }));

      // Update voting state
      saveVotingState({
        hasVoted: true,
        votedFor: contestantId,
        remainingVotes: votingState.remainingVotes - 1,
      });

      const contestant = contestants.find(c => c.id === contestantId);
      toast({
        title: "Vote Cast Successfully!",
        description: `Your vote for ${contestant?.name} has been recorded.`,
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error('Failed to cast vote:', error);
      toast({
        title: "Vote Failed",
        description: "There was an error casting your vote. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [votingState, contestants, saveVotingState]);

  const getContestantVoteCount = useCallback((contestantId: string) => {
    return contestantVotes[contestantId] || 0;
  }, [contestantVotes]);

  const hasVotedFor = useCallback((contestantId: string) => {
    return votingState.votedFor === contestantId;
  }, [votingState.votedFor]);

  const resetVotes = useCallback(() => {
    localStorage.removeItem(VOTING_STORAGE_KEY);
    setVotingState({
      hasVoted: false,
      votedFor: null,
      remainingVotes: MAX_VOTES,
      isVotingActive: true,
    });
    
    const initialVotes: Record<string, number> = {};
    contestants.forEach(contestant => {
      initialVotes[contestant.id] = contestant.votes;
    });
    setContestantVotes(initialVotes);
  }, [contestants]);

  return {
    votingState,
    castVote,
    getContestantVoteCount,
    hasVotedFor,
    isLoading,
    resetVotes,
    setIsVotingActive: (active: boolean) => 
      setVotingState(prev => ({ ...prev, isVotingActive: active })),
  };
};