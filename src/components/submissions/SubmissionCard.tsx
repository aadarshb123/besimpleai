// Component to display a single submission (presentation only)

import { Submission } from '@/lib/types';
import { formatDateTime } from '@/utils/formatters';

interface SubmissionCardProps {
  submission: Submission;
}

const styles = {
  card: 'bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow',
  header: 'flex items-start justify-between mb-3',
  id: 'text-lg font-semibold text-gray-900',
  badge: 'px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded',
  infoGrid: 'grid grid-cols-2 gap-3',
  infoItem: 'space-y-1',
  label: 'text-xs font-medium text-gray-500 uppercase',
  value: 'text-sm text-gray-900',
};

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const questionCount = submission.questions.length;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.id}>{submission.id}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Queue: {submission.queueId}
          </p>
        </div>
        <span className={styles.badge}>
          {questionCount} {questionCount === 1 ? 'Question' : 'Questions'}
        </span>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <p className={styles.label}>Task ID</p>
          <p className={styles.value}>{submission.labelingTaskId}</p>
        </div>

        <div className={styles.infoItem}>
          <p className={styles.label}>Created</p>
          <p className={styles.value}>{formatDateTime(submission.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
