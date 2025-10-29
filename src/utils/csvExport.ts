// CSV Export Utility

import { Evaluation } from '@/lib/types';

/**
 * Converts evaluations to CSV format and triggers download
 */
export function exportEvaluationsToCSV(evaluations: Evaluation[], filename = 'evaluations.csv') {
  if (evaluations.length === 0) {
    alert('No evaluations to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'Submission ID',
    'Queue ID',
    'Question ID',
    'Judge Name',
    'Judge ID',
    'Provider',
    'Model',
    'Verdict',
    'Reasoning',
    'Created At',
    'Latency (ms)',
    'Prompt Tokens',
    'Completion Tokens',
  ];

  // Convert evaluations to CSV rows
  const rows = evaluations.map(evaluation => [
    evaluation.submissionId,
    evaluation.queueId,
    evaluation.questionId,
    evaluation.judgeName,
    evaluation.judgeId,
    evaluation.metadata.provider,
    evaluation.metadata.modelUsed,
    evaluation.verdict,
    `"${evaluation.reasoning.replace(/"/g, '""')}"`, // Escape quotes in reasoning
    new Date(evaluation.createdAt).toLocaleString(),
    evaluation.metadata.latency?.toString() || '',
    evaluation.metadata.promptTokens?.toString() || '',
    evaluation.metadata.completionTokens?.toString() || '',
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
