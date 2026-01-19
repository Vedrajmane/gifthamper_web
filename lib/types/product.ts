export interface Product {
  id: string;
  name: string;
  description: string;
  instructions?: string;
  deliveryInfo?: string;
  price: number;
  category: string;
  subcategory?: string;
  imageUrl: string; // Primary image for backward compatibility
  images?: string[]; // Array of up to 4 images
  tags?: string[];
  isPersonalizable?: boolean;
  personalizationOptions?: {
    allowName?: boolean;
    allowImage?: boolean;
    allowMessage?: boolean;
    maxMessageLength?: number;
  };
  averageRating?: number;
  reviewCount?: number;
  createdAt?: Date;
}

export interface PersonalizationData {
  customerName?: string;
  customerImage?: string;
  message?: string;
}

export interface CartItem extends Product {
  quantity?: number;
  personalization?: PersonalizationData;
}

export type Category = 
  | 'Baby Shower'
  | 'Wedding'
  | 'Corporate'
  | 'Hamper'
  | 'Housewarming'
  | 'Naming Ceremony'
  | 'Crystal'
  | 'Candle'
  | 'Pregnancy Announcement';

export interface CategoryInfo {
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
}
