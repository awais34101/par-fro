import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import './Home.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://par-back.onrender.com/api';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentImageSlide, setCurrentImageSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dynamic content from API
  const [imageSlideshow, setImageSlideshow] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [deal, setDeal] = useState(null);
  const [promoBanners, setPromoBanners] = useState([]);
  const [categoryShowcase, setCategoryShowcase] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    fetchHomeContent();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (imageSlideshow.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageSlide((prev) => (prev + 1) % imageSlideshow.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [imageSlideshow]);

  useEffect(() => {
    if (heroSlides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroSlides]);

  useEffect(() => {
    if (deal && deal.endTime) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const endTime = new Date(deal.endTime).getTime();
        const distance = endTime - now;

        if (distance > 0) {
          setTimeLeft({
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
          });
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [deal]);

  const fetchHomeContent = async () => {
    try {
      const response = await axios.get(`${API_URL}/home-content`);
      const data = response.data;
      
      console.log('Home content data:', data);
      console.log('Image slideshow:', data.imageSlideshow);
      
      setImageSlideshow(data.imageSlideshow?.filter(slide => slide.isActive) || []);
      setHeroSlides(data.heroSlides?.filter(slide => slide.isActive) || []);
      setDeal(data.deal?.isActive ? data.deal : null);
      setPromoBanners(data.promoBanners?.filter(banner => banner.isActive) || []);
      setCategoryShowcase(data.categoryShowcase?.filter(cat => cat.isActive) || []);
      
      console.log('Image slideshow after filter:', data.imageSlideshow?.filter(slide => slide.isActive));
    } catch (error) {
      console.error('Error fetching home content:', error);
      // Set default content if API fails
      setHeroSlides([{
        title: "Discover Your Signature Scent",
        subtitle: "Luxury Fragrances from World-Renowned Brands",
        ctaText: "Shop Now",
        ctaLink: "/products",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }]);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      const products = response.data;
      
      setFeaturedProducts(products.slice(0, 8));
      setBestSellers(products.slice(0, 6));
      setNewArrivals(products.slice(-6));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="home">
      {/* Image Slideshow Section */}
      {console.log('Image slideshow length:', imageSlideshow.length)}
      {console.log('Image slideshow data:', imageSlideshow)}
      {imageSlideshow.length > 0 ? (
        <section className="image-slideshow">
          {imageSlideshow.map((slide, index) => (
            <div
              key={index}
              className={`slideshow-image ${index === currentImageSlide ? 'active' : ''}`}
              style={{ 
                backgroundImage: `url(${slide.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ))}
          {imageSlideshow.length > 1 && (
            <div className="slideshow-indicators">
              {imageSlideshow.map((_, index) => (
                <button
                  key={index}
                  className={index === currentImageSlide ? 'active' : ''}
                  onClick={() => setCurrentImageSlide(index)}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div style={{padding: '20px', background: '#f0f0f0', textAlign: 'center'}}>
          No images in slideshow. Please add images in Admin Panel.
        </div>
      )}

      {/* Hero Carousel */}
      <section className="hero-carousel">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ background: slide.gradient }}
          >
            <div className="hero-content">
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
              <Link to={slide.ctaLink} className="btn btn-primary btn-large">
                {slide.ctaText}
              </Link>
            </div>
          </div>
        ))}
        {heroSlides.length > 1 && (
          <>
            <button className="carousel-btn prev" onClick={prevSlide}>‹</button>
            <button className="carousel-btn next" onClick={nextSlide}>›</button>
            <div className="carousel-indicators">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  className={index === currentSlide ? 'active' : ''}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Quick Categories Bar */}
      <section className="quick-categories">
        <div className="container">
          <div className="quick-categories-grid">
            <Link to="/products?category=Men" className="quick-category">
              <div className="quick-category-icon">👔</div>
              <span>Men's</span>
            </Link>
            <Link to="/products?category=Women" className="quick-category">
              <div className="quick-category-icon">👗</div>
              <span>Women's</span>
            </Link>
            <Link to="/products?category=Unisex" className="quick-category">
              <div className="quick-category-icon">🎭</div>
              <span>Unisex</span>
            </Link>
            <Link to="/products?type=luxury" className="quick-category">
              <div className="quick-category-icon">💎</div>
              <span>Luxury</span>
            </Link>
            <Link to="/products?type=bestsellers" className="quick-category">
              <div className="quick-category-icon">🔥</div>
              <span>Best Sellers</span>
            </Link>
            <Link to="/products?type=new" className="quick-category">
              <div className="quick-category-icon">✨</div>
              <span>New Arrivals</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Deal of the Day */}
      {deal && (
        <section className="deal-section">
          <div className="container">
            <div className="deal-banner">
              <div className="deal-content">
                <span className="deal-badge">{deal.subtitle}</span>
                <h2>{deal.title}</h2>
                <p className="deal-discount">{deal.discount}</p>
                <div className="deal-timer">
                  <div className="timer-box">
                    <span className="timer-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="timer-label">Hours</span>
                  </div>
                  <div className="timer-box">
                    <span className="timer-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="timer-label">Minutes</span>
                  </div>
                  <div className="timer-box">
                    <span className="timer-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="timer-label">Seconds</span>
                  </div>
                </div>
                <Link to={deal.ctaLink} className="btn btn-secondary btn-large">
                  {deal.ctaText}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="view-all-link">
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      {promoBanners.length > 0 && (
        <section className="promo-banners">
          <div className="container">
            <div className="promo-grid">
              {promoBanners.map((banner, index) => (
                <div
                  key={index}
                  className={`promo-card ${banner.size === 'large' ? 'promo-large' : 'promo-small'}`}
                  style={{ background: banner.gradient }}
                >
                  <div className="promo-content">
                    <span className="promo-tag">{banner.tag}</span>
                    <h3>{banner.title}</h3>
                    <p>{banner.description}</p>
                    <Link to={banner.ctaLink} className="btn btn-outline">
                      {banner.ctaText}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      <section className="products-section dark-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Best Sellers</h2>
            <Link to="/products?type=bestsellers" className="view-all-link">
              View All →
            </Link>
          </div>
          {!loading && (
            <div className="products-carousel">
              {bestSellers.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Showcase */}
      {categoryShowcase.length > 0 && (
        <section className="categories-showcase">
          <div className="container">
            <h2 className="section-title">Shop by Category</h2>
            <div className="categories-grid-modern">
              {categoryShowcase.map((category, index) => (
                <Link
                  key={index}
                  to={category.link}
                  className="category-card-modern"
                  style={{ background: category.gradient }}
                >
                  <div className="category-overlay">
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <span className="shop-now-btn">Shop Now →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands Section */}
      <section className="brands-section">
        <div className="container">
          <h2 className="section-title">Top Brands</h2>
          <div className="brands-grid">
            <div className="brand-item">Chanel</div>
            <div className="brand-item">Dior</div>
            <div className="brand-item">Gucci</div>
            <div className="brand-item">Tom Ford</div>
            <div className="brand-item">Versace</div>
            <div className="brand-item">Armani</div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="features-bar">
        <div className="container">
          <div className="features-grid-inline">
            <div className="feature-inline">
              <div className="feature-icon-inline">🚚</div>
              <div className="feature-text">
                <h4>Free Delivery</h4>
                <p>On orders over $50</p>
              </div>
            </div>
            <div className="feature-inline">
              <div className="feature-icon-inline">💳</div>
              <div className="feature-text">
                <h4>Secure Payment</h4>
                <p>100% encrypted</p>
              </div>
            </div>
            <div className="feature-inline">
              <div className="feature-icon-inline">🎁</div>
              <div className="feature-text">
                <h4>Authentic Products</h4>
                <p>100% genuine</p>
              </div>
            </div>
            <div className="feature-inline">
              <div className="feature-icon-inline">🔄</div>
              <div className="feature-text">
                <h4>Easy Returns</h4>
                <p>30-day guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-container">
            <div className="newsletter-icon">📧</div>
            <div className="newsletter-content">
              <h2>Join Our Newsletter</h2>
              <p>Subscribe to get special offers, updates, and exclusive deals</p>
            </div>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" className="form-control" />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
