import { useBrand } from '@/context/BrandContext';
import { useState } from 'react';

export const PersonaGenerator = ({ personas, onPersonasGenerated }) => {
  const { activeBrand } = useBrand();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!activeBrand) {
      setError('Please configure a brand in Setup first.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'persona',
          payload: {
            brandDetails: JSON.stringify(activeBrand, null, 2),
            feedback
          }
        })
      });
      const { data } = await response.json();
      if (!data?.personas) {
        throw new Error('Gemini did not return personas. Check raw output in console.');
      }
      onPersonasGenerated(data.personas);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate personas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,2fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Persona & Insight Generator</h2>
          <span className="text-xs font-medium uppercase tracking-wide text-brand-600">Step 2</span>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Paste customer anecdotes, survey nuggets, or notes. Gemini converts them into sharp micro-personas.
        </p>
        <textarea
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          rows={8}
          placeholder="Optional: Paste customer interviews, testimonials, support chats..."
          className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-inner focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 w-full rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-brand-300/50 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Thinking with Gemini...' : 'Generate personas'}
        </button>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>
      <div className="space-y-4">
        {(!personas || personas.length === 0) && (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h3 className="text-lg font-semibold text-slate-700">No personas yet</h3>
            <p className="mt-2 text-sm text-slate-500">
              Generate personas to unlock personalised content, campaign experiments, and smarter chat assistance.
            </p>
          </div>
        )}
        {personas?.map((persona) => (
          <div key={persona.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {persona.name}{' '}
                  <span className="text-sm font-normal text-slate-500">({persona.label})</span>
                </h3>
                <p className="mt-1 text-sm text-slate-500">{persona.summary}</p>
              </div>
              <div className="rounded-full bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
                Priority fit
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Goals</h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {persona.goals?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pains</h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {persona.pains?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Triggers</h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {persona.triggers?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Objections</h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {persona.objections?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
              <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">
                Prefers: {persona.preferredChannels?.join(', ')}
              </div>
              <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">
                Quote: “{persona.sampleQuote}”
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
