import { useState, useEffect } from 'react';
import { PortfolioData } from '@/types/portfolio';
import { defaultPortfolioData } from '@/data/defaultData';

const API_URL = '/api/portfolio';

export const usePortfolioData = () => {
    const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [isLoading, setIsLoading] = useState(false);

  // initial load
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(API_URL, { credentials: 'same-origin' });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load portfolio data', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const updateData = async (newData: PortfolioData) => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error('Failed to save data');
      setData(newData);
    } finally {
      setIsLoading(false);
    }
  };

    const exportData = () => JSON.stringify(data, null, 2);

  const importData = async (jsonString: string) => {
    const importedData = JSON.parse(jsonString) as PortfolioData;
    await updateData(importedData);
    return importedData;
  };

  return {
    data,
    updateData,
    exportData,
    importData,
    isLoading
  };
};
