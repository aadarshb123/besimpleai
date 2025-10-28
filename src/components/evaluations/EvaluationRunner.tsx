// Component for running evaluations (presentation + control logic)

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';
import { Submission } from '@/lib/types';
import { getUniqueQueueIds } from '@/utils/submissionHelpers';
import { useEvaluationRunner } from '@/hooks/useEvaluationRunner';
import { Play } from 'lucide-react';

interface EvaluationRunnerProps {
  submissions: Submission[];
}

const styles = {
  title: 'text-lg font-semibold mb-4',
  section: 'space-y-4',
  progressCard: 'border border-blue-200 bg-blue-50 rounded-lg p-4',
  progressText: 'text-sm font-medium text-blue-900',
  progressBar: 'w-full h-2 bg-blue-200 rounded-full overflow-hidden mt-2',
  progressFill: 'h-full bg-blue-600 transition-all duration-300',
  summaryCard: 'border border-green-200 bg-green-50 rounded-lg p-4',
  summaryText: 'text-sm font-medium text-green-900',
};

export function EvaluationRunner({ submissions }: EvaluationRunnerProps) {
  const [selectedQueue, setSelectedQueue] = useState<string>('');
  const { isRunning, progress, error, summary, runEvaluations } = useEvaluationRunner();

  const queueIds = getUniqueQueueIds(submissions);

  const handleRun = async () => {
    if (!selectedQueue) return;
    await runEvaluations(selectedQueue);
  };

  if (submissions.length === 0) {
    return (
      <Card>
        <h2 className={styles.title}>Run AI Judges</h2>
        <EmptyState
          title="No submissions available"
          description="Upload submissions first to run evaluations"
        />
      </Card>
    );
  }

  const progressPercentage = progress
    ? (progress.completed / progress.total) * 100
    : 0;

  return (
    <Card>
      <h2 className={styles.title}>Run AI Judges</h2>

      {error && <Alert type="error" message={error} />}

      <div className={styles.section}>
        <Select
          label="Select Queue"
          options={[
            { value: '', label: 'Select a queue...' },
            ...queueIds.map(id => ({ value: id, label: id })),
          ]}
          value={selectedQueue}
          onChange={e => setSelectedQueue(e.target.value)}
          disabled={isRunning}
        />

        <Button
          onClick={handleRun}
          disabled={!selectedQueue || isRunning}
          isLoading={isRunning}
          className="w-full flex items-center justify-center"
        >
          <Play size={16} className="mr-2" />
          {isRunning ? 'Running Evaluations...' : 'Run AI Judges'}
        </Button>

        {isRunning && progress && (
          <div className={styles.progressCard}>
            <p className={styles.progressText}>
              Evaluating: {progress.completed} / {progress.total} completed
              {progress.failed > 0 && ` (${progress.failed} failed)`}
            </p>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {!isRunning && summary && (
          <div className={styles.summaryCard}>
            <p className={styles.summaryText}>{summary}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
