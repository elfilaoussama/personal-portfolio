import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
const db = getFirestore(app);

async function importData() {
  const dataPath = path.join(__dirname, '../public/data/portfolio.json');
  const jsonData = JSON.parse(await fs.readFile(dataPath, 'utf8'));
  
  await setDoc(doc(db, 'portfolio', 'portfolioData'), jsonData);
  console.log('Data imported successfully!');
}

importData().catch(console.error);
