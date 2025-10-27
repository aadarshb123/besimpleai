import { SubmissionUpload } from '@/components/submissions/SubmissionUpload';
import { SubmissionList } from '@/components/submissions/SubmissionList';
import { JudgeForm } from '@/components/judges/JudgeForm';
import { JudgeList } from '@/components/judges/JudgeList';
import { useSubmissions } from '@/hooks/useSubmissions';
import { useJudges } from '@/hooks/useJudges';

function App() {
  const { submissions, isLoading, error, refetch } = useSubmissions();
  const {
    judges,
    isLoading: judgesLoading,
    error: judgesError,
    createJudge,
    toggleActive,
  } = useJudges();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="BeSimple AI" className="h-10 w-10" />
            <h1 className="text-2xl font-bold text-gray-900">
              AI Judge
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 space-y-6">
        {/* Submissions Section */}
        <SubmissionUpload onSuccess={refetch} />
        <SubmissionList
          submissions={submissions}
          isLoading={isLoading}
          error={error}
        />

        {/* Judges Section */}
        <JudgeForm onSubmit={createJudge} />
        <JudgeList
          judges={judges}
          isLoading={judgesLoading}
          error={judgesError}
          onToggleActive={toggleActive}
        />
      </main>
    </div>
  );
}

export default App;
