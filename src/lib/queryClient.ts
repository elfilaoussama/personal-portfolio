import { QueryClient } from '@tanstack/react-query';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const PORTFOLIO_DOC = 'portfolioData';

export const queryClient = new QueryClient();

export async function fetchPortfolio() {
  const docRef = doc(db, 'portfolio', PORTFOLIO_DOC);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function updatePortfolio(data: any) {
  await setDoc(doc(db, 'portfolio', PORTFOLIO_DOC), data);
}
