import React from 'react';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';
import Logo from './Logo';
import type { SiteSettings } from '../types';

interface FooterProps {
  setActivePage: (page: string) => void;
  siteSettings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, siteSettings }) => {
  return (
    <footer id="contact-footer" className="site-footer">
      <div className="footer-container">
        {/* Brand Summary */}
          <div className="footer-brand">
          <Logo size="sm" text1={siteSettings.logoPart1} text2={siteSettings.logoPart2} />
          <p className="brand-pitch">
            Bringing happiness and magical learning to kids of all ages with high-quality, safe, and engaging toys.
          </p>
          <div className="footer-contact-info">
            <div className="info-item">
              <Phone size={16} />
              <span>+91 {siteSettings.contactNumber}</span>
            </div>
            <div className="info-item">
              <Mail size={16} />
              <span>{siteSettings.officialEmail}</span>
            </div>
            <div className="info-item">
              <MapPin size={16} />
              <span>{siteSettings.siteName} Hub, Kerala, India</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links-col">
          <h4>Explore Shop</h4>
          <ul className="footer-links">
            <li><button onClick={() => setActivePage('home')}>Home</button></li>
            <li><button onClick={() => { setActivePage('shop'); }}>All Toys</button></li>
            <li><a href={`https://wa.me/91${siteSettings.contactNumber}`} target="_blank" rel="noreferrer">Support Chat</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="footer-bottom">
        <div className="bottom-container">
          <p>
            &copy; {new Date().getFullYear()} {siteSettings.siteName}. Made with <Heart size={12} fill="var(--secondary)" color="var(--secondary)" style={{ display: 'inline' }} /> for Kids.
          </p>
          <div className="payment-icons">
            <span className="payment-badge">WhatsApp Checkout</span>
            <span className="payment-badge">Cash on Delivery</span>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: #110e1a;
          color: #b7b4c7;
          padding: 60px 0 20px;
          margin-top: auto;
          border-top: 5px solid var(--primary);
        }
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 48px;
        }
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .brand-pitch {
          color: #a09cb4;
          font-size: 0.95rem;
          max-width: 320px;
          line-height: 1.6;
        }
        .footer-contact-info {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 10px;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: #a09cb4;
        }
        .footer-links-col h4 {
          color: var(--white);
          font-size: 1.1rem;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 8px;
        }
        .footer-links-col h4::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 3px;
          background: var(--secondary);
          border-radius: 2px;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-links button, .footer-links a {
          text-align: left;
          color: #a09cb4;
          font-size: 0.95rem;
          font-weight: 500;
          transition: var(--transition-smooth);
        }
        .footer-links button:hover, .footer-links a:hover {
          color: var(--secondary);
          transform: translateX(4px);
        }
        .footer-bottom {
          margin-top: 48px;
          padding-top: 20px;
          border-top: 1px solid #28233a;
        }
        .bottom-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: #837f97;
        }
        .payment-icons {
          display: flex;
          gap: 12px;
        }
        .payment-badge {
          background: #28233a;
          color: var(--white);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .bottom-container {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};
export default Footer;
