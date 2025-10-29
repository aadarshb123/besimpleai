import { useState, useRef } from 'react';
import { SubmissionUpload } from '@/components/submissions/SubmissionUpload';
import { SubmissionList } from '@/components/submissions/SubmissionList';
import { JudgeForm } from '@/components/judges/JudgeForm';
import { JudgeList } from '@/components/judges/JudgeList';
import { JudgeAssignment } from '@/components/judges/JudgeAssignment';
import { EvaluationRunner } from '@/components/evaluations/EvaluationRunner';
import { ResultsView } from '@/components/results/ResultsView';
import { useSubmissions } from '@/hooks/useSubmissions';
import { useJudges } from '@/hooks/useJudges';
import { Judge } from '@/lib/types';

function App() {
  const { submissions, isLoading, error, refetch } = useSubmissions();
  const {
    judges,
    isLoading: judgesLoading,
    error: judgesError,
    createJudge,
    updateJudge,
    toggleActive,
  } = useJudges();

  // Edit state management
  const [editingJudge, setEditingJudge] = useState<Judge | null>(null);

  // Ref to the judge form for scrolling
  const judgeFormRef = useRef<HTMLDivElement>(null);

  // Handler to start editing a judge
  const handleEdit = (judge: Judge) => {
    setEditingJudge(judge);
    // Scroll to the form
    setTimeout(() => {
      judgeFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handler to cancel editing
  const handleCancelEdit = () => {
    setEditingJudge(null);
  };

  // Handler for form submission (both create and edit)
  const handleJudgeSubmit = async (input: Parameters<typeof createJudge>[0]) => {
    if (editingJudge) {
      // Update existing judge
      await updateJudge(editingJudge.id, input);
    } else {
      // Create new judge
      await createJudge(input);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <header className="bg-white shadow-md border-b-4 border-primary-500">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="BeSimple AI" className="h-12 w-12 drop-shadow-md" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              AI Evaluation Platform
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Submissions Section */}
        <SubmissionUpload onSuccess={refetch} />
        <SubmissionList
          submissions={submissions}
          isLoading={isLoading}
          error={error}
        />

        {/* Judges Section */}
        <div ref={judgeFormRef}>
          <JudgeForm
            onSubmit={handleJudgeSubmit}
            initialJudge={editingJudge}
            judgeId={editingJudge?.id}
            onCancelEdit={handleCancelEdit}
          />
        </div>
        <JudgeList
          judges={judges}
          isLoading={judgesLoading}
          error={judgesError}
          onToggleActive={toggleActive}
          onEdit={handleEdit}
        />

        {/* Assignment Section */}
        <JudgeAssignment submissions={submissions} judges={judges} />

        {/* Evaluation Section */}
        <EvaluationRunner submissions={submissions} />

        {/* Results Section */}
        <ResultsView />
      </main>
    </div>
  );
}

export default App;
