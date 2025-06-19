import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "portfolio-75d4b.firebaseapp.com",
  projectId: "portfolio-75d4b",
  storageBucket: "portfolio-75d4b.appspot.com",
  messagingSenderId: "103484558667",
  appId: "1:103484558667:web:9b3b1a1b3b1a1b3b1a1b3b",
  measurementId: "G-CBPG2P6TK4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
