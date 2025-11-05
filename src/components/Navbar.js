import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import './Navbar.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://par-back.onrender.com/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const [storeName, setStoreName] = useState('Luxe Perfumes');

  useEffect(() => {
    fetchStoreName();
  }, []);

  const fetchStoreName = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`);
      if (response.data.storeName) {
        setStoreName(response.data.storeName);
      }
    } catch (error) {
      console.error('Error fetching store name:', error);
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
              <Link to="/orders" className="nav-icon" title="My Orders">
                <FiPackage size={24} />
              </Link>
              <Link to="/profile" className="nav-icon" title="Profile">
                <FiUser size={24} />
              </Link>
              <button onClick={logout} className="nav-icon logout-btn" title="Logout">
                <FiLogOut size={24} />
              </button>
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
