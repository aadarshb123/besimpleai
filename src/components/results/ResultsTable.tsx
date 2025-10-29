// Component for displaying evaluations in a table format

import { Evaluation } from '@/lib/types';
import { VERDICT_COLORS } from '@/utils/constants';

interface ResultsTableProps {
  evaluations: Evaluation[];
}

const styles = {
  container: 'bg-white border rounded-lg overflow-hidden',
  table: 'min-w-full divide-y divide-gray-200',
  thead: 'bg-gray-50',
  th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
  tbody: 'bg-white divide-y divide-gray-200',
  td: 'px-6 py-4 text-sm text-gray-900',
  tdReasoning: 'px-6 py-4 text-sm text-gray-600 max-w-md',
  verdictBadge: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
};

export function ResultsTable({ evaluations }: ResultsTableProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (evaluations.length === 0) {
    return (
      <div className={styles.container}>
        <div className="px-6 py-12 text-center text-gray-500">
          No evaluations found. Try adjusting your filters or run AI judges first.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Submission</th>
            <th className={styles.th}>Question</th>
            <th className={styles.th}>Judge</th>
            <th className={styles.th}>Verdict</th>
            <th className={styles.th}>Reasoning</th>
            <th className={styles.th}>Created</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {evaluations.map(evaluation => (
            <tr key={evaluation.id}>
              <td className={styles.td}>
                <div className="font-medium">{evaluation.submissionId}</div>
                <div className="text-xs text-gray-500">Queue: {evaluation.queueId}</div>
              </td>
              <td className={styles.td}>
                <div className="max-w-xs truncate" title={evaluation.questionId}>
                  {evaluation.questionId}
                </div>
              </td>
              <td className={styles.td}>
                <div className="font-medium">{evaluation.judgeName}</div>
                <div className="text-xs text-gray-500">
                  {evaluation.metadata.provider} • {evaluation.metadata.modelUsed}
                </div>
              </td>
              <td className={styles.td}>
                <span className={`${styles.verdictBadge} ${VERDICT_COLORS[evaluation.verdict]}`}>
                  {evaluation.verdict}
                </span>
              </td>
              <td className={styles.tdReasoning}>
                <div className="line-clamp-2" title={evaluation.reasoning}>
                  {evaluation.reasoning}
                </div>
              </td>
              <td className={styles.td}>
                <div className="text-xs">{formatDate(evaluation.createdAt)}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
