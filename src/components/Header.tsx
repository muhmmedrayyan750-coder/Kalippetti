import React, { useState } from 'react';
import { Search, ShoppingBag, Truck, Menu, X } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  cartCount: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  toggleCart: () => void;
  siteSettings: {
    logoPart1: string;
    logoPart2: string;
  };
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  cartCount,
  searchTerm,
  setSearchTerm,
  toggleCart,
  siteSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleNavClick = (page: string) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (activePage !== 'shop' && activePage !== 'home') {
      setActivePage('shop');
    }
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Mobile menu toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div className="header-logo" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>
          <Logo
            size="md"
            text1={siteSettings.logoPart1}
            text2={siteSettings.logoPart2}
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <button
            className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>
          <button
            className={`nav-link ${activePage === 'shop' ? 'active' : ''}`}
            onClick={() => handleNavClick('shop')}
          >
            Toys Shop
          </button>
          <button
            className={`nav-link ${activePage === 'track' ? 'active' : ''}`}
            onClick={() => handleNavClick('track')}
          >
            Track Order
          </button>
        </nav>

        {/* Actions (Search, Cart) */}
        <div className="header-actions">
          {/* Search bar */}
          <div className={`search-wrapper ${showSearchInput ? 'expanded' : ''}`}>
            <button
              className="action-btn"
              onClick={() => setShowSearchInput(!showSearchInput)}
              aria-label="Search toys"
            >
              <Search size={22} />
            </button>
            <input
              type="text"
              placeholder="Search magic toys..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          {/* Order tracking button */}
          <button
            className="action-btn track-btn-header"
            onClick={() => handleNavClick('track')}
            title="Track Order"
          >
            <Truck size={22} />
          </button>

          {/* Cart trigger */}
          <button
            className="action-btn cart-trigger-btn"
            onClick={toggleCart}
            aria-label="View shopping cart"
          >
            <div className="cart-icon-wrapper">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="cart-badge animate-pulse-soft">{cartCount}</span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer animate-slide-in">
          <div className="mobile-nav-links">
            <button
              className={`mobile-nav-link ${activePage === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              Home
            </button>
            <button
              className={`mobile-nav-link ${activePage === 'shop' ? 'active' : ''}`}
              onClick={() => handleNavClick('shop')}
            >
              Toys Shop
            </button>
            <button
              className={`mobile-nav-link ${activePage === 'track' ? 'active' : ''}`}
              onClick={() => handleNavClick('track')}
            >
              Track Order
            </button>
          </div>
        </div>
      )}

      {/* Header specific styles */}
      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 2px solid var(--border);
          padding: 12px 0;
          box-shadow: 0 4px 20px rgba(112, 38, 185, 0.05);
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .mobile-toggle {
          display: none;
          color: var(--primary);
        }
        .desktop-nav {
          display: flex;
          gap: 24px;
        }
        .nav-link {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--neutral-dark);
          position: relative;
          padding: 8px 12px;
          border-radius: 20px;
          transition: var(--transition-smooth);
        }
        .nav-link:hover {
          color: var(--primary);
          background: var(--primary-light);
        }
        .nav-link.active {
          color: var(--primary);
          background: var(--primary-light);
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--secondary);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .action-btn {
          color: var(--neutral-dark);
          padding: 8px;
          border-radius: 50%;
          transition: var(--transition-bouncy);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .action-btn:hover {
          color: var(--primary);
          background: var(--primary-light);
          transform: scale(1.1);
        }
        .cart-icon-wrapper {
          position: relative;
          display: flex;
        }
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--secondary);
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(255, 107, 0, 0.4);
          border: 1.5px solid white;
        }
        .search-wrapper {
          display: flex;
          align-items: center;
          background: transparent;
          border-radius: 50px;
          transition: var(--transition-smooth);
          overflow: hidden;
          padding: 0;
          width: 38px;
          border: 2px solid transparent;
        }
        .search-wrapper.expanded {
          background: var(--neutral-light);
          border-color: var(--border);
          width: 240px;
          padding-right: 12px;
        }
        .search-input {
          border: none;
          background: transparent;
          outline: none;
          font-family: var(--sans);
          font-size: 0.9rem;
          padding: 6px 0;
          width: 0;
          transition: var(--transition-smooth);
        }
        .search-wrapper.expanded .search-input {
          width: 170px;
          padding-left: 8px;
        }
        .mobile-nav-drawer {
          position: fixed;
          top: 79px;
          left: 0;
          width: 100%;
          background: var(--white);
          box-shadow: var(--shadow-lg);
          border-bottom: 3px solid var(--primary);
          padding: 16px 24px;
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mobile-nav-link {
          text-align: left;
          padding: 12px 16px;
          border-radius: var(--border-radius-md);
          font-weight: 600;
          font-size: 1.1rem;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active {
          background: var(--primary-light);
          color: var(--primary);
        }
        @media (max-width: 768px) {
          .desktop-nav, .track-btn-header {
            display: none;
          }
          .mobile-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            border-radius: 50%;
          }
          .search-wrapper.expanded {
            width: 180px;
          }
          .search-wrapper.expanded .search-input {
            width: 110px;
          }
        }
      `}</style>
    </header>
  );
};
export default Header;
