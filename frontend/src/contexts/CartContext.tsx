import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Sweet } from '../services/api';

interface CartItem {
  sweet: Sweet;
  quantity: number; // in kg (0.25, 0.5, or 1.0)
  price: number; // total price for this item
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (sweet: Sweet, quantity: number) => void;
  removeFromCart: (sweetId: number) => void;
  updateCartItemQuantity: (sweetId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (sweet: Sweet, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.sweet.id === sweet.id && item.quantity === quantity);
      
      if (existingItem) {
        // If same sweet with same quantity exists, don't add duplicate
        // Instead, show a message or update quantity
        return prevItems;
      }

      const pricePerKilo = sweet.pricePerKilo || sweet.price;
      const totalPrice = pricePerKilo * quantity;

      return [
        ...prevItems,
        {
          sweet,
          quantity,
          price: totalPrice,
        },
      ];
    });
  };

  const removeFromCart = (sweetId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.sweet.id !== sweetId));
  };

  const updateCartItemQuantity = (sweetId: number, quantity: number) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.sweet.id === sweetId) {
          const pricePerKilo = item.sweet.pricePerKilo || item.sweet.price;
          return {
            ...item,
            quantity,
            price: pricePerKilo * quantity,
          };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const getTotalItems = () => {
    return cartItems.length;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

