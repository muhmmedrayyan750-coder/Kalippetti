import React, { useState, useEffect, useCallback } from 'react';
import {
    BarChart3, Package, ShoppingBag, Image, Settings, Moon, Sun,
    Plus, Trash2, Save, Download, RefreshCw, Eye, Search,
    TrendingUp, Users, DollarSign, Activity, Clock, Shield,
    AlertTriangle, Megaphone
} from 'lucide-react';
import type { Product } from './ProductCard';
import type { Advertisement } from './AdCarousel';
import type { SiteSettings } from '../types';
import { readStoredData, writeStoredData, SHOP_STORAGE_KEYS } from '../lib/persistence';

// ── Shared Storage Keys ──
const STORAGE_KEYS = SHOP_STORAGE_KEYS;

interface Order {
    id: string; customerName: string; phone: string; altPhone?: string;
    address: string; pincode: string; cityState: string;
    items: { id: string; title: string; price: number; quantity: number; category: string }[];
    subtotal: number; shippingCharge: number; total: number; status: string; date: string;
}

interface ActivityLog { time: string; action: string; type: 'info' | 'success' | 'warning' | 'danger'; }

const DEFAULT_SETTINGS: SiteSettings = {
    siteName: 'Kalippetti', logoPart1: 'Kali', logoPart2: 'ppetti',
    contactNumber: '7012780209', officialEmail: 'muhmmedrayyan750@gmail.com',
    welcomeMessage: 'Shop premium, non-toxic, educational, and creative toys for your kids.',
    primaryColor: '#6366f1', secondaryColor: '#ff6b00',
    instagramUrl: 'https://instagram.com', facebookUrl: 'https://facebook.com',
    shippingCharge: 60, freeShippingThreshold: 999,
};

