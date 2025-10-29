// Component to display a single judge (presentation only)

import { Judge } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Edit } from 'lucide-react';
import { truncateText } from '@/utils/formatters';

interface JudgeCardProps {
  judge: Judge;
  onToggleActive: (id: string, active: boolean) => Promise<void>;
  onEdit: (judge: Judge) => void;
}

const styles = {
  card: 'bg-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-primary-300 transition-all duration-200',
  header: 'flex items-start justify-between mb-3',
  name: 'text-lg font-semibold text-gray-900',
  badge: (active: boolean) =>
    `px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
      active ? 'bg-secondary-100 text-secondary-700 border border-secondary-300' : 'bg-gray-100 text-gray-600 border border-gray-300'
    }`,
  modelInfo: 'text-sm text-gray-600 mb-3 flex items-center gap-2',
  providerBadge: 'px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs font-medium',
  prompt: 'text-sm text-gray-700 mb-4 p-4 bg-gradient-to-br from-gray-50 to-primary-50/30 rounded-lg border border-gray-200',
  actions: 'flex gap-2',
};

export function JudgeCard({ judge, onToggleActive, onEdit }: JudgeCardProps) {
  const handleToggle = async () => {
    await onToggleActive(judge.id, !judge.active);
  };

  const handleEdit = () => {
    onEdit(judge);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className="flex-1">
          <h3 className={styles.name}>{judge.name}</h3>
          <div className={styles.modelInfo}>
            <span className={styles.providerBadge}>{judge.provider}</span>
            <span className="text-gray-400">•</span>
            <span className="text-xs text-gray-500">{judge.modelName}</span>
          </div>
        </div>
        <span className={styles.badge(judge.active)}>
          {judge.active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className={styles.prompt}>
        <p className="text-xs font-medium text-gray-500 uppercase mb-1">
          System Prompt
        </p>
        <p className="whitespace-pre-wrap">
          {truncateText(judge.systemPrompt, 200)}
        </p>
      </div>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          onClick={handleEdit}
          className="flex items-center justify-center px-4"
        >
          <Edit size={16} className="mr-1" />
          Edit
        </Button>
        <Button
          variant={judge.active ? 'secondary' : 'primary'}
          onClick={handleToggle}
          className="flex-1 px-4"
        >
          {judge.active ? 'Deactivate' : 'Activate'}
        </Button>
      </div>
    </div>
  );
}
