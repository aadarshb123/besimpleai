// Core data types matching the JSON input format and our data model

// ============================================================================
// Submission Types (from JSON input)
// ============================================================================

export interface Question {
  rev: number;
  data: {
    id: string;
    questionType: string;
    questionText: string;
  };
}

export interface Answer {
  choice?: string;
  reasoning?: string;
  freeformText?: string;
  selectedOptions?: string[];
}

export interface Submission {
  id: string;
  queueId: string;
  labelingTaskId: string;
  createdAt: number;
  questions: Question[];
  answers: Record<string, Answer>;
  uploadedAt?: number;
}

// ============================================================================
// Judge Types
// ============================================================================

export type LLMProvider = 'openai' | 'anthropic';

export interface Judge {
  id: string;
  name: string;
  systemPrompt: string;
  modelName: string;
  provider: LLMProvider;
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CreateJudgeInput {
  name: string;
  systemPrompt: string;
  modelName: string;
  provider: LLMProvider;
}

// ============================================================================
// Judge Assignment Types
// ============================================================================

export interface JudgeAssignment {
  id: string;
  queueId: string;
  questionId: string;
  judgeIds: string[];
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// Evaluation Types
// ============================================================================

export type Verdict = 'pass' | 'fail' | 'inconclusive';

export interface EvaluationMetadata {
  modelUsed: string;
  provider: string;
  latency: number;
  error?: string;
  promptTokens?: number;
  completionTokens?: number;
}

export interface Evaluation {
  id: string;
  submissionId: string;
  queueId: string;
  questionId: string;
  judgeId: string;
  judgeName: string;
  verdict: Verdict;
  reasoning: string;
  createdAt: number;
  metadata: EvaluationMetadata;
}

export interface EvaluationRun {
  id: string;
  queueId: string;
  status: 'running' | 'completed' | 'failed';
  totalEvaluations: number;
  completedEvaluations: number;
  failedEvaluations: number;
  startedAt: number;
  completedAt?: number;
  error?: string;
}

// ============================================================================
// LLM API Types
// ============================================================================

export interface LLMEvaluationRequest {
  judge: Judge;
  question: Question;
  answer: Answer;
}

export interface LLMEvaluationResponse {
  verdict: Verdict;
  reasoning: string;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface EvaluationFilters {
  judgeIds: string[];
  questionIds: string[];
  verdicts: Verdict[];
}

export interface EvaluationStats {
  total: number;
  passed: number;
  failed: number;
  inconclusive: number;
  passRate: number;
}
