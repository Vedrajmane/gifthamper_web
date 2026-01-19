import { Product } from '../types/product';

const PRODUCTS_STORAGE_KEY = 'martini_products';

export function getProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const products = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return products ? JSON.parse(products) : [];
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Failed to save products:', error);
  }
}

export function addProduct(product: Omit<Product, 'id'>): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  
  if (index === -1) return null;
  
  products[index] = { ...products[index], ...updates };
  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filteredProducts = products.filter((p) => p.id !== id);
  
  if (filteredProducts.length === products.length) return false;
  
  saveProducts(filteredProducts);
  return true;
}

export function initializeProducts(defaultProducts: Product[]): void {
  const existingProducts = getProducts();
  if (existingProducts.length === 0) {
    saveProducts(defaultProducts);
  }
}
