import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartAPI } from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  const { user } = useContext(AuthContext);
  const CACHE_TIME = 30000; // 30 seconds cache

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
      setLastFetch(null);
    }
  }, [user]);

  const fetchCart = async (force = false) => {
    // Skip if recently fetched (unless forced)
    if (!force && lastFetch && Date.now() - lastFetch < CACHE_TIME) {
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data.data);
      setLastFetch(Date.now());
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartAPI.addToCart(productId, quantity);
      setCart(response.data.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add to cart'
      };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await cartAPI.updateItem(productId, quantity);
      setCart(response.data.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update cart'
      };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await cartAPI.removeItem(productId);
      setCart(response.data.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove from cart'
      };
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart({ items: [] });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to clear cart'
      };
    }
  };

  const getCartTotal = () => {
    if (!cart.items || cart.items.length === 0) return 0;
    
    return cart.items.reduce((total, item) => {
      const price = item.product?.discountPrice || item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    if (!cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
