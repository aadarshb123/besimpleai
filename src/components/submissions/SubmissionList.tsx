// Component to display list of submissions (presentation layer)

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { SubmissionCard } from './SubmissionCard';
import { Submission } from '@/lib/types';

interface SubmissionListProps {
  submissions: Submission[];
  isLoading: boolean;
  error: string | null;
}

const styles = {
  title: 'text-lg font-semibold mb-4',
  grid: 'grid gap-4 md:grid-cols-2',
  loading: 'text-center py-8 text-gray-600',
};

export function SubmissionList({ submissions, isLoading, error }: SubmissionListProps) {

  return (
    <Card>
      <h2 className={styles.title}>Submissions</h2>

      {error && <Alert type="error" message={error} />}

      {isLoading && (
        <p className={styles.loading}>Loading submissions...</p>
      )}

      {!isLoading && !error && submissions.length === 0 && (
        <EmptyState
          title="No submissions yet"
          description="Upload a JSON file to get started"
        />
      )}

      {!isLoading && !error && submissions.length > 0 && (
        <div className={styles.grid}>
          {submissions.map(submission => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))}
        </div>
      )}
    </Card>
  );
}
