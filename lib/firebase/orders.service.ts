import { db } from './config';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, orderBy, Timestamp } from 'firebase/firestore';
import { Order, DeliveryStatus } from '@/lib/types/order';

const ORDERS_COLLECTION = 'orders';

export async function createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }
    
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...order,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      deliveryStatus: {
        ...doc.data().deliveryStatus,
        estimatedDelivery: doc.data().deliveryStatus?.estimatedDelivery?.toDate(),
        updates: doc.data().deliveryStatus?.updates?.map((u: any) => ({
          ...u,
          timestamp: u.timestamp?.toDate() || new Date(),
        })) || [],
      },
    })) as Order[];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Order[];
  } catch (error) {
    console.error('Error getting user orders:', error);
    return [];
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: DeliveryStatus['status'],
  message: string,
  location?: string
): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    
    // Get current order to append to updates
    const currentOrder = await getOrderById(orderId);
    if (!currentOrder) throw new Error('Order not found');

    const newUpdate = {
      status,
      message,
      location,
      timestamp: new Date(),
    };

    await updateDoc(orderRef, {
      'deliveryStatus.status': status,
      'deliveryStatus.updates': [...(currentOrder.deliveryStatus.updates || []), newUpdate],
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const orders = await getAllOrders();
    return orders.find(o => o.id === orderId) || null;
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
}
