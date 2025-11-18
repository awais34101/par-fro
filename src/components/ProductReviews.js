import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductReviews.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://par-back.onrender.com/api';

const ProductReviews = ({ productId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  console.log('ProductReviews component mounted for product:', productId);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/reviews/product/${productId}`);
      setReviews(response.data.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/reviews`,
        { ...formData, product: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Review submitted successfully!');
      setShowForm(false);
      setFormData({ rating: 5, title: '', comment: '' });
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading reviews...</div>;
  }

  return (
    <div className="product-reviews">
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        {user && !showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Write a Review
          </button>
        )}
      </div>

      {showForm && (
        <form className="review-form" onSubmit={handleSubmit}>
          <h3>Write Your Review</h3>
          
          <div className="form-group">
            <label>Rating</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= formData.rating ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, rating: star })}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Review Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Sum up your review"
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="comment">Your Review *</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Share your experience with this product"
              required
              maxLength={1000}
              rows={5}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Submit Review</button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header-item">
                <div>
                  <strong>{review.user?.name || 'Anonymous'}</strong>
                  {renderStars(review.rating)}
                </div>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4>{review.title}</h4>
              <p>{review.comment}</p>
              {review.verified && (
                <span className="verified-badge">✓ Verified Purchase</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
