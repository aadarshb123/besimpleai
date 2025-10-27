// Custom hook for fetching submissions (data logic separated from UI)

import { useState, useEffect } from 'react';
import { getSubmissions } from '@/lib/firebase/submissions';
import { Submission } from '@/lib/types';

interface SubmissionsState {
  submissions: Submission[];
  isLoading: boolean;
  error: string | null;
}

export function useSubmissions() {
  const [state, setState] = useState<SubmissionsState>({
    submissions: [],
    isLoading: true,
    error: null,
  });

  const fetchSubmissions = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await getSubmissions();
      setState({
        submissions: data,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState({
        submissions: [],
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch submissions',
      });
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return {
    ...state,
    refetch: fetchSubmissions,
  };
}
