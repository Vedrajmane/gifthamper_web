import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { products } from '../lib/data/products';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function migrateProducts() {
  console.log('🚀 Starting product migration to Firestore...\n');

  // Validate Firebase config
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('❌ Firebase configuration is missing!');
    console.error('Please ensure .env.local file exists with all Firebase credentials.');
    process.exit(1);
  }

  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log(`✅ Connected to Firebase project: ${firebaseConfig.projectId}\n`);
    console.log(`📦 Found ${products.length} products to migrate\n`);

    let successCount = 0;
    let failCount = 0;

    // Upload each product
    for (const product of products) {
      try {
        const productData = {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, 'products'), productData);
        console.log(`✅ Migrated: ${product.name} (ID: ${docRef.id})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to migrate: ${product.name}`, error);
        failCount++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Success: ${successCount} products migrated`);
    if (failCount > 0) {
      console.log(`❌ Failed: ${failCount} products`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎉 Migration complete!');
    console.log('You can view your products in Firebase Console:');
    console.log(`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateProducts();
