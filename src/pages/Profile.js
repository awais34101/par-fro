import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiCheck } from 'react-icons/fi';
import { authAPI, ordersAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
      fetchOrderCount();
    }
  }, [user]);

  const fetchOrderCount = async () => {
    try {
      const response = await ordersAPI.getUserOrders();
      setOrderCount(response.data.data?.length || 0);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrderCount(0);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authAPI.updateProfile(formData);
      updateUser(response.data.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {getInitials(user?.name)}
              </div>
            </div>
            <div className="profile-header-info">
              <h1>{user?.name || 'User Name'}</h1>
              <p className="profile-email">
                <FiMail size={16} />
                {user?.email || 'email@example.com'}
              </p>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{orderCount}</span>
                  <span className="stat-label">Orders</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-value">Member</span>
                  <span className="stat-label">Status</span>
                </div>
              </div>
            </div>
            <button 
              className="edit-toggle-btn"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <FiCheck size={20} /> : <FiEdit2 size={20} />}
              {isEditing ? 'View Mode' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          <form onSubmit={handleSubmit} className="profile-form">
            {/* Personal Information Card */}
            <div className="info-card">
              <div className="card-header">
                <FiUser size={22} />
                <h2>Personal Information</h2>
              </div>
              <div className="card-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">
                      Full Name
                      <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-input"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address
                      <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="phone">
                      <FiPhone size={16} />
                      Phone Number
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="form-input"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="info-card">
              <div className="card-header">
                <FiMapPin size={22} />
                <h2>Shipping Address</h2>
              </div>
              <div className="card-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="address.street">Street Address</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="address.street"
                        name="address.street"
                        className="form-input"
                        value={formData.address.street}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="123 Main Street, Apt 4B"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.city">City</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="address.city"
                        name="address.city"
                        className="form-input"
                        value={formData.address.city}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="New York"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.state">State / Province</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="address.state"
                        name="address.state"
                        className="form-input"
                        value={formData.address.state}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="NY"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.zipCode">ZIP / Postal Code</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="address.zipCode"
                        name="address.zipCode"
                        className="form-input"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.country">Country</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="address.country"
                        name="address.country"
                        className="form-input"
                        value={formData.address.country}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="United States"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

          {/* Logout Section */}
          <div className="danger-zone">
            <div className="danger-zone-content">
              <div>
                <h3>Logout</h3>
                <p>Sign out of your account</p>
              </div>
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }} 
                className="btn btn-logout"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
