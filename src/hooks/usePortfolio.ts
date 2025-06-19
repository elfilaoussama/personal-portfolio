import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { debounce } from 'lodash';
import { toast } from '@/hooks/use-toast';

export function usePortfolio() {
  const queryClient = useQueryClient();
  
  const { data: portfolioData, isLoading, error } = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const docRef = doc(db, 'portfolio', 'portfolioData');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (newData: any) => {
      try {
        await setDoc(doc(db, 'portfolio', 'portfolioData'), newData);
        // Verify write was successful
        const docRef = doc(db, 'portfolio', 'portfolioData');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists() || JSON.stringify(docSnap.data()) !== JSON.stringify(newData)) {
          throw new Error('Failed to verify Firestore update');
        }
      } catch (error) {
        console.error('Firestore update error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
    onError: (error) => {
      toast({
        title: 'Save failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Auto-save with 1 second debounce
  const autoSave = debounce((newData: any) => {
    console.log('Attempting auto-save with data:', newData);
    updateMutation.mutate(newData, {
      onSuccess: () => console.log('Auto-save successful'),
      onError: (error) => console.error('Auto-save failed:', error)
    });
  }, 1000);

  return {
    portfolio: portfolioData,
    isLoading,
    error,
    updatePortfolio: autoSave
  };
}
