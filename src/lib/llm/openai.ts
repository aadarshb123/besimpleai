// OpenAI API integration

import { LLMResponse, LLMError } from './types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function callOpenAI(
  modelName: string,
  systemPrompt: string,
  userPrompt: string
): Promise<LLMResponse> {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || `OpenAI API error: ${response.status}`;

    // Check if error is retryable (rate limit, server error)
    const retryable = response.status === 429 || response.status >= 500;

    const error: LLMError = {
      message: errorMessage,
      retryable,
    };
    throw error;
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No response from OpenAI');
  }

  // Parse JSON response
  try {
    const parsed = JSON.parse(content);
    return {
      verdict: parsed.verdict,
      reasoning: parsed.reasoning,
    };
  } catch (err) {
    throw new Error('Failed to parse OpenAI response as JSON');
  }
}
