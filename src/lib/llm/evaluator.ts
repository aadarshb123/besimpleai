// Main evaluation logic - orchestrates LLM calls via Cloud Functions

import { Judge, Question, Answer, Verdict } from '@/lib/types';
import { functions } from '@/lib/firebase/config';
import { httpsCallable } from 'firebase/functions';
import { MAX_RETRIES, RETRY_DELAY } from '@/utils/constants';

interface EvaluationResult {
  success: boolean;
  verdict?: Verdict;
  reasoning?: string;
  error?: string;
  latency: number;
}

interface CloudFunctionResponse {
  success: boolean;
  verdict?: Verdict;
  reasoning?: string;
  error?: string;
  retryable?: boolean;
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

// Call the Cloud Function to evaluate
async function callCloudFunction(
  judge: Judge,
  userPrompt: string
): Promise<CloudFunctionResponse> {
  const evaluateAnswerFn = httpsCallable<unknown, CloudFunctionResponse>(
    functions,
    'evaluateAnswer'
  );

  const result = await evaluateAnswerFn({
    provider: judge.provider,
    modelName: judge.modelName,
    systemPrompt: judge.systemPrompt,
    userPrompt,
  });

  return result.data;
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
    const response = await callCloudFunction(judge, userPrompt);

    const latency = Date.now() - startTime;

    if (response.success && response.verdict && response.reasoning) {
      return {
        success: true,
        verdict: response.verdict,
        reasoning: response.reasoning,
        latency,
      };
    } else {
      throw new Error(response.error || 'Unknown error from Cloud Function');
    }
  } catch (err) {
    const latency = Date.now() - startTime;

    // Check if error is retryable
    const errorObj = err as { message?: string; retryable?: boolean };
    const isRetryable = errorObj.retryable === true;

    if (isRetryable && retries < MAX_RETRIES) {
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
