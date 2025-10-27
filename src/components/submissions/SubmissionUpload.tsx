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
  uploadArea: 'border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors',
  icon: 'mx-auto mb-4 text-gray-400',
  title: 'text-lg font-semibold mb-2',
  description: 'text-gray-600 mb-4',
  fileInfo: 'text-sm text-gray-500 mt-2',
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
        <Upload className={styles.icon} size={48} />
        <p className="text-gray-700 mb-2">
          Click to select a JSON file
        </p>
        <p className={styles.fileInfo}>
          Supports: .json files with submission data
        </p>
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
