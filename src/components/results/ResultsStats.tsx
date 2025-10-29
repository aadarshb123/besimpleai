// Component for displaying evaluation statistics (pass rate, counts)

import { Evaluation } from '@/lib/types';

interface ResultsStatsProps {
  evaluations: Evaluation[];
}

const styles = {
  container: 'bg-gradient-to-br from-primary-50 via-primary-50/50 to-secondary-50 border-2 border-primary-200 rounded-xl p-6 mb-6 shadow-md',
  grid: 'grid grid-cols-1 md:grid-cols-3 gap-6',
  stat: 'text-center bg-white rounded-lg p-4 shadow-sm',
  label: 'text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide',
  value: 'text-2xl font-bold text-primary-700',
  passRate: 'text-4xl font-bold text-gray-900',
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
          <div className="text-xs text-gray-500 mt-2">
            {passed} of {total} evaluations
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Passed</div>
          <div className="text-3xl font-bold text-secondary-600" style={{ color: '#5f8f4f' }}>{passed}</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Failed</div>
          <div className="text-3xl font-bold text-red-600" style={{ color: '#dc2626' }}>{failed}</div>
        </div>
      </div>
    </div>
  );
}
