import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

interface EvaluateRequest {
  provider: 'openai' | 'anthropic';
  modelName: string;
  systemPrompt: string;
  userPrompt: string;
}

interface LLMResponse {
  verdict: 'pass' | 'fail' | 'inconclusive';
  reasoning: string;
}

// Cloud Function to proxy OpenAI API calls
async function callOpenAI(
  modelName: string,
  systemPrompt: string,
  userPrompt: string,
  apiKey: string
): Promise<LLMResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 4096,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No response from OpenAI');
  }

  try {
    const parsed = JSON.parse(content);

    if (!parsed.verdict || !parsed.reasoning) {
      throw new Error('Invalid response format: missing verdict or reasoning');
    }

    return {
      verdict: parsed.verdict,
      reasoning: parsed.reasoning,
    };
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', content);
    throw new Error(`JSON parsing failed: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
  }
}

// Cloud Function to proxy Anthropic API calls
async function callAnthropic(
  modelName: string,
  systemPrompt: string,
  userPrompt: string,
  apiKey: string
): Promise<LLMResponse> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: modelName,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text;

  if (!content) {
    throw new Error('No response from Anthropic');
  }

  try {
    // Anthropic sometimes returns JSON in markdown code blocks
    let jsonText = content;
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    const parsed = JSON.parse(jsonText);

    if (!parsed.verdict || !parsed.reasoning) {
      throw new Error('Invalid response format: missing verdict or reasoning');
    }

    return {
      verdict: parsed.verdict,
      reasoning: parsed.reasoning,
    };
  } catch (parseError) {
    console.error('Failed to parse Anthropic response:', content);
    throw new Error(`JSON parsing failed: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
  }
}

// HTTPS Callable Function for evaluating answers
export const evaluateAnswer = functions.https.onCall(async (request) => {
  try {
    const { provider, modelName, systemPrompt, userPrompt } = request.data as EvaluateRequest;

    // Validate inputs
    if (!provider || !modelName || !systemPrompt || !userPrompt) {
      throw new Error('Missing required parameters');
    }

    // Check prompt sizes to prevent context window issues
    // Rough estimate: 1 token ≈ 4 characters
    const systemTokens = Math.ceil(systemPrompt.length / 4);
    const userTokens = Math.ceil(userPrompt.length / 4);
    const totalInputTokens = systemTokens + userTokens;

    // Most models have 128k+ context windows, but let's be conservative
    // Allow up to 100k tokens for input (leaving room for output)
    const MAX_INPUT_TOKENS = 100000;

    if (totalInputTokens > MAX_INPUT_TOKENS) {
      throw new Error(`Input too large: ${totalInputTokens} tokens (max: ${MAX_INPUT_TOKENS}). Consider shortening the evaluation criteria or answer.`);
    }

    // Get API keys from environment variables
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    let result: LLMResponse;

    if (provider === 'openai') {
      if (!openaiKey) {
        throw new Error('OpenAI API key not configured');
      }
      result = await callOpenAI(modelName, systemPrompt, userPrompt, openaiKey);
    } else if (provider === 'anthropic') {
      if (!anthropicKey) {
        throw new Error('Anthropic API key not configured');
      }
      result = await callAnthropic(modelName, systemPrompt, userPrompt, anthropicKey);
    } else {
      throw new Error(`Unknown provider: ${provider}`);
    }

    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.error('Error in evaluateAnswer:', error);

    // Determine if error is retryable
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isRetryable = !errorMessage.includes('Input too large') &&
                        !errorMessage.includes('not configured') &&
                        !errorMessage.includes('Missing required parameters');

    return {
      success: false,
      error: errorMessage,
      retryable: isRetryable,
    };
  }
});
