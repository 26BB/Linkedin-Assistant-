/**
 * aiApi.js — Multi-provider AI service for LinkedIn AI Assistant
 *
 * Supported providers:
 *  • OpenAI          (gpt-4o-mini)
 *  • Google Gemini   (gemini-1.5-flash)
 *  • Anthropic Claude(claude-3-haiku-20240307)
 *  • Mistral AI      (mistral-small-latest)
 *  • Groq            (llama-3.1-8b-instant)
 *
 * API keys are read from localStorage (set via Settings page) or from
 * Vite env vars as fallback — so anyone can fork and self-host easily.
 */

export const PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    model: 'gpt-4o-mini',
    icon: '🤖',
    docsUrl: 'https://platform.openai.com/api-keys',
    keyPlaceholder: 'sk-...',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    model: 'gemini-1.5-flash',
    icon: '✨',
    docsUrl: 'https://aistudio.google.com/app/apikey',
    keyPlaceholder: 'AIza...',
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    model: 'claude-3-haiku-20240307',
    icon: '🧠',
    docsUrl: 'https://console.anthropic.com/settings/keys',
    keyPlaceholder: 'sk-ant-...',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    model: 'mistral-small-latest',
    icon: '🌪️',
    docsUrl: 'https://console.mistral.ai/api-keys/',
    keyPlaceholder: 'your-mistral-key',
  },
  {
    id: 'groq',
    name: 'Groq',
    model: 'llama-3.1-8b-instant',
    icon: '⚡',
    docsUrl: 'https://console.groq.com/keys',
    keyPlaceholder: 'gsk_...',
  },
];

// ─── Key helpers ─────────────────────────────────────────────────────────────

const ENV_KEY_MAP = {
  openai: import.meta.env.VITE_OPENAI_API_KEY,
  gemini: import.meta.env.VITE_GEMINI_API_KEY,
  anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY,
  mistral: import.meta.env.VITE_MISTRAL_API_KEY,
  groq: import.meta.env.VITE_GROQ_API_KEY,
};

export function getApiKey(providerId) {
  return localStorage.getItem(`ai_key_${providerId}`) || ENV_KEY_MAP[providerId] || '';
}

export function saveApiKey(providerId, key) {
  localStorage.setItem(`ai_key_${providerId}`, key);
}

export function getSelectedProvider() {
  return localStorage.getItem('ai_provider') || 'openai';
}

export function saveSelectedProvider(providerId) {
  localStorage.setItem('ai_provider', providerId);
}

// ─── Prompt builder ──────────────────────────────────────────────────────────

function buildSystemPrompt() {
  return `You are an expert LinkedIn content strategist. Write compelling, authentic LinkedIn posts that drive engagement.
Format posts with line breaks for readability. Include relevant emojis sparingly, and add 3-5 hashtags at the end.
Do not include any meta-commentary — output only the post text itself.`;
}

function buildUserPrompt(topic, tone) {
  return `Write a LinkedIn post about: "${topic}"

Tone: ${tone}
Length: 150–300 words
Style: First-person, authentic, insightful`;
}

// ─── Provider implementations ─────────────────────────────────────────────────

async function callOpenAI(apiKey, topic, tone, model) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(topic, tone) },
      ],
      max_tokens: 600,
      temperature: 0.8,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI error ${res.status}`);
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

async function callGemini(apiKey, topic, tone, model) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: buildSystemPrompt() + '\n\n' + buildUserPrompt(topic, tone) },
          ],
        },
      ],
      generationConfig: { maxOutputTokens: 600, temperature: 0.8 },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini error ${res.status}`);
  }
  const data = await res.json();
  return data.candidates[0].content.parts[0].text.trim();
}

