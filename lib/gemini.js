const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const callGemini = async (payload) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY. Add it to your .env.local file.');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text;
};

export const buildPrompt = (template, variables = {}) => {
  let prompt = template;
  Object.entries(variables).forEach(([key, value]) => {
    const safeValue = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    prompt = prompt.replaceAll(`{{${key}}}`, safeValue || '');
  });
  return prompt;
};
