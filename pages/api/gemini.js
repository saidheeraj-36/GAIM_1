import { buildPrompt, callGemini } from '@/lib/gemini';
import { chatbotSystemPrompt, contentStudioPrompt, experimentPrompt, personaPrompt } from '@/lib/prompts';

const safeJsonParse = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse Gemini response as JSON. Returning raw text instead.', error);
    return { rawText: text };
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { type, payload } = req.body;

  if (!type) {
    return res.status(400).json({ message: 'Missing request type' });
  }

  try {
    let prompt;
    switch (type) {
      case 'persona': {
        prompt = buildPrompt(personaPrompt, payload);
        break;
      }
      case 'content': {
        prompt = buildPrompt(contentStudioPrompt, payload);
        break;
      }
      case 'experiment': {
        prompt = buildPrompt(experimentPrompt, payload);
        break;
      }
      case 'chat': {
        const { messageHistory = [], brandDetails = '', personas = '', experiments = '' } = payload;
        const conversation = messageHistory
          .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
          .join('\n');
        prompt = `${chatbotSystemPrompt}\n\nBrand context:\n${brandDetails}\n\nPersonas:\n${personas}\n\nExperiment board:\n${experiments}\n\nConversation so far:\n${conversation}\n\nRespond to the latest user message with actionable advice.`;
        break;
      }
      default:
        return res.status(400).json({ message: `Unsupported request type: ${type}` });
    }

    const text = await callGemini({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    });

    const data = ['chat'].includes(type) ? text : safeJsonParse(text);
    return res.status(200).json({ data });
  } catch (error) {
    console.error('Gemini API handler error', error);
    return res.status(500).json({ message: error.message || 'Gemini API error' });
  }
}
