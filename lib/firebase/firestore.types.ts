import { Timestamp } from 'firebase/firestore';
import { Product, CartItem } from '../types/product';

// Firestore Product document structure with enhanced features
export interface FirestoreProduct extends Omit<Product, 'createdAt' | 'imageUrl'> {
  images: string[]; // Array of 4 image URLs
  imageUrl?: string; // Keep for backward compatibility
  subcategory?: string;
  instructions?: string;
  deliveryInfo?: string;
  tags?: string[];
  isPersonalizable?: boolean;
  averageRating?: number;
  reviewCount?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Category with subcategories
export interface FirestoreCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
  subcategories: string[]; // Array of subcategory IDs
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Subcategory
export interface FirestoreSubcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  order: number;
  createdAt: Timestamp;
}

// Review
export interface FirestoreReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1-5
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number; // Count of helpful votes
  createdAt: Timestamp;
}

// Delivery Address
export interface FirestoreDeliveryAddress {
  id: string;
  userId: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Personalization for gifts
export interface ProductPersonalization {
  recipientName?: string;
  occasion?: string; // Birthday, Anniversary, Diwali, etc.
  customMessage?: string;
  uploadedImageUrl?: string;
  deliveryDate?: Date;
}

// Enhanced Cart Item with personalization
export interface FirestoreCartItem extends CartItem {
  personalization?: ProductPersonalization;
  addedAt: Timestamp;
}

// User Cart document structure
export interface FirestoreUserCart {
  userId: string;
  items: FirestoreCartItem[];
  updatedAt: Timestamp;
}

// User document structure
export interface FirestoreUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  defaultAddressId?: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}
