import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
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
        console.log('Admin hash verification:', {
          hasHash: !!newData.adminHash,
          hashValue: newData.adminHash,
          expectedHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
        });
        
        await setDoc(doc(db, 'portfolio', 'portfolioData'), newData);
        
        const docSnap = await getDoc(doc(db, 'portfolio', 'portfolioData'));
        if (!docSnap.exists()) {
          throw new Error('Write verification failed');
        }
        return true;
      } catch (error) {
        console.error('Firestore write error details:', {
          error,
          rules: 'Check firestore.rules for write permissions'
        });
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

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'portfolio', 'portfolioData'), 
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as any;
          if (JSON.stringify(data) !== JSON.stringify(portfolioData)) {
            console.log('Firestore update detected, syncing UI');
            queryClient.setQueryData(['portfolio'], data);
          }
        }
      },
      (error) => {
        console.error('Firestore listener error:', error);
      }
    );

    return () => unsubscribe();
  }, [portfolioData]);

  // Auto-save with 1 second debounce
  const autoSave = debounce((newData: any) => {
    // console.log('Attempting auto-save with data:', newData);
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
