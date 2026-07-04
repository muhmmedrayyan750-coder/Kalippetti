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
import OrderTracker from './components/OrderTracker';
import CampaignProductSection from './components/CampaignProductSection';
import { Star, ShoppingCart, X } from 'lucide-react';
import type { SiteSettings } from './types';
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
  const [trackingIdParam, setTrackingIdParam] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);



  // SHARED DATABASE BLOB IDs FOR SITE-WIDE GLOBAL SYNC
  const SHARED_IDS = {
    products: '019f28a9-101d-74a6-bb98-ae67b9ee5a89',
    ads: '019f28a9-14c9-7be2-862a-5368eed7b8d7',
    campaign: '019f28a9-1783-76c0-90cf-331dbde692b7',
    orders: '019f28a9-1a03-74dc-b778-3ca048b6ae97',
    settings: '019f28a9-1c33-7476-b57c-60c239729ad9'
  };

  const getBlobUrl = (key: keyof typeof SHARED_IDS) => `https://jsonblob.com/api/jsonBlob/${SHARED_IDS[key]}`;

  // Initialize and load database from JSONBlob cloud
  useEffect(() => {
    const loadCloudData = async () => {
      try {
        const [prodRes, adsRes, campRes, setRes] = await Promise.all([
          fetch(getBlobUrl('products')),
          fetch(getBlobUrl('ads')),
          fetch(getBlobUrl('campaign')),
          fetch(getBlobUrl('settings'))
        ]);

        if (prodRes.ok) setProducts(await prodRes.json());
        if (adsRes.ok) setAds(await adsRes.json());
        if (campRes.ok) setCampaign(await campRes.json());
        if (setRes.ok) {
          const parsed = await setRes.json();
          setSiteSettings(parsed);
          if (parsed.primaryColor) document.documentElement.style.setProperty('--primary', parsed.primaryColor);
          if (parsed.secondaryColor) document.documentElement.style.setProperty('--secondary', parsed.secondaryColor);
        }
      } catch (err) {
        console.error('Error loading data from cloud db:', err);
      }
    };

    // Also load local cart
    const savedCart = localStorage.getItem('kalippetti_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // URL Tracking Parameter Check
    const params = new URLSearchParams(window.location.search);
    const trackId = params.get('track');
    if (trackId) {
      setActivePage('track');
      setTrackingIdParam(trackId);
    }

    loadCloudData();
  }, []);

  // Poll cloud data periodically to keep customers synced in real-time
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [prodRes, adsRes, campRes, setRes] = await Promise.all([
          fetch(getBlobUrl('products')),
          fetch(getBlobUrl('ads')),
          fetch(getBlobUrl('campaign')),
          fetch(getBlobUrl('settings'))
        ]);

        if (prodRes.ok) {
          const cloudProducts = await prodRes.ok ? await prodRes.json() : [];
          if (JSON.stringify(cloudProducts) !== JSON.stringify(products)) {
            setProducts(cloudProducts);
          }
        }
        if (adsRes.ok) {
          const cloudAds = await adsRes.json();
          if (JSON.stringify(cloudAds) !== JSON.stringify(ads)) {
            setAds(cloudAds);
          }
        }
        if (campRes.ok) {
          const cloudCampaign = await campRes.json();
          if (JSON.stringify(cloudCampaign) !== JSON.stringify(campaign)) {
            setCampaign(cloudCampaign);
          }
        }
        if (setRes.ok) {
          const cloudSettings = await setRes.json();
          if (JSON.stringify(cloudSettings) !== JSON.stringify(siteSettings)) {
            setSiteSettings(cloudSettings);
            if (cloudSettings.primaryColor) document.documentElement.style.setProperty('--primary', cloudSettings.primaryColor);
            if (cloudSettings.secondaryColor) document.documentElement.style.setProperty('--secondary', cloudSettings.secondaryColor);
          }
        }
      } catch (err) {
        console.error('Error polling cloud db:', err);
      }
    }, 12000); // Check for global updates every 12 seconds

    return () => clearInterval(interval);
  }, [products, siteSettings, ads, campaign]);

  // Update document title when settings change
  useEffect(() => {
    document.title = `${siteSettings.siteName} - Premium Kids Toys Store`;
  }, [siteSettings.siteName]);

  // Sync Cart to LocalStorage (Cart remains private to each visitor's browser/session)
  const syncCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('kalippetti_cart', JSON.stringify(updatedCart));
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

  const handleOrderPlaced = (orderId: string) => {
    // Clear shopping cart
    syncCart([]);
    // Redirect to tracking page with parameter pre-filled
    setTrackingIdParam(orderId);
    setActivePage('track');
  };


  // Sync admin panel changes across tabs (orders, products, settings, etc.)
  useEffect(() => {
    const handleStorageSync = (e: StorageEvent) => {
      if (!e.key || e.newValue === null) return;
      try {
        switch (e.key) {
          case 'kalippetti_products':
            setProducts(JSON.parse(e.newValue));
            break;
          case 'kalippetti_ads':
            setAds(JSON.parse(e.newValue));
            break;
          case 'kalippetti_campaign':
            setCampaign(JSON.parse(e.newValue));
            break;
          case 'kalippetti_settings': {
            const parsed = JSON.parse(e.newValue);
            setSiteSettings(parsed);
            if (parsed.primaryColor) document.documentElement.style.setProperty('--primary', parsed.primaryColor);
            if (parsed.secondaryColor) document.documentElement.style.setProperty('--secondary', parsed.secondaryColor);
          }
        }
      } catch {
        // ignore malformed storage payloads
      }
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

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
        siteSettings={siteSettings}
      />

      {/* Main Pages Content */}
      <main className="main-content-layout">

        {/* PAGE 1: HOME PAGE */}
        {activePage === 'home' && (
          <div className="home-page-layout animate-slide-in container">
            {/* Promo slider */}
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

        {/* PAGE 4: TRACK ORDER */}
        {activePage === 'track' && (
          <OrderTracker orderIdParam={trackingIdParam} />
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
