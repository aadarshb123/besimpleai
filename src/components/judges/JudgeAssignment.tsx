// Component for assigning judges to questions (presentation + form logic)

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';
import { Submission, Judge } from '@/lib/types';
import { getUniqueQueueIds, getQuestionsForQueue } from '@/utils/submissionHelpers';
import { useAssignments } from '@/hooks/useAssignments';

interface JudgeAssignmentProps {
  submissions: Submission[];
  judges: Judge[];
}

const styles = {
  title: 'text-lg font-semibold mb-4',
  section: 'space-y-4',
  questionCard: 'border border-gray-200 rounded-lg p-4 space-y-3',
  questionText: 'font-medium text-gray-900',
  judgeGrid: 'grid grid-cols-2 gap-2',
  actions: 'flex justify-end',
};

export function JudgeAssignment({ submissions, judges }: JudgeAssignmentProps) {
  const [selectedQueue, setSelectedQueue] = useState<string>('');
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { assignments: existingAssignments, saveAssignment } = useAssignments(
    selectedQueue || null
  );

  const queueIds = getUniqueQueueIds(submissions);
  const questions = selectedQueue ? getQuestionsForQueue(submissions, selectedQueue) : [];
  const activeJudges = judges.filter(j => j.active);

  // Initialize assignments when existing assignments load
  useEffect(() => {
    if (existingAssignments.length > 0) {
      const initialAssignments: Record<string, string[]> = {};
      existingAssignments.forEach(assignment => {
        initialAssignments[assignment.questionId] = assignment.judgeIds;
      });
      setAssignments(initialAssignments);
    }
  }, [existingAssignments]);

  const handleQueueChange = (queueId: string) => {
    setSelectedQueue(queueId);
    setAssignments({});
    setError(null);
    setSuccess(null);
  };

  const handleJudgeToggle = (questionId: string, judgeId: string, checked: boolean) => {
    setAssignments(prev => {
      const currentJudges = prev[questionId] || [];
      const newJudges = checked
        ? [...currentJudges, judgeId]
        : currentJudges.filter(id => id !== judgeId);

      return {
        ...prev,
        [questionId]: newJudges,
      };
    });
  };

  const handleSave = async () => {
    if (!selectedQueue) return;

    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      // Save assignments for all questions
      for (const question of questions) {
        const questionId = question.data.id;
        const judgeIds = assignments[questionId] || [];
        await saveAssignment(selectedQueue, questionId, judgeIds);
      }

      setSuccess('Assignments saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save assignments');
    } finally {
      setIsSaving(false);
    }
  };

  if (submissions.length === 0) {
    return (
      <Card>
        <h2 className={styles.title}>Assign Judges to Questions</h2>
        <EmptyState
          title="No submissions available"
          description="Upload submissions first to assign judges"
        />
      </Card>
    );
  }

  if (activeJudges.length === 0) {
    return (
      <Card>
        <h2 className={styles.title}>Assign Judges to Questions</h2>
        <EmptyState
          title="No active judges"
          description="Create and activate judges first to make assignments"
        />
      </Card>
    );
  }

  return (
    <Card>
      <h2 className={styles.title}>Assign Judges to Questions</h2>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <div className={styles.section}>
        <Select
          label="Select Queue"
          options={[
            { value: '', label: 'Select a queue...' },
            ...queueIds.map(id => ({ value: id, label: id })),
          ]}
          value={selectedQueue}
          onChange={e => handleQueueChange(e.target.value)}
        />

        {selectedQueue && questions.length === 0 && (
          <EmptyState
            title="No questions found"
            description="This queue has no questions"
          />
        )}

        {selectedQueue && questions.length > 0 && (
          <>
            <div className="space-y-4">
              {questions.map(question => {
                const questionId = question.data.id;
                const assignedJudges = assignments[questionId] || [];

                return (
                  <div key={questionId} className={styles.questionCard}>
                    <p className={styles.questionText}>
                      {question.data.questionText}
                    </p>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        Assign Judges:
                      </p>
                      <div className={styles.judgeGrid}>
                        {activeJudges.map(judge => (
                          <Checkbox
                            key={judge.id}
                            label={judge.name}
                            checked={assignedJudges.includes(judge.id)}
                            onChange={e =>
                              handleJudgeToggle(questionId, judge.id, e.target.checked)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.actions}>
              <Button onClick={handleSave} isLoading={isSaving}>
                Save Assignments
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
