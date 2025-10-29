// Custom hook for judge management (data logic separated from UI)

import { useState, useEffect } from 'react';
import { getJudges, createJudge, updateJudge, toggleJudgeActive } from '@/lib/firebase/judges';
import { Judge, CreateJudgeInput } from '@/lib/types';

interface JudgesState {
  judges: Judge[];
  isLoading: boolean;
  error: string | null;
}

export function useJudges() {
  const [state, setState] = useState<JudgesState>({
    judges: [],
    isLoading: true,
    error: null,
  });

  const fetchJudges = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await getJudges();
      setState({
        judges: data,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState({
        judges: [],
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch judges',
      });
    }
  };

  const handleCreateJudge = async (input: CreateJudgeInput) => {
    try {
      await createJudge(input);
      await fetchJudges(); // Refresh list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create judge');
    }
  };

  const handleUpdateJudge = async (id: string, updates: Partial<Judge>) => {
    try {
      await updateJudge(id, updates);
      await fetchJudges(); // Refresh list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update judge');
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    // Optimistic update - update UI immediately
    setState(prev => ({
      ...prev,
      judges: prev.judges.map(judge =>
        judge.id === id ? { ...judge, active } : judge
      ),
    }));

    try {
      await toggleJudgeActive(id, active);
      // Silently refresh to get the latest data without showing loading state
      const data = await getJudges();
      setState(prev => ({
        ...prev,
        judges: data,
      }));
    } catch (err) {
      // Revert optimistic update on error
      await fetchJudges();
      throw new Error(err instanceof Error ? err.message : 'Failed to toggle judge status');
    }
  };

  useEffect(() => {
    fetchJudges();
  }, []);

  return {
    ...state,
    refetch: fetchJudges,
    createJudge: handleCreateJudge,
    updateJudge: handleUpdateJudge,
    toggleActive: handleToggleActive,
  };
}
