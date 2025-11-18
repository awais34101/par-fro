import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'https://par-back.onrender.com/api';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  const CACHE_TIME = 60000; // 1 minute cache

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist({ products: [] });
      setLastFetch(null);
    }
  }, [user]);

  const fetchWishlist = async (force = false) => {
    // Skip if recently fetched (unless forced)
    if (!force && lastFetch && Date.now() - lastFetch < CACHE_TIME) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(response.data.data);
      setLastFetch(Date.now());
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/wishlist/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist(response.data.data);
      return { success: true, message: 'Added to wishlist!' };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to add to wishlist' };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(response.data.data);
      return { success: true, message: 'Removed from wishlist' };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, message: 'Failed to remove from wishlist' };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.products.some(item => item.product._id === productId);
  };

  const getWishlistCount = () => {
    return wishlist.products.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistCount,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
