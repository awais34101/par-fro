import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shippingAddress: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || ''
    },
    paymentMethod: 'Card'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shippingPrice = 10.00;
  const taxRate = 0.08;
  const itemsPrice = getCartTotal();
  const taxPrice = itemsPrice * taxRate;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('shippingAddress.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        shippingAddress: {
          ...formData.shippingAddress,
          [field]: value
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
    setError('');

    try {
      const orderData = {
        orderItems: cart.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          image: item.product.image,
          price: item.product.discountPrice || item.product.price
        })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        itemsPrice: itemsPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2)
      };

      const response = await ordersAPI.create(orderData);
      
      // Clear cart immediately without waiting
      clearCart();
      
      toast.success('Order placed successfully! 🎉');
      
      // Navigate immediately
      navigate('/orders', { replace: true });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to place order';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="checkout-layout">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h2>Shipping Address</h2>
              
              <div className="form-group">
                <label htmlFor="shippingAddress.street">Street Address *</label>
                <input
                  type="text"
                  id="shippingAddress.street"
                  name="shippingAddress.street"
                  className="form-control"
                  value={formData.shippingAddress.street}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="shippingAddress.city">City *</label>
                  <input
                    type="text"
                    id="shippingAddress.city"
                    name="shippingAddress.city"
                    className="form-control"
                    value={formData.shippingAddress.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="shippingAddress.state">State *</label>
                  <input
                    type="text"
                    id="shippingAddress.state"
                    name="shippingAddress.state"
                    className="form-control"
                    value={formData.shippingAddress.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="shippingAddress.zipCode">Zip Code *</label>
                  <input
                    type="text"
                    id="shippingAddress.zipCode"
                    name="shippingAddress.zipCode"
                    className="form-control"
                    value={formData.shippingAddress.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="shippingAddress.country">Country *</label>
                  <input
                    type="text"
                    id="shippingAddress.country"
                    name="shippingAddress.country"
                    className="form-control"
                    value={formData.shippingAddress.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Payment Method</h2>
              
              <div className="payment-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Card"
                    checked={formData.paymentMethod === 'Card'}
                    onChange={handleChange}
                  />
                  <span>Credit/Debit Card</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PayPal"
                    checked={formData.paymentMethod === 'PayPal'}
                    onChange={handleChange}
                  />
                  <span>PayPal</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={formData.paymentMethod === 'Cash on Delivery'}
                    onChange={handleChange}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-items">
              {cart.items.map((item) => (
                <div key={item.product._id} className="summary-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="item-details">
                    <p className="item-name">{item.product.name}</p>
                    <p className="item-qty">Qty: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>${shippingPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
