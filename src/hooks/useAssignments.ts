// Custom hook for judge assignment management (data logic separated from UI)

import { useState, useEffect } from 'react';
import { getAssignments, saveAssignment } from '@/lib/firebase/assignments';
import { JudgeAssignment } from '@/lib/types';

interface AssignmentsState {
  assignments: JudgeAssignment[];
  isLoading: boolean;
  error: string | null;
}

export function useAssignments(queueId: string | null) {
  const [state, setState] = useState<AssignmentsState>({
    assignments: [],
    isLoading: false,
    error: null,
  });

  const fetchAssignments = async (queue: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await getAssignments(queue);
      setState({
        assignments: data,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState({
        assignments: [],
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch assignments',
      });
    }
  };

  const handleSaveAssignment = async (
    queue: string,
    questionId: string,
    judgeIds: string[]
  ) => {
    try {
      await saveAssignment(queue, questionId, judgeIds);
      await fetchAssignments(queue); // Refresh assignments
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to save assignment');
    }
  };

  useEffect(() => {
    if (queueId) {
      fetchAssignments(queueId);
    } else {
      setState({ assignments: [], isLoading: false, error: null });
    }
  }, [queueId]);

  return {
    ...state,
    saveAssignment: handleSaveAssignment,
  };
}
