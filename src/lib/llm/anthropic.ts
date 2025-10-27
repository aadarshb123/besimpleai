// Anthropic (Claude) API integration

import { LLMResponse, LLMError } from './types';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export async function callAnthropic(
  modelName: string,
  systemPrompt: string,
  userPrompt: string
): Promise<LLMResponse> {
  if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
    throw new Error('Anthropic API key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file.');
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: modelName,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || `Anthropic API error: ${response.status}`;

    // Check if error is retryable (rate limit, server error)
    const retryable = response.status === 429 || response.status >= 500;

    const error: LLMError = {
      message: errorMessage,
      retryable,
    };
    throw error;
  }

  const data = await response.json();
  const content = data.content[0]?.text;

  if (!content) {
    throw new Error('No response from Anthropic');
  }

  // Parse JSON response
  try {
    const parsed = JSON.parse(content);
    return {
      verdict: parsed.verdict,
      reasoning: parsed.reasoning,
    };
  } catch (err) {
    throw new Error('Failed to parse Anthropic response as JSON');
  }
}
