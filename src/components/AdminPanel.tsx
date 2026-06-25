import React, { useState } from 'react';
import { Package, ShoppingBag, Trash2, Plus, MessageSquare, ShieldAlert, LogOut, Layers, Mail, Lock, ArrowRight, ShieldCheck, Settings } from 'lucide-react';
import type { Product } from './ProductCard';
import type { Advertisement } from './AdCarousel';
import type { SiteSettings } from '../types';

interface AdminPanelProps {
  isLoggedInAdmin: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
  products: Product[];
  onUpdateProducts: (newProducts: Product[]) => void;
  ads: Advertisement[];
  onUpdateAds: (newAds: Advertisement[]) => void;
  orders: any[];
  onUpdateOrders: (newOrders: any[]) => void;
  campaign: Product | null;
  onUpdateCampaign: (newCampaign: Product | null) => void;
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (newSettings: SiteSettings) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isLoggedInAdmin,
  onLoginSuccess,
  onLogout,
  products,
  onUpdateProducts,
  ads,
  onUpdateAds,
  orders,
  onUpdateOrders,
  campaign,
  onUpdateCampaign,
  siteSettings,
  onUpdateSiteSettings,
}) => {
  // Login credentials state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deletingAdId, setDeletingAdId] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState(false);

  // Active Tab: 'orders' | 'products' | 'ads' | 'campaign' | 'settings'
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'ads' | 'campaign' | 'settings'>('orders');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm.siteName.trim() || !settingsForm.logoPart1.trim()) {
      alert('Site Name and Logo Part 1 are required.');
      return;
    }
    onUpdateSiteSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Form states - Products
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    imageUrl: '',
    category: 'Creative Boards',
    rating: '5',
    inStock: true,
  });

  // Form states - Ads
  const [newAd, setNewAd] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    bgColor: '#7026b9',
    ctaText: 'Shop Now 🧸',
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().toLowerCase();
    if (
      (cleanUsername === 'admin' || cleanUsername === 'admin@adminsecure.com' || cleanUsername === 'admin@company.com') &&
      password === 'kalippetti@123'
    ) {
      onLoginSuccess();
      setLoginError('');
    } else {
      setLoginError('Invalid Email Address or Password!');
    }
  };

  // Product actions
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price || !newProduct.imageUrl) {
      alert('Please fill in title, price, and image URL!');
      return;
    }

    const createdProduct: Product = {
      id: `prod-${Date.now()}`,
      title: newProduct.title,
      description: newProduct.description || 'A magical toy for kids.',
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
      category: newProduct.category || 'General',
      imageUrl: newProduct.imageUrl,
      rating: parseFloat(newProduct.rating),
      reviewsCount: Math.floor(Math.random() * 15) + 3,
      inStock: newProduct.inStock,
    };

    const updated = [...products, createdProduct];
    onUpdateProducts(updated);

    // Reset form
    setNewProduct({
      title: '',
      description: '',
      price: '',
      originalPrice: '',
      imageUrl: '',
      category: 'Creative Boards',
      rating: '5',
      inStock: true,
    });
    alert('Product added successfully!');
  };

  const handleDeleteProduct = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (deletingProductId === id) {
      const updated = products.filter((p) => p.id !== id);
      onUpdateProducts(updated);
      setDeletingProductId(null);
    } else {
      setDeletingProductId(id);
    }
  };

  // Ads actions
  const handleAddAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAd.title || !newAd.subtitle || !newAd.imageUrl) {
      alert('Please fill in Title, Subtitle, and Image URL!');
      return;
    }

    const createdAd: Advertisement = {
      id: `ad-${Date.now()}`,
      title: newAd.title,
      subtitle: newAd.subtitle,
      imageUrl: newAd.imageUrl,
      bgColor: newAd.bgColor,
      ctaText: newAd.ctaText,
    };

    const updated = [...ads, createdAd];
    onUpdateAds(updated);

    // Reset form
    setNewAd({
      title: '',
      subtitle: '',
      imageUrl: '',
      bgColor: '#7026b9',
      ctaText: 'Shop Now 🧸',
    });
    alert('Ad Banner added successfully!');
  };

  const handleDeleteAd = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (deletingAdId === id) {
      const updated = ads.filter((ad) => ad.id !== id);
      onUpdateAds(updated);
      setDeletingAdId(null);
    } else {
      setDeletingAdId(id);
    }
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price || !newProduct.imageUrl) {
      alert('Please fill the required campaign details (Title, Price, Image).');
      return;
    }
    const newCamp: Product = {
      id: `camp-${Date.now()}`,
      title: newProduct.title,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
      category: 'Combos',
      imageUrl: newProduct.imageUrl,
      rating: parseFloat(newProduct.rating),
      reviewsCount: 0,
      inStock: newProduct.inStock,
    };
    onUpdateCampaign(newCamp);
    setNewProduct({
      title: '', description: '', price: '', originalPrice: '',
      imageUrl: '', category: 'Creative Boards', rating: '5', inStock: true,
    });
    alert('Campaign Combo added successfully!');
  };

  const handleDeleteCampaign = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (deletingCampaign) {
      onUpdateCampaign(null);
      setDeletingCampaign(false);
    } else {
      setDeletingCampaign(true);
    }
  };

  // Order actions
  const handleStatusChange = (orderId: string, newStatus: string) => {
    const updated = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    onUpdateOrders(updated);
  };

  const handleDeleteOrder = (e: React.MouseEvent, orderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (deletingOrderId === orderId) {
      const updated = orders.filter((o) => o.id !== orderId);
      onUpdateOrders(updated);
      setDeletingOrderId(null);
    } else {
      setDeletingOrderId(orderId);
    }
  };

  const handleContactCustomer = (order: any) => {
    const customerPhone = order.phone.trim();
    // Indian standard prefix is 91. Make sure it has 91.
    const cleanPhone = customerPhone.startsWith('91') || customerPhone.startsWith('+91')
      ? customerPhone.replace('+', '')
      : `91${customerPhone}`;

    const adminMessage = `Hello ${order.customerName},\n` +
      `This is *${siteSettings.siteName} Admin*.\n` +
      `We are writing to update you on your *Order ID: ${order.id}*.\n` +
      `Your current order status is: *${order.status}*.\n\n` +
      `Items ordered:\n` +
      `${order.items.map((i: any) => `- ${i.quantity}x ${i.title}`).join('\n')}\n\n` +
      `We are processing it. Thank you for shopping with ${siteSettings.siteName}! 🧸`;

    const encodedText = encodeURIComponent(adminMessage);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
  };

  // Stats calculators
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Placed').length;
  const shippedOrdersCount = orders.filter(o => o.status === 'Shipped').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'Delivered').length;

  if (!isLoggedInAdmin) {
    return (
      <div className="ag-login-universe" id="ag-login-root">
        {/* Animated particle field */}
        <div className="ag-particles">
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} className={`ag-particle ag-particle-${i % 5}`} style={{
              left: `${(i * 13 + 3) % 100}%`,
              animationDelay: `${(i * 0.35) % 6}s`,
              animationDuration: `${7 + (i % 5) * 1.5}s`
            }} />
          ))}
        </div>

        {/* Cyber grid */}
        <div className="ag-cyber-grid" />

        {/* Depth rings */}
        <div className="ag-depth-ring ag-depth-ring-1" />
        <div className="ag-depth-ring ag-depth-ring-2" />
        <div className="ag-depth-ring ag-depth-ring-3" />

        {/* Energy waves */}
        <div className="ag-energy-wave ag-wave-1" />
        <div className="ag-energy-wave ag-wave-2" />
        <div className="ag-energy-wave ag-wave-3" />

        {/* Floating 3D geometric objects */}
        <div className="ag-geo ag-geo-1" />
        <div className="ag-geo ag-geo-2" />
        <div className="ag-geo ag-geo-3" />
        <div className="ag-geo ag-geo-4" />
        <div className="ag-geo ag-geo-5" />
        <div className="ag-geo ag-geo-6" />
        <div className="ag-geo ag-geo-7" />
        <div className="ag-geo ag-geo-8" />

        {/* Main centered card */}
        <div className="ag-login-stage">
          {/* Hovering logo above card */}
          <div className="ag-logo-hover">
            <div className="ag-logo-ring">
              <div className="ag-logo-inner">
                <ShieldCheck size={32} color="#ffffff" />
              </div>
            </div>
            <span className="ag-logo-brand">KALIPPETTI</span>
          </div>

          <div className="ag-glass-card">
            {/* Card glow */}
            <div className="ag-card-glow" />
            {/* Corner accent bottom-right */}
            <div className="ag-card-corner-br" />

            <div className="ag-card-header">
              <h1 className="ag-heading">Admin Control Center</h1>
              <p className="ag-subheading">Secure access to system operations</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="ag-form">
              <div className="ag-field-group">
                <label className="ag-field-label">EMAIL ADDRESS</label>
                <div className="ag-input-wrap">
                  <Mail size={16} className="ag-input-icon" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin@company.com"
                    className="ag-input"
                    required
                  />
                  <div className="ag-input-glow" />
                </div>
              </div>

              <div className="ag-field-group">
                <div className="ag-field-label-row">
                  <label className="ag-field-label">PASSWORD</label>
                  <a
                    href="#forgot"
                    onClick={(e) => { e.preventDefault(); alert('Please contact the systems administrator to reset your password.'); }}
                    className="ag-forgot-link"
                  >Forgot Password?</a>
                </div>
                <div className="ag-input-wrap">
                  <Lock size={16} className="ag-input-icon" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="ag-input"
                    required
                  />
                  <div className="ag-input-glow" />
                </div>
              </div>

              <div className="ag-options-row">
                <label className="ag-remember-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="ag-checkbox"
                  />
                  <span>Remember Me</span>
                </label>
              </div>

              {loginError && (
                <div className="ag-error-msg">
                  <ShieldAlert size={14} />
                  <span>{loginError}</span>
                </div>
              )}

              <button type="submit" className="ag-signin-btn">
                <span className="ag-btn-glow" />
                <span className="ag-btn-text">Sign In to Dashboard</span>
                <ArrowRight size={18} className="ag-btn-arrow" />
              </button>
            </form>

            <div className="ag-divider">
              <span>OR</span>
            </div>

            {/* Biometric login */}
            <button
              type="button"
              onClick={() => alert('Biometric authentication is not configured.')}
              className="ag-biometric-btn"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
              <span>Use Biometric Login</span>
            </button>

            {/* System status */}
            <div className="ag-status-bar">
              <div className="ag-status-dot" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="ag-footer">
          <span>© 2024 {siteSettings.siteName} Admin Suite · Secured with AES-256</span>
          <div className="ag-footer-links">
            <a href="#privacy" onClick={e => e.preventDefault()}>Privacy</a>
            <a href="#terms" onClick={e => e.preventDefault()}>Terms</a>
            <a href="#support" onClick={e => e.preventDefault()}>Support</a>
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

          #ag-login-root, .ag-login-universe {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #050816;
            position: relative;
            overflow: hidden;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 40px 20px;
          }

          /* NEBULA ORBS */
          .ag-login-universe::before {
            content: '';
            position: absolute;
            top: -20%;
            left: -10%;
            width: 70vw;
            height: 70vw;
            max-width: 800px;
            max-height: 800px;
            background: radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(59,130,246,0.08) 40%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            filter: blur(60px);
          }
          .ag-login-universe::after {
            content: '';
            position: absolute;
            bottom: -20%;
            right: -10%;
            width: 60vw;
            height: 60vw;
            max-width: 700px;
            max-height: 700px;
            background: radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(16,185,129,0.06) 40%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            filter: blur(80px);
          }

          /* CYBER GRID */
          .ag-cyber-grid {
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            background-image:
              linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
            background-size: 60px 60px;
            mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
            -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
          }

          /* DEPTH RINGS */
          .ag-depth-ring {
            position: absolute;
            border-radius: 50%;
            border: 1px solid rgba(59,130,246,0.08);
            pointer-events: none;
            z-index: 0;
            animation: agDepthExpand linear infinite;
          }
          .ag-depth-ring-1 { width: 400px; height: 400px; animation-duration: 8s; animation-delay: 0s; }
          .ag-depth-ring-2 { width: 700px; height: 700px; animation-duration: 8s; animation-delay: 2.6s; }
          .ag-depth-ring-3 { width: 1000px; height: 1000px; animation-duration: 8s; animation-delay: 5.3s; }
          @keyframes agDepthExpand {
            0%   { opacity: 0.7; transform: scale(0.3); }
            100% { opacity: 0; transform: scale(1.2); }
          }

          /* ===== PARTICLES ===== */
          .ag-particles { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
          .ag-particle {
            position: absolute;
            border-radius: 50%;
            animation: agParticleFloat linear infinite;
          }
          .ag-particle-0 { width: 3px; height: 3px; background: #06B6D4; opacity: 0.8; box-shadow: 0 0 6px #06B6D4; }
          .ag-particle-1 { width: 2px; height: 2px; background: #8B5CF6; opacity: 0.7; box-shadow: 0 0 5px #8B5CF6; }
          .ag-particle-2 { width: 4px; height: 4px; background: #10B981; opacity: 0.5; box-shadow: 0 0 8px #10B981; }
          .ag-particle-3 { width: 2px; height: 2px; background: #3B82F6; opacity: 0.9; box-shadow: 0 0 5px #3B82F6; }
          .ag-particle-4 { width: 3px; height: 3px; background: #c084fc; opacity: 0.6; box-shadow: 0 0 6px #c084fc; }
          @keyframes agParticleFloat {
            0%   { transform: translateY(105vh) translateX(0px) scale(1); opacity: 0; }
            8%   { opacity: 1; }
            92%  { opacity: 1; }
            100% { transform: translateY(-5vh) translateX(30px) scale(0.4); opacity: 0; }
          }

          /* ===== ENERGY WAVES ===== */
          .ag-energy-wave {
            position: absolute;
            border-radius: 50%;
            border: 1px solid rgba(59,130,246,0.12);
            pointer-events: none;
            animation: agWavePulse ease-out infinite;
            z-index: 1;
          }
          .ag-wave-1 { width: 500px; height: 500px; animation-duration: 5s; animation-delay: 0s; border-color: rgba(59,130,246,0.18); }
          .ag-wave-2 { width: 800px; height: 800px; animation-duration: 5s; animation-delay: 1.7s; border-color: rgba(139,92,246,0.12); }
          .ag-wave-3 { width: 1100px; height: 1100px; animation-duration: 5s; animation-delay: 3.3s; border-color: rgba(6,182,212,0.08); }
          @keyframes agWavePulse {
            0%   { transform: scale(0.3); opacity: 0.8; }
            100% { transform: scale(1.05); opacity: 0; }
          }

          /* ===== FLOATING GEOMETRICS ===== */
          .ag-geo {
            position: absolute;
            pointer-events: none;
            z-index: 1;
            animation: agGeoFloat ease-in-out infinite alternate;
          }
          .ag-geo-1 {
            width: 90px; height: 90px;
            top: 10%; left: 6%;
            border: 1.5px solid rgba(6,182,212,0.35);
            border-radius: 20px;
            background: rgba(6,182,212,0.05);
            animation-duration: 7s;
            box-shadow: inset 0 0 40px rgba(6,182,212,0.1), 0 0 30px rgba(6,182,212,0.15);
          }
          .ag-geo-2 {
            width: 55px; height: 55px;
            top: 60%; left: 4%;
            border: 1.5px solid rgba(139,92,246,0.4);
            border-radius: 50%;
            background: rgba(139,92,246,0.06);
            animation-duration: 9s; animation-delay: 1s;
            box-shadow: 0 0 30px rgba(139,92,246,0.2);
          }
          .ag-geo-3 {
            width: 80px; height: 80px;
            top: 25%; right: 5%;
            border: 1.5px solid rgba(16,185,129,0.3);
            clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
            background: rgba(16,185,129,0.06);
            animation-duration: 8s; animation-delay: 0.5s;
            filter: drop-shadow(0 0 10px rgba(16,185,129,0.3));
          }
          .ag-geo-4 {
            width: 65px; height: 65px;
            bottom: 18%; right: 8%;
            border: 1.5px solid rgba(59,130,246,0.35);
            border-radius: 14px;
            transform: rotate(45deg);
            background: rgba(59,130,246,0.06);
            animation-duration: 6s; animation-delay: 2s;
            box-shadow: 0 0 25px rgba(59,130,246,0.15);
          }
          .ag-geo-5 {
            width: 40px; height: 40px;
            top: 8%; right: 20%;
            border: 1.5px solid rgba(192,132,252,0.4);
            border-radius: 50%;
            animation-duration: 10s; animation-delay: 0.8s;
            box-shadow: 0 0 20px rgba(192,132,252,0.25);
            background: rgba(192,132,252,0.04);
          }
          .ag-geo-6 {
            width: 130px; height: 130px;
            bottom: 6%; left: 12%;
            border: 1px solid rgba(6,182,212,0.15);
            border-radius: 32px;
            transform: rotate(-15deg);
            animation-duration: 12s; animation-delay: 3s;
            background: rgba(6,182,212,0.02);
            box-shadow: 0 0 40px rgba(6,182,212,0.05);
          }
          .ag-geo-7 {
            width: 25px; height: 25px;
            top: 40%; left: 2%;
            border: 1.5px solid rgba(59,130,246,0.5);
            border-radius: 6px;
            animation-duration: 5s; animation-delay: 1.5s;
            transform: rotate(20deg);
            box-shadow: 0 0 12px rgba(59,130,246,0.3);
            background: rgba(59,130,246,0.08);
          }
          .ag-geo-8 {
            width: 45px; height: 45px;
            bottom: 30%; left: 7%;
            border: 1.5px solid rgba(16,185,129,0.25);
            clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
            animation-duration: 11s; animation-delay: 4s;
            background: rgba(16,185,129,0.04);
            filter: drop-shadow(0 0 8px rgba(16,185,129,0.2));
          }
          @keyframes agGeoFloat {
            0%   { transform: translateY(0px) rotate(0deg) scale(1); }
            50%  { transform: translateY(-12px) rotate(5deg) scale(1.02); }
            100% { transform: translateY(-22px) rotate(10deg) scale(0.98); }
          }

          /* ===== LOGO ===== */
          .ag-login-stage {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            max-width: 500px;
          }
          .ag-logo-hover {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            margin-bottom: -20px;
            animation: agLogoHover ease-in-out 3s infinite alternate;
            z-index: 11;
            position: relative;
          }
          @keyframes agLogoHover {
            0%   { transform: translateY(0px); }
            100% { transform: translateY(-10px); }
          }
          .ag-logo-ring {
            width: 78px;
            height: 78px;
            border-radius: 22px;
            background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #06B6D4 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow:
              0 0 0 1px rgba(255,255,255,0.15),
              0 0 40px rgba(59,130,246,0.7),
              0 0 80px rgba(139,92,246,0.4),
              0 0 120px rgba(6,182,212,0.25);
            position: relative;
          }
          .ag-logo-ring::before {
            content: '';
            position: absolute;
            inset: -4px;
            border-radius: 26px;
            background: conic-gradient(from 0deg, #3B82F6, #8B5CF6, #06B6D4, #10B981, #3B82F6);
            z-index: -1;
            animation: agConicSpin 3s linear infinite;
            opacity: 0.9;
          }
          .ag-logo-ring::after {
            content: '';
            position: absolute;
            inset: -1px;
            border-radius: 22px;
            background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #06B6D4 100%);
            z-index: -1;
          }
          @keyframes agConicSpin {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .ag-logo-inner {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 1;
          }
          .ag-logo-brand {
            font-size: 0.68rem;
            font-weight: 900;
            letter-spacing: 0.3em;
            color: rgba(255,255,255,0.5);
            text-transform: uppercase;
          }

          /* ===== GLASS CARD ===== */
          .ag-glass-card {
            width: 100%;
            background: rgba(5, 8, 22, 0.7);
            backdrop-filter: blur(60px) saturate(200%) brightness(1.1);
            -webkit-backdrop-filter: blur(60px) saturate(200%) brightness(1.1);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 32px;
            padding: 56px 48px 44px;
            position: relative;
            overflow: hidden;
            box-shadow:
              0 40px 100px rgba(0,0,0,0.8),
              0 0 0 1px rgba(59,130,246,0.1),
              inset 0 1px 0 rgba(255,255,255,0.1),
              inset 0 -1px 0 rgba(59,130,246,0.08);
            animation: agCardEntry 0.8s cubic-bezier(0.16,1,0.3,1) both;
          }
          @keyframes agCardEntry {
            from { opacity: 0; transform: translateY(30px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          /* Scan line effect */
          .ag-glass-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #3B82F6, #8B5CF6, #06B6D4, transparent);
            animation: agScanLine 4s ease-in-out infinite;
            z-index: 20;
          }
          @keyframes agScanLine {
            0%   { opacity: 0; transform: translateX(-100%); }
            20%  { opacity: 1; }
            80%  { opacity: 1; }
            100% { opacity: 0; transform: translateX(100%); }
          }
          /* Corner accents */
          .ag-glass-card::after {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 40px; height: 40px;
            border-top: 2px solid rgba(59,130,246,0.5);
            border-left: 2px solid rgba(59,130,246,0.5);
            border-radius: 32px 0 0 0;
            pointer-events: none;
          }
          .ag-card-glow {
            position: absolute;
            top: -80px;
            left: 50%;
            transform: translateX(-50%);
            width: 280px;
            height: 280px;
            background: radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.1) 40%, transparent 70%);
            pointer-events: none;
            border-radius: 50%;
          }
          /* Bottom right corner accent */
          .ag-card-corner-br {
            position: absolute;
            bottom: 0; right: 0;
            width: 40px; height: 40px;
            border-bottom: 2px solid rgba(6,182,212,0.4);
            border-right: 2px solid rgba(6,182,212,0.4);
            border-radius: 0 0 32px 0;
            pointer-events: none;
          }

          /* ===== CARD HEADER ===== */
          .ag-card-header {
            text-align: center;
            margin-bottom: 36px;
            padding-top: 20px;
          }
          .ag-heading {
            font-size: 2rem;
            font-weight: 800;
            letter-spacing: -0.8px;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 40%, #8B5CF6 80%, #06B6D4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.1;
          }
          .ag-subheading {
            font-size: 0.88rem;
            color: rgba(148,163,184,0.85);
            font-weight: 400;
            letter-spacing: 0.02em;
          }

          /* ===== FORM ===== */
          .ag-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .ag-field-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .ag-field-label-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .ag-field-label {
            font-size: 0.68rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            color: rgba(255,255,255,0.5);
            text-transform: uppercase;
          }
          .ag-forgot-link {
            font-size: 0.72rem;
            font-weight: 600;
            color: #a855f7;
            text-decoration: none;
            transition: color 0.2s;
          }
          .ag-forgot-link:hover { color: #c084fc; }
          .ag-input-wrap {
            position: relative;
            display: flex;
            align-items: center;
          }
          .ag-input-icon {
            position: absolute;
            left: 16px;
            color: rgba(255,255,255,0.3);
            pointer-events: none;
            z-index: 2;
          }
          .ag-input {
            width: 100%;
            height: 54px;
            padding: 0 18px 0 48px;
            background: rgba(15,23,42,0.8);
            border: 1px solid rgba(148,163,184,0.12);
            border-radius: 14px;
            color: #f1f5f9;
            font-size: 0.95rem;
            font-family: 'Inter', -apple-system, sans-serif;
            outline: none;
            transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
            box-sizing: border-box;
          }
          .ag-input::placeholder { color: rgba(148,163,184,0.4); }
          .ag-input:focus {
            background: rgba(15,23,42,0.95);
            border-color: rgba(59,130,246,0.6);
            box-shadow: 0 0 0 3px rgba(59,130,246,0.12), 0 0 24px rgba(59,130,246,0.15), 0 0 1px rgba(59,130,246,0.4) inset;
          }
          .ag-input:focus + .ag-input-glow {
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
          }
          .ag-input-glow {
            position: absolute;
            inset: 0;
            border-radius: 14px;
            pointer-events: none;
          }

          /* ===== OPTIONS ===== */
          .ag-options-row {
            display: flex;
            align-items: center;
            margin-top: -4px;
          }
          .ag-remember-label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.85rem;
            color: rgba(255,255,255,0.5);
            cursor: pointer;
            user-select: none;
          }
          .ag-checkbox {
            width: 16px;
            height: 16px;
            accent-color: #6366f1;
            cursor: pointer;
          }

          /* ===== ERROR ===== */
          .ag-error-msg {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: rgba(239, 68, 68, 0.12);
            border: 1px solid rgba(239,68,68,0.3);
            border-radius: 10px;
            color: #f87171;
            font-size: 0.85rem;
            font-weight: 600;
          }

          /* ===== SIGN IN BUTTON ===== */
          .ag-signin-btn {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            height: 58px;
            background: linear-gradient(135deg, #1d4ed8 0%, #7c3aed 40%, #3B82F6 70%, #06B6D4 100%);
            background-size: 300% 300%;
            border: none;
            border-radius: 16px;
            color: #ffffff;
            font-size: 1rem;
            font-weight: 700;
            font-family: 'Inter', sans-serif;
            cursor: pointer;
            overflow: hidden;
            transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
            animation: agGradientShift 5s ease infinite;
            box-shadow:
              0 4px 20px rgba(59,130,246,0.4),
              0 2px 8px rgba(139,92,246,0.3),
              0 0 60px rgba(6,182,212,0.1),
              inset 0 1px 0 rgba(255,255,255,0.2);
            letter-spacing: 0.01em;
          }
          @keyframes agGradientShift {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .ag-signin-btn:hover {
            transform: translateY(-3px) scale(1.01);
            box-shadow:
              0 12px 50px rgba(59,130,246,0.6),
              0 6px 25px rgba(139,92,246,0.5),
              0 0 80px rgba(6,182,212,0.2),
              inset 0 1px 0 rgba(255,255,255,0.25);
          }
          .ag-signin-btn:active { transform: scale(0.98) translateY(0); }
          .ag-btn-glow {
            position: absolute;
            top: 0; left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
            animation: agBtnShimmer 2.5s ease infinite;
          }
          @keyframes agBtnShimmer {
            0%   { left: -100%; }
            100% { left: 220%; }
          }
          .ag-btn-text { position: relative; z-index: 1; font-size: 0.97rem; }
          .ag-btn-arrow {
            position: relative;
            z-index: 1;
            transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
          }
          .ag-signin-btn:hover .ag-btn-arrow { transform: translateX(5px); }

          /* ===== DIVIDER ===== */
          .ag-divider {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 24px 0 16px;
            color: rgba(255,255,255,0.25);
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.1em;
          }
          .ag-divider::before, .ag-divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(255,255,255,0.1);
          }

          /* ===== BIOMETRIC BUTTON ===== */
          .ag-biometric-btn {
            width: 100%;
            height: 50px;
            background: rgba(15,23,42,0.6);
            border: 1px solid rgba(148,163,184,0.1);
            border-radius: 14px;
            color: rgba(148,163,184,0.7);
            font-size: 0.88rem;
            font-weight: 600;
            font-family: 'Inter', sans-serif;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: background 0.25s, border-color 0.25s, color 0.25s, box-shadow 0.25s;
            letter-spacing: 0.01em;
          }
          .ag-biometric-btn:hover {
            background: rgba(59,130,246,0.08);
            border-color: rgba(59,130,246,0.3);
            color: #93c5fd;
            box-shadow: 0 0 20px rgba(59,130,246,0.08);
          }

          /* ===== STATUS BAR ===== */
          .ag-status-bar {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 28px;
            padding: 10px 20px;
            background: rgba(16,185,129,0.06);
            border: 1px solid rgba(16,185,129,0.15);
            border-radius: 50px;
            font-size: 0.78rem;
            color: rgba(167,243,208,0.7);
            font-weight: 500;
            letter-spacing: 0.02em;
          }
          .ag-status-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #10B981;
            box-shadow: 0 0 8px rgba(16,185,129,0.9), 0 0 16px rgba(16,185,129,0.5);
            animation: agStatusPulse 2.5s ease-in-out infinite;
            flex-shrink: 0;
          }
          @keyframes agStatusPulse {
            0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 8px rgba(16,185,129,0.9), 0 0 16px rgba(16,185,129,0.5); }
            50%       { opacity: 0.6; transform: scale(0.8); box-shadow: 0 0 4px rgba(16,185,129,0.6); }
          }

          /* ===== FOOTER ===== */
          .ag-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            max-width: 500px;
            margin-top: 32px;
            font-size: 0.72rem;
            color: rgba(100,116,139,0.8);
            position: relative;
            z-index: 10;
            flex-wrap: wrap;
            gap: 8px;
          }
          .ag-footer-links {
            display: flex;
            gap: 20px;
          }
          .ag-footer a {
            color: rgba(100,116,139,0.7);
            text-decoration: none;
            transition: color 0.2s;
          }
          .ag-footer a:hover { color: rgba(148,163,184,0.9); }

          @media (max-width: 560px) {
            .ag-glass-card { padding: 48px 24px 36px; }
            .ag-heading { font-size: 1.6rem; }
            .ag-footer { flex-direction: column; align-items: center; text-align: center; }
            .ag-geo-6, .ag-geo-8 { display: none; }
          }
          @media (max-width: 400px) {
            .ag-glass-card { padding: 44px 20px 28px; border-radius: 24px; }
            .ag-heading { font-size: 1.4rem; }
            .ag-signin-btn { height: 52px; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container animate-slide-in">
      <div className="dashboard-header-row">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage {siteSettings.siteName} store inventory, active advertisements, and user orders.</p>
        </div>
        <button onClick={onLogout} className="btn btn-light logout-btn">
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>

      {/* Stats Board */}
      <div className="stats-board-grid">
        <div className="stat-card wavy-card bg-primary-light text-primary">
          <div className="stat-hdr">Total Revenue</div>
          <div className="stat-val">Rs. {totalRevenue}</div>
        </div>
        <div className="stat-card wavy-card bg-orange-light text-orange">
          <div className="stat-hdr">New Orders</div>
          <div className="stat-val">{pendingOrdersCount}</div>
        </div>
        <div className="stat-card wavy-card bg-blue-light text-blue">
          <div className="stat-hdr">Shipped Packages</div>
          <div className="stat-val">{shippedOrdersCount}</div>
        </div>
        <div className="stat-card wavy-card bg-green-light text-green">
          <div className="stat-hdr">Delivered Orders</div>
          <div className="stat-val">{deliveredOrdersCount}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          onClick={() => setActiveTab('orders')}
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
        >
          <ShoppingBag size={18} />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
        >
          <Package size={18} />
          <span>Toys Inventory ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`tab-btn ${activeTab === 'ads' ? 'active' : ''}`}
        >
          <Layers size={18} />
          <span>Advertisement Slider ({ads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('campaign')}
          className={`tab-btn ${activeTab === 'campaign' ? 'active' : ''}`}
        >
          <Package size={18} />
          <span>Campaign Combo</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <Settings size={18} />
          <span>Site Settings</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="dashboard-content">

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="tab-panel animate-slide-in">
            <h3 className="panel-title">Customer Placed Orders</h3>
            <p className="panel-desc">All order details are listed below. Click WhatsApp icon to text customer directly.</p>

            {orders.length === 0 ? (
              <div className="empty-panel-state">
                <span>📦</span>
                <h3>No Orders Placed Yet</h3>
                <p>Orders submitted by customers via checkout will populate here.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Details</th>
                      <th>Items Purchased</th>
                      <th>Total Amount</th>
                      <th>Update Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice().reverse().map((order) => (
                      <tr key={order.id}>
                        <td>
                          <b className="tbl-order-id">{order.id}</b>
                          <div className="tbl-order-date">{order.date}</div>
                        </td>
                        <td>
                          <div className="tbl-cust-name">{order.customerName}</div>
                          <div className="tbl-cust-phone">{order.phone}</div>
                          <div className="tbl-cust-address">{order.address}</div>
                        </td>
                        <td>
                          <div className="tbl-items-list">
                            {order.items.map((i: any, idx: number) => (
                              <div key={idx} className="tbl-item-line">
                                <b>{i.quantity}x</b> {i.title}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className="tbl-amount">Rs. {order.total}</span>
                          <div className="tbl-shipping-note">{order.shippingCharge === 0 ? 'FREE Shipping' : `+ Rs. ${order.shippingCharge} Shipping`}</div>
                        </td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="form-select tbl-status-select"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <div className="tbl-actions">
                            <button
                              onClick={() => handleContactCustomer(order)}
                              className="tbl-action-btn contact-btn"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare size={16} />
                              <span>WhatsApp</span>
                            </button>
                            {deletingOrderId === order.id ? (
                              <div className="delete-confirm-wrapper" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteOrder(e, order.id)}
                                  className="btn-confirm-delete"
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeletingOrderId(null); }}
                                  className="btn-cancel-delete"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteOrder(e, order.id)}
                                className="tbl-action-btn delete-btn"
                                title="Delete Order"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="tab-panel animate-slide-in">
            <div className="inventory-grid">

              {/* Product Form */}
              <div className="inventory-form-card wavy-card">
                <h3>Add New Toy</h3>
                <form onSubmit={handleAddProduct} className="inventory-form">
                  <div className="form-group">
                    <label className="form-label">Toy Title *</label>
                    <input
                      type="text"
                      placeholder="E.g. Magnetic Drawing Board"
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Price (Rs.) *</label>
                      <input
                        type="number"
                        placeholder="E.g. 499"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Original Price (Rs. - Optional)</label>
                      <input
                        type="number"
                        placeholder="E.g. 750 (For discount)"
                        value={newProduct.originalPrice}
                        onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="form-select"
                        required
                      >
                        <option value="Creative Boards">Creative Boards</option>
                        <option value="Wooden Blocks">Wooden Blocks</option>
                        <option value="Action & Science">Action & Science</option>
                        <option value="Plush Toys">Plush Toys</option>
                        <option value="General">General</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Rating Stars (1 - 5)</label>
                      <select
                        value={newProduct.rating}
                        onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                        className="form-select"
                      >
                        <option value="5">5 Stars</option>
                        <option value="4.5">4.5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Image URL *</label>
                    <input
                      type="url"
                      placeholder="Paste online image URL (Unsplash, etc.)"
                      value={newProduct.imageUrl}
                      onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                      className="form-input"
                      required
                    />
                    <span className="field-hint">Tip: Use high quality stock URLs (e.g. from Unsplash).</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      placeholder="Tell customers about the materials, age range, fun factor..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-checkbox-row">
                    <input
                      type="checkbox"
                      id="inStockCheck"
                      checked={newProduct.inStock}
                      onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                      className="checkbox-input"
                    />
                    <label htmlFor="inStockCheck">Product in Stock (In Stock)</label>
                  </div>

                  <button type="submit" className="btn btn-secondary w-full submit-prod-btn">
                    <Plus size={18} />
                    <span>Add Toy Product</span>
                  </button>
                </form>
              </div>

              {/* Product List */}
              <div className="inventory-list-card wavy-card">
                <h3>Current Inventory</h3>
                <p className="panel-desc">Review your current listings. Click delete to remove a toy instantly.</p>

                <div className="inventory-items-container">
                  {products.map((p) => (
                    <div key={p.id} className="inventory-item-row">
                      <div className="inv-img-wrapper">
                        <img src={p.imageUrl} alt={p.title} />
                      </div>

                      <div className="inv-details">
                        <h4>{p.title}</h4>
                        <span className="inv-tag">{p.category}</span>
                        <div className="inv-prices">
                          <span className="inv-cur-price">Rs. {p.price}</span>
                          {p.originalPrice && <span className="inv-orig-price">Rs. {p.originalPrice}</span>}
                        </div>
                      </div>

                      <div className="inv-stock-status">
                        {p.inStock ? (
                          <span className="badge badge-success">In Stock</span>
                        ) : (
                          <span className="badge badge-danger">Out of Stock</span>
                        )}
                      </div>

                      {deletingProductId === p.id ? (
                        <div className="delete-confirm-wrapper" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteProduct(e, p.id)}
                            className="btn-confirm-delete"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeletingProductId(null); }}
                            className="btn-cancel-delete"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteProduct(e, p.id)}
                          className="inv-delete-btn"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: ADVERTISEMENTS */}
        {activeTab === 'ads' && (
          <div className="tab-panel animate-slide-in">
            <div className="inventory-grid">

              {/* Ad Form */}
              <div className="inventory-form-card wavy-card">
                <h3>Add Promo Banner</h3>
                <form onSubmit={handleAddAd} className="inventory-form">
                  <div className="form-group">
                    <label className="form-label">Banner Header / Title *</label>
                    <input
                      type="text"
                      placeholder="E.g. Summer Toy Sale!"
                      value={newAd.title}
                      onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subtitle Description *</label>
                    <input
                      type="text"
                      placeholder="E.g. Flat 30% OFF on educational kits."
                      value={newAd.subtitle}
                      onChange={(e) => setNewAd({ ...newAd, subtitle: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Banner Product Image URL *</label>
                    <input
                      type="url"
                      placeholder="Paste transparent toy PNG or stock image URL"
                      value={newAd.imageUrl}
                      onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Banner Background Color</label>
                      <input
                        type="color"
                        value={newAd.bgColor}
                        onChange={(e) => setNewAd({ ...newAd, bgColor: e.target.value })}
                        className="form-input color-picker-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">CTA Button Label</label>
                      <input
                        type="text"
                        value={newAd.ctaText}
                        onChange={(e) => setNewAd({ ...newAd, ctaText: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-secondary w-full submit-prod-btn">
                    <Plus size={18} />
                    <span>Add Carousel Slide</span>
                  </button>
                </form>
              </div>

              {/* Ad Banners list */}
              <div className="inventory-list-card wavy-card">
                <h3>Active Slideshow Banners</h3>
                <p className="panel-desc">All sliders currently showing on the customer home page header.</p>

                <div className="ad-banners-container">
                  {ads.map((ad) => (
                    <div
                      key={ad.id}
                      className="admin-ad-preview-card"
                      style={{ borderLeft: `10px solid ${ad.bgColor}` }}
                    >
                      <div className="ad-prev-details">
                        <h4>{ad.title}</h4>
                        <p>{ad.subtitle}</p>
                        <span className="ad-prev-color" style={{ background: ad.bgColor }}>
                          {ad.bgColor}
                        </span>
                      </div>
                      <div className="ad-prev-img-wrap">
                        <img src={ad.imageUrl} alt="" />
                      </div>
                      {deletingAdId === ad.id ? (
                        <div className="delete-confirm-wrapper" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteAd(e, ad.id)}
                            className="btn-confirm-delete"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeletingAdId(null); }}
                            className="btn-cancel-delete"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAd(e, ad.id)}
                          className="ad-delete-btn"
                          title="Remove banner"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}


        {/* CAMPAIGN TAB */}
        {activeTab === 'campaign' && (
          <div className="admin-grid-layout">
            <div className="left-panel">
              <div className="form-card wavy-card">
                <h3>{campaign ? 'Update Campaign Combo' : 'Create Campaign Combo'}</h3>
                <p className="panel-desc">Update the special featured Campaign Combo on the home page.</p>

                <form onSubmit={handleCreateCampaign} className="admin-form">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Combo Title</label>
                      <input
                        type="text"
                        value={newProduct.title}
                        onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                        className="form-input"
                        placeholder="KidzAge Combo..."
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Sale Price (Rs.)</label>
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Original Price (Rs.) (Optional)</label>
                      <input
                        type="number"
                        value={newProduct.originalPrice}
                        onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Image URL</label>
                      <input
                        type="url"
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                        className="form-input"
                        placeholder="https://..."
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Combo Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="form-input"
                      rows={3}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary w-full submit-prod-btn">
                    <Plus size={18} />
                    <span>{campaign ? 'Replace Existing Campaign' : 'Create Campaign'}</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="right-panel">
              <div className="inventory-list-card wavy-card">
                <h3>Current Active Campaign</h3>
                {campaign ? (
                  <div className="admin-product-preview-card">
                    <div className="prod-prev-img">
                      <img src={campaign.imageUrl} alt={campaign.title} />
                    </div>
                    <div className="prod-prev-details">
                      <h4>{campaign.title}</h4>
                      <div className="prod-prev-price">
                        <span>Rs. {campaign.price}</span>
                        {campaign.originalPrice && <span className="orig">Rs. {campaign.originalPrice}</span>}
                      </div>
                      <p>{campaign.description}</p>
                    </div>
                    {deletingCampaign ? (
                      <div className="delete-confirm-wrapper" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCampaign(e)}
                          className="btn-confirm-delete"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeletingCampaign(false); }}
                          className="btn-cancel-delete"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCampaign(e)}
                        className="prod-delete-btn"
                        title="Remove campaign"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ) : (
                  <p>No active campaign combo currently set.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="tab-panel animate-slide-in">
            <h3 className="panel-title">Site Settings</h3>
            <p className="panel-desc">Update global site variables like brand name, contact, and welcome text.</p>

            <div className="admin-grid-layout" style={{ display: 'block', maxWidth: '600px' }}>
              <div className="form-card wavy-card">
                <form onSubmit={handleSaveSettings} className="admin-form">
                  <div className="form-group">
                    <label>Site Name (Used in Titles & Tags)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={settingsForm.siteName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group d-flex gap-16">
                    <div style={{ flex: 1 }}>
                      <label>Logo Text Part 1 (Purple)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={settingsForm.logoPart1}
                        onChange={(e) => setSettingsForm({ ...settingsForm, logoPart1: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>Logo Text Part 2 (Orange)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={settingsForm.logoPart2}
                        onChange={(e) => setSettingsForm({ ...settingsForm, logoPart2: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group d-flex gap-16">
                    <div style={{ flex: 1 }}>
                      <label>WhatsApp Contact Number</label>
                      <input
                        type="text"
                        className="form-input"
                        value={settingsForm.contactNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactNumber: e.target.value })}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>Official Email</label>
                      <input
                        type="email"
                        className="form-input"
                        value={settingsForm.officialEmail}
                        onChange={(e) => setSettingsForm({ ...settingsForm, officialEmail: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Welcome Message (Homepage Banner Text)</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={settingsForm.welcomeMessage}
                      onChange={(e) => setSettingsForm({ ...settingsForm, welcomeMessage: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                    <button type="submit" className="btn btn-secondary submit-prod-btn" style={{ margin: 0 }}>
                      <Settings size={18} />
                      Save Settings
                    </button>
                    {settingsSaved && (
                      <span className="text-green fade-in" style={{ fontWeight: 'bold' }}>✓ Saved successfully!</span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .delete-confirm-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn-confirm-delete {
          background-color: var(--danger);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-confirm-delete:hover {
          background-color: #c60029;
        }
        .btn-cancel-delete {
          background-color: #e2e8f0;
          color: #475569;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-cancel-delete:hover {
          background-color: #cbd5e1;
        }
        /* Login styles moved inline to ag-login-universe section above */

        /* Dashboard styles */
        .admin-dashboard-container {
          max-width: 1200px;
          margin: 40px auto 80px;
          padding: 0 24px;
        }
        .dashboard-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        .logout-btn {
          border-color: var(--danger);
          color: var(--danger);
          padding: 8px 16px;
          border-radius: 20px;
        }
        .logout-btn:hover {
          background: rgba(255, 23, 68, 0.05);
          border-color: var(--danger);
        }
        .stats-board-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 36px;
        }
        .stat-card {
          padding: 20px;
          text-align: left;
        }
        .bg-primary-light { background: #f3e5f5; }
        .bg-orange-light { background: #ffe0b2; }
        .bg-blue-light { background: #e1f5fe; }
        .bg-green-light { background: #e8f5e9; }
        .text-orange { color: #f57c00; }
        .text-blue { color: #0288d1; }
        .text-green { color: #388e3c; }
        .stat-hdr {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .stat-val {
          font-size: 1.8rem;
          font-weight: 800;
        }
        .dashboard-tabs {
          display: flex;
          border-bottom: 2px solid var(--border);
          margin-bottom: 30px;
          gap: 12px;
        }
        .tab-btn {
          padding: 12px 20px;
          font-weight: 700;
          font-size: 1rem;
          color: var(--neutral-gray);
          border-bottom: 3px solid transparent;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tab-btn:hover {
          color: var(--primary);
        }
        .tab-btn.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }
        .panel-title {
          font-size: 1.4rem;
          margin-bottom: 6px;
        }
        .panel-desc {
          font-size: 0.9rem;
          color: var(--neutral-gray);
          margin-bottom: 24px;
        }
        .empty-panel-state {
          padding: 60px;
          text-align: center;
          background: var(--white);
          border-radius: var(--border-radius-lg);
          border: 2px dashed var(--border);
        }
        .empty-panel-state span {
          font-size: 3.5rem;
          display: block;
          margin-bottom: 16px;
        }
        .table-responsive {
          width: 100%;
          overflow-x: auto;
          background: var(--white);
          border-radius: var(--border-radius-lg);
          border: 2px solid var(--border);
          box-shadow: var(--shadow-sm);
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .admin-table th {
          background: var(--neutral-light);
          padding: 16px 20px;
          font-weight: 700;
          font-size: 0.9rem;
          border-bottom: 2px solid var(--border);
          color: var(--neutral-dark);
        }
        .admin-table td {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          vertical-align: top;
          font-size: 0.9rem;
        }
        .tbl-order-id {
          font-size: 1.1rem;
          color: var(--primary);
        }
        .tbl-order-date {
          font-size: 0.75rem;
          color: var(--neutral-gray);
          margin-top: 4px;
        }
        .tbl-cust-name {
          font-weight: 700;
          color: var(--neutral-dark);
        }
        .tbl-cust-phone {
          font-weight: 600;
          margin-bottom: 4px;
        }
        .tbl-cust-address {
          font-size: 0.75rem;
          color: var(--neutral-gray);
          line-height: 1.4;
          max-width: 200px;
        }
        .tbl-item-line {
          font-size: 0.85rem;
          line-height: 1.4;
        }
        .tbl-amount {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary);
        }
        .tbl-shipping-note {
          font-size: 0.75rem;
          color: var(--neutral-gray);
        }
        .tbl-status-select {
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          width: 130px;
        }
        .tbl-actions {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .tbl-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .contact-btn {
          background: #e8f5e9;
          color: #2e7d32;
        }
        .contact-btn:hover {
          background: #2e7d32;
          color: white;
        }
        .delete-btn {
          background: #ffebee;
          color: var(--danger);
          justify-content: center;
        }
        .delete-btn:hover {
          background: var(--danger);
          color: white;
        }

        /* Inventory grids */
        .inventory-grid {
          display: grid;
          grid-template-columns: 2fr 3fr;
          gap: 32px;
          align-items: start;
        }
        .inventory-form-card, .inventory-list-card {
          padding: 24px;
          background: var(--white);
        }
        .inventory-form-card h3, .inventory-list-card h3 {
          font-size: 1.25rem;
          margin-bottom: 20px;
          border-bottom: 2px solid var(--border);
          padding-bottom: 8px;
        }
        .inventory-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .field-hint {
          font-size: 0.7rem;
          color: var(--neutral-gray);
          margin-top: 2px;
        }
        .form-checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .checkbox-input {
          width: 18px;
          height: 18px;
          accent-color: var(--primary);
        }
        .submit-prod-btn {
          padding: 12px;
        }
        .inventory-items-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 520px;
          overflow-y: auto;
          padding-right: 6px;
        }
        .inventory-item-row {
          display: flex;
          gap: 12px;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }
        .inv-img-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          background: var(--neutral-light);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          overflow: hidden;
          flex-shrink: 0;
        }
        .inv-img-wrapper img {
          max-height: 90%;
          max-width: 90%;
          object-fit: contain;
        }
        .inv-details {
          flex-grow: 1;
        }
        .inv-details h4 {
          font-size: 0.9rem;
          margin-bottom: 2px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .inv-tag {
          font-size: 0.7rem;
          color: var(--neutral-gray);
          font-weight: 600;
          text-transform: uppercase;
        }
        .inv-prices {
          display: flex;
          gap: 8px;
          align-items: baseline;
        }
        .inv-cur-price {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary);
        }
        .inv-orig-price {
          font-size: 0.75rem;
          text-decoration: line-through;
          color: var(--neutral-gray);
        }
        .inv-stock-status .badge {
          padding: 2px 6px;
          font-size: 0.65rem;
        }
        .inv-delete-btn {
          color: var(--neutral-gray);
        }
        .inv-delete-btn:hover {
          color: var(--danger);
        }

        /* Banner styles */
        .color-picker-input {
          padding: 4px 8px;
          height: 48px;
          cursor: pointer;
        }
        .ad-banners-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 520px;
          overflow-y: auto;
        }
        .admin-ad-preview-card {
          background: var(--neutral-light);
          border: 1px solid var(--border);
          border-radius: var(--border-radius-md);
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
        }
        .ad-prev-details {
          flex-grow: 1;
        }
        .ad-prev-details h4 {
          font-size: 1rem;
          margin-bottom: 4px;
        }
        .ad-prev-details p {
          font-size: 0.8rem;
          color: var(--neutral-gray);
          margin-bottom: 6px;
        }
        .ad-prev-color {
          font-size: 0.7rem;
          font-weight: 700;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .ad-prev-img-wrap {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .ad-prev-img-wrap img {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
        }
        .ad-delete-btn {
          color: var(--neutral-gray);
        }
        .ad-delete-btn:hover {
          color: var(--danger);
        }

        @media (max-width: 992px) {
          .inventory-grid {
            grid-template-columns: 1fr;
          }
          .stats-board-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 576px) {
          .stats-board-grid {
            grid-template-columns: 1fr;
          }
          .dashboard-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .dashboard-tabs {
            flex-direction: column;
            border-bottom: none;
            gap: 4px;
          }
          .tab-btn {
            border-bottom: none;
            border-left: 3px solid transparent;
            padding: 8px 12px;
          }
          .tab-btn.active {
            border-left-color: var(--primary);
            background: var(--primary-light);
          }
        }
      `}</style>
    </div>
  );
};
export default AdminPanel;
