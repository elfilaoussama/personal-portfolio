import { useState, useEffect } from 'react';
import { PortfolioData } from '@/types/portfolio';
import { storage } from '@/utils/storage';

export const usePortfolioData = () => {
  const [data, setData] = useState<PortfolioData>(() => storage.getPortfolioData());
  const [isLoading, setIsLoading] = useState(false);

  const updateData = async (newData: PortfolioData) => {
    setIsLoading(true);
    try {
      storage.savePortfolioData(newData);
      setData(newData);
    } catch (error) {
      console.error('Error updating portfolio data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    return storage.exportData();
  };

  const importData = async (jsonString: string) => {
    setIsLoading(true);
    try {
      const importedData = storage.importData(jsonString);
      setData(importedData);
      return importedData;
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    updateData,
    exportData,
    importData,
    isLoading
  };
};
