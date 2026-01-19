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
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { FirestoreDeliveryAddress } from './firestore.types';

const ADDRESSES_COLLECTION = 'addresses';

// Get all addresses for a user
export async function getUserAddresses(userId: string): Promise<FirestoreDeliveryAddress[]> {
  try {
    if (!db || !userId) {
      return [];
    }

    const addressesRef = collection(db, ADDRESSES_COLLECTION);
    const q = query(addressesRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirestoreDeliveryAddress));
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
}

// Get default address for a user
export async function getDefaultAddress(userId: string): Promise<FirestoreDeliveryAddress | null> {
  try {
    if (!db || !userId) {
      return null;
    }

    const addressesRef = collection(db, ADDRESSES_COLLECTION);
    const q = query(
      addressesRef, 
      where('userId', '==', userId),
      where('isDefault', '==', true)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as FirestoreDeliveryAddress;
  } catch (error) {
    console.error('Error fetching default address:', error);
    return null;
  }
}

// Add a new address
export async function addAddress(address: Omit<FirestoreDeliveryAddress, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return null;
    }

    const now = Timestamp.now();
    
    // If this is set as default, unset other defaults
    if (address.isDefault) {
      await unsetDefaultAddresses(address.userId);
    }

    const addressData = {
      ...address,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, ADDRESSES_COLLECTION), addressData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding address:', error);
    return null;
  }
}

// Update an address
export async function updateAddress(id: string, updates: Partial<FirestoreDeliveryAddress>): Promise<boolean> {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return false;
    }

    // If setting as default, unset other defaults
    if (updates.isDefault && updates.userId) {
      await unsetDefaultAddresses(updates.userId);
    }

    const addressRef = doc(db, ADDRESSES_COLLECTION, id);
    await updateDoc(addressRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating address:', error);
    return false;
  }
}

// Delete an address
export async function deleteAddress(id: string): Promise<boolean> {
  try {
    if (!db) {
      console.warn('Firestore not initialized');
      return false;
    }

    const addressRef = doc(db, ADDRESSES_COLLECTION, id);
    await deleteDoc(addressRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting address:', error);
    return false;
  }
}

// Helper: Unset all default addresses for a user
async function unsetDefaultAddresses(userId: string): Promise<void> {
  try {
    if (!db) return;

    const addresses = await getUserAddresses(userId);
    const defaultAddresses = addresses.filter(addr => addr.isDefault);

    for (const addr of defaultAddresses) {
      const addressRef = doc(db, ADDRESSES_COLLECTION, addr.id);
      await updateDoc(addressRef, {
        isDefault: false,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error unsetting default addresses:', error);
  }
}

// Validate pincode (basic validation - can be enhanced with API)
export function validatePincode(pincode: string): boolean {
  // Indian pincode: 6 digits
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
}
