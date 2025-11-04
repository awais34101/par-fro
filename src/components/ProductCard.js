import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="product-card card">
      <Link to={`/products/${product._id}`} className="product-image-link">
        <img
          src={product.image || 'https://via.placeholder.com/300x400?text=Perfume'}
          alt={product.name}
          className="product-image"
        />
        {hasDiscount && (
          <span className="discount-badge">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </span>
        )}
      </Link>

      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-size">{product.size}</p>

        <div className="product-rating">
          <FiStar className="star-icon" />
          <span>{product.rating || 0} ({product.numReviews || 0} reviews)</span>
        </div>

        <div className="product-footer">
          <div className="product-price">
            {hasDiscount && (
              <span className="original-price">${product.price}</span>
            )}
            <span className="current-price">${price}</span>
          </div>

          <button
            className="btn-add-to-cart"
            onClick={() => onAddToCart(product._id)}
            disabled={product.stock === 0}
          >
            <FiShoppingCart />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
