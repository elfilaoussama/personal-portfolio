import { PortfolioData } from '@/types/portfolio';
import { defaultPortfolioData } from '@/data/defaultData';

const API_URL = '/api/portfolio';

// Legacy localStorage key retained for backward compatibility (unused for portfolio data now)
const STORAGE_KEY = 'portfolio_data';
const ADMIN_CODE_KEY = 'admin_code_hash';

export const storage = {
  // Fetch latest portfolio data from server
  getPortfolioData: async (): Promise<PortfolioData> => {
    try {
      const res = await fetch(API_URL, { credentials: 'same-origin' });
      if (res.ok) {
        return (await res.json()) as PortfolioData;
      }
      return defaultPortfolioData;
    } catch (err) {
      console.error('Error fetching portfolio data', err);
      return defaultPortfolioData;
    }
  },

    // Persist portfolio data to server
  savePortfolioData: async (data: PortfolioData): Promise<void> => {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'same-origin',
    });
    if (!res.ok) {
      throw new Error('Failed to save portfolio data');
    }
  },

    exportData: async (): Promise<string> => {
    const data = await storage.getPortfolioData();
    return JSON.stringify(data, null, 2);
  },

    importData: async (jsonString: string): Promise<PortfolioData> => {
    try {
      const data = JSON.parse(jsonString);
      // Validate data structure here if needed
      await storage.savePortfolioData(data);
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
