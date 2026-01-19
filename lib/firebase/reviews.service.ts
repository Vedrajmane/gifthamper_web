import { db } from './config';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';

export interface Review {
  id?: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  helpful: number;
  verified: boolean;
}

const REVIEWS_COLLECTION = 'reviews';

export async function addReview(review: Omit<Review, 'id' | 'createdAt' | 'helpful'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
      ...review,
      createdAt: Timestamp.now(),
      helpful: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Review[];
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
}

export async function calculateAverageRating(productId: string): Promise<{ average: number; count: number }> {
  try {
    const reviews = await getProductReviews(productId);
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / reviews.length;
    
    return {
      average: Math.round(average * 10) / 10, // Round to 1 decimal
      count: reviews.length,
    };
  } catch (error) {
    console.error('Error calculating average rating:', error);
    return { average: 0, count: 0 };
  }
}
