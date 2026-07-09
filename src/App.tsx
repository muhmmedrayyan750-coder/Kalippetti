import { useState, useEffect } from 'react';

import Header from './components/Header';
import Footer from './components/Footer';
import AdCarousel from './components/AdCarousel';
import type { Advertisement } from './components/AdCarousel';
import ProductCard from './components/ProductCard';
import type { Product } from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import type { CartItem } from './components/CartDrawer';
import CheckoutForm from './components/CheckoutForm';
import CampaignProductSection from './components/CampaignProductSection';
import AdminPanel from './components/AdminPanel';
import { Star, ShoppingCart, X } from 'lucide-react';
import type { SiteSettings } from './types';
import { readStoredData, SHOP_STORAGE_KEYS } from './lib/persistence';
import './App.css';



// Site Settings Type is in ./types.ts
export type { SiteSettings };

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Kalippetti',
  logoPart1: 'Kali',
  logoPart2: 'ppetti',
  contactNumber: '7012780209',
  officialEmail: 'muhmmedrayyan750@gmail.com',
  welcomeMessage: 'Shop premium, non-toxic, educational, and creative toys for your kids.',
  primaryColor: '#7026b9',
  secondaryColor: '#ff6b00',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  shippingCharge: 60,
  freeShippingThreshold: 999,
};

