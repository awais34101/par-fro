import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.brand) params.brand = filters.brand;
      if (filters.search) params.search = filters.search;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const response = await productsAPI.getAll(params);
      setProducts(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Update URL params
    const params = {};
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) params[key] = newFilters[key];
    });
    setSearchParams(params);
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    const result = await addToCart(productId, 1);
    if (result.success) {
      alert('Product added to cart!');
    } else {
      alert(result.message);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">Our Collection</h1>

        <div className="filters">
          <input
            type="text"
            placeholder="Search products..."
            className="form-control search-input"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />

          <select
            className="form-control"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            className="form-control"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />

          <input
            type="number"
            placeholder="Max Price"
            className="form-control"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />

          <button className="btn btn-secondary" onClick={fetchProducts}>
            Apply Filters
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
