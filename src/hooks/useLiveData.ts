import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Contestant } from './useVoting';

export const useLiveData = () => {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Load contestants from Supabase
  const loadContestants = useCallback(async () => {
    try {
      const { data: contestantsData, error: contestantsError } = await supabase
        .from('contestants')
        .select('*');

      if (contestantsError) throw contestantsError;

      // Get vote counts for each contestant
      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('contestant_id');

      if (votesError) throw votesError;

      // Count votes per contestant
      const voteCounts: Record<string, number> = {};
      votesData?.forEach(vote => {
        voteCounts[vote.contestant_id] = (voteCounts[vote.contestant_id] || 0) + 1;
      });

      // Map contestants with vote counts
      const contestantsWithVotes: Contestant[] = contestantsData?.map(contestant => ({
        id: contestant.id,
        name: contestant.name,
        talent: contestant.talent,
        imageUrl: contestant.image_url,
        votes: voteCounts[contestant.id] || 0
      })) || [];

      setContestants(contestantsWithVotes);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading contestants:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadContestants();
  }, [loadContestants]);

  // Set up real-time updates for votes
  useEffect(() => {
    const channel = supabase
      .channel('vote-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes'
        },
        () => {
          // Reload data when votes change
          loadContestants();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadContestants]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    await loadContestants();
  }, [loadContestants]);

  return {
    contestants,
    isLoading,
    lastUpdate,
    refreshData,
  };
};