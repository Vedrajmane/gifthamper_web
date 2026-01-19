import { 
  doc, 
  getDoc, 
  setDoc, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import { CartItem } from '../types/product';
import { FirestoreUserCart } from './firestore.types';
import { getCart as getLocalCart, saveCart as saveLocalCart } from '../utils/cart';

const CARTS_COLLECTION = 'carts';

// Get user's cart from Firestore
export async function getUserCart(userId: string): Promise<CartItem[]> {
  try {
    if (!db || !userId) {
      return [];
    }

    const cartRef = doc(db, CARTS_COLLECTION, userId);
    const snapshot = await getDoc(cartRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const data = snapshot.data() as FirestoreUserCart;
    return (data.items || []) as CartItem[];
  } catch (error) {
    console.error('Error fetching user cart:', error);
    return [];
  }
}

// Save user's cart to Firestore
export async function saveUserCart(userId: string, cart: CartItem[]): Promise<boolean> {
  try {
    if (!db || !userId) {
      return false;
    }

    const cartRef = doc(db, CARTS_COLLECTION, userId);
    // @ts-ignore - Type mismatch between PersonalizationData and ProductPersonalization
    const cartData: FirestoreUserCart = {
      userId,
      items: cart.map(item => ({
        ...item,
        addedAt: Timestamp.now(),
      })) as any,
      updatedAt: Timestamp.now(),
    };

    await setDoc(cartRef, cartData);
    return true;
  } catch (error) {
    console.error('Error saving user cart:', error);
    return false;
  }
}

// Sync local cart with cloud cart (merge strategy)
export async function syncCartToCloud(userId: string): Promise<CartItem[]> {
  try {
    if (!userId) {
      return getLocalCart();
    }

    // Get both local and cloud carts
    const localCart = getLocalCart();
    const cloudCart = await getUserCart(userId);

    // Merge strategy: combine both carts, avoid duplicates
    const mergedCart: CartItem[] = [...cloudCart];
    
    localCart.forEach(localItem => {
      const existsInCloud = cloudCart.some(cloudItem => cloudItem.id === localItem.id);
      if (!existsInCloud) {
        mergedCart.push(localItem);
      }
    });

    // Save merged cart to both cloud and local
    await saveUserCart(userId, mergedCart);
    saveLocalCart(mergedCart);

    return mergedCart;
  } catch (error) {
    console.error('Error syncing cart:', error);
    return getLocalCart();
  }
}

// Clear user's cart from Firestore
export async function clearUserCart(userId: string): Promise<boolean> {
  try {
    if (!db || !userId) {
      return false;
    }

    const cartRef = doc(db, CARTS_COLLECTION, userId);
    await setDoc(cartRef, {
      userId,
      items: [],
      updatedAt: Timestamp.now(),
    } as FirestoreUserCart);
    
    return true;
  } catch (error) {
    console.error('Error clearing user cart:', error);
    return false;
  }
}
