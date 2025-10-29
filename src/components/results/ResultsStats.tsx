// Component for displaying evaluation statistics (pass rate, counts)

import { Evaluation } from '@/lib/types';

interface ResultsStatsProps {
  evaluations: Evaluation[];
}

const styles = {
  container: 'bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6',
  grid: 'grid grid-cols-1 md:grid-cols-3 gap-4',
  stat: 'text-center',
  label: 'text-sm text-gray-600 mb-1',
  value: 'text-2xl font-bold text-blue-900',
  passRate: 'text-3xl font-bold text-green-600',
};

export function ResultsStats({ evaluations }: ResultsStatsProps) {
  const total = evaluations.length;
  const passed = evaluations.filter(e => e.verdict === 'pass').length;
  const failed = evaluations.filter(e => e.verdict === 'fail').length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.stat}>
          <div className={styles.label}>Pass Rate</div>
          <div className={styles.passRate}>
            {passRate}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ({passed} / {total} evaluations)
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Passed</div>
          <div className="text-2xl font-bold text-green-600">{passed}</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Failed</div>
          <div className="text-2xl font-bold text-red-600">{failed}</div>
        </div>
      </div>
    </div>
  );
}
