// Main evaluation logic - orchestrates LLM calls

import { Judge, Question, Answer, Verdict } from '@/lib/types';
import { callOpenAI } from './openai';
import { callAnthropic } from './anthropic';
import { LLMResponse, LLMError } from './types';
import { MAX_RETRIES, RETRY_DELAY } from '@/utils/constants';

interface EvaluationResult {
  success: boolean;
  verdict?: Verdict;
  reasoning?: string;
  error?: string;
  latency: number;
}

// Build the user prompt from question and answer
function buildUserPrompt(question: Question, answer: Answer): string {
  const questionText = question.data.questionText;
  const choice = answer.choice || 'N/A';
  const reasoning = answer.reasoning || answer.freeformText || 'N/A';

  return `
QUESTION:
${questionText}

USER'S ANSWER:
Choice: ${choice}
Reasoning: ${reasoning}

Evaluate this answer according to the rubric provided in the system prompt.

Respond in JSON format:
{
  "verdict": "pass" | "fail" | "inconclusive",
  "reasoning": "Brief explanation of your verdict"
}
`.trim();
}

// Call the appropriate LLM based on provider
async function callLLM(
  judge: Judge,
  userPrompt: string
): Promise<LLMResponse> {
  if (judge.provider === 'openai') {
    return await callOpenAI(judge.modelName, judge.systemPrompt, userPrompt);
  } else if (judge.provider === 'anthropic') {
    return await callAnthropic(judge.modelName, judge.systemPrompt, userPrompt);
  } else {
    throw new Error(`Unknown provider: ${judge.provider}`);
  }
}

// Evaluate with retry logic
async function evaluateWithRetry(
  judge: Judge,
  question: Question,
  answer: Answer,
  retries = 0
): Promise<EvaluationResult> {
  const startTime = Date.now();

  try {
    const userPrompt = buildUserPrompt(question, answer);
    const response = await callLLM(judge, userPrompt);

    const latency = Date.now() - startTime;

    return {
      success: true,
      verdict: response.verdict,
      reasoning: response.reasoning,
      latency,
    };
  } catch (err) {
    const latency = Date.now() - startTime;

    // Check if error is retryable
    const isLLMError = (err: unknown): err is LLMError => {
      return typeof err === 'object' && err !== null && 'retryable' in err;
    };

    if (isLLMError(err) && err.retryable && retries < MAX_RETRIES) {
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retries + 1)));
      return evaluateWithRetry(judge, question, answer, retries + 1);
    }

    // Return error result
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      latency,
    };
  }
}

// Main evaluation function (exported)
export async function evaluateAnswer(
  judge: Judge,
  question: Question,
  answer: Answer
): Promise<EvaluationResult> {
  return evaluateWithRetry(judge, question, answer);
}
