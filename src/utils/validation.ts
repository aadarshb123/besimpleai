// JSON validation utilities

import { Submission } from '@/lib/types';

export function validateSubmissionJSON(data: unknown): data is Submission[] {
  if (!Array.isArray(data)) {
    return false;
  }

  // Check each submission has required fields
  for (const item of data) {
    if (!item.id || typeof item.id !== 'string') return false;
    if (!item.queueId || typeof item.queueId !== 'string') return false;
    if (!item.labelingTaskId || typeof item.labelingTaskId !== 'string') return false;
    if (!item.createdAt || typeof item.createdAt !== 'number') return false;
    if (!Array.isArray(item.questions)) return false;
    if (!item.answers || typeof item.answers !== 'object') return false;
  }

  return true;
}

export async function parseJSONFile(file: File): Promise<Submission[]> {
  const text = await file.text();
  const data = JSON.parse(text);

  if (!validateSubmissionJSON(data)) {
    throw new Error('Invalid JSON format. Expected an array of submissions.');
  }

  return data;
}
