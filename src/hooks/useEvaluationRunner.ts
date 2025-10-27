// Custom hook for running evaluations (orchestrates the full evaluation flow)

import { useState } from 'react';
import { Judge } from '@/lib/types';
import { getSubmissions } from '@/lib/firebase/submissions';
import { getJudges } from '@/lib/firebase/judges';
import { getAssignments } from '@/lib/firebase/assignments';
import { saveEvaluation } from '@/lib/firebase/evaluations';
import { evaluateAnswer } from '@/lib/llm/evaluator';

interface EvaluationProgress {
  total: number;
  completed: number;
  failed: number;
}

interface RunnerState {
  isRunning: boolean;
  progress: EvaluationProgress | null;
  error: string | null;
  summary: string | null;
}

export function useEvaluationRunner() {
  const [state, setState] = useState<RunnerState>({
    isRunning: false,
    progress: null,
    error: null,
    summary: null,
  });

  const runEvaluations = async (queueId: string) => {
    setState({
      isRunning: true,
      progress: { total: 0, completed: 0, failed: 0 },
      error: null,
      summary: null,
    });

    try {
      // 1. Fetch data
      const submissions = await getSubmissions(queueId);
      const judges = await getJudges();
      const assignments = await getAssignments(queueId);

      if (submissions.length === 0) {
        throw new Error('No submissions found in this queue');
      }

      if (assignments.length === 0) {
        throw new Error('No judge assignments found for this queue');
      }

      // 2. Build assignment map: questionId -> judgeIds
      const assignmentMap = new Map<string, string[]>();
      assignments.forEach(assignment => {
        assignmentMap.set(assignment.questionId, assignment.judgeIds);
      });

      // 3. Build judge map: judgeId -> Judge
      const judgeMap = new Map<string, Judge>();
      judges.forEach(judge => {
        judgeMap.set(judge.id, judge);
      });

      // 4. Calculate total evaluations
      let totalEvaluations = 0;
      for (const submission of submissions) {
        for (const question of submission.questions) {
          const questionId = question.data.id;
          const assignedJudgeIds = assignmentMap.get(questionId) || [];
          totalEvaluations += assignedJudgeIds.length;
        }
      }

      setState(prev => ({
        ...prev,
        progress: { total: totalEvaluations, completed: 0, failed: 0 },
      }));

      // 5. Run evaluations
      let completed = 0;
      let failed = 0;

      for (const submission of submissions) {
        for (const question of submission.questions) {
          const questionId = question.data.id;
          const answer = submission.answers[questionId];

          if (!answer) continue;

          const assignedJudgeIds = assignmentMap.get(questionId) || [];

          for (const judgeId of assignedJudgeIds) {
            const judge = judgeMap.get(judgeId);

            if (!judge || !judge.active) {
              failed++;
              setState(prev => ({
                ...prev,
                progress: prev.progress ? { ...prev.progress, completed: completed + 1, failed: failed } : null,
              }));
              continue;
            }

            // Evaluate
            const result = await evaluateAnswer(judge, question, answer);

            if (result.success && result.verdict && result.reasoning) {
              // Save to Firebase
              await saveEvaluation({
                submissionId: submission.id,
                queueId: submission.queueId,
                questionId,
                judgeId: judge.id,
                judgeName: judge.name,
                verdict: result.verdict,
                reasoning: result.reasoning,
                createdAt: Date.now(),
                metadata: {
                  modelUsed: judge.modelName,
                  provider: judge.provider,
                  latency: result.latency,
                },
              });

              completed++;
            } else {
              failed++;
            }

            // Update progress
            setState(prev => ({
              ...prev,
              progress: prev.progress ? { ...prev.progress, completed: completed, failed: failed } : null,
            }));
          }
        }
      }

      // 6. Done
      const summary = `Evaluation complete! ${completed} passed, ${failed} failed out of ${totalEvaluations} total.`;
      setState({
        isRunning: false,
        progress: { total: totalEvaluations, completed, failed },
        error: null,
        summary,
      });
    } catch (err) {
      setState({
        isRunning: false,
        progress: null,
        error: err instanceof Error ? err.message : 'Failed to run evaluations',
        summary: null,
      });
    }
  };

  return {
    ...state,
    runEvaluations,
  };
}
