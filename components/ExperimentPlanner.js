import { useBrand } from '@/context/BrandContext';
import { useEffect, useState } from 'react';

const channels = ['Meta Ads', 'Google Ads', 'LinkedIn Ads', 'Email', 'WhatsApp', 'Influencer'];

export const ExperimentPlanner = ({ onExperimentsGenerated, experiments }) => {
  const { activeBrand } = useBrand();
  const [selectedGoal, setSelectedGoal] = useState(activeBrand?.goal || 'Lead generation');
  const [selectedChannel, setSelectedChannel] = useState(channels[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Keep the goal selector aligned with the active brand when switching workspaces
  useEffect(() => {
    if (activeBrand?.goal) {
      setSelectedGoal(activeBrand.goal);
    }
  }, [activeBrand?.goal]);

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
          type: 'experiment',
          payload: {
            brandDetails: JSON.stringify(activeBrand, null, 2),
            goal: selectedGoal,
            channel: selectedChannel
          }
        })
      });
      const { data } = await response.json();
      if (!data?.angles) {
        throw new Error('Gemini did not return experiment angles.');
      }
      const enriched = data.angles.map((angle) => ({ ...angle, notes: '', status: 'Planned' }));
      onExperimentsGenerated(enriched);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate experiment plan');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (index, field, value) => {
    const updated = experiments.map((item, idx) => (idx === index ? { ...item, [field]: value } : item));
    onExperimentsGenerated(updated);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Campaign Experiment Planner</h2>
          <p className="mt-1 text-sm text-slate-500">
            Orchestrate message testing with structured hypotheses, hooks, and creative briefs.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedGoal}
            onChange={(event) => setSelectedGoal(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            <option>Lead generation</option>
            <option>App installs</option>
            <option>E-commerce sales</option>
            <option>Event registrations</option>
            <option>Community growth</option>
            <option>Brand awareness</option>
          </select>
          <select
            value={selectedChannel}
            onChange={(event) => setSelectedChannel(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            {channels.map((channel) => (
              <option key={channel}>{channel}</option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-brand-300/50 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Mapping angles...' : 'Generate plan'}
          </button>
        </div>
      </div>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Angle</th>
              <th className="px-4 py-3">Hypothesis</th>
              <th className="px-4 py-3">Primary metric</th>
              <th className="px-4 py-3">Hooks</th>
              <th className="px-4 py-3">Creative brief</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Learning notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {(!experiments || experiments.length === 0) && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                  No experiments yet. Generate a plan to populate your board.
                </td>
              </tr>
            )}
            {experiments?.map((angle, index) => (
              <tr key={angle.title} className="bg-white">
                <td className="px-4 py-4 align-top font-semibold text-slate-800">{angle.title}</td>
                <td className="px-4 py-4 align-top text-slate-600">{angle.hypothesis}</td>
                <td className="px-4 py-4 align-top text-slate-600">{angle.primaryMetric}</td>
                <td className="px-4 py-4 align-top text-slate-600">
                  <ul className="list-disc space-y-1 pl-4">
                    {angle.hooks?.map((hook, hookIndex) => (
                      <li key={hookIndex}>{hook}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-4 align-top text-slate-600">
                  <ul className="list-disc space-y-1 pl-4">
                    {angle.creativeBrief?.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-4 align-top">
                  <select
                    value={angle.status}
                    onChange={(event) => updateStatus(index, 'status', event.target.value)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  >
                    <option>Planned</option>
                    <option>In-flight</option>
                    <option>Winner</option>
                    <option>Parked</option>
                  </select>
                </td>
                <td className="px-4 py-4 align-top">
                  <textarea
                    value={angle.notes}
                    onChange={(event) => updateStatus(index, 'notes', event.target.value)}
                    rows={3}
                    placeholder="Document learnings, metrics, next steps"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
