import { PortfolioData } from '@/types/portfolio';
import { defaultPortfolioData } from '@/data/defaultData';

const STORAGE_KEY = 'portfolio_data';
const ADMIN_CODE_KEY = 'admin_code_hash';

export const storage = {
  getPortfolioData: (): PortfolioData => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultPortfolioData;
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      return defaultPortfolioData;
    }
  },

  savePortfolioData: (data: PortfolioData): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving portfolio data:', error);
      throw new Error('Failed to save portfolio data');
    }
  },

  exportData: (): string => {
    const data = storage.getPortfolioData();
    return JSON.stringify(data, null, 2);
  },

  importData: (jsonString: string): PortfolioData => {
    try {
      const data = JSON.parse(jsonString);
      // Validate data structure here if needed
      storage.savePortfolioData(data);
      return data;
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid JSON data');
    }
  },

  getAdminCodeHash: (): string | null => {
    return localStorage.getItem(ADMIN_CODE_KEY);
  },

  setAdminCodeHash: (hash: string): void => {
    localStorage.setItem(ADMIN_CODE_KEY, hash);
  },

  clearData: (): void => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ADMIN_CODE_KEY);
  }
};
