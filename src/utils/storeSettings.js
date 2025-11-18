import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://par-back.onrender.com/api';

// Get store name from localStorage or default
export const getStoreName = () => {
  return localStorage.getItem('storeName') || 'Luxe Perfumes';
};

// Fetch and update store settings
export const fetchStoreSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/settings`);
    if (response.data && response.data.storeName) {
      localStorage.setItem('storeName', response.data.storeName);
      return response.data.storeName;
    }
  } catch (error) {
    console.error('Error fetching store settings:', error);
  }
  return getStoreName();
};

// Initialize store settings on app load
export const initializeStoreSettings = async () => {
  const storeName = await fetchStoreSettings();
  // Update page title
  document.title = `${storeName} - Premium Fragrance Store`;
  // Dispatch custom event to notify components
  window.dispatchEvent(new CustomEvent('storeNameUpdated', { detail: storeName }));
  return storeName;
};
