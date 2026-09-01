'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { Book, CartItem, User } from './types';
import { tokenManager } from './api';

interface StoreContextType {
  cart: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User, token?: string) => void;
  logout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];

    try {
      const savedCart = localStorage.getItem('book-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Sepet yükleme hatası:', e);
      return [];
    }
  });
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;

    try {
      const savedUser = localStorage.getItem('book-user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Kullanıcı yükleme hatası:', e);
      return null;
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('book-cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

 
  const addToCart = useCallback((book: Book) => {
    setCart((prev) => {
      const incomingId = Number(book.id);
      const existing = prev.find((item) => Number(item.book.id) === incomingId);

      let updatedCart: CartItem[];

      if (existing) {
        updatedCart = prev.map((item) =>
          Number(item.book.id) === incomingId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [
          ...prev,
          { book: { ...book, id: incomingId }, quantity: 1 },
        ];
      }

      localStorage.setItem('book-cart', JSON.stringify(updatedCart));

      return updatedCart;
    });
  }, []);

  const removeFromCart = useCallback((bookId: number) => {
    setCart((prev) => prev.filter((item) => Number(item.book.id) !== Number(bookId)));
  }, []);

  const updateQuantity = useCallback((bookId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        Number(item.book.id) === Number(bookId) ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const login = useCallback((userData: User, token?: string) => {
    setUser(userData);
    localStorage.setItem('book-user', JSON.stringify(userData));
    if (token) tokenManager.set(token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('book-user');
    tokenManager.remove();
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.book.price) || 0) * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isAdmin = user?.role === 'admin';

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        user,
        isAuthenticated: !!user,
        isAdmin,
        login,
        logout,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}