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
  card: 'bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow',
  header: 'flex items-start justify-between mb-3',
  name: 'text-lg font-semibold text-gray-900',
  badge: (active: boolean) =>
    `px-2 py-1 text-xs font-medium rounded ${
      active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
    }`,
  modelInfo: 'text-sm text-gray-600 mb-2',
  prompt: 'text-sm text-gray-700 mb-3 p-3 bg-gray-50 rounded border border-gray-200',
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
        <div>
          <h3 className={styles.name}>{judge.name}</h3>
          <p className={styles.modelInfo}>
            {judge.provider} • {judge.modelName}
          </p>
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
          className="flex items-center justify-center"
        >
          <Edit size={16} className="mr-1" />
          Edit
        </Button>
        <Button
          variant={judge.active ? 'secondary' : 'primary'}
          onClick={handleToggle}
          className="flex-1"
        >
          {judge.active ? 'Deactivate' : 'Activate'}
        </Button>
      </div>
    </div>
  );
}
