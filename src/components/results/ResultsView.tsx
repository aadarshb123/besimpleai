// Main Results View component - orchestrates filtering and display logic

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Verdict } from '@/lib/types';
import { useEvaluations } from '@/hooks/useEvaluations';
import { ResultsStats } from './ResultsStats';
import { ResultsFilters } from './ResultsFilters';
import { ResultsTable } from './ResultsTable';

const styles = {
  title: 'text-lg font-semibold mb-4',
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
      <h2 className={styles.title}>Evaluation Results</h2>

      {/* Stats Section */}
      <ResultsStats evaluations={filteredEvaluations} />

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
