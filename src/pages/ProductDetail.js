import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { productsAPI } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data.data);
    } catch (err) {
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    const result = await addToCart(product._id, quantity);
    if (result.success) {
      alert('Product added to cart!');
      navigate('/cart');
    } else {
      alert(result.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-detail-grid">
          <div className="product-images">
            <img
              src={product.image || 'https://via.placeholder.com/500x600?text=Perfume'}
              alt={product.name}
              className="main-image"
            />
          </div>

          <div className="product-details">
            <p className="product-brand">{product.brand}</p>
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating">
              <FiStar className="star-filled" />
              <span>{product.rating || 0} ({product.numReviews || 0} reviews)</span>
            </div>

            <div className="product-price-section">
              {hasDiscount && (
                <>
                  <span className="original-price">${product.price}</span>
                  <span className="discount-badge">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </span>
                </>
              )}
              <div className="current-price">${price}</div>
            </div>

            <div className="product-meta">
              <div className="meta-item">
                <strong>Category:</strong> {product.category}
              </div>
              <div className="meta-item">
                <strong>Fragrance:</strong> {product.fragrance}
              </div>
              <div className="meta-item">
                <strong>Size:</strong> {product.size}
              </div>
              <div className="meta-item">
                <strong>Stock:</strong> 
                <span className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="btn btn-primary btn-large"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <FiShoppingCart />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