function App() {
  // Check if we are on the admin route (supporting pathname /admin as well as hash #/admin)
  const checkAdminRoute = () => {
    const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    return path === '/admin' || window.location.hash === '#/admin';
  };

  const [isAdminRoute, setIsAdminRoute] = useState(checkAdminRoute);

  useEffect(() => {
    const onChange = () => setIsAdminRoute(checkAdminRoute());
    window.addEventListener('hashchange', onChange);
    window.addEventListener('popstate', onChange);
    const interval = setInterval(() => {
      const current = checkAdminRoute();
      setIsAdminRoute(prev => prev !== current ? current : prev);
    }, 1000);
    return () => {
      window.removeEventListener('hashchange', onChange);
      window.removeEventListener('popstate', onChange);
      clearInterval(interval);
    };
  }, []);

  // Global States
  const [products, setProducts] = useState<Product[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [campaign, setCampaign] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  // View states
  const [activePage, setActivePage] = useState<string>('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const scrollToFooter = () => {
    const footer = document.getElementById('contact-footer');
    if (footer) footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Initialize and load catalog data from shared storage
  useEffect(() => {
    const loadLocalData = async () => {
      try {
        const [prodData, adsData, campData, setData] = await Promise.all([
          readStoredData<Product[]>(SHOP_STORAGE_KEYS.products),
          readStoredData<Advertisement[]>(SHOP_STORAGE_KEYS.ads),
          readStoredData<Product | null>(SHOP_STORAGE_KEYS.campaign, null),
          readStoredData<SiteSettings>(SHOP_STORAGE_KEYS.settings, DEFAULT_SETTINGS),
        ]);

        if (prodData) setProducts(prodData);
        if (adsData) setAds(adsData);
        if (campData) setCampaign(campData);
        if (setData) {
          setSiteSettings(setData);
          if (setData.primaryColor) document.documentElement.style.setProperty('--primary', setData.primaryColor);
          if (setData.secondaryColor) document.documentElement.style.setProperty('--secondary', setData.secondaryColor);
        }
      } catch (err) {
        console.error('Error loading data from shared storage:', err);
      }
    };

    const savedCart = localStorage.getItem(SHOP_STORAGE_KEYS.cart);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }


    void loadLocalData();
  }, []);

  // Sync admin panel changes across tabs and sessions
  const handleStorageSync = async () => {
    try {
      const [prodData, adsData, campData, setData] = await Promise.all([
        readStoredData<Product[]>(SHOP_STORAGE_KEYS.products),
        readStoredData<Advertisement[]>(SHOP_STORAGE_KEYS.ads),
        readStoredData<Product | null>(SHOP_STORAGE_KEYS.campaign, null),
        readStoredData<SiteSettings>(SHOP_STORAGE_KEYS.settings, DEFAULT_SETTINGS),
      ]);

      if (prodData) setProducts(prodData);
      if (adsData) setAds(adsData);
      if (campData) setCampaign(campData);
      if (setData) {
        setSiteSettings(setData);
        if (setData.primaryColor) document.documentElement.style.setProperty('--primary', setData.primaryColor);
        if (setData.secondaryColor) document.documentElement.style.setProperty('--secondary', setData.secondaryColor);
      }
    } catch {
      // ignore malformed storage payloads
    }
  };

  useEffect(() => {
    window.addEventListener('storage', handleStorageSync);
    window.addEventListener('local-update', handleStorageSync);

    const interval = setInterval(() => { void handleStorageSync(); }, 3000);

    return () => {
      window.removeEventListener('storage', handleStorageSync);
      window.removeEventListener('local-update', handleStorageSync);
      clearInterval(interval);
    };
  }, []);

  // Update document title when settings change
  useEffect(() => {
    document.title = `${siteSettings.siteName} - Premium Kids Toys Store`;
  }, [siteSettings.siteName]);

  // Sync Cart to LocalStorage (Cart remains private to each visitor's browser/session)
  const syncCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem(SHOP_STORAGE_KEYS.cart, JSON.stringify(updatedCart));
  };



  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    const existing = cart.find((item) => item.product.id === product.id);
    let updated: CartItem[];
    if (existing) {
      updated = cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updated = [...cart, { product, quantity }];
    }
    syncCart(updated);
    setCartOpen(true); // Open the sidebar drawer for confirmation
  };

  const handleBuyNow = (product: Product, quantity: number = 1) => {
    const existing = cart.find((item) => item.product.id === product.id);
    let updated: CartItem[];
    if (existing) {
      updated = cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updated = [...cart, { product, quantity }];
    }
    syncCart(updated);
    setActivePage('checkout');
    setCartOpen(false);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    const updated = cart.map((item) => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });
    syncCart(updated);
  };

  const handleRemoveCartItem = (productId: string) => {
    const updated = cart.filter((item) => item.product.id !== productId);
    syncCart(updated);
  };

  const handleProceedToCheckout = () => {
    setCartOpen(false);
    setActivePage('checkout');
  };

  const handleOrderPlaced = () => {
    // Clear shopping cart and return to shop
    syncCart([]);
    setActivePage('home');
  };




  // Filtered and Sorted Products list
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured/default
  });

  // Selected Product for details modal
  const selectedProduct = products.find((p) => p.id === selectedProductId);


  if (isAdminRoute) return <AdminPanel />;

  // Otherwise return standard public store interface
  return (
    <>
      {/* Header */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        toggleCart={() => setCartOpen(!cartOpen)}
        onContactClick={scrollToFooter}
        siteSettings={siteSettings}
      />

      {/* Main Pages Content */}
      <main className="main-content-layout">

        {/* PAGE 1: HOME PAGE */}
        {activePage === 'home' && (
          <div className="home-page-layout animate-slide-in container">
            {/* Promo slider */}
            <div className="home-web-banner wavy-card">
            <div className="web-banner-content">
              <div className="web-banner-copy">
                <span className="banner-pill">Web Exclusive</span>
                <h2>All-in-One Football Kit</h2>
                <p>Grab the complete football gear set for kids — ball, gloves, socks, shin guards, and training bag all in one deal.</p>
                <div className="web-banner-actions">
                  <button className="btn btn-primary" onClick={() => setActivePage('shop')}>
                    Shop Now
                  </button>
                  <a
                    className="banner-secondary-link"
                    href={`https://wa.me/91${siteSettings.contactNumber}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Contact on WhatsApp
                  </a>
                </div>
              </div>
              <div className="web-banner-image">
                <img
                  src={ads?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1000&q=80'}
                  alt="Football Kit"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1000&q=80'; }}
                />
              </div>
            </div>
          </div>

          <AdCarousel ads={ads} setActivePage={setActivePage} />

            {/* Campaign Combo Section */}
            {campaign && (
              <CampaignProductSection
                campaignProduct={campaign}
                onAddToCart={(p, q) => handleAddToCart(p, q)}
                onBuyNow={(p, q) => handleBuyNow(p, q)}
              />
            )}

            {/* Featured Toys */}
            <section className="featured-toys-section">
              <div className="section-title-wrapper flex-between">
                <div>
                  <h2>{siteSettings.siteName} Featured Toys</h2>
                  <p>{siteSettings.welcomeMessage}</p>
                </div>
                <button onClick={() => setActivePage('shop')} className="btn btn-light">
                  View All Toys
                </button>
              </div>

              <div className="products-grid">
                {products.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onSelectProduct={setSelectedProductId}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* PAGE 2: SHOP PAGE */}
        {activePage === 'shop' && (
          <div className="shop-page-layout animate-slide-in container">
            <h1 className="shop-title">All {siteSettings.siteName} Toys</h1>
            <p className="shop-subtitle">Unbox magic! Click cards to see full product materials and age guides.</p>

            {/* Search/Filter Controls */}
            <div className="shop-filters-bar wavy-card">
              <div className="filters-group-sorting" style={{ marginLeft: 'auto' }}>
                <label>Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select filter-sort-select"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products grid */}
            {sortedProducts.length === 0 ? (
              <div className="no-products-state wavy-card">
                <span>🔍</span>
                <h3>No Toys Found</h3>
                <p>We couldn't find any toys matching your filter options. Try typing another search term.</p>
                <button onClick={() => { setSearchTerm(''); }} className="btn btn-primary">
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onSelectProduct={setSelectedProductId}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* PAGE 3: ORDER VERIFICATION / CHECKOUT */}
        {activePage === 'checkout' && (
          <CheckoutForm
            cartItems={cart}
            onBack={() => setActivePage('shop')}
            onOrderPlaced={handleOrderPlaced}
            siteSettings={siteSettings}
          />
        )}


      </main>

      {/* Cart Slide-out Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Product Details Modal Overlay */}
      {selectedProductId && selectedProduct && (
        <div className="product-details-modal-overlay" onClick={() => setSelectedProductId(null)}>
          <div className="product-details-modal wavy-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProductId(null)}>
              <X size={24} />
            </button>

            <div className="modal-content-grid">
              <div className="modal-image-wrapper">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.title}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1603356029285-a04a78c47985?w=500&q=80';
                  }}
                />
              </div>

              <div className="modal-info-wrapper">
                <span className="modal-category-tag">{selectedProduct.category}</span>
                <h2>{selectedProduct.title}</h2>

                {/* Rating */}
                <div className="modal-rating">
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={16}
                        fill={idx < Math.round(selectedProduct.rating) ? 'var(--accent)' : 'none'}
                        color={idx < Math.round(selectedProduct.rating) ? 'var(--accent)' : '#ccc'}
                      />
                    ))}
                  </div>
                  <span className="rating-val">{selectedProduct.rating} / 5</span>
                  <span className="reviews-label">({selectedProduct.reviewsCount || 10} verified reviews)</span>
                </div>

                {/* Price */}
                <div className="modal-price-wrapper">
                  <span className="modal-cur-price">Rs. {selectedProduct.price}</span>
                  {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                    <>
                      <span className="modal-orig-price">Rs. {selectedProduct.originalPrice}</span>
                      <span className="modal-discount-tag">
                        {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Stock info */}
                <div className="modal-stock-row">
                  <b>Availability: </b>
                  {selectedProduct.inStock ? (
                    <span className="text-green font-bold">✓ In Stock (Shipped within 24 Hours)</span>
                  ) : (
                    <span className="text-danger font-bold">✗ Out of Stock</span>
                  )}
                </div>

                {/* Description */}
                <div className="modal-description">
                  <h3>About this toy</h3>
                  <p>{selectedProduct.description}</p>
                </div>

                {/* Safety & materials highlights */}
                <div className="modal-highlights-grid">
                  <div className="highlight-item">
                    <span>🍃</span>
                    <b>100% Non-Toxic</b>
                  </div>
                  <div className="highlight-item">
                    <span>👶</span>
                    <b>Age 3+ Safe</b>
                  </div>
                </div>

                {/* Add Actions */}
                <div className="modal-action-row">
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProductId(null);
                    }}
                    disabled={!selectedProduct.inStock}
                    className="btn btn-light modal-add-cart-btn"
                  >
                    <ShoppingCart size={18} />
                    <span>Add to Toy Box</span>
                  </button>

                  <button
                    onClick={() => {
                      handleBuyNow(selectedProduct);
                      setSelectedProductId(null);
                    }}
                    disabled={!selectedProduct.inStock}
                    className="btn btn-secondary modal-buy-now-btn animate-pulse-soft"
                  >
                    Buy Now
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer
        setActivePage={setActivePage}
        siteSettings={siteSettings}
      />
    </>
  );
}

export default App;
