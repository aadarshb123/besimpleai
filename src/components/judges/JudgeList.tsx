// Component to display list of judges (presentation layer)

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { JudgeCard } from './JudgeCard';
import { Judge } from '@/lib/types';

interface JudgeListProps {
  judges: Judge[];
  isLoading: boolean;
  error: string | null;
  onToggleActive: (id: string, active: boolean) => Promise<void>;
}

const styles = {
  title: 'text-lg font-semibold mb-4',
  grid: 'grid gap-4 md:grid-cols-2',
  loading: 'text-center py-8 text-gray-600',
};

export function JudgeList({ judges, isLoading, error, onToggleActive }: JudgeListProps) {
  return (
    <Card>
      <h2 className={styles.title}>AI Judges</h2>

      {error && <Alert type="error" message={error} />}

      {isLoading && (
        <p className={styles.loading}>Loading judges...</p>
      )}

      {!isLoading && !error && judges.length === 0 && (
        <EmptyState
          title="No judges yet"
          description="Create your first AI judge to start evaluating submissions"
        />
      )}

      {!isLoading && !error && judges.length > 0 && (
        <div className={styles.grid}>
          {judges.map(judge => (
            <JudgeCard
              key={judge.id}
              judge={judge}
              onToggleActive={onToggleActive}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
