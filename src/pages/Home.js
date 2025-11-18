import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import axios from 'axios';
import './Home.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://par-back.onrender.com/api';

const Home = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedGender, setSelectedGender] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  // Load from localStorage immediately to avoid flash
  const [storeName, setStoreName] = useState(
    localStorage.getItem('storeName') || 'Premium Fragrances'
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
    
    // Listen for store name updates
    const handleStoreNameUpdate = (event) => {
      setStoreName(event.detail);
    };
    
    window.addEventListener('storeNameUpdated', handleStoreNameUpdate);
    
    return () => {
      window.removeEventListener('storeNameUpdated', handleStoreNameUpdate);
    };
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`);
      if (response.data && response.data.storeName) {
        setStoreName(response.data.storeName);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const response = await productsAPI.getAll();
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      // Backend returns { success: true, count: X, data: [...products] }
      const products = Array.isArray(response.data.data) ? response.data.data : 
                      Array.isArray(response.data) ? response.data : [];
      
      console.log('Products array:', products);
      console.log('Number of products:', products.length);
      
      setAllProducts(products);
      setFilteredProducts(products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setAllProducts([]);
      setFilteredProducts([]);
      setLoading(false);
    }
  };

  const handleGenderFilter = (gender) => {
    setSelectedGender(gender);
    filterProducts(gender, searchQuery);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterProducts(selectedGender, query);
  };

  const filterProducts = (gender, search) => {
    let filtered = Array.isArray(allProducts) ? [...allProducts] : [];
    
    // Filter by gender
    if (gender !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === gender.toLowerCase()
      );
    }
    
    // Filter by search query
    if (search) {
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.brand?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  };

  const handleAddToCart = (productId) => {
    // Navigate to product detail page or add to cart
    navigate(`/products/${productId}`);
  };

  return (
    <div className="home">
      {/* Gender Filter Bar */}
      <section className="gender-filter-bar">
        <div className="container">
          <h2 className="filter-title">Shop {storeName}</h2>
          
          {/* Search Bar */}
          <div className="search-bar-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search perfumes, brands..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="gender-filters">
            <button 
              className={`gender-filter-btn ${selectedGender === 'all' ? 'active' : ''}`}
              onClick={() => handleGenderFilter('all')}
            >
              <span className="filter-icon">🌟</span>
              All Products
            </button>
            <button 
              className={`gender-filter-btn ${selectedGender === 'men' ? 'active' : ''}`}
              onClick={() => handleGenderFilter('men')}
            >
              <span className="filter-icon">👔</span>
              Men
            </button>
            <button 
              className={`gender-filter-btn ${selectedGender === 'women' ? 'active' : ''}`}
              onClick={() => handleGenderFilter('women')}
            >
              <span className="filter-icon">👗</span>
              Women
            </button>
            <button 
              className={`gender-filter-btn ${selectedGender === 'unisex' ? 'active' : ''}`}
              onClick={() => handleGenderFilter('unisex')}
            >
              <span className="filter-icon">🎭</span>
              Unisex
            </button>
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="products-section all-products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {selectedGender === 'all' ? 'All Products' : 
               selectedGender === 'men' ? "Men's Fragrances" :
               selectedGender === 'women' ? "Women's Fragrances" :
               'Unisex Fragrances'}
            </h2>
            <span className="products-count">{Array.isArray(filteredProducts) ? filteredProducts.length : 0} Products</span>
          </div>
          {loading ? (
            <div className="products-grid">
              {[...Array(6)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : !Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found in this category.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
