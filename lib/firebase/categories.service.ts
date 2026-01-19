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
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { FirestoreCategory, FirestoreSubcategory } from './firestore.types';

const CATEGORIES_COLLECTION = 'categories';
const SUBCATEGORIES_COLLECTION = 'subcategories';

// Get all categories with their subcategories
export async function getAllCategories(): Promise<FirestoreCategory[]> {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return [];
    }

    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const q = query(categoriesRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirestoreCategory));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Get subcategories for a category
export async function getSubcategoriesByCategory(categoryId: string): Promise<FirestoreSubcategory[]> {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return [];
    }

    const subcategoriesRef = collection(db, SUBCATEGORIES_COLLECTION);
    const q = query(
      subcategoriesRef, 
      where('categoryId', '==', categoryId),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirestoreSubcategory));
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}

// Add a new category (Admin only)
export async function addCategory(category: Omit<FirestoreCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return null;
    }

    const now = Timestamp.now();
    const categoryData = {
      ...category,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), categoryData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    return null;
  }
}

// Add a new subcategory (Admin only)
export async function addSubcategory(subcategory: Omit<FirestoreSubcategory, 'id' | 'createdAt'>): Promise<string | null> {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return null;
    }

    const subcategoryData = {
      ...subcategory,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, SUBCATEGORIES_COLLECTION), subcategoryData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding subcategory:', error);
    return null;
  }
}

// Update category (Admin only)
export async function updateCategory(id: string, updates: Partial<FirestoreCategory>): Promise<boolean> {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return false;
    }

    const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(categoryRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating category:', error);
    return false;
  }
}

// Delete category (Admin only)
export async function deleteCategory(id: string): Promise<boolean> {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return false;
    }

    const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(categoryRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
}

// Delete subcategory (Admin only)
export async function deleteSubcategory(id: string): Promise<boolean> {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return false;
    }

    const subcategoryRef = doc(db, SUBCATEGORIES_COLLECTION, id);
    await deleteDoc(subcategoryRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return false;
  }
}
