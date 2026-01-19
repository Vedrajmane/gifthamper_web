'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { syncCartToCloud, saveUserCart } from '../firebase/cart.service';
import { getCart, clearCart } from '../utils/cart';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync cart when user logs in
  const syncUserCart = async (userId: string) => {
    try {
      await syncCartToCloud(userId);
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setUser(user);
      
      if (user) {
        // User logged in - sync cart
        await syncUserCart(user.uid);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Email/Password login
  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth not initialized');
    
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result.user) {
      await syncUserCart(result.user.uid);
    }
  };

  // Email/Password signup
  const signUp = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth not initialized');
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (result.user) {
      // New user - save current local cart to cloud
      const localCart = getCart();
      await saveUserCart(result.user.uid, localCart);
    }
  };

  // Google login
  const loginWithGoogle = async () => {
    if (!auth) throw new Error('Firebase Auth not initialized');
    
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    if (result.user) {
      await syncUserCart(result.user.uid);
    }
  };

  // Logout
  const logout = async () => {
    if (!auth) throw new Error('Firebase Auth not initialized');
    
    // Save current cart to cloud before logout
    if (user) {
      const currentCart = getCart();
      await saveUserCart(user.uid, currentCart);
    }
    
    await signOut(auth);
    // Keep cart in localStorage for guest mode
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signUp,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