const AdminPanel: React.FC = () => {
    const [dark, setDark] = useState(() => localStorage.getItem('admin_dark') === '1');
    const [tab, setTab] = useState('dashboard');
    const [products, setProducts] = useState<Product[]>([]);
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [campaign, setCampaign] = useState<Product | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [searchQ, setSearchQ] = useState('');
    const [toast, setToast] = useState('');

    // Authentication States
    const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: 'admin' | 'staff' | 'product_manager' | 'user' } | null>(() => {
        const saved = localStorage.getItem('kalippetti_session_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authName, setAuthName] = useState('');
    const [authRole, setAuthRole] = useState<'admin' | 'staff' | 'product_manager' | 'user'>('user');
    const [isRegistering, setIsRegistering] = useState(false);
    const [authError, setAuthError] = useState('');

    // Active forms
    const emptyProd: Product = { id: '', title: '', description: '', price: 0, originalPrice: 0, category: '', imageUrl: '', rating: 4.5, reviewsCount: 10, inStock: true };
    const [prodForm, setProdForm] = useState<Product>({ ...emptyProd });
    const emptyAd: Advertisement = { id: '', title: '', subtitle: '', imageUrl: '', bgColor: '#ff6b00', ctaText: 'Shop Now 🧸' };
    const [adForm, setAdForm] = useState<Advertisement>({ ...emptyAd });

    const log = useCallback((action: string, type: ActivityLog['type'] = 'info') => {
        setLogs(p => [{ time: new Date().toLocaleTimeString(), action, type }, ...p].slice(0, 50));
    }, []);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    // Get all registered users from localStorage or initialize with default accounts
    const getUsers = (): any[] => {
        const saved = localStorage.getItem('kalippetti_users');
        if (!saved) {
            const defaults = [
                { name: 'Super Admin', email: 'muhmmedrayyan750@gmail.com', password: 'Admin@123', role: 'admin' },
                { name: 'Backup Admin', email: 'admin@kalippetti.com', password: 'Admin@123', role: 'admin' },
                { name: 'Staff Member', email: 'staff@kalippetti.com', password: 'Admin@123', role: 'staff' },
                { name: 'Product Manager', email: 'pm@kalippetti.com', password: 'Admin@123', role: 'product_manager' }
            ];
            localStorage.setItem('kalippetti_users', JSON.stringify(defaults));
            return defaults;
        }
        return JSON.parse(saved);
    };

    // ── Load all data ──
    const loadAll = useCallback(async () => {
        setLoading(true);
        try {
            const [pR, aR, cR, oR, sR] = await Promise.all([
                readStoredData<Product[]>(STORAGE_KEYS.products),
                readStoredData<Advertisement[]>(STORAGE_KEYS.ads),
                readStoredData<Product | null>(STORAGE_KEYS.campaign, null),
                readStoredData<Order[]>(STORAGE_KEYS.orders, []),
                readStoredData<SiteSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS),
            ]);

            if (pR) setProducts(pR);
            if (aR) setAds(aR);
            if (cR) setCampaign(cR);
            if (oR) setOrders(oR);
            if (sR) setSettings(sR);
            log('Shared database synced successfully', 'success');
        } catch { log('Failed to sync shared database', 'danger'); }
        setLoading(false);
    }, [log]);

    useEffect(() => {
        if (currentUser) {
            loadAll();
        }
    }, [currentUser, loadAll]);

    // ── Save Helper ──
    const saveData = async (key: keyof typeof STORAGE_KEYS, data: unknown) => {
        setSaving(true);
        try {
            await writeStoredData(STORAGE_KEYS[key], data);
            log(`Saved ${key} to shared storage`, 'success');
            showToast(`✅ ${key} saved successfully!`);
        } catch { log(`Failed to save ${key}`, 'danger'); showToast(`❌ Failed to save ${key}`); }
        setSaving(false);
    };

    // ── Authentication Actions ──
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        const userList = getUsers();
        const found = userList.find(u => u.email.toLowerCase() === authEmail.trim().toLowerCase() && u.password === authPassword);

        if (!found) {
            setAuthError('Invalid email or password.');
            return;
        }

        if (found.role === 'user') {
            setAuthError('Access Denied: Customers cannot access the management panel.');
            return;
        }

        const sessionUser = { name: found.name, email: found.email, role: found.role };
        setCurrentUser(sessionUser);
        localStorage.setItem('kalippetti_session_user', JSON.stringify(sessionUser));
        log(`User ${found.name} logged in as ${found.role}`, 'success');
        showToast(`Welcome back, ${found.name}!`);
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');

        if (!authName.trim() || !authEmail.trim() || !authPassword) {
            setAuthError('Please fill out all fields.');
            return;
        }

        if (authPassword.length < 6) {
            setAuthError('Password must be at least 6 characters.');
            return;
        }

        const emailLower = authEmail.trim().toLowerCase();

        // Enforce admin restrictions
        if (authRole === 'admin' && emailLower !== 'muhmmedrayyan750@gmail.com' && emailLower !== 'admin@kalippetti.com') {
            setAuthError('Access Denied: Only the official administrator email (muhmmedrayyan750@gmail.com) can register as Admin.');
            return;
        }

        let roleToSave = authRole;
        if (emailLower === 'muhmmedrayyan750@gmail.com') {
            roleToSave = 'admin';
        }

        const userList = getUsers();
        if (userList.some(u => u.email.toLowerCase() === emailLower)) {
            setAuthError('An account with this email already exists.');
            return;
        }

        const newUser = { name: authName.trim(), email: emailLower, password: authPassword, role: roleToSave };
        const updated = [...userList, newUser];
        localStorage.setItem('kalippetti_users', JSON.stringify(updated));

        // Sync user list helper
        const userSync = async () => {
            try {
                const payload: Record<string, unknown> = {};
                const keys = ['products', 'ads', 'campaign', 'orders', 'settings', 'users'];
                keys.forEach(k => {
                    const val = localStorage.getItem(`kalippetti_${k}`);
                    payload[k] = val ? JSON.parse(val) : (k === 'users' ? updated : null);
                });
                await fetch('https://jsonblob.com/api/jsonBlob/019f3bdb-faa6-7f7f-8f01-68d01c3219b0', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } catch (err) {
                console.error(err);
            }
        };
        userSync();

        if (roleToSave === 'user') {
            showToast('Registration successful! Please login.');
            setAuthEmail(emailLower);
            setAuthPassword('');
            setIsRegistering(false);
            setAuthError('Customer account created. Note: customers cannot log in to the admin panel - please log in as Staff, Product Manager, or Administrator.');
        } else {
            const sessionUser = { name: newUser.name, email: newUser.email, role: newUser.role };
            setCurrentUser(sessionUser);
            localStorage.setItem('kalippetti_session_user', JSON.stringify(sessionUser));
            log(`User ${newUser.name} registered and logged in as ${newUser.role}`, 'success');
            showToast(`Registered and logged in as ${newUser.role}!`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('kalippetti_session_user');
        setCurrentUser(null);
        setAuthPassword('');
        log('Logged out successfully', 'info');
        showToast('Logged out successfully');
    };

    // ── Dark mode ──
    useEffect(() => { localStorage.setItem('admin_dark', dark ? '1' : '0'); }, [dark]);

    // ── Backup ──
    const downloadBackup = () => {
        if (currentUser?.role !== 'admin') return showToast('❌ Backup restricted to Admin only');
        const backup = { products, ads, campaign, orders, settings, exportedAt: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
        a.download = `kalippetti-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
        log('Backup downloaded', 'success'); showToast('📦 Backup downloaded!');
    };

    // ── Products CRUD ──
    const addProduct = async () => {
        if (currentUser?.role === 'staff') return showToast('❌ Staff account has read-only access to products');
        if (!prodForm.title || !prodForm.price) return showToast('❌ Title & Price required');
        const np = { ...prodForm, id: prodForm.id || `prod-${Date.now()}` };
        const updated = prodForm.id && products.find(p => p.id === prodForm.id)
            ? products.map(p => p.id === np.id ? np : p) : [...products, np];
        setProducts(updated); await saveData('products', updated);
        setProdForm({ ...emptyProd }); log(`Product "${np.title}" saved`, 'success');
    };
    const deleteProduct = async (id: string) => {
        if (currentUser?.role === 'staff') return showToast('❌ Staff account has read-only access to products');
        const updated = products.filter(p => p.id !== id);
        setProducts(updated); await saveData('products', updated);
        log(`Product deleted`, 'warning');
    };

    // ── Ads CRUD ──
    const addAd = async () => {
        if (currentUser?.role === 'staff') return showToast('❌ Staff account has read-only access to banners');
        if (!adForm.title) return showToast('❌ Title required');
        const na = { ...adForm, id: adForm.id || `ad-${Date.now()}` };
        const updated = adForm.id && ads.find(a => a.id === adForm.id)
            ? ads.map(a => a.id === na.id ? na : a) : [...ads, na];
        setAds(updated); await saveData('ads', updated);
        setAdForm({ ...emptyAd }); log(`Ad "${na.title}" saved`, 'success');
    };
    const deleteAd = async (id: string) => {
        if (currentUser?.role === 'staff') return showToast('❌ Staff account has read-only access to banners');
        const updated = ads.filter(a => a.id !== id);
        setAds(updated); await saveData('ads', updated); log('Ad deleted', 'warning');
    };

    // ── Orders ──
    const updateOrderStatus = async (id: string, status: string) => {
        if (currentUser?.role === 'product_manager') return showToast('❌ Product Manager has read-only access to orders');
        const updated = orders.map(o => o.id === id ? { ...o, status } : o);
        setOrders(updated); await saveData('orders', updated);
        log(`Order ${id} → ${status}`, 'info');
    };
    const deleteOrder = async (id: string) => {
        if (currentUser?.role === 'product_manager') return showToast('❌ Product Manager has read-only access to orders');
        const updated = orders.filter(o => o.id !== id);
        setOrders(updated); await saveData('orders', updated); log(`Order ${id} deleted`, 'warning');
    };

    // ── Settings ──
    const saveSettings = async () => {
        if (currentUser?.role !== 'admin') return showToast('❌ Settings can only be saved by administrator');
        await saveData('settings', settings);
    };

    // ── Campaign ──
    const saveCampaign = async () => {
        if (currentUser?.role === 'staff') return showToast('❌ Staff account has read-only access to campaigns');
        await saveData('campaign', campaign); log('Campaign saved', 'success');
    };

    // ── Stats ──
    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'Placed' || o.status === 'Processing').length;
    const theme = dark ? 'adm-dark' : 'adm-light';

    const filteredOrders = orders.filter(o =>
        o.id?.toLowerCase().includes(searchQ.toLowerCase()) ||
        o.customerName?.toLowerCase().includes(searchQ.toLowerCase()) ||
        o.phone?.includes(searchQ)
    );

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
        { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
        { id: 'products', label: 'Products', icon: <Package size={18} /> },
        { id: 'ads', label: 'Banners', icon: <Image size={18} /> },
        { id: 'campaign', label: 'Campaign', icon: <Megaphone size={18} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
        { id: 'activity', label: 'Activity', icon: <Activity size={18} /> },
    ];


    if (!currentUser) {
        return (
            <div className={`adm-root auth-page ${theme}`}>
                {toast && <div className="adm-toast">{toast}</div>}

                <div className="auth-container">
                    <div className="auth-card wavy-card">
                        <div className="auth-logo">
                            <Shield size={36} />
                            <h2>Kalippetti Management Portal</h2>
                            <p>Secure login for administrators, staff, and managers</p>
                        </div>

                        <div className="auth-tabs">
                            <button type="button" className={`auth-tab-btn ${!isRegistering ? 'active' : ''}`} onClick={() => { setIsRegistering(false); setAuthError(''); }}>Login</button>
                            <button type="button" className={`auth-tab-btn ${isRegistering ? 'active' : ''}`} onClick={() => { setIsRegistering(true); setAuthError(''); }}>Register</button>
                        </div>

                        {authError && <div className={`auth-alert ${authError.includes('Access Denied') ? 'alert-danger' : 'alert-info'}`}>{authError}</div>}

                        {isRegistering ? (
                            <form onSubmit={handleRegister} className="form-fields">
                                <div>
                                    <label className="field-label">Full Name</label>
                                    <input placeholder="Enter full name" value={authName} onChange={e => setAuthName(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="field-label">Email Address</label>
                                    <input type="email" placeholder="email@example.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="field-label">Password</label>
                                    <input type="password" placeholder="••••••••" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="field-label">Select Access Role</label>
                                    <select value={authRole} onChange={e => setAuthRole(e.target.value as any)}>
                                        <option value="user">Customer (Store View Only)</option>
                                        <option value="staff">Staff Member (Manage Orders)</option>
                                        <option value="product_manager">Product Manager (Manage Inventory)</option>
                                        <option value="admin">Administrator (Full Access)</option>
                                    </select>
                                </div>
                                <div className="role-restriction-notice">
                                    ℹ️ <strong>Note:</strong> Admin privileges are reserved for <code>muhmmedrayyan750@gmail.com</code>.
                                </div>
                                <button type="submit" className="btn-primary">Register Account</button>
                            </form>
                        ) : (
                            <form onSubmit={handleLogin} className="form-fields">
                                <div>
                                    <label className="field-label">Email Address</label>
                                    <input type="email" placeholder="email@example.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="field-label">Password</label>
                                    <input type="password" placeholder="••••••••" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn-primary">Authenticate</button>
                            </form>
                        )}

                        <div className="auth-footer-help">
                            <a href="/">← Return to Storefront</a>
                            <div className="default-acc-hints">
                                <p><strong>Demo Credentials:</strong></p>
                                <ul>
                                    <li>Admin: <code>muhmmedrayyan750@gmail.com</code> / <code>Admin@123</code> (Settings edit permitted)</li>
                                    <li>PM Account: <code>pm@kalippetti.com</code> / <code>Admin@123</code> (Products edit permitted)</li>
                                    <li>Staff Account: <code>staff@kalippetti.com</code> / <code>Admin@123</code> (Orders edit permitted)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    .auth-page {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: var(--ab);
                        padding: 20px;
                        min-height: 100vh;
                        width: 100%;
                    }
                    .auth-container {
                        width: 100%;
                        max-width: 480px;
                    }
                    .auth-card {
                        background: var(--ac);
                        border: 1px solid var(--abrd);
                        border-radius: 20px;
                        padding: 40px;
                        box-shadow: var(--shadow);
                    }
                    .auth-logo {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .auth-logo svg {
                        color: var(--as);
                        margin-bottom: 12px;
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .auth-logo h2 {
                        font-size: 1.5rem;
                        font-weight: 800;
                        margin-bottom: 6px;
                    }
                    .auth-logo p {
                        font-size: 0.9rem;
                        color: var(--asub);
                    }
                    .auth-tabs {
                        display: flex;
                        border-bottom: 2px solid var(--abrd);
                        margin-bottom: 24px;
                    }
                    .auth-tab-btn {
                        flex: 1;
                        padding: 12px;
                        background: transparent;
                        border: none;
                        font-weight: 700;
                        color: var(--asub);
                        cursor: pointer;
                        font-family: inherit;
                        transition: .2s;
                        border-bottom: 2px solid transparent;
                        margin-bottom: -2px;
                    }
                    .auth-tab-btn.active {
                        color: var(--as);
                        border-bottom-color: var(--as);
                    }
                    .auth-alert {
                        padding: 12px 16px;
                        border-radius: 12px;
                        font-size: 0.85rem;
                        font-weight: 600;
                        margin-bottom: 20px;
                        line-height: 1.4;
                    }
                    .alert-danger {
                        background: rgba(239, 68, 68, 0.1);
                        color: #ef4444;
                        border: 1px solid rgba(239, 68, 68, 0.2);
                    }
                    .alert-info {
                        background: rgba(59, 130, 246, 0.1);
                        color: #3b82f6;
                        border: 1px solid rgba(59, 130, 246, 0.2);
                    }
                    .role-restriction-notice {
                        background: var(--ainput);
                        padding: 10px 14px;
                        border-radius: 10px;
                        font-size: 0.8rem;
                        color: var(--asub);
                        border-left: 3px solid var(--as);
                        margin-bottom: 8px;
                    }
                    .auth-footer-help {
                        text-align: center;
                        margin-top: 24px;
                        font-size: 0.9rem;
                    }
                    .auth-footer-help a {
                        color: var(--as);
                        text-decoration: none;
                        font-weight: 700;
                    }
                    .default-acc-hints {
                        margin-top: 20px;
                        text-align: left;
                        font-size: 0.77rem;
                        color: var(--asub);
                        border-top: 1px solid var(--abrd);
                        padding-top: 16px;
                    }
                    .default-acc-hints ul {
                        margin: 6px 0 0 0;
                        padding-left: 16px;
                        line-height: 1.5;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className={`adm-root ${theme}`}>
            {toast && <div className="adm-toast">{toast}</div>}

            {/* Sidebar */}
            <aside className="adm-sidebar">
                <div className="adm-sidebar-logo">
                    <Shield size={24} /> <span>Kalippetti</span><small>Admin</small>
                </div>

                <div className="adm-sidebar-profile">
                    <div className="profile-photo">
                        {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <span className="profile-name">{currentUser.name}</span>
                        <span className={`profile-role role-${currentUser.role}`}>{currentUser.role.replace('_', ' ')}</span>
                    </div>
                </div>

                <nav className="adm-nav">
                    {tabs.map(t => (
                        <button key={t.id} className={`adm-nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                            {t.icon}<span>{t.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="adm-sidebar-bottom">
                    <button className="adm-dark-toggle" onClick={() => setDark(!dark)}>
                        {dark ? <Sun size={18} /> : <Moon size={18} />}<span>{dark ? 'Light' : 'Dark'} Mode</span>
                    </button>
                    {currentUser?.role === 'admin' && (
                        <button className="adm-backup-btn" onClick={downloadBackup}><Download size={16} /><span>Backup</span></button>
                    )}
                    <a href="/" className="adm-visit-btn"><Eye size={16} /><span>View Site</span></a>
                    <button className="adm-logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="adm-main">
                <header className="adm-topbar">
                    <h1 className="adm-page-title">{tabs.find(t => t.id === tab)?.label}</h1>
                    <div className="adm-topbar-actions">
                        <button onClick={loadAll} disabled={loading} className="adm-refresh-btn" title="Refresh"><RefreshCw size={18} className={loading ? 'spin' : ''} /></button>
                        {saving && <span className="adm-saving-badge">Saving...</span>}
                    </div>
                </header>

                <div className="adm-content">
                    {/* ═══ DASHBOARD ═══ */}
                    {tab === 'dashboard' && (
                        <div className="adm-dashboard">
                            <div className="stat-grid">
                                <div className="stat-card sc-purple"><DollarSign size={28} /><div><small>Total Revenue</small><h2>₹{totalRevenue.toLocaleString()}</h2></div></div>
                                <div className="stat-card sc-orange"><ShoppingBag size={28} /><div><small>Total Orders</small><h2>{orders.length}</h2></div></div>
                                <div className="stat-card sc-blue"><Package size={28} /><div><small>Products</small><h2>{products.length}</h2></div></div>
                                <div className="stat-card sc-red"><AlertTriangle size={28} /><div><small>Pending</small><h2>{pendingOrders}</h2></div></div>
                                <div className="stat-card sc-green"><TrendingUp size={28} /><div><small>Banners</small><h2>{ads.length}</h2></div></div>
                                <div className="stat-card sc-teal"><Users size={28} /><div><small>Unique Customers</small><h2>{new Set(orders.map(o => o.phone)).size}</h2></div></div>
                            </div>
                            <div className="dash-row">
                                <div className="dash-card"><h3><Clock size={18} /> Recent Orders</h3>
                                    {orders.slice(-5).reverse().map(o => (
                                        <div key={o.id} className="dash-order-row">
                                            <span className="do-id">{o.id}</span><span className="do-name">{o.customerName}</span>
                                            <span className={`do-status st-${o.status?.toLowerCase()}`}>{o.status}</span>
                                            <span className="do-total">₹{o.total}</span>
                                        </div>
                                    ))}
                                    {orders.length === 0 && <p className="empty-hint">No orders yet</p>}
                                </div>
                                <div className="dash-card"><h3><Activity size={18} /> Recent Activity</h3>
                                    {logs.slice(0, 8).map((l, i) => (
                                        <div key={i} className={`log-row log-${l.type}`}><span className="log-time">{l.time}</span><span>{l.action}</span></div>
                                    ))}
                                    {logs.length === 0 && <p className="empty-hint">No activity yet</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══ ORDERS ═══ */}
                    {tab === 'orders' && (
                        <div className="adm-orders">
                            {currentUser?.role === 'product_manager' && (
                                <div className="rbac-warning-banner">
                                    <AlertTriangle size={18} />
                                    <span><strong>Read-Only Mode:</strong> Product managers are not authorized to update order status or delete transactions.</span>
                                </div>
                            )}
                            <div className="orders-toolbar">
                                <div className="search-box"><Search size={16} /><input placeholder="Search orders..." value={searchQ} onChange={e => setSearchQ(e.target.value)} /></div>
                                <span className="orders-count">{filteredOrders.length} orders</span>
                            </div>
                            <div className="orders-table-wrap">
                                <table className="orders-table">
                                    <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {filteredOrders.map(o => (
                                            <tr key={o.id}>
                                                <td><strong>{o.id}</strong><br /><small>{o.date}</small></td>
                                                <td><strong>{o.customerName}</strong><br /><small>{o.phone}</small><br /><small className="addr-text">{o.address}, {o.cityState} - {o.pincode}</small></td>
                                                <td>{o.items?.map((it, i) => <div key={i} className="item-line">{it.quantity}× {it.title}</div>)}</td>
                                                <td><strong>₹{o.total}</strong></td>
                                                <td>
                                                    <select disabled={currentUser?.role === 'product_manager'} value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)} className={`status-sel st-${o.status?.toLowerCase()}`}>
                                                        {['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                                                    </select>
                                                </td>
                                                <td>
                                                    <div className="order-actions">
                                                        <a href={`https://wa.me/91${o.phone}`} target="_blank" rel="noreferrer" className="oa-btn oa-green" title="WhatsApp">💬</a>
                                                        {currentUser?.role !== 'product_manager' && (
                                                            <button onClick={() => deleteOrder(o.id)} className="oa-btn oa-red" title="Delete">🗑</button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredOrders.length === 0 && <p className="empty-hint" style={{ padding: 40 }}>No orders found</p>}
                            </div>
                        </div>
                    )}

                    {/* ═══ PRODUCTS ═══ */}
                    {tab === 'products' && (
                        <div className="adm-products">
                            {currentUser?.role === 'staff' && (
                                <div className="rbac-warning-banner">
                                    <AlertTriangle size={18} />
                                    <span><strong>Read-Only Mode:</strong> Staff members are not authorized to add, edit, or delete items in the product catalog.</span>
                                </div>
                            )}
                            <div className="prod-grid">
                                <div className="form-card">
                                    <h3><Plus size={18} /> {prodForm.id ? 'Edit' : 'Add'} Product</h3>
                                    <div className="form-fields">
                                        <input disabled={currentUser?.role === 'staff'} placeholder="Title *" value={prodForm.title} onChange={e => setProdForm({ ...prodForm, title: e.target.value })} />
                                        <textarea disabled={currentUser?.role === 'staff'} placeholder="Description" value={prodForm.description} onChange={e => setProdForm({ ...prodForm, description: e.target.value })} />
                                        <div className="form-row-2">
                                            <input disabled={currentUser?.role === 'staff'} type="number" placeholder="Price *" value={prodForm.price || ''} onChange={e => setProdForm({ ...prodForm, price: +e.target.value })} />
                                            <input disabled={currentUser?.role === 'staff'} type="number" placeholder="Original Price" value={prodForm.originalPrice || ''} onChange={e => setProdForm({ ...prodForm, originalPrice: +e.target.value })} />
                                        </div>
                                        <div className="form-row-2">
                                            <input disabled={currentUser?.role === 'staff'} placeholder="Category" value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })} />
                                            <input disabled={currentUser?.role === 'staff'} type="number" step="0.1" placeholder="Rating" value={prodForm.rating || ''} onChange={e => setProdForm({ ...prodForm, rating: +e.target.value })} />
                                        </div>
                                        <input disabled={currentUser?.role === 'staff'} placeholder="Image URL" value={prodForm.imageUrl} onChange={e => setProdForm({ ...prodForm, imageUrl: e.target.value })} />
                                        <label className="checkbox-row"><input disabled={currentUser?.role === 'staff'} type="checkbox" checked={prodForm.inStock} onChange={e => setProdForm({ ...prodForm, inStock: e.target.checked })} /> In Stock</label>
                                        <div className="form-actions">
                                            <button disabled={currentUser?.role === 'staff'} className="btn-primary" onClick={addProduct}><Save size={16} /> Save</button>
                                            {prodForm.id && <button className="btn-ghost" onClick={() => setProdForm({ ...emptyProd })}>Cancel</button>}
                                        </div>
                                    </div>
                                </div>
                                <div className="list-card">
                                    <h3><Package size={18} /> All Products ({products.length})</h3>
                                    <div className="item-list">
                                        {products.map(p => (
                                            <div key={p.id} className="list-item">
                                                <div className="li-img">{p.imageUrl ? <img src={p.imageUrl} alt="" /> : '📦'}</div>
                                                <div className="li-info"><strong>{p.title}</strong><small>{p.category} · ₹{p.price}</small></div>
                                                <div className="li-actions">
                                                    <button onClick={() => { if (currentUser?.role === 'staff') { showToast('❌ Staff can only view products'); } else { setProdForm(p); } }} title="Edit">✏️</button>
                                                    {currentUser?.role !== 'staff' && (
                                                        <button onClick={() => deleteProduct(p.id)} title="Delete"><Trash2 size={14} /></button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {products.length === 0 && <p className="empty-hint">No products yet</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══ BANNERS ═══ */}
                    {tab === 'ads' && (
                        <div className="adm-ads">
                            {currentUser?.role === 'staff' && (
                                <div className="rbac-warning-banner">
                                    <AlertTriangle size={18} />
                                    <span><strong>Read-Only Mode:</strong> Staff members are not authorized to modify store banners.</span>
                                </div>
                            )}
                            <div className="prod-grid">
                                <div className="form-card">
                                    <h3><Plus size={18} /> {adForm.id ? 'Edit' : 'Add'} Banner</h3>
                                    <div className="form-fields">
                                        <input disabled={currentUser?.role === 'staff'} placeholder="Title *" value={adForm.title} onChange={e => setAdForm({ ...adForm, title: e.target.value })} />
                                        <input disabled={currentUser?.role === 'staff'} placeholder="Subtitle" value={adForm.subtitle} onChange={e => setAdForm({ ...adForm, subtitle: e.target.value })} />
                                        <input disabled={currentUser?.role === 'staff'} placeholder="Image URL" value={adForm.imageUrl} onChange={e => setAdForm({ ...adForm, imageUrl: e.target.value })} />
                                        <div className="form-row-2">
                                            <div><label className="field-label">Background Color</label><input disabled={currentUser?.role === 'staff'} type="color" value={adForm.bgColor} onChange={e => setAdForm({ ...adForm, bgColor: e.target.value })} /></div>
                                            <input disabled={currentUser?.role === 'staff'} placeholder="CTA Text" value={adForm.ctaText || ''} onChange={e => setAdForm({ ...adForm, ctaText: e.target.value })} />
                                        </div>
                                        <div className="form-actions">
                                            <button disabled={currentUser?.role === 'staff'} className="btn-primary" onClick={addAd}><Save size={16} /> Save</button>
                                            {adForm.id && <button className="btn-ghost" onClick={() => setAdForm({ ...emptyAd })}>Cancel</button>}
                                        </div>
                                    </div>
                                </div>
                                <div className="list-card">
                                    <h3><Image size={18} /> All Banners ({ads.length})</h3>
                                    <div className="item-list">
                                        {ads.map(a => (
                                            <div key={a.id} className="list-item">
                                                <div className="li-color" style={{ background: a.bgColor }}></div>
                                                <div className="li-info"><strong>{a.title}</strong><small>{a.subtitle}</small></div>
                                                <div className="li-actions">
                                                    <button onClick={() => { if (currentUser?.role === 'staff') { showToast('❌ Staff can only view banners'); } else { setAdForm(a); } }} title="Edit">✏️</button>
                                                    {currentUser?.role !== 'staff' && (
                                                        <button onClick={() => deleteAd(a.id)} title="Delete"><Trash2 size={14} /></button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {ads.length === 0 && <p className="empty-hint">No banners yet</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══ CAMPAIGN ═══ */}
                    {tab === 'campaign' && (
                        <div className="adm-campaign">
                            {currentUser?.role === 'staff' && (
                                <div className="rbac-warning-banner">
                                    <AlertTriangle size={18} />
                                    <span><strong>Read-Only Mode:</strong> Staff members are not authorized to modify campaigns.</span>
                                </div>
                            )}
                            <div className="form-card" style={{ maxWidth: 600 }}>
                                <h3><Megaphone size={18} /> Campaign Combo Product</h3>
                                <p className="field-hint">This special product appears on the homepage as a highlighted deal.</p>
                                <div className="form-fields">
                                    <input disabled={currentUser?.role === 'staff'} placeholder="Title" value={campaign?.title || ''} onChange={e => setCampaign({ ...campaign!, title: e.target.value })} />
                                    <textarea disabled={currentUser?.role === 'staff'} placeholder="Description" value={campaign?.description || ''} onChange={e => setCampaign({ ...campaign!, description: e.target.value })} />
                                    <div className="form-row-2">
                                        <input disabled={currentUser?.role === 'staff'} type="number" placeholder="Price" value={campaign?.price || ''} onChange={e => setCampaign({ ...campaign!, price: +e.target.value })} />
                                        <input disabled={currentUser?.role === 'staff'} type="number" placeholder="Original Price" value={campaign?.originalPrice || ''} onChange={e => setCampaign({ ...campaign!, originalPrice: +e.target.value })} />
                                    </div>
                                    <input disabled={currentUser?.role === 'staff'} placeholder="Image URL" value={campaign?.imageUrl || ''} onChange={e => setCampaign({ ...campaign!, imageUrl: e.target.value })} />
                                    <input disabled={currentUser?.role === 'staff'} placeholder="Category" value={campaign?.category || ''} onChange={e => setCampaign({ ...campaign!, category: e.target.value })} />
                                    <div className="form-actions">
                                        <button disabled={currentUser?.role === 'staff'} className="btn-primary" onClick={saveCampaign}><Save size={16} /> Save Campaign</button>
                                        <button disabled={currentUser?.role === 'staff'} className="btn-ghost" onClick={async () => { setCampaign(null); await saveData('campaign', null); }}>Clear</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══ SETTINGS ═══ */}
                    {tab === 'settings' && (
                        <div className="adm-settings">
                            {currentUser?.role !== 'admin' && (
                                <div className="rbac-warning-banner">
                                    <AlertTriangle size={18} />
                                    <span><strong>Access Denied:</strong> Only the primary administrator (muhmmedrayyan750@gmail.com) can adjust settings, pricing, shipping, or branding colors.</span>
                                </div>
                            )}
                            <div className="form-card" style={{ maxWidth: 700 }}>
                                <h3><Settings size={18} /> Site Settings</h3>
                                <div className="form-fields">
                                    <div className="form-row-2">
                                        <div><label className="field-label">Site Name</label><input disabled={currentUser?.role !== 'admin'} value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} /></div>
                                        <div><label className="field-label">Contact Number</label><input disabled={currentUser?.role !== 'admin'} value={settings.contactNumber} onChange={e => setSettings({ ...settings, contactNumber: e.target.value })} /></div>
                                    </div>
                                    <div className="form-row-2">
                                        <div><label className="field-label">Logo Part 1</label><input disabled={currentUser?.role !== 'admin'} value={settings.logoPart1} onChange={e => setSettings({ ...settings, logoPart1: e.target.value })} /></div>
                                        <div><label className="field-label">Logo Part 2</label><input disabled={currentUser?.role !== 'admin'} value={settings.logoPart2} onChange={e => setSettings({ ...settings, logoPart2: e.target.value })} /></div>
                                    </div>
                                    <div><label className="field-label">Official Email</label><input disabled={currentUser?.role !== 'admin'} value={settings.officialEmail} onChange={e => setSettings({ ...settings, officialEmail: e.target.value })} /></div>
                                    <div><label className="field-label">Welcome Message</label><textarea disabled={currentUser?.role !== 'admin'} value={settings.welcomeMessage} onChange={e => setSettings({ ...settings, welcomeMessage: e.target.value })} /></div>
                                    <div className="form-row-2">
                                        <div><label className="field-label">Primary Color</label><input disabled={currentUser?.role !== 'admin'} type="color" value={settings.primaryColor} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })} style={{ height: 44 }} /></div>
                                        <div><label className="field-label">Secondary Color</label><input disabled={currentUser?.role !== 'admin'} type="color" value={settings.secondaryColor} onChange={e => setSettings({ ...settings, secondaryColor: e.target.value })} style={{ height: 44 }} /></div>
                                    </div>
                                    <div className="form-row-2">
                                        <div><label className="field-label">Shipping Charge (₹)</label><input disabled={currentUser?.role !== 'admin'} type="number" value={settings.shippingCharge} onChange={e => setSettings({ ...settings, shippingCharge: +e.target.value })} /></div>
                                        <div><label className="field-label">Free Shipping Threshold (₹)</label><input disabled={currentUser?.role !== 'admin'} type="number" value={settings.freeShippingThreshold} onChange={e => setSettings({ ...settings, freeShippingThreshold: +e.target.value })} /></div>
                                    </div>
                                    <div className="form-actions"><button disabled={currentUser?.role !== 'admin'} className="btn-primary" onClick={saveSettings}><Save size={16} /> Save Settings</button></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══ ACTIVITY ═══ */}
                    {tab === 'activity' && (
                        <div className="adm-activity">
                            <div className="form-card" style={{ maxWidth: 700 }}>
                                <h3><Activity size={18} /> Real-Time Activity Log</h3>
                                <div className="activity-list">
                                    {logs.map((l, i) => (
                                        <div key={i} className={`log-entry log-${l.type}`}>
                                            <span className="log-time-badge">{l.time}</span>
                                            <span className="log-msg">{l.action}</span>
                                            <span className={`log-type-badge lt-${l.type}`}>{l.type}</span>
                                        </div>
                                    ))}
                                    {logs.length === 0 && <p className="empty-hint">No activity recorded in this session</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <style>{`
        /* ═══ ROOT & THEMES ═══ */
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .adm-root{display:flex;min-height:100vh;font-family:'Plus Jakarta Sans',sans-serif;transition:background .3s,color .3s; background-color: var(--ab); color: var(--at);}
        .adm-light{--ab:#f0f2f5;--ac:#ffffff;--at:#0f172a;--as:#6366f1;--asub:#64748b;--abrd:#e2e8f0;--ahover:#f8fafc;--ainput:#f1f5f9;--shadow:0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);--glass:rgba(255,255,255,0.85);}
        .adm-dark{--ab:#0b0f19;--ac:#1e293b;--at:#f8fafc;--as:#818cf8;--asub:#94a3b8;--abrd:#334155;--ahover:#0f172a;--ainput:#0f172a;--shadow:0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5);--glass:rgba(30,41,59,0.85);}
        
        /* ═══ SIDEBAR ═══ */
        .adm-sidebar{width:260px;background:var(--ac);border-right:1px solid var(--abrd);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;z-index:30;}
        .adm-sidebar-logo{padding:28px !important;display:flex;align-items:center;gap:12px;font-weight:800;font-size:1.3rem;background:linear-gradient(135deg, var(--as), #c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;border-bottom:1px solid var(--abrd);}
        .adm-sidebar-logo svg{color:var(--as);-webkit-text-fill-color:initial;}
        .adm-sidebar-logo small{font-size:.7rem;background:var(--as);color:#fff;padding:4px 10px;border-radius:20px;font-weight:700;-webkit-text-fill-color:initial;}
        .adm-nav{flex:1;padding:24px 16px;display:flex;flex-direction:column;gap:8px}
        .adm-nav-btn{display:flex;align-items:center;gap:14px;padding:12px 18px;border-radius:12px;font-weight:600;font-size:.95rem;color:var(--asub);transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);outline:none;border:none;background:transparent;cursor:pointer;}
        .adm-nav-btn:hover{background:var(--ahover);color:var(--as);transform:translateX(4px);}
        .adm-nav-btn.active{background:var(--as);color:#fff!important;box-shadow:0 4px 12px rgba(99,102,241,0.3);}
        .adm-sidebar-bottom{padding:20px 16px;border-top:1px solid var(--abrd);display:flex;flex-direction:column;gap:8px;}
        .adm-dark-toggle,.adm-backup-btn,.adm-visit-btn{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;font-size:.9rem;font-weight:600;color:var(--asub);text-decoration:none;transition:all .2s;background:transparent;border:none;cursor:pointer;width:100%;text-align:left;}
        .adm-dark-toggle:hover,.adm-backup-btn:hover,.adm-visit-btn:hover{background:var(--ahover);color:var(--as);}

        /* ═══ MAIN ═══ */
        .adm-main{flex:1;display:flex;flex-direction:column;min-width:0; background:var(--ab);}
        .adm-topbar{display:flex;align-items:center;justify-content:space-between;padding:24px 40px;border-bottom:1px solid var(--abrd);background:var(--glass);backdrop-filter:blur(12px);position:sticky;top:0;z-index:20;}
        .adm-page-title{font-size:1.75rem;font-weight:800;letter-spacing:-0.03em;}
        .adm-topbar-actions{display:flex;align-items:center;gap:16px}
        .adm-refresh-btn{padding:10px;border-radius:10px;color:var(--asub);background:var(--ac);border:1px solid var(--abrd);cursor:pointer;transition:all .3s;box-shadow:var(--shadow);}
        .adm-refresh-btn:hover{color:var(--as);border-color:var(--as);transform:rotate(180deg);}
        .spin{animation:spin 1s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .adm-saving-badge{background:linear-gradient(to right, #f59e0b, #fbbf24);color:#000;padding:6px 16px;border-radius:20px;font-size:.8rem;font-weight:700;animation:pulse 1.5s infinite;box-shadow:0 4px 12px rgba(245,158,11,0.3);}
        @keyframes pulse{50%{opacity:.7}}
        .adm-content{padding:40px;flex:1;}
        .adm-toast{position:fixed;top:30px;right:30px;z-index:9999;background:var(--ac);color:var(--at);border:1px solid var(--abrd);padding:16px 28px;border-radius:14px;font-weight:600;box-shadow:0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);animation:slideInR .4s cubic-bezier(0.16, 1, 0.3, 1);}
        @keyframes slideInR{from{transform:translateX(100px);opacity:0}}

        /* ═══ DASHBOARD ═══ */
        .stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;margin-bottom:32px}
        .stat-card{position:relative;display:flex;align-items:center;gap:20px;padding:28px;border-radius:20px;background:var(--ac);border:1px solid var(--abrd);box-shadow:var(--shadow);transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);overflow:hidden;}
        .stat-card::before{content:'';position:absolute;top:0;left:0;width:4px;height:100%;transition:.3s;}
        .stat-card:hover{transform:translateY(-4px);box-shadow:0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);}
        .sc-purple::before{background:#8b5cf6}.sc-orange::before{background:#f97316}.sc-blue::before{background:#3b82f6}.sc-red::before{background:#ef4444}.sc-green::before{background:#10b981}.sc-teal::before{background:#14b8a6}
        .stat-card small{font-size:.85rem;color:var(--asub);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;}
        .stat-card h2{font-size:1.8rem;font-weight:800;margin-top:6px;letter-spacing:-0.03em;}
        .sc-purple svg{color:#8b5cf6}.sc-orange svg{color:#f97316}.sc-blue svg{color:#3b82f6}.sc-red svg{color:#ef4444}.sc-green svg{color:#10b981}.sc-teal svg{color:#14b8a6}
        
        .dash-row{display:grid;grid-template-columns:1fr 1fr;gap:24px}
        .dash-card{background:var(--ac);border:1px solid var(--abrd);border-radius:20px;padding:32px;box-shadow:var(--shadow);}
        .dash-card h3{font-size:1.2rem;margin-bottom:24px;display:flex;align-items:center;gap:12px;color:var(--at);font-weight:700;}
        .dash-card h3 svg{color:var(--as);}
        .dash-order-row{display:flex;align-items:center;gap:16px;padding:12px 0;border-bottom:1px solid var(--abrd);font-size:.9rem}
        .dash-order-row:last-child{border-bottom:none;}
        .do-id{font-weight:700;color:var(--asub);min-width:90px}.do-name{flex:1;font-weight:600;}.do-total{font-weight:800;color:var(--as)}
        .do-status,.status-sel{padding:6px 12px;border-radius:20px;font-size:.75rem;font-weight:700;border:none;text-transform:uppercase;letter-spacing:0.05em;}
        .st-placed{background:rgba(217, 119, 6, 0.1);color:#d97706}.st-processing{background:rgba(37, 99, 235, 0.1);color:#2563eb}.st-shipped{background:rgba(5, 150, 105, 0.1);color:#059669}.st-delivered{background:rgba(16, 185, 129, 0.1);color:#10b981}.st-cancelled{background:rgba(220, 38, 38, 0.1);color:#dc2626}
        
        .log-row{display:flex;align-items:center;gap:16px;padding:10px 0;font-size:.9rem;border-bottom:1px solid var(--abrd)}
        .log-row:last-child{border-bottom:none;}
        .log-time{color:var(--asub);min-width:80px;font-size:.8rem;font-weight:600;}
        .log-info{border-left:4px solid #3b82f6}.log-success{border-left:4px solid #10b981}.log-warning{border-left:4px solid #f59e0b}.log-danger{border-left:4px solid #ef4444}
        .log-row,.log-entry{padding-left:14px;border-radius:4px;}
        .empty-hint{color:var(--asub);font-size:.95rem;text-align:center;padding:40px;font-weight:500;}

        /* ═══ ORDERS ═══ */
        .orders-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;gap:20px;flex-wrap:wrap}
        .search-box{display:flex;align-items:center;gap:12px;background:var(--ac);border:1px solid var(--abrd);border-radius:12px;padding:12px 18px;flex:1;max-width:400px;box-shadow:var(--shadow);transition:border-color .2s;}
        .search-box:focus-within{border-color:var(--as);box-shadow:0 0 0 3px rgba(99,102,241,0.15);}
        .search-box input{border:none;background:transparent;outline:none;font-size:.95rem;color:var(--at);width:100%}
        .orders-count{font-weight:700;color:var(--asub);font-size:.95rem;background:var(--ac);padding:8px 16px;border-radius:20px;box-shadow:var(--shadow);}
        .orders-table-wrap{overflow-x:auto;border-radius:16px;border:1px solid var(--abrd);background:var(--ac);box-shadow:var(--shadow);}
        .orders-table{width:100%;border-collapse:collapse;font-size:.9rem}
        .orders-table th{background:var(--ainput);text-align:left;padding:18px 24px;font-weight:700;font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;color:var(--asub)}
        .orders-table td{padding:20px 24px;border-top:1px solid var(--abrd);vertical-align:top}
        .orders-table tr:hover{background:var(--ahover)}
        .addr-text{color:var(--asub);max-width:220px;display:inline-block;line-height:1.6;margin-top:8px;}
        .item-line{font-size:.85rem;line-height:1.6;color:var(--asub);}
        .status-sel{cursor:pointer;padding:8px 14px;border-radius:10px;font-family:inherit;}
        .order-actions{display:flex;gap:8px}
        .oa-btn{padding:8px 12px;border-radius:10px;font-size:.9rem;cursor:pointer;transition:.2s;border:none;display:flex;align-items:center;justify-content:center;}
        .oa-green{background:rgba(16,185,129,0.1);color:#10b981;}.oa-green:hover{background:#10b981;color:#fff;}
        .oa-red{background:rgba(239,68,68,0.1);color:#ef4444;}.oa-red:hover{background:#ef4444;color:#fff;}

        /* ═══ FORMS ═══ */
        .prod-grid{display:grid;grid-template-columns:1fr 1.3fr;gap:32px;align-items:start}
        .form-card{background:var(--ac);border:1px solid var(--abrd);border-radius:20px;padding:32px;box-shadow:var(--shadow);}
        .form-card h3{font-size:1.25rem;margin-bottom:28px;display:flex;align-items:center;gap:10px;color:var(--at);font-weight:800;}
        .form-card h3 svg{color:var(--as);}
        .form-fields{display:flex;flex-direction:column;gap:20px}
        .form-fields input,.form-fields textarea,.form-fields select{width:100%;padding:14px 18px;border:1px solid var(--abrd);border-radius:12px;background:var(--ainput);color:var(--at);font-size:.95rem;transition:all .2s;font-family:inherit;}
        .form-fields input:focus,.form-fields textarea:focus{border-color:var(--as);outline:none;box-shadow:0 0 0 4px rgba(99,102,241,0.15);background:var(--ac);}
        .form-fields textarea{min-height:120px;resize:vertical}
        .form-row-2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .field-label{font-size:.85rem;font-weight:700;color:var(--at);margin-bottom:8px;display:block}
        .field-hint{font-size:.85rem;color:var(--asub);margin-bottom:12px;line-height:1.5;}
        .checkbox-row{display:flex;align-items:center;gap:12px;font-weight:600;font-size:.95rem;cursor:pointer;}
        .checkbox-row input[type=checkbox]{width:20px;height:20px;accent-color:var(--as);cursor:pointer;}
        .form-actions{display:flex;gap:12px;margin-top:10px}
        .btn-primary{display:flex;align-items:center;justify-content:center;gap:10px;background:linear-gradient(135deg, var(--as), #4f46e5);color:#fff;padding:14px 24px;border-radius:12px;font-weight:700;font-size:1rem;transition:all .3s;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(79,70,229,0.3);}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(79,70,229,0.4);}
        .btn-ghost{padding:14px 24px;border-radius:12px;font-weight:700;font-size:1rem;color:var(--asub);border:1px solid var(--abrd);background:transparent;cursor:pointer;transition:.2s;}
        .btn-ghost:hover{background:var(--ahover);color:var(--at);}

        /* ═══ LISTS ═══ */
        .list-card{background:var(--ac);border:1px solid var(--abrd);border-radius:20px;padding:32px;box-shadow:var(--shadow);}
        .list-card h3{font-size:1.25rem;margin-bottom:24px;display:flex;align-items:center;gap:10px;color:var(--at);font-weight:800;}
        .list-card h3 svg{color:var(--as);}
        .item-list{display:flex;flex-direction:column;gap:12px;max-height:600px;overflow-y:auto;padding-right:8px;}
        .item-list::-webkit-scrollbar{width:6px;}
        .item-list::-webkit-scrollbar-thumb{background:var(--abrd);border-radius:10px;}
        .list-item{display:flex;align-items:center;gap:16px;padding:16px;border-radius:16px;border:1px solid var(--abrd);transition:all .2s;background:var(--ac);}
        .list-item:hover{background:var(--ahover);transform:translateX(4px);border-color:var(--asub);}
        .li-img{width:60px;height:60px;border-radius:12px;background:var(--ainput);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;font-size:1.8rem}
        .li-img img{width:100%;height:100%;object-fit:cover}
        .li-color{width:60px;height:60px;border-radius:12px;flex-shrink:0;box-shadow:inset 0 2px 4px rgba(0,0,0,0.1);}
        .li-info{flex:1;min-width:0}.li-info strong{display:block;font-size:1rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px;color:var(--at);}
        .li-info small{color:var(--asub);font-size:.85rem;font-weight:500;}
        .li-actions{display:flex;gap:8px}
        .li-actions button{padding:10px;border-radius:10px;font-size:1rem;transition:.2s;border:none;background:var(--ainput);cursor:pointer;color:var(--asub);}
        .li-actions button:hover{background:var(--as);color:#fff;}

        /* ═══ ACTIVITY ═══ */
        .activity-list{display:flex;flex-direction:column;gap:12px;max-height:700px;overflow-y:auto;padding-right:8px;}
        .activity-list::-webkit-scrollbar{width:6px;}
        .activity-list::-webkit-scrollbar-thumb{background:var(--abrd);border-radius:10px;}
        .log-entry{display:flex;align-items:center;gap:16px;padding:16px 20px;border-radius:12px;border:1px solid var(--abrd);font-size:.95rem;background:var(--ac);transition:all .2s;}
        .log-entry:hover{border-color:var(--asub);}
        .log-time-badge{font-size:.8rem;color:var(--asub);min-width:90px;font-weight:600;}
        .log-msg{flex:1;font-weight:500;color:var(--at);}
        .log-type-badge{padding:4px 12px;border-radius:20px;font-size:.75rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;}
        .lt-info{background:rgba(37,99,235,0.1);color:#2563eb}.lt-success{background:rgba(16,185,129,0.1);color:#10b981}.lt-warning{background:rgba(245,158,11,0.1);color:#d97706}.lt-danger{background:rgba(239,68,68,0.1);color:#dc2626}

        /* ═══ RESPONSIVE ═══ */
        @media(max-width:1200px){
          .prod-grid{grid-template-columns:1fr;}
        }
        @media(max-width:992px){
          .adm-sidebar{width:80px;}.adm-sidebar-logo span,.adm-sidebar-logo small,.adm-nav-btn span,.adm-dark-toggle span,.adm-backup-btn span,.adm-visit-btn span{display:none}
          .adm-nav-btn{justify-content:center;padding:16px;}.adm-sidebar-logo{justify-content:center;padding:24px 0 !important;}
          .dash-row{grid-template-columns:1fr}
          .adm-content{padding:24px}
          .adm-topbar{padding:20px 24px;}
        }
        @media(max-width:576px){
          .adm-sidebar{display:none}
          .stat-grid{grid-template-columns:1fr}
          .form-row-2{grid-template-columns:1fr}
          .adm-content{padding:16px}
        }
        
        /* ═══ ROLE-BASED ACCESS CONTROL ═══ */
        .rbac-warning-banner {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
          border: 1px solid rgba(245, 158, 11, 0.25);
          padding: 12px 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .adm-sidebar-profile {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid var(--abrd);
          margin-bottom: 10px;
        }
        .profile-photo {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--as);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .profile-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .profile-name {
          font-weight: 700;
          font-size: 0.88rem;
          color: var(--at);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .profile-role {
          font-size: 0.7rem;
          color: var(--asub);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .profile-role.role-admin {
          color: #ef4444 !important;
        }
        .profile-role.role-staff {
          color: #3b82f6 !important;
        }
        .profile-role.role-product_manager {
          color: #10b981 !important;
        }
        .adm-logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: .9rem;
          font-weight: 700;
          color: #ef4444;
          transition: all .2s;
          background: transparent;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          margin-top: 10px;
        }
        .adm-logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
      `}</style>
        </div>
    );
};

export default AdminPanel;
