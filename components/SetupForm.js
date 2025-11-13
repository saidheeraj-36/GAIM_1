import { useBrand } from '@/context/BrandContext';
import { generateId } from '@/utils/helpers';
import { useEffect, useMemo, useState } from 'react';

const initialForm = {
  id: '',
  name: '',
  description: '',
  audience: '',
  geography: '',
  goal: 'Lead generation',
  notes: ''
};

export const SetupForm = () => {
  const { brands, activeBrand, activeBrandId, setActiveBrandId, upsertBrand, deleteBrand } = useBrand();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (activeBrand) {
      setForm(activeBrand);
    } else {
      setForm(initialForm);
    }
  }, [activeBrand]);

  const isNewBrand = useMemo(() => !form.id, [form.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name || !form.description || !form.audience) {
      setStatus('Please fill in brand name, product description, and audience.');
      return;
    }

    const id = form.id || generateId();
    const brandRecord = { ...form, id, updatedAt: new Date().toISOString() };
    upsertBrand(brandRecord);
    setActiveBrandId(id);
    setStatus('Brand saved successfully.');
    setTimeout(() => setStatus(''), 2500);
  };

  const handleReset = () => {
    setForm(initialForm);
    setActiveBrandId(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Brand & Audience Setup</h2>
          <span className="text-xs font-medium uppercase tracking-wide text-brand-600">Step 1</span>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Capture foundational context once and reuse it across personas, content, experiments, and chat.
        </p>
        <div className="mt-6 grid gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Brand / Project name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="E.g. FreshCart, an on-demand grocery app"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Product / Service description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the offering, positioning, and differentiators"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Target audience</label>
            <textarea
              name="audience"
              value={form.audience}
              onChange={handleChange}
              rows={2}
              placeholder="Who are you targeting? Mention demographics, firmographics, psychographics."
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Primary geography</label>
              <input
                type="text"
                name="geography"
                value={form.geography}
                onChange={handleChange}
                placeholder="APAC, North America, Tier-1 Indian cities, etc."
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Core marketing goal</label>
              <select
                name="goal"
                value={form.goal}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                <option>Lead generation</option>
                <option>App installs</option>
                <option>E-commerce sales</option>
                <option>Event registrations</option>
                <option>Community growth</option>
                <option>Brand awareness</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Internal notes (optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              placeholder="Launch timeline, key metrics, budget guardrails, etc."
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
        </div>
        {status && <p className="mt-4 text-sm text-brand-600">{status}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-brand-300/50 transition hover:bg-brand-700"
          >
            {isNewBrand ? 'Create brand workspace' : 'Update brand workspace'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
          >
            Start fresh
          </button>
        </div>
      </form>
      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Active workspaces</h3>
          <p className="mt-2 text-sm text-slate-500">
            Easily switch between brands or experiments. Delete when done to keep things tidy.
          </p>
          <div className="mt-4 space-y-3">
            {brands.length === 0 && <p className="text-sm text-slate-400">No brands yet. Create your first workspace.</p>}
            {brands.map((brand) => (
              <div
                key={brand.id}
                className={`rounded-xl border px-4 py-3 ${
                  brand.id === activeBrandId ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{brand.name}</p>
                    <p className="text-xs text-slate-500">Goal: {brand.goal}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveBrandId(brand.id)}
                      className="rounded-full border border-brand-200 px-3 py-1 text-xs font-semibold text-brand-600 transition hover:bg-brand-100"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => deleteBrand(brand.id)}
                      className="text-xs font-medium text-slate-400 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50 via-white to-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pro tip</h3>
          <p className="mt-2 text-sm text-slate-600">
            Drop short qualitative notes (user interviews, support transcripts) into the Persona module for deeper insights.
          </p>
        </div>
      </aside>
    </div>
  );
};
