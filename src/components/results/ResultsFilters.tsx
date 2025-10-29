// Component for filtering evaluations by judge, question, and verdict

import { Evaluation, Verdict } from '@/lib/types';
import { Checkbox } from '@/components/ui/Checkbox';

interface ResultsFiltersProps {
  evaluations: Evaluation[];
  selectedJudgeIds: string[];
  selectedQuestionIds: string[];
  selectedVerdicts: Verdict[];
  onJudgeToggle: (judgeId: string) => void;
  onQuestionToggle: (questionId: string) => void;
  onVerdictToggle: (verdict: Verdict) => void;
}

const styles = {
  container: 'bg-white border rounded-lg p-4 mb-6',
  title: 'text-sm font-semibold text-gray-700 mb-3',
  section: 'mb-4',
  filterGrid: 'grid grid-cols-1 md:grid-cols-3 gap-6',
  checkboxList: 'space-y-2',
};

export function ResultsFilters({
  evaluations,
  selectedJudgeIds,
  selectedQuestionIds,
  selectedVerdicts,
  onJudgeToggle,
  onQuestionToggle,
  onVerdictToggle,
}: ResultsFiltersProps) {
  // Extract unique judges, questions, and verdicts
  const uniqueJudges = Array.from(
    new Map(evaluations.map(e => [e.judgeId, e.judgeName])).entries()
  ).map(([id, name]) => ({ id, name }));

  const uniqueQuestions = Array.from(
    new Set(evaluations.map(e => e.questionId))
  );

  const verdictOptions: Verdict[] = ['pass', 'fail', 'inconclusive'];

  return (
    <div className={styles.container}>
      <div className={styles.filterGrid}>
        {/* Judge Filter */}
        <div className={styles.section}>
          <div className={styles.title}>Filter by Judge</div>
          <div className={styles.checkboxList}>
            {uniqueJudges.map(judge => (
              <Checkbox
                key={judge.id}
                label={judge.name}
                checked={selectedJudgeIds.includes(judge.id)}
                onChange={() => onJudgeToggle(judge.id)}
              />
            ))}
          </div>
        </div>

        {/* Question Filter */}
        <div className={styles.section}>
          <div className={styles.title}>Filter by Question</div>
          <div className={styles.checkboxList}>
            {uniqueQuestions.map(questionId => (
              <Checkbox
                key={questionId}
                label={questionId}
                checked={selectedQuestionIds.includes(questionId)}
                onChange={() => onQuestionToggle(questionId)}
              />
            ))}
          </div>
        </div>

        {/* Verdict Filter */}
        <div className={styles.section}>
          <div className={styles.title}>Filter by Verdict</div>
          <div className={styles.checkboxList}>
            {verdictOptions.map(verdict => (
              <Checkbox
                key={verdict}
                label={verdict.charAt(0).toUpperCase() + verdict.slice(1)}
                checked={selectedVerdicts.includes(verdict)}
                onChange={() => onVerdictToggle(verdict)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
