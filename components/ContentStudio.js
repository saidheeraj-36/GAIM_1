import { useBrand } from '@/context/BrandContext';
import { useEffect, useMemo, useState } from 'react';

const tones = ['Formal', 'Casual', 'Witty', 'Hinglish', 'Storytelling', 'Premium'];
const objectives = ['Launch', 'Promotion', 'Nurture', 'Win-back', 'Thought leadership'];

export const ContentStudio = ({ personas }) => {
  const { activeBrand } = useBrand();
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [selectedTone, setSelectedTone] = useState(tones[0]);
  const [selectedObjective, setSelectedObjective] = useState(objectives[0]);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const personaOptions = useMemo(() => personas || [], [personas]);
  const selectedPersona = personaOptions.find((persona) => persona.id === selectedPersonaId) || personaOptions[0];

  // Default to the first persona whenever the list updates
  useEffect(() => {
    if (!selectedPersonaId && personaOptions.length > 0) {
      setSelectedPersonaId(personaOptions[0].id);
    }
  }, [personaOptions, selectedPersonaId]);

  const handleGenerate = async () => {
    if (!activeBrand) {
      setError('Please configure a brand in Setup first.');
      return;
    }

    if (!selectedPersona) {
      setError('Generate personas first to personalise content.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'content',
          payload: {
            brandDetails: JSON.stringify(activeBrand, null, 2),
            persona: JSON.stringify(selectedPersona, null, 2),
            tone: selectedTone,
            objective: selectedObjective
          }
        })
      });
      const { data } = await response.json();
      if (!data?.linkedinPosts) {
        throw new Error('Gemini did not return content. Check console for raw output.');
      }
      setContent(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setError('Copied to clipboard!');
      setTimeout(() => setError(''), 2000);
    } catch (copyError) {
      setError('Copy failed. Select and copy manually.');
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Multi-Channel Content Studio</h2>
          <p className="mt-1 text-sm text-slate-500">
            Generate channel-ready assets calibrated to persona, tone, and campaign objective.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedPersona?.id || ''}
            onChange={(event) => setSelectedPersonaId(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            {personaOptions.length === 0 && <option value="">Create personas first</option>}
            {personaOptions.map((persona) => (
              <option key={persona.id} value={persona.id}>
                {persona.name}
              </option>
            ))}
          </select>
          <select
            value={selectedTone}
            onChange={(event) => setSelectedTone(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            {tones.map((tone) => (
              <option key={tone}>{tone}</option>
            ))}
          </select>
          <select
            value={selectedObjective}
            onChange={(event) => setSelectedObjective(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            {objectives.map((objective) => (
              <option key={objective}>{objective}</option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-brand-300/50 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Assembling assets...' : 'Generate content suite'}
          </button>
        </div>
      </div>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      {content && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">LinkedIn Variations</h3>
              <button
                onClick={() => handleCopy(JSON.stringify(content.linkedinPosts, null, 2))}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                Copy JSON
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {content.linkedinPosts.map((post, index) => (
                <div key={index} className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
                    <span>Concept {index + 1}</span>
                    <button onClick={() => handleCopy(`${post.hook}\n\n${post.body}\n\nCTA: ${post.cta}`)}>Copy</button>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-700">{post.hook}</p>
                  <p className="mt-2 text-sm text-slate-600">{post.body}</p>
                  <div className="mt-2 text-xs text-slate-500">CTA: {post.cta}</div>
                  <div className="mt-1 text-xs text-slate-400">Hashtags: {post.hashtags?.join(' ')}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Instagram Carousel</h3>
                <button
                  onClick={() =>
                    handleCopy(
                      `${content.instagramCarousel.caption}\n\n${content.instagramCarousel.slides
                        .map((slide, index) => `Slide ${index + 1}: ${slide.title} - ${slide.point}`)
                        .join('\n')}\n\nCTA: ${content.instagramCarousel.cta}`
                    )
                  }
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Copy
                </button>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-700">{content.instagramCarousel.caption}</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {content.instagramCarousel.slides.map((slide, index) => (
                  <li key={index} className="rounded-lg bg-white px-3 py-2 shadow-sm">
                    <span className="text-xs uppercase tracking-wide text-slate-400">Slide {index + 1}</span>
                    <p className="text-sm font-medium text-slate-700">{slide.title}</p>
                    <p className="text-xs text-slate-500">{slide.point}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-medium uppercase text-brand-600">CTA: {content.instagramCarousel.cta}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">WhatsApp Broadcast</h3>
                <button
                  onClick={() =>
                    handleCopy(
                      `${content.whatsappBroadcast.hook}\n\n${content.whatsappBroadcast.body}\n\nCTA: ${content.whatsappBroadcast.cta}\nEmojis: ${content.whatsappBroadcast.emojis?.join(' ')}`
                    )
                  }
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Copy
                </button>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-700">{content.whatsappBroadcast.hook}</p>
              <p className="mt-2 text-sm text-slate-600">{content.whatsappBroadcast.body}</p>
              <p className="mt-2 text-xs font-medium uppercase text-brand-600">CTA: {content.whatsappBroadcast.cta}</p>
              <p className="mt-1 text-xs text-slate-500">Emojis: {content.whatsappBroadcast.emojis?.join(' ')}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Email Asset</h3>
                <button
                  onClick={() =>
                    handleCopy(
                      `${content.email.subjectLines.join('\n')}\n\n${content.email.body}`
                    )
                  }
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Copy
                </button>
              </div>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                {content.email.subjectLines.map((subject, index) => (
                  <li key={index} className="rounded-lg bg-white px-3 py-2 shadow-sm">
                    <span className="text-xs uppercase tracking-wide text-slate-400">Option {index + 1}</span>
                    <p className="text-sm font-medium text-slate-700">{subject}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 whitespace-pre-line rounded-lg bg-white px-3 py-3 text-sm text-slate-600 shadow-sm">
                {content.email.body}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
