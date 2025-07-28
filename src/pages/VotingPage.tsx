import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { VotingHeader } from '@/components/VotingHeader';
import { ContestantCard } from '@/components/ContestantCard';
import { PageLoading } from '@/components/LoadingSpinner';
import { useVoting } from '@/hooks/useVoting';
import { useLiveData } from '@/hooks/useLiveData';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const VotingPageContent: React.FC = () => {
  const { contestants, isLoading: dataLoading, lastUpdate, refreshData } = useLiveData();
  const {
    votingState,
    castVote,
    getContestantVoteCount,
    hasVotedFor,
    isLoading: voteLoading,
    resetVotes,
    setIsVotingActive,
  } = useVoting(contestants);

  const handleToggleVoting = () => {
    setIsVotingActive(!votingState.isVotingActive);
  };

  if (dataLoading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effects */}
      <div className="fixed inset-0 bg-gradient-stage opacity-10 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <VotingHeader
            votingState={votingState}
            totalContestants={contestants.length}
            onResetVotes={resetVotes}
            onToggleVoting={handleToggleVoting}
          />

          {/* Refresh Controls */}
          <div className="flex items-center justify-center gap-4 mt-6 mb-8">
            <Button
              onClick={refreshData}
              variant="outline"
              size="sm"
              className="border-border/50"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh Data
            </Button>
            <p className="text-xs text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>

          {/* Contestants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {contestants.map((contestant) => (
              <ErrorBoundary 
                key={contestant.id}
                fallback={
                  <div className="bg-card border border-border/50 rounded-lg p-4 text-center">
                    <p className="text-muted-foreground">
                      Failed to load contestant
                    </p>
                  </div>
                }
              >
                <ContestantCard
                  contestant={contestant}
                  voteCount={getContestantVoteCount(contestant.id)}
                  hasVoted={votingState.hasVoted}
                  hasVotedFor={hasVotedFor(contestant.id)}
                  onVote={castVote}
                  isLoading={voteLoading}
                  isVotingActive={votingState.isVotingActive}
                />
              </ErrorBoundary>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center space-y-4">
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span>🎭 Live Voting System</span>
              <span>📱 Mobile Responsive</span>
              <span>⚡ Real-time Updates</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
              Your vote is securely stored and cannot be changed once submitted. 
              The voting window may close at any time. Vote counts update automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VotingPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <VotingPageContent />
    </ErrorBoundary>
  );
};