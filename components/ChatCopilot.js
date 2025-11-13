import { useBrand } from '@/context/BrandContext';
import { useEffect, useRef, useState } from 'react';

const initialMessages = [
  {
    role: 'assistant',
    content:
      'Hi! I am Campaign Copilot. Ask me anything about launching campaigns, crafting hooks, or scaling this brand.'
  }
];

export const ChatCopilot = ({ personas, experiments }) => {
  const { activeBrand } = useBrand();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!activeBrand) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Please set up a brand first.' }]);
      return;
    }

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chat',
          payload: {
            brandDetails: JSON.stringify(activeBrand, null, 2),
            personas: JSON.stringify(personas, null, 2),
            experiments: JSON.stringify(experiments, null, 2),
            messageHistory: [...messages, userMessage]
          }
        })
      });
      const { data } = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I ran into an error connecting to Gemini. Double-check your API key and try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="flex h-[600px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Campaign Copilot</h2>
          <p className="text-sm text-slate-500">
            Ask for campaign ideas, demand gen playbooks, creative frameworks, or measurement tips.
          </p>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto bg-white px-6 py-4 scrollbar-thin">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  message.role === 'user'
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-500">Thinking...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t border-slate-200 bg-white px-6 py-4">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="E.g. Create a launch sprint for Persona 2 using Instagram Reels"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Copilot uses your latest brand, persona, and experiment context for personalised recommendations.
            </p>
            <button
              onClick={handleSend}
              disabled={loading}
              className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-brand-300/50 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Context snapshot</h3>
          {activeBrand ? (
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Brand:</span> {activeBrand.name}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Goal:</span> {activeBrand.goal}
              </p>
              <p className="text-xs text-slate-500">{activeBrand.description}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">Complete the setup to unlock full Copilot intelligence.</p>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quick prompts</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• Build a nurture email sequence for Persona 1</li>
            <li>• Suggest 5 webinar titles for APAC CMOs</li>
            <li>• Draft paid ad hooks aligned to Experiment Angle 2</li>
            <li>• How do I measure brand lift for this launch?</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};
