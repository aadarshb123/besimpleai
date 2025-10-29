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

  const parsed = JSON.parse(content);
  return {
    verdict: parsed.verdict,
    reasoning: parsed.reasoning,
  };
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
      max_tokens: 2048,
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

  // Anthropic sometimes returns JSON in markdown code blocks
  let jsonText = content;
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1];
  }

  const parsed = JSON.parse(jsonText);
  return {
    verdict: parsed.verdict,
    reasoning: parsed.reasoning,
  };
}

// HTTPS Callable Function for evaluating answers
export const evaluateAnswer = functions.https.onCall(async (request) => {
  try {
    const { provider, modelName, systemPrompt, userPrompt } = request.data as EvaluateRequest;

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

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      retryable: true,
    };
  }
});
