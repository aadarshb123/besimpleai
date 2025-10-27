import { SubmissionUpload } from '@/components/submissions/SubmissionUpload';
import { SubmissionList } from '@/components/submissions/SubmissionList';
import { useSubmissions } from '@/hooks/useSubmissions';

function App() {
  const { submissions, isLoading, error, refetch } = useSubmissions();

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
        <SubmissionUpload onSuccess={refetch} />
        <SubmissionList
          submissions={submissions}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
}

export default App;
