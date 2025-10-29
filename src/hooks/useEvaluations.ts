// Custom hook for fetching and managing evaluations

import { useState, useEffect } from 'react';
import { Evaluation } from '@/lib/types';
import { getEvaluations } from '@/lib/firebase/evaluations';

interface UseEvaluationsResult {
  evaluations: Evaluation[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEvaluations(): UseEvaluationsResult {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getEvaluations();
      console.log('Fetched evaluations:', data.length, data);
      setEvaluations(data);
    } catch (err) {
      console.error('Error fetching evaluations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch evaluations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  return {
    evaluations,
    isLoading,
    error,
    refetch: fetchEvaluations,
  };
}
