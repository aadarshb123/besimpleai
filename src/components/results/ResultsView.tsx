// Main Results View component - orchestrates filtering and display logic

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';
import { Verdict } from '@/lib/types';
import { useEvaluations } from '@/hooks/useEvaluations';
import { ResultsStats } from './ResultsStats';
import { ResultsCharts } from './ResultsCharts';
import { ResultsFilters } from './ResultsFilters';
import { ResultsTable } from './ResultsTable';
import { exportEvaluationsToCSV } from '@/utils/csvExport';

const styles = {
  header: 'flex items-center justify-between mb-4',
  title: 'text-lg font-semibold',
  loading: 'text-center py-12 text-gray-500',
};

export function ResultsView() {
  const { evaluations, isLoading, error } = useEvaluations();

  // Filter state
  const [selectedJudgeIds, setSelectedJudgeIds] = useState<string[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [selectedVerdicts, setSelectedVerdicts] = useState<Verdict[]>([]);

  // Filter toggle handlers
  const handleJudgeToggle = (judgeId: string) => {
    setSelectedJudgeIds(prev =>
      prev.includes(judgeId)
        ? prev.filter(id => id !== judgeId)
        : [...prev, judgeId]
    );
  };

  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestionIds(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleVerdictToggle = (verdict: Verdict) => {
    setSelectedVerdicts(prev =>
      prev.includes(verdict)
        ? prev.filter(v => v !== verdict)
        : [...prev, verdict]
    );
  };

  // Apply filters to evaluations
  const filteredEvaluations = useMemo(() => {
    let filtered = evaluations;

    // Filter by judge
    if (selectedJudgeIds.length > 0) {
      filtered = filtered.filter(e => selectedJudgeIds.includes(e.judgeId));
    }

    // Filter by question
    if (selectedQuestionIds.length > 0) {
      filtered = filtered.filter(e => selectedQuestionIds.includes(e.questionId));
    }

    // Filter by verdict
    if (selectedVerdicts.length > 0) {
      filtered = filtered.filter(e => selectedVerdicts.includes(e.verdict));
    }

    return filtered;
  }, [evaluations, selectedJudgeIds, selectedQuestionIds, selectedVerdicts]);

  // Handle CSV export
  const handleExport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `evaluations-${timestamp}.csv`;
    exportEvaluationsToCSV(filteredEvaluations, filename);
  };

  if (isLoading) {
    return (
      <Card>
        <h2 className={styles.title}>Evaluation Results</h2>
        <div className={styles.loading}>Loading evaluations...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <h2 className={styles.title}>Evaluation Results</h2>
        <Alert type="error" message={error} />
      </Card>
    );
  }

  if (evaluations.length === 0) {
    return (
      <Card>
        <h2 className={styles.title}>Evaluation Results</h2>
        <div className={styles.loading}>
          No evaluations yet. Run AI judges to generate evaluations.
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className={styles.header}>
        <h2 className={styles.title}>Evaluation Results</h2>
        <Button
          variant="secondary"
          onClick={handleExport}
          className="flex items-center gap-2"
          disabled={filteredEvaluations.length === 0}
        >
          <Download size={16} />
          Export to CSV
        </Button>
      </div>

      {/* Stats Section */}
      <ResultsStats evaluations={filteredEvaluations} />

      {/* Charts Section */}
      <ResultsCharts evaluations={filteredEvaluations} />

      {/* Filters Section */}
      <ResultsFilters
        evaluations={evaluations}
        selectedJudgeIds={selectedJudgeIds}
        selectedQuestionIds={selectedQuestionIds}
        selectedVerdicts={selectedVerdicts}
        onJudgeToggle={handleJudgeToggle}
        onQuestionToggle={handleQuestionToggle}
        onVerdictToggle={handleVerdictToggle}
      />

      {/* Results Table */}
      <ResultsTable evaluations={filteredEvaluations} />
    </Card>
  );
}
