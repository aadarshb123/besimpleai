// Types for LLM integration

export interface LLMResponse {
  verdict: 'pass' | 'fail' | 'inconclusive';
  reasoning: string;
}

export interface LLMError {
  message: string;
  retryable: boolean;
}
