import React, { useState } from 'react';
import type { Product } from './ProductCard';

interface CampaignProductSectionProps {
  campaignProduct: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const CampaignProductSection: React.FC<CampaignProductSectionProps> = ({ campaignProduct, onAddToCart, onBuyNow }) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQty = () => setQuantity(prev => prev + 1);
  const decreaseQty = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <section className="campaign-product-section container animate-slide-in">
      <div className="campaign-product-grid">
        <div className="campaign-image-col">
          <img
            src={campaignProduct.imageUrl}
            alt={campaignProduct.title}
            className="campaign-main-image"
          />
        </div>

        <div className="campaign-info-col">
          <h1 className="campaign-title">{campaignProduct.title}</h1>

          <div className="campaign-price-row">
            {campaignProduct.originalPrice && (
              <span className="campaign-original-price">Rs. {campaignProduct.originalPrice.toFixed(2)}</span>
            )}
            <span className="campaign-sale-price">Rs. {campaignProduct.price.toFixed(2)}</span>
            <span className="campaign-sale-badge">Sale</span>
          </div>

          <p className="campaign-shipping-note">Shipping calculated at checkout.</p>

          <div className="campaign-quantity-selector">
            <label>Quantity</label>
            <div className="quantity-controls">
              <button onClick={decreaseQty} className="qty-btn">-</button>
              <span className="qty-value">{quantity}</span>
              <button onClick={increaseQty} className="qty-btn">+</button>
            </div>
          </div>

          <div className="campaign-actions">
            <button
              onClick={() => onAddToCart(campaignProduct, quantity)}
              className="btn btn-light campaign-add-cart-btn"
            >
              Add to cart
            </button>

            <button
              onClick={() => onBuyNow(campaignProduct, quantity)}
              className="btn btn-primary campaign-buy-now-btn animate-pulse-soft"
              style={{ backgroundColor: '#eb6136', borderColor: '#eb6136', color: 'white' }}
            >
              Buy it now
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .campaign-product-section {
          padding: 60px 24px;
          margin: 0 auto;
          max-width: 1200px;
        }
        .campaign-product-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }
        .campaign-image-col {
          border: 1px solid #e0dced;
          border-radius: 20px;
          overflow: hidden;
          background: #fdfdfd;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .campaign-main-image {
          width: 100%;
          height: auto;
          object-fit: contain;
          border-radius: 12px;
        }
        .campaign-info-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-top: 20px;
        }
        .campaign-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--neutral-dark);
          line-height: 1.2;
        }
        .campaign-price-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .campaign-original-price {
          font-size: 1.2rem;
          color: #a09cb4;
          text-decoration: line-through;
        }
        .campaign-sale-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #eb6136;
        }
        .campaign-sale-badge {
          background: #eb6136;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .campaign-shipping-note {
          font-size: 0.9rem;
          color: var(--neutral-gray);
          margin-bottom: 10px;
        }
        .campaign-quantity-selector {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .campaign-quantity-selector label {
          font-size: 0.9rem;
          color: var(--neutral-dark);
          font-weight: 500;
        }
        .quantity-controls {
          display: flex;
          align-items: center;
          border: 1px solid var(--border);
          border-radius: 30px;
          width: fit-content;
          background: white;
        }
        .qty-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: var(--neutral-dark);
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .qty-value {
          width: 40px;
          text-align: center;
          font-weight: 600;
          font-size: 1rem;
        }
        .campaign-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
        }
        .campaign-add-cart-btn {
          width: 100%;
          padding: 16px;
          border-radius: 30px;
          font-size: 1.1rem;
          font-weight: 600;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--neutral-dark);
          transition: background 0.3s ease;
        }
        .campaign-add-cart-btn:hover {
          background: #f5f3fa;
        }
        .campaign-buy-now-btn {
          width: 100%;
          padding: 16px;
          border-radius: 30px;
          font-size: 1.1rem;
          font-weight: 600;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .campaign-buy-now-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(235, 97, 54, 0.3);
        }
        
        @media (max-width: 768px) {
          .campaign-product-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .campaign-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </section>
  );
};
export default CampaignProductSection;
