import { useState, useEffect, useCallback } from 'react';
import { Contestant } from './useVoting';

const MOCK_CONTESTANTS: Contestant[] = [
  {
    id: 'contestant-1',
    name: 'Sarah Johnson',
    talent: 'Singer',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=300&fit=crop&crop=face',
    votes: 127
  },
  {
    id: 'contestant-2',
    name: 'Marcus Chen',
    talent: 'Magician',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face',
    votes: 95
  },
  {
    id: 'contestant-3',
    name: 'Isabella Rodriguez',
    talent: 'Dancer',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face',
    votes: 143
  },
  {
    id: 'contestant-4',
    name: 'David Thompson',
    talent: 'Comedian',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop&crop=face',
    votes: 78
  },
  {
    id: 'contestant-5',
    name: 'Emma Williams',
    talent: 'Acrobat',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face',
    votes: 156
  },
  {
    id: 'contestant-6',
    name: 'Alex Kim',
    talent: 'Musician',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face',
    votes: 112
  }
];

export const useLiveData = () => {
  const [contestants, setContestants] = useState<Contestant[]>(MOCK_CONTESTANTS);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Simulate live vote updates
  const simulateVoteUpdates = useCallback(() => {
    setContestants(prevContestants => {
      return prevContestants.map(contestant => {
        // Random chance for each contestant to receive votes
        const shouldUpdate = Math.random() < 0.3; // 30% chance per update
        if (shouldUpdate) {
          const votesToAdd = Math.floor(Math.random() * 3) + 1; // 1-3 votes
          return {
            ...contestant,
            votes: contestant.votes + votesToAdd
          };
        }
        return contestant;
      });
    });
    setLastUpdate(new Date());
  }, []);

  // Initial loading simulation
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Live updates simulation (every 5-10 seconds)
  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      simulateVoteUpdates();
    }, Math.random() * 5000 + 5000); // Random interval between 5-10 seconds

    return () => clearInterval(interval);
  }, [isLoading, simulateVoteUpdates]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset to initial state with some randomization
    setContestants(MOCK_CONTESTANTS.map(contestant => ({
      ...contestant,
      votes: contestant.votes + Math.floor(Math.random() * 50)
    })));
    
    setIsLoading(false);
    setLastUpdate(new Date());
  }, []);

  return {
    contestants,
    isLoading,
    lastUpdate,
    refreshData,
  };
};