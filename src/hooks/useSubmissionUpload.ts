// Custom hook for submission upload logic (separated from UI)

import { useState } from 'react';
import { parseJSONFile } from '@/utils/validation';
import { uploadSubmissions } from '@/lib/firebase/submissions';

interface UploadState {
  isUploading: boolean;
  error: string | null;
  success: string | null;
}

export function useSubmissionUpload(onSuccess?: () => void) {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    error: null,
    success: null,
  });

  const uploadFile = async (file: File) => {
    setState({ isUploading: true, error: null, success: null });

    try {
      // Parse and validate JSON
      const submissions = await parseJSONFile(file);

      // Upload to Firebase
      await uploadSubmissions(submissions);

      setState({
        isUploading: false,
        error: null,
        success: `Successfully uploaded ${submissions.length} submission(s)`,
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setState({
        isUploading: false,
        error: err instanceof Error ? err.message : 'Failed to upload file',
        success: null,
      });
    }
  };

  const clearMessages = () => {
    setState(prev => ({ ...prev, error: null, success: null }));
  };

  return {
    ...state,
    uploadFile,
    clearMessages,
  };
}
