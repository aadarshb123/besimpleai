// Helper functions for working with submissions

import { Submission, Question } from '@/lib/types';

export function getUniqueQueueIds(submissions: Submission[]): string[] {
  const queueIds = new Set(submissions.map(sub => sub.queueId));
  return Array.from(queueIds).sort();
}

export function getQuestionsForQueue(
  submissions: Submission[],
  queueId: string
): Question[] {
  const questionsMap = new Map<string, Question>();

  submissions
    .filter(sub => sub.queueId === queueId)
    .forEach(submission => {
      submission.questions.forEach(question => {
        const questionId = question.data.id;
        if (!questionsMap.has(questionId)) {
          questionsMap.set(questionId, question);
        }
      });
    });

  return Array.from(questionsMap.values());
}
