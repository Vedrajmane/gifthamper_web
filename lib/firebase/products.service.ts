import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './config';
import { Product } from '../types/product';
import { FirestoreProduct } from './firestore.types';

const PRODUCTS_COLLECTION = 'products';

// Convert Firestore document to Product
function firestoreToProduct(doc: QueryDocumentSnapshot<DocumentData>): Product {
  const data = doc.data() as FirestoreProduct;
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    imageUrl: data.imageUrl,
    createdAt: data.createdAt?.toDate(),
  };
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return [];
    }

    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    
    return snapshot.docs.map(firestoreToProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return [];
    }

    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef, where('category', '==', category));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(firestoreToProduct);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

// Get single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return null;
    }

    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    const snapshot = await getDoc(productRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    return firestoreToProduct(snapshot as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Add a new product (Admin only)
export async function addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<string | null> {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return null;
    }

    const now = Timestamp.now();
    const productData: Omit<FirestoreProduct, 'id'> = {
      ...product,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
}

// Update a product (Admin only)
export async function updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return false;
    }

    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
}

// Delete a product (Admin only)
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return false;
    }

    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(productRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}
