import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import type { Product } from './ProductCard';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <ShoppingBag size={22} color="var(--primary)" />
            <h2>Your Toy Box</h2>
            <span className="item-count-badge">{cartItems.length}</span>
          </div>
          <button className="close-drawer-btn" onClick={onClose} aria-label="Close Cart">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="cart-drawer-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <span className="empty-emoji">🧸</span>
              <h3>Your cart is empty!</h3>
              <p>Looks like you haven't added any magic toys to your box yet.</p>
              <button 
                onClick={onClose}
                className="btn btn-primary btn-empty-cart-cta"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.product.id} className="cart-item-card">
                  <div className="cart-item-img-wrapper">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.title} 
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1603356029285-a04a78c47985?w=200&q=80';
                      }}
                    />
                  </div>
                  
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.product.title}</h4>
                    <span className="cart-item-category">{item.product.category}</span>
                    <span className="cart-item-price">Rs. {item.product.price}</span>
                    
                    <div className="cart-item-controls">
                      {/* Quantity Selector */}
                      <div className="qty-selector">
                        <button 
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          disabled={item.quantity <= 1}
                          className="qty-btn"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="qty-btn"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => onRemoveItem(item.product.id)}
                        className="remove-item-btn"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="cart-item-total">
                    Rs. {item.product.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="summary-row">
              <span>Subtotal</span>
              <span className="subtotal-amount">Rs. {subtotal}</span>
            </div>
            <p className="shipping-info-note">🎈 Shipping charges calculated at checkout. Free shipping on orders above Rs. 499!</p>
            
            <button 
              onClick={onProceedToCheckout}
              className="btn btn-secondary w-full checkout-btn animate-pulse-soft"
            >
              Verify & Place Order via WhatsApp
            </button>
          </div>
        )}
      </div>

      <style>{`
        .cart-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(17, 14, 26, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }
        .cart-drawer {
          width: 460px;
          max-width: 100%;
          height: 100%;
          background: var(--white);
          box-shadow: -10px 0 30px rgba(112, 38, 185, 0.15);
          display: flex;
          flex-direction: column;
          animation: slideLeft 0.35s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .cart-drawer-header {
          padding: 20px 24px;
          border-bottom: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cart-header-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cart-header-title h2 {
          font-size: 1.4rem;
        }
        .item-count-badge {
          background: var(--primary-light);
          color: var(--primary);
          font-size: 0.85rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
        }
        .close-drawer-btn {
          color: var(--neutral-gray);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .close-drawer-btn:hover {
          background: var(--neutral-light);
          color: var(--danger);
        }
        .cart-drawer-content {
          flex-grow: 1;
          overflow-y: auto;
          padding: 24px;
        }
        .empty-cart-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 80%;
          text-align: center;
          gap: 16px;
        }
        .empty-emoji {
          font-size: 4rem;
          animation: float 4s infinite;
        }
        .empty-cart-state p {
          max-width: 280px;
          font-size: 0.95rem;
        }
        .btn-empty-cart-cta {
          margin-top: 10px;
        }
        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cart-item-card {
          display: flex;
          gap: 14px;
          padding-bottom: 16px;
          border-bottom: 1px dashed var(--border);
          align-items: center;
        }
        .cart-item-img-wrapper {
          width: 75px;
          height: 75px;
          border-radius: var(--border-radius-md);
          background: var(--neutral-light);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          overflow: hidden;
          flex-shrink: 0;
        }
        .cart-item-img-wrapper img {
          max-height: 85%;
          max-width: 85%;
          object-fit: contain;
        }
        .cart-item-details {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .cart-item-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--neutral-dark);
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .cart-item-category {
          font-size: 0.7rem;
          text-transform: uppercase;
          color: var(--neutral-gray);
          font-weight: 700;
        }
        .cart-item-price {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--primary);
        }
        .cart-item-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 6px;
        }
        .qty-selector {
          display: inline-flex;
          align-items: center;
          background: var(--neutral-light);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
        }
        .qty-btn {
          padding: 4px 8px;
          color: var(--primary);
          display: flex;
          align-items: center;
        }
        .qty-btn:hover:not(:disabled) {
          background: #ebe6f8;
        }
        .qty-btn:disabled {
          color: #bdbdbd;
          cursor: not-allowed;
        }
        .qty-value {
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0 6px;
          min-width: 20px;
          text-align: center;
        }
        .remove-item-btn {
          color: var(--neutral-gray);
          transition: var(--transition-smooth);
        }
        .remove-item-btn:hover {
          color: var(--danger);
        }
        .cart-item-total {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--neutral-dark);
          align-self: center;
          white-space: nowrap;
        }
        .cart-drawer-footer {
          padding: 20px 24px 30px;
          border-top: 2px solid var(--border);
          background: #fbfaff;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--neutral-dark);
        }
        .subtotal-amount {
          font-size: 1.35rem;
          color: var(--primary);
        }
        .shipping-info-note {
          font-size: 0.75rem;
          color: var(--neutral-gray);
          line-height: 1.3;
        }
        .w-full {
          width: 100%;
        }
        .checkout-btn {
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};
export default CartDrawer;