async function callAnthropic(apiKey, topic, tone, model) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      // Required for browser-side CORS — user must enable "beta" flag in their Claude console
      'anthropic-dangerous-request-origin': window.location.origin,
    },
    body: JSON.stringify({
      model,
      max_tokens: 600,
      system: buildSystemPrompt(),
      messages: [{ role: 'user', content: buildUserPrompt(topic, tone) }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Anthropic error ${res.status}`);
  }
  const data = await res.json();
  return data.content[0].text.trim();
}

async function callMistral(apiKey, topic, tone, model) {
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(topic, tone) },
      ],
      max_tokens: 600,
      temperature: 0.8,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Mistral error ${res.status}`);
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

async function callGroq(apiKey, topic, tone, model) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(topic, tone) },
      ],
      max_tokens: 600,
      temperature: 0.8,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq error ${res.status}`);
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export async function generateLinkedInPost(topic, tone) {
  const providerId = getSelectedProvider();
  const provider = PROVIDERS.find((p) => p.id === providerId);
  if (!provider) throw new Error('Unknown provider selected.');

  const apiKey = getApiKey(providerId);
  if (!apiKey) {
    throw new Error(
      `No API key found for ${provider.name}. Go to Settings → paste your key.`
    );
  }

  switch (providerId) {
    case 'openai':    return callOpenAI(apiKey, topic, tone, provider.model);
    case 'gemini':    return callGemini(apiKey, topic, tone, provider.model);
    case 'anthropic': return callAnthropic(apiKey, topic, tone, provider.model);
    case 'mistral':   return callMistral(apiKey, topic, tone, provider.model);
    case 'groq':      return callGroq(apiKey, topic, tone, provider.model);
    default:          throw new Error(`Provider "${providerId}" not implemented.`);
  }
}

/**
 * Quick connection test — generates a 5-word sentence to validate the key.
 */
export async function testConnection(providerId, apiKey) {
  const provider = PROVIDERS.find((p) => p.id === providerId);
  if (!provider) throw new Error('Unknown provider');

  const topic = 'a quick API connection test';
  const tone = 'Conversational';

  // temporarily store key, call, then restore original
  const original = localStorage.getItem(`ai_key_${providerId}`);
  localStorage.setItem(`ai_key_${providerId}`, apiKey);
  try {
    await generateLinkedInPost(topic, tone);
  } finally {
    if (original === null) localStorage.removeItem(`ai_key_${providerId}`);
    else localStorage.setItem(`ai_key_${providerId}`, original);
  }
}



export async function chatWithMcp(messages, mcpTools) {
  const providerId = getSelectedProvider();
  const apiKey = getApiKey(providerId);
  if (!apiKey) throw new Error(`No API key for ${providerId}`);

  const provider = PROVIDERS.find((p) => p.id === providerId);
  if (!provider) throw new Error('Provider not found');

  // Format MCP tools to OpenAI tool format
  const tools = mcpTools && mcpTools.length > 0 ? mcpTools.map(t => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.inputSchema
    }
  })) : undefined;

  // We are keeping this simple and mainly supporting OpenAI style tool calls (used by OpenAI, Mistral, Groq, and broadly Anthropic/Gemini but requires specific payload changes if not native)
  // For maximum compatibility in a short amount of time, let's implement the OpenAI/Groq/Mistral fetch logic,
  // and handle Anthropic/Gemini slightly differently if needed.
  // Actually, Anthropic uses different tool syntax. For simplicity, we'll implement OpenAI's tool format for OpenAI, Groq, Mistral.

  if (providerId === 'anthropic' || providerId === 'gemini') {
     console.warn("Tool calling for Anthropic/Gemini might need custom adapter. Falling back to OpenAI format if supported by proxy or ignoring tools.");
     // we'll still try to send it, but we should probably tell the user
  }

  const payload = {
    model: provider.model,
    messages: messages,
  };

  if (tools) {
     payload.tools = tools;
     payload.tool_choice = "auto";
  }

  let apiUrl = '';
  let headers = {
    'Content-Type': 'application/json',
  };

  // Setup based on provider (copied from generateLinkedInPost roughly)
  if (providerId === 'openai') {
    apiUrl = 'https://api.openai.com/v1/chat/completions';
    headers.Authorization = `Bearer ${apiKey}`;
  } else if (providerId === 'groq') {
    apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    headers.Authorization = `Bearer ${apiKey}`;
  } else if (providerId === 'mistral') {
    apiUrl = 'https://api.mistral.ai/v1/chat/completions';
    headers.Authorization = `Bearer ${apiKey}`;
  } else if (providerId === 'anthropic') {
    apiUrl = 'https://api.anthropic.com/v1/messages';
    headers['x-api-key'] = apiKey;
    headers['anthropic-version'] = '2023-06-01';
    headers['anthropic-cors-mac'] = 'true';

    // Convert messages and tools to Anthropic format
    const systemMsgs = messages.filter(m => m.role === 'system').map(m => m.content).join('\n');
    const userMsgs = messages.filter(m => m.role !== 'system');

    let anthropicPayload = {
      model: provider.model,
      max_tokens: 1024,
      messages: userMsgs,
    };
    if (systemMsgs) anthropicPayload.system = systemMsgs;

    if (mcpTools && mcpTools.length > 0) {
      anthropicPayload.tools = mcpTools.map(t => ({
        name: t.name,
        description: t.description,
        input_schema: t.inputSchema
      }));
    }

    const res = await fetch(apiUrl, { method: 'POST', headers, body: JSON.stringify(anthropicPayload) });
    if (!res.ok) throw new Error(`Anthropic error: ${await res.text()}`);
    const data = await res.json();

    // Check if Anthropic decided to call a tool
    if (data.stop_reason === 'tool_use') {
      const toolCall = data.content.find(c => c.type === 'tool_use');
      return {
        message: {
           role: 'assistant',
           content: data.content.filter(c => c.type === 'text').map(c => c.text).join('\n') || null,
           tool_calls: [{
             id: toolCall.id,
             type: 'function',
             function: {
               name: toolCall.name,
               arguments: JSON.stringify(toolCall.input)
             }
           }]
        }
      };
    }

    return {
      message: {
        role: 'assistant',
        content: data.content[0]?.text || ''
      }
    };
  } else if (providerId === 'gemini') {
    apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${provider.model}:generateContent?key=${apiKey}`;

    // Gemini uses a different format, omit tools for now to keep it simple, or implement if needed.
    // For simplicity, we just send standard text message for gemini
    const geminiPayload = {
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content || '' }]
      }))
    };

    // Very basic tool mapping for Gemini
    if (mcpTools && mcpTools.length > 0) {
       geminiPayload.tools = [{
          functionDeclarations: mcpTools.map(t => ({
             name: t.name,
             description: t.description,
             parameters: t.inputSchema
          }))
       }];
    }

    const res = await fetch(apiUrl, { method: 'POST', headers, body: JSON.stringify(geminiPayload) });
    if (!res.ok) throw new Error(`Gemini error: ${await res.text()}`);
    const data = await res.json();

    const part = data.candidates?.[0]?.content?.parts?.[0];
    if (part?.functionCall) {
       return {
         message: {
           role: 'assistant',
           content: null,
           tool_calls: [{
             id: "call_" + Math.random().toString(36).substring(7),
             type: 'function',
             function: {
               name: part.functionCall.name,
               arguments: JSON.stringify(part.functionCall.args)
             }
           }]
         }
       };
    }

    return {
      message: {
        role: 'assistant',
        content: part?.text || ''
      }
    };
  }

  // Fallback for OpenAI compatible APIs
  const res = await fetch(apiUrl, { method: 'POST', headers, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(`${provider.name} API Error: ${await res.text()}`);
  const data = await res.json();

  return data.choices[0];
}
