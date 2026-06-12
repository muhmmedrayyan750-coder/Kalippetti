import React, { useState } from 'react';
import { Package, ShoppingBag, Trash2, Plus, MessageSquare, ShieldAlert, LogOut, Layers } from 'lucide-react';
import type { Product } from './ProductCard';
import type { Advertisement } from './AdCarousel';

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
}) => {
  // Login credentials state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab: 'orders' | 'products' | 'ads' | 'campaign'
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'ads' | 'campaign'>('orders');

  // Form states - Products
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    imageUrl: '',
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
    if (username === 'admin' && password === 'kalippetti@123') {
      onLoginSuccess();
      setLoginError('');
    } else {
      setLoginError('Invalid Username or Password!');
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
      category: 'General',
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
      rating: '5',
      inStock: true,
    });
    alert('Product added successfully!');
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this toy product?')) {
      const updated = products.filter((p) => p.id !== id);
      onUpdateProducts(updated);
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

  const handleDeleteAd = (id: string) => {
    if (window.confirm('Are you sure you want to remove this advertisement banner?')) {
      const updated = ads.filter((ad) => ad.id !== id);
      onUpdateAds(updated);
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
      imageUrl: '', rating: '5', inStock: true,
    });
    alert('Campaign Combo added successfully!');
  };

  const handleDeleteCampaign = () => {
    if (window.confirm('Are you sure you want to delete the Campaign Combo?')) {
      onUpdateCampaign(null);
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

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order history?')) {
      const updated = orders.filter((o) => o.id !== orderId);
      onUpdateOrders(updated);
    }
  };

  const handleContactCustomer = (order: any) => {
    const customerPhone = order.phone.trim();
    // Indian standard prefix is 91. Make sure it has 91.
    const cleanPhone = customerPhone.startsWith('91') || customerPhone.startsWith('+91') 
      ? customerPhone.replace('+', '') 
      : `91${customerPhone}`;

    const adminMessage = `Hello ${order.customerName},\n` +
      `This is *Kalippetti Toys Admin*.\n` +
      `We are writing to update you on your *Order ID: ${order.id}*.\n` +
      `Your current order status is: *${order.status}*.\n\n` +
      `Items ordered:\n` +
      `${order.items.map((i: any) => `- ${i.quantity}x ${i.title}`).join('\n')}\n\n` +
      `We are processing it. Thank you for shopping with Kalippetti! 🧸`;

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
      <div className="admin-login-container animate-slide-in">
        <div className="admin-login-card wavy-card">
          <div className="login-logo-brand">
            <span style={{ color: '#7b31d8' }}>Kali</span><span style={{ color: '#ff7b00' }}>ppetti</span>
          </div>
          <h2>Admin Dashboard</h2>
          <p>Please enter admin credentials to manage products, banners, and orders.</p>
          
          <form onSubmit={handleLoginSubmit} className="admin-login-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter 'admin'"
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="form-input"
                required
              />
            </div>

            {loginError && <p className="login-error-msg"><ShieldAlert size={14} /> {loginError}</p>}

            <button type="submit" className="btn btn-primary w-full login-btn-sub">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container animate-slide-in">
      <div className="dashboard-header-row">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage Kalippetti toy store inventory, active advertisements, and user orders.</p>
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
                            <button 
                              onClick={() => handleDeleteOrder(order.id)}
                              className="tbl-action-btn delete-btn"
                              title="Delete Order"
                            >
                              <Trash2 size={16} />
                            </button>
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
                      onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
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
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
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
                        onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">

                    <div className="form-group">
                      <label className="form-label">Rating Stars (1 - 5)</label>
                      <select 
                        value={newProduct.rating}
                        onChange={(e) => setNewProduct({...newProduct, rating: e.target.value})}
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
                      onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
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
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-checkbox-row">
                    <input 
                      type="checkbox" 
                      id="inStockCheck"
                      checked={newProduct.inStock}
                      onChange={(e) => setNewProduct({...newProduct, inStock: e.target.checked})}
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

                      <button 
                        onClick={() => handleDeleteProduct(p.id)}
                        className="inv-delete-btn"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
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
                      onChange={(e) => setNewAd({...newAd, title: e.target.value})}
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
                      onChange={(e) => setNewAd({...newAd, subtitle: e.target.value})}
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
                      onChange={(e) => setNewAd({...newAd, imageUrl: e.target.value})}
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
                        onChange={(e) => setNewAd({...newAd, bgColor: e.target.value})}
                        className="form-input color-picker-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">CTA Button Label</label>
                      <input 
                        type="text" 
                        value={newAd.ctaText}
                        onChange={(e) => setNewAd({...newAd, ctaText: e.target.value})}
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
                      <button 
                        onClick={() => handleDeleteAd(ad.id)}
                        className="ad-delete-btn"
                        title="Remove banner"
                      >
                        <Trash2 size={16} />
                      </button>
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
                        onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
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
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Original Price (Rs.) (Optional)</label>
                      <input 
                        type="number" 
                        value={newProduct.originalPrice}
                        onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Image URL</label>
                      <input 
                        type="url" 
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
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
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
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
                    <button 
                      onClick={handleDeleteCampaign}
                      className="prod-delete-btn"
                      title="Remove campaign"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <p>No active campaign combo currently set.</p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .admin-login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 70vh;
          padding: 24px;
        }
        .admin-login-card {
          width: 100%;
          max-width: 440px;
          background: var(--white);
          padding: 40px 30px;
          text-align: center;
        }
        .login-logo-brand {
          font-size: 2.8rem;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 16px;
          text-align: center;
        }
        .admin-login-card h2 {
          font-size: 1.6rem;
          margin-bottom: 8px;
        }
        .admin-login-card p {
          font-size: 0.95rem;
          color: var(--neutral-gray);
          margin-bottom: 24px;
        }
        .admin-login-form {
          text-align: left;
        }
        .login-error-msg {
          color: var(--danger);
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 16px;
        }
        .login-btn-sub {
          padding: 14px;
          font-size: 1.05rem;
        }
        .admin-tips-box {
          background: var(--neutral-light);
          border: 1px solid var(--border);
          border-radius: var(--border-radius-md);
          margin-top: 24px;
          padding: 12px;
          font-size: 0.8rem;
          color: var(--neutral-gray);
          text-align: left;
        }

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
