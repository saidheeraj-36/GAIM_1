import { useBrand } from '@/context/BrandContext';
import clsx from 'clsx';
import { useEffect } from 'react';

const tabs = [
  { id: 'setup', label: 'Setup' },
  { id: 'personas', label: 'Personas' },
  { id: 'content', label: 'Content Studio' },
  { id: 'experiments', label: 'Experiment Planner' },
  { id: 'chat', label: 'Copilot Chat' }
];

export const Layout = ({ activeTab, onTabChange, children }) => {
  const { brands, activeBrand, activeBrandId, setActiveBrandId } = useBrand();

  useEffect(() => {
    if (!activeBrandId && brands.length > 0) {
      setActiveBrandId(brands[0].id);
    }
  }, [brands, activeBrandId, setActiveBrandId]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Marketing CoPilot OS</h1>
              <p className="text-sm text-slate-500">
                AI-native operating system for modern marketing teams.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={activeBrandId || ''}
                onChange={(event) => setActiveBrandId(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                <option value="">Select brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {activeBrand && (
                <div className="hidden md:block rounded-full bg-brand-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
                  {activeBrand.goal || 'Goal not set'}
                </div>
              )}
            </div>
          </div>
          <nav className="mt-6 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-200/50'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
      <footer className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-slate-400 sm:px-6 lg:px-8">
          Built for IIMA GenAI in Marketing · Powered by Google Gemini · Designed for investor-grade polish
        </div>
      </footer>
    </div>
  );
};
