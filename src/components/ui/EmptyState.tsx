// Empty state component for when no data exists

import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
}

const styles = {
  container: 'text-center py-12',
  icon: 'mx-auto mb-4 text-gray-300',
  title: 'text-lg font-semibold text-gray-900 mb-2',
  description: 'text-gray-600',
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <FileQuestion className={styles.icon} size={64} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
