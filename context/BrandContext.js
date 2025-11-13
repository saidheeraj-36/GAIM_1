import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const BrandContext = createContext();

// Helper to read from localStorage safely when running in browser
const readLocalStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.warn('Failed to read localStorage', error);
    return fallback;
  }
};

export const BrandProvider = ({ children }) => {
  const [brands, setBrands] = useState(() => readLocalStorage('marketing-copilot-brands', []));
  const [activeBrandId, setActiveBrandId] = useState(() => {
    const stored = readLocalStorage('marketing-copilot-active-brand', null);
    return stored;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('marketing-copilot-brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('marketing-copilot-active-brand', JSON.stringify(activeBrandId));
  }, [activeBrandId]);

  const upsertBrand = (brand) => {
    setBrands((prev) => {
      const exists = prev.find((b) => b.id === brand.id);
      if (exists) {
        return prev.map((b) => (b.id === brand.id ? { ...exists, ...brand } : b));
      }
      return [...prev, brand];
    });
  };

  const deleteBrand = (id) => {
    setBrands((prev) => prev.filter((brand) => brand.id !== id));
    setActiveBrandId((prev) => (prev === id ? null : prev));
  };

  const value = useMemo(
    () => ({
      brands,
      activeBrandId,
      setActiveBrandId,
      upsertBrand,
      deleteBrand,
      activeBrand: brands.find((brand) => brand.id === activeBrandId) || null
    }),
    [brands, activeBrandId]
  );

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) throw new Error('useBrand must be used within BrandProvider');
  return context;
};
