import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleRemove = async (productId) => {
    if (window.confirm('Remove this item from cart?')) {
      await removeFromCart(productId);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your Cart is Empty</h2>
            <p>Add some perfumes to your cart to get started!</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.product._id} className="cart-item">
                <img
                  src={item.product.image || 'https://via.placeholder.com/100'}
                  alt={item.product.name}
                  className="cart-item-image"
                />

                <div className="cart-item-details">
                  <Link to={`/products/${item.product._id}`}>
                    <h3>{item.product.name}</h3>
                  </Link>
                  <p className="cart-item-brand">{item.product.brand}</p>
                  <p className="cart-item-size">{item.product.size}</p>
                </div>

                <div className="cart-item-price">
                  ${item.product.discountPrice || item.product.price}
                </div>

                <div className="cart-item-quantity">
                  <button
                    onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    <FiPlus />
                  </button>
                </div>

                <div className="cart-item-total">
                  ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                </div>

                <button
                  className="cart-item-remove"
                  onClick={() => handleRemove(item.product._id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>

            <button className="btn btn-primary btn-full" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
