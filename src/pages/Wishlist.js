import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { wishlist, removeFromWishlist, loading } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleRemove = async (productId) => {
    const result = await removeFromWishlist(productId);
    if (result.success) {
      toast.success('Removed from wishlist');
    }
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product._id, 1);
    if (result.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.message);
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return <div className="loading-container">Loading wishlist...</div>;
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1 className="page-title">My Wishlist ❤️</h1>
        
        {!wishlist.products || wishlist.products.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">❤️</div>
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite products here</p>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <p className="wishlist-count">{wishlist.products.length} item{wishlist.products.length !== 1 ? 's' : ''} in your wishlist</p>
            
            <div className="wishlist-grid">
              {wishlist.products.map((item) => {
                const product = item.product;
                if (!product) return null;
                
                return (
                  <div key={product._id} className="wishlist-card">
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemove(product._id)}
                      title="Remove from wishlist"
                    >
                      ×
                    </button>
                    
                    <div className="wishlist-image" onClick={() => handleViewProduct(product._id)}>
                      <img 
                        src={product.image || 'https://via.placeholder.com/300x400?text=Perfume'} 
                        alt={product.name}
                      />
                    </div>
                    
                    <div className="wishlist-details">
                      <p className="product-brand">{product.brand}</p>
                      <h3 className="product-name" onClick={() => handleViewProduct(product._id)}>
                        {product.name}
                      </h3>
                      
                      <div className="product-meta">
                        <span className="category">{product.category}</span>
                        <span className="size">{product.size}</span>
                      </div>
                      
                      <div className="price-section">
                        {product.discountPrice && product.discountPrice < product.price ? (
                          <>
                            <span className="original-price">${product.price}</span>
                            <span className="current-price">${product.discountPrice}</span>
                          </>
                        ) : (
                          <span className="current-price">${product.price}</span>
                        )}
                      </div>
                      
                      <div className="stock-status">
                        {product.stock > 0 ? (
                          <span className="in-stock">✓ In Stock</span>
                        ) : (
                          <span className="out-stock">Out of Stock</span>
                        )}
                      </div>
                      
                      <div className="wishlist-actions">
                        <button 
                          className="btn btn-primary btn-full"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button 
                          className="btn btn-secondary btn-full"
                          onClick={() => handleViewProduct(product._id)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
