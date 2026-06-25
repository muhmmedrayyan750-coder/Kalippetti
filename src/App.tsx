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
import AdminPanel from './components/AdminPanel';
import CampaignProductSection from './components/CampaignProductSection';
import { Star, ShoppingCart, X } from 'lucide-react';
import type { SiteSettings } from './types';
import './App.css';

// Seed Data
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Magnetic Drawing Board for Kids | 80 Beads Learning Board',
    description: 'Create colorful drawings with this magic magnetic pen and beads. Perfect for learning shapes, numbers, letters, and developing motor skills in toddlers without making a mess!',
    price: 499,
    originalPrice: 750,
    category: 'Creative Boards',
    imageUrl: 'https://images.unsplash.com/photo-1603356029285-a04a78c47985?w=500&q=80',
    rating: 4.8,
    reviewsCount: 12,
    inStock: true,
  },
  {
    id: 'prod-2',
    title: 'Kids Wooden Building Blocks | 50 Pcs Color Set',
    description: 'Classic wooden block set crafted from organic, high-quality wood. Features multiple shapes and vibrant, child-safe water-based paints. Encourages engineering, spatial skills, and creative logic.',
    price: 799,
    originalPrice: 1200,
    category: 'Wooden Blocks',
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=500&q=80',
    rating: 4.9,
    reviewsCount: 19,
    inStock: true,
  },
  {
    id: 'prod-3',
    title: 'Interactive Robot Toy with Sound & Voice Control',
    description: 'Smart dancing and speaking robot with programmable routines and light-up eyes. Plays music, responds to hand gestures, and helps introduce children to the basics of robotics.',
    price: 999,
    originalPrice: 1500,
    category: 'Action & Science',
    imageUrl: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=500&q=80',
    rating: 4.6,
    reviewsCount: 8,
    inStock: true,
  },
  {
    id: 'prod-4',
    title: 'Fluffy Teddy Bear Plush Toy | Soft Lavender Size',
    description: 'Extremely soft, cuddly teddy bear made of premium hypo-allergenic fabric. A perfect sleepy time companion for toddlers and baby nurseries.',
    price: 399,
    originalPrice: 599,
    category: 'Plush Toys',
    imageUrl: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?w=500&q=80',
    rating: 5.0,
    reviewsCount: 22,
    inStock: true,
  },
  {
    id: 'prod-5',
    title: 'Wooden Railway Train Track Starter Set',
    description: 'Vibrant train track set complete with wooden rails, magnetic train cars, small human figures, and trees. Integrates with standard track sets for infinite configurations.',
    price: 1299,
    originalPrice: 1999,
    category: 'Wooden Blocks',
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&q=80',
    rating: 4.7,
    reviewsCount: 14,
    inStock: true,
  },
  {
    id: 'prod-6',
    title: 'Kids DIY Science Volcano Eruption Experiment Kit',
    description: 'Build your own volcano and watch it erupt! Includes reusable safety goggles, ingredients for multiple bubbly reactions, and a detailed science guide on geology and chemical reactions.',
    price: 599,
    originalPrice: 890,
    category: 'Action & Science',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80',
    rating: 4.5,
    reviewsCount: 6,
    inStock: true,
  },
];


const DEFAULT_ADS: Advertisement[] = [
  {
    id: 'ad-1',
    title: 'Super Summer Toy Sale!',
    subtitle: 'Flat 40% OFF on educational and creative board toys. Seize the magic!',
    bgColor: '#7026b9',
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80',
    ctaText: 'Shop Sale 🧸',
  },
  {
    id: 'ad-2',
    title: 'Build Infinite Dreams',
    subtitle: 'Classic wooden block collections and train track systems for little builders.',
    bgColor: '#ff6b00',
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&q=80',
    ctaText: 'Explore Blocks 🚀',
  },
];

// Site Settings Type is in ./types.ts
export type { SiteSettings };

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Kalippetti',
  logoPart1: 'Kali',
  logoPart2: 'ppetti',
  contactNumber: '7012780209',
  officialEmail: 'muhmmedrayyan750@gmail.com',
  welcomeMessage: 'Shop premium, non-toxic, educational, and creative toys for your kids.',
};

