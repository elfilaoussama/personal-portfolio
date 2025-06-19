import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAGwCCPyMAC4gHm18vCogXaT-E2MtUCEgw",
  authDomain: "portfolio-75d4b.firebaseapp.com",
  projectId: "portfolio-75d4b",
  storageBucket: "portfolio-75d4b.appspot.com",
  messagingSenderId: "899520571595",
  appId: "1:899520571595:web:72862e8d3712a8f783934e",
  measurementId: "G-CBPG2P6TK4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
