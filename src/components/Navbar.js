import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiPackage, FiHeart } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import axios from 'axios';
import './Navbar.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://par-back.onrender.com/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const { getWishlistCount } = useContext(WishlistContext);
  // Load from localStorage immediately to avoid flash
  const [storeName, setStoreName] = useState(
    localStorage.getItem('storeName') || 'Luxe Perfumes'
  );

  useEffect(() => {
    fetchStoreName();
    
    // Listen for store name updates
    const handleStoreNameUpdate = (event) => {
      setStoreName(event.detail);
    };
    
    window.addEventListener('storeNameUpdated', handleStoreNameUpdate);
    
    return () => {
      window.removeEventListener('storeNameUpdated', handleStoreNameUpdate);
    };
  }, []);

  const fetchStoreName = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`);
      console.log('Settings response:', response.data);
      // The API returns settings directly, not wrapped in data
      if (response.data && response.data.storeName) {
        setStoreName(response.data.storeName);
        // Also store in localStorage for quick access
        localStorage.setItem('storeName', response.data.storeName);
      }
    } catch (error) {
      console.error('Error fetching store name:', error);
      // Try to get from localStorage as fallback
      const cached = localStorage.getItem('storeName');
      if (cached) {
        setStoreName(cached);
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <h1>{storeName}</h1>
        </Link>

        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
        </ul>

        <div className="navbar-actions">
          <Link to="/cart" className="nav-icon">
            <FiShoppingCart size={24} />
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/wishlist" className="nav-icon" title="My Wishlist">
                <FiHeart size={24} />
                {getWishlistCount() > 0 && (
                  <span className="cart-badge">{getWishlistCount()}</span>
                )}
              </Link>
              <Link to="/orders" className="nav-icon" title="My Orders">
                <FiPackage size={24} />
              </Link>
              <Link to="/profile" className="nav-icon" title="Profile">
                <FiUser size={24} />
              </Link>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
