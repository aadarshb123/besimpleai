// Component for uploading JSON submissions (presentation only)

import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { useSubmissionUpload } from '@/hooks/useSubmissionUpload';

interface SubmissionUploadProps {
  onSuccess?: () => void;
}

const styles = {
  uploadArea: 'border-2 border-dashed border-primary-300 bg-gradient-to-br from-primary-50/50 to-secondary-50/30 rounded-xl p-10 text-center hover:border-primary-500 hover:bg-primary-100/50 transition-all duration-200 cursor-pointer',
  icon: 'mx-auto mb-4 text-primary-500',
  title: 'text-xl font-bold mb-2 text-gray-900',
  description: 'text-gray-600 mb-6',
  fileInfo: 'text-sm text-gray-500 mt-3 bg-white px-4 py-2 rounded-lg inline-block',
};

export function SubmissionUpload({ onSuccess }: SubmissionUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isUploading, error, success, uploadFile } = useSubmissionUpload(onSuccess);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <h2 className={styles.title}>Upload Submissions</h2>
      <p className={styles.description}>
        Upload a JSON file containing submission data
      </p>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <div className={styles.uploadArea} onClick={handleClick}>
        <Upload className={styles.icon} size={56} strokeWidth={1.5} />
        <p className="text-lg font-semibold text-gray-800 mb-2">
          Click to Upload Submissions
        </p>
        <p className="text-gray-600 mb-3">
          Select a JSON file from your computer
        </p>
        <div className={styles.fileInfo}>
          📄 Supports .json format only
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {isUploading && (
        <div className="mt-4 text-center">
          <p className="text-gray-600">Uploading submissions...</p>
        </div>
      )}
    </Card>
  );
}