function App() {
  // Global States
  const [products, setProducts] = useState<Product[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [campaign, setCampaign] = useState<Product | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  // View states
  const [activePage, setActivePage] = useState<string>('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [trackingIdParam, setTrackingIdParam] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Authentication State
  const [isLoggedInAdmin, setIsLoggedInAdmin] = useState(false);

  // Initialize and Seed LocalStorage Database
  useEffect(() => {
    // Products Seeding
    const savedProducts = localStorage.getItem('kalippetti_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      localStorage.setItem('kalippetti_products', JSON.stringify(DEFAULT_PRODUCTS));
      setProducts(DEFAULT_PRODUCTS);
    }

    // Ads Seeding
    const savedAds = localStorage.getItem('kalippetti_ads');
    if (savedAds) {
      setAds(JSON.parse(savedAds));
    } else {
      localStorage.setItem('kalippetti_ads', JSON.stringify(DEFAULT_ADS));
      setAds(DEFAULT_ADS);
    }

    // Campaign Seeding
    const savedCampaign = localStorage.getItem('kalippetti_campaign');
    if (savedCampaign) {
      setCampaign(JSON.parse(savedCampaign));
    } else {
      localStorage.setItem('kalippetti_campaign', JSON.stringify(null));
      setCampaign(null);
    }

    // Orders Seeding
    const savedOrders = localStorage.getItem('kalippetti_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      localStorage.setItem('kalippetti_orders', JSON.stringify([]));
      setOrders([]);
    }

    // Settings Seeding
    const savedSettings = localStorage.getItem('kalippetti_settings');
    if (savedSettings) {
      setSiteSettings(JSON.parse(savedSettings));
    } else {
      localStorage.setItem('kalippetti_settings', JSON.stringify(DEFAULT_SETTINGS));
      setSiteSettings(DEFAULT_SETTINGS);
    }

    // Cart loading
    const savedCart = localStorage.getItem('kalippetti_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // URL Tracking Parameter Check (e.g. ?track=KP-8392)
    const params = new URLSearchParams(window.location.search);
    const trackId = params.get('track');
    if (trackId) {
      setActivePage('track');
      setTrackingIdParam(trackId);
    }
  }, []);

  // Update document title and meta information when settings change
  useEffect(() => {
    document.title = `${siteSettings.siteName} - Premium Kids Toys Store`;
  }, [siteSettings.siteName]);

  // Sync Cart to LocalStorage
  const syncCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('kalippetti_cart', JSON.stringify(updatedCart));
  };

  // Update Products & sync with LocalStorage
  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('kalippetti_products', JSON.stringify(newProducts));
  };

  // Update Ads & sync with LocalStorage
  const handleUpdateAds = (newAds: Advertisement[]) => {
    setAds(newAds);
    localStorage.setItem('kalippetti_ads', JSON.stringify(newAds));
  };

  // Update Orders & sync with LocalStorage
  const handleUpdateOrders = (newOrders: any[]) => {
    setOrders(newOrders);
    localStorage.setItem('kalippetti_orders', JSON.stringify(newOrders));
  };

  // Update Campaign & sync with LocalStorage
  const handleUpdateCampaign = (newCampaign: Product | null) => {
    setCampaign(newCampaign);
    localStorage.setItem('kalippetti_campaign', JSON.stringify(newCampaign));
  };

  // Update Site Settings & sync with LocalStorage
  const handleUpdateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    localStorage.setItem('kalippetti_settings', JSON.stringify(newSettings));

    // Update document title if site name changed
    document.title = `${newSettings.siteName} - Premium Kids Toys Store`;
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

  const handleDeleteProduct = (productId: string) => {
    if (products.find((p) => p.id === productId)) {
      const updated = products.filter((p) => p.id !== productId);
      handleUpdateProducts(updated);

      // Clean up campaign if it matches the deleted product
      if (campaign && campaign.id === productId) {
        handleUpdateCampaign(null);
      }

      // Clean up cart items containing the deleted product
      const updatedCart = cart.filter((item) => item.product.id !== productId);
      if (updatedCart.length !== cart.length) {
        syncCart(updatedCart);
      }
    }
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
    // Update local state orders list
    const updatedOrdersJson = localStorage.getItem('kalippetti_orders');
    if (updatedOrdersJson) {
      setOrders(JSON.parse(updatedOrdersJson));
    }
    // Redirect to tracking page with parameter pre-filled
    setTrackingIdParam(orderId);
    setActivePage('track');
  };

  // Login handler
  const handleLoginSuccess = () => {
    setIsLoggedInAdmin(true);
  };

  const handleLogout = () => {
    setIsLoggedInAdmin(false);
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
        isLoggedInAdmin={isLoggedInAdmin}
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
                    isLoggedInAdmin={isLoggedInAdmin}
                    onDeleteProduct={handleDeleteProduct}
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
                    isLoggedInAdmin={isLoggedInAdmin}
                    onDeleteProduct={handleDeleteProduct}
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

        {/* PAGE 5: ADMIN PANEL */}
        {activePage === 'admin' && (
          <AdminPanel
            isLoggedInAdmin={isLoggedInAdmin}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            products={products}
            onUpdateProducts={handleUpdateProducts}
            ads={ads}
            onUpdateAds={handleUpdateAds}
            campaign={campaign}
            onUpdateCampaign={handleUpdateCampaign}
            orders={orders}
            onUpdateOrders={handleUpdateOrders}
            siteSettings={siteSettings}
            onUpdateSiteSettings={handleUpdateSiteSettings}
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

                {/* Admin Delete from Modal */}
                {isLoggedInAdmin && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${selectedProduct.title}"? This cannot be undone.`)) {
                        handleDeleteProduct(selectedProduct.id);
                        setSelectedProductId(null);
                      }
                    }}
                    className="btn btn-danger modal-admin-delete-btn"
                    style={{ width: '100%', marginTop: '12px' }}
                  >
                    🗑️ Delete This Product (Admin)
                  </button>
                )}

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
