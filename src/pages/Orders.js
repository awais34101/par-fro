import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getUserOrders();
      setOrders(response.data.data);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#f39c12',
      'Processing': '#3498db',
      'Shipped': '#9b59b6',
      'Delivered': '#27ae60',
      'Cancelled': '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="page-title">My Orders</h1>

        {error && <div className="error-message">{error}</div>}

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div 
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </div>
                </div>

                <div className="order-items">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="order-item">
                      <img
                        src={item.image || 'https://via.placeholder.com/80'}
                        alt={item.name}
                      />
                      <div className="order-item-details">
                        <p className="item-name">{item.name}</p>
                        <p className="item-qty">Quantity: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-address">
                    <strong>Shipping Address:</strong>
                    <p>
                      {order.shippingAddress.street}, {order.shippingAddress.city},
                      {order.shippingAddress.state} {order.shippingAddress.zipCode},
                      {order.shippingAddress.country}
                    </p>
                  </div>

                  <div className="order-total">
                    <strong>Total:</strong>
                    <span className="total-amount">${order.totalPrice}</span>
                  </div>
                </div>

                <div className="order-payment">
                  <span>Payment Method: {order.paymentMethod}</span>
                  <span className={order.isPaid ? 'paid' : 'unpaid'}>
                    {order.isPaid ? '✓ Paid' : '✗ Not Paid'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
