// Quick test to check if products exist in Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function testFetchProducts() {
  console.log('🔍 Testing Firestore connection...\n');
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    console.log(`✅ Connected to Firestore`);
    console.log(`📦 Products found: ${snapshot.size}\n`);
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`- ${data.name} (ID: ${doc.id})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testFetchProducts();
