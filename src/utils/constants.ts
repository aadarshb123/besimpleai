// Application constants

import { LLMProvider, Verdict } from '@/lib/types';

// ============================================================================
// LLM Provider Configuration
// ============================================================================

export const LLM_PROVIDERS: { value: LLMProvider; label: string }[] = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
];

export const MODEL_OPTIONS: Record<
  LLMProvider,
  { value: string; label: string }[]
> = {
  openai: [
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-4', label: 'GPT-4' },
  ],
  anthropic: [
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
    { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
  ],
};

// ============================================================================
// Verdict Configuration
// ============================================================================

export const VERDICT_OPTIONS: { value: Verdict; label: string }[] = [
  { value: 'pass', label: 'Pass' },
  { value: 'fail', label: 'Fail' },
  { value: 'inconclusive', label: 'Inconclusive' },
];

export const VERDICT_COLORS: Record<Verdict, string> = {
  pass: 'text-green-700 bg-green-100',
  fail: 'text-red-700 bg-red-100',
  inconclusive: 'text-yellow-700 bg-yellow-100',
};

// ============================================================================
// Firebase Collection Names
// ============================================================================

export const COLLECTIONS = {
  SUBMISSIONS: 'submissions',
  JUDGES: 'judges',
  ASSIGNMENTS: 'judgeAssignments',
  EVALUATIONS: 'evaluations',
  EVALUATION_RUNS: 'evaluationRuns',
} as const;

// ============================================================================
// UI Constants
// ============================================================================

export const PAGE_SIZE = 20;
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000; // milliseconds
