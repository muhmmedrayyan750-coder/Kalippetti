import React from 'react';
import { Star, ShoppingCart, Percent, Trash2 } from 'lucide-react';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  rating: number;
  reviewsCount?: number;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onSelectProduct: (productId: string) => void;
  isLoggedInAdmin?: boolean;
  onDeleteProduct?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  isLoggedInAdmin = false,
  onDeleteProduct,
}) => {
  const calculateDiscount = () => {
    if (!product.originalPrice || product.originalPrice <= product.price) return 0;
    const diff = product.originalPrice - product.price;
    return Math.round((diff / product.originalPrice) * 100);
  };

  const discountPercent = calculateDiscount();

  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (showConfirm) {
      onDeleteProduct?.(product.id);
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <div className="product-card wavy-card">
      {/* Discount Ribbon */}
      {discountPercent > 0 && (
        <div className="discount-tag">
          <Percent size={12} />
          <span>{discountPercent}% OFF</span>
        </div>
      )}

      {/* Admin Delete Button */}
      {isLoggedInAdmin && (
        showConfirm ? (
          <div className="card-delete-confirm-wrapper" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="card-admin-delete-confirm-btn"
              onClick={handleDeleteClick}
              title="Confirm delete"
            >
              Confirm
            </button>
            <button
              type="button"
              className="card-admin-delete-cancel-btn"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShowConfirm(false); }}
              title="Cancel"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="card-admin-delete-btn"
            onClick={handleDeleteClick}
            title="Delete this product"
          >
            <Trash2 size={15} />
          </button>
        )
      )}

      {/* Product Image */}
      <div 
        className="product-image-container"
        onClick={() => onSelectProduct(product.id)}
      >
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="product-img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1603356029285-a04a78c47985?w=400&q=80';
          }}
        />
      </div>

      {/* Product Details */}
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        
        <h3 
          className="product-title"
          onClick={() => onSelectProduct(product.id)}
        >
          {product.title}
        </h3>

        {/* Rating */}
        <div className="product-rating">
          <div className="stars">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star 
                key={idx} 
                size={14} 
                fill={idx < Math.round(product.rating) ? 'var(--accent)' : 'none'}
                color={idx < Math.round(product.rating) ? 'var(--accent)' : '#ccc'}
              />
            ))}
          </div>
          <span className="reviews-count">({product.reviewsCount || 8} reviews)</span>
        </div>

        {/* Price Tag */}
        <div className="product-price-row">
          <div className="price-wrapper">
            <span className="current-price">Rs. {product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">Rs. {product.originalPrice}</span>
            )}
          </div>
          
          {!product.inStock && (
            <span className="out-of-stock-badge">Out of Stock</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="product-actions">
          <button 
            onClick={() => onAddToCart(product)} 
            disabled={!product.inStock}
            className="btn-add-cart"
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
            <span>Add</span>
          </button>
          
          <button 
            onClick={() => onBuyNow(product)} 
            disabled={!product.inStock}
            className="btn-buy-now"
          >
            Buy Now
          </button>
        </div>
      </div>

      <style>{`
        .product-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--white);
          overflow: hidden;
          padding: 12px;
        }
        .discount-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          background: var(--secondary);
          color: white;
          padding: 4px 10px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 3px;
          z-index: 5;
          box-shadow: 0 4px 8px rgba(255, 107, 0, 0.25);
        }
        .card-admin-delete-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 20;
          background: rgba(255, 23, 68, 0.92);
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(255,23,68,0.4);
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .card-admin-delete-btn:hover {
          background: #c60029;
          transform: scale(1.12);
        }
        .product-image-container {
          width: 100%;
          height: 200px;
          overflow: hidden;
          border-radius: var(--border-radius-md);
          background: var(--neutral-light);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
        }
        .product-img {
          max-height: 90%;
          max-width: 90%;
          object-fit: contain;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .product-card:hover .product-img {
          transform: scale(1.1) rotate(2deg);
        }
        .product-info {
          display: flex;
          flex-direction: column;
          padding-top: 14px;
          flex-grow: 1;
        }
        .product-category {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--neutral-gray);
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .product-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--neutral-dark);
          margin-bottom: 8px;
          cursor: pointer;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 2.85rem;
          line-height: 1.25;
          transition: var(--transition-smooth);
        }
        .product-title:hover {
          color: var(--primary);
        }
        .product-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
        }
        .reviews-count {
          font-size: 0.75rem;
          color: var(--neutral-gray);
          font-weight: 500;
        }
        .product-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          margin-top: auto;
        }
        .price-wrapper {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .current-price {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--primary);
        }
        .original-price {
          font-size: 0.9rem;
          text-decoration: line-through;
          color: var(--neutral-gray);
          font-weight: 500;
        }
        .out-of-stock-badge {
          background: rgba(255, 23, 68, 0.1);
          color: var(--danger);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .product-actions {
          display: grid;
          grid-template-columns: 2fr 3fr;
          gap: 8px;
        }
        .btn-add-cart {
          background: var(--primary-light);
          color: var(--primary);
          border: 2px solid var(--border);
          border-radius: var(--border-radius-xl);
          padding: 8px 12px;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
        .btn-add-cart:hover:not(:disabled) {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .btn-buy-now {
          background: var(--secondary);
          color: white;
          border-radius: var(--border-radius-xl);
          padding: 8px 12px;
          font-weight: 700;
          font-size: 0.85rem;
          box-shadow: 0 4px 8px rgba(255, 107, 0, 0.15);
        }
        .btn-buy-now:hover:not(:disabled) {
          background: #e66000;
          box-shadow: 0 6px 12px rgba(255, 107, 0, 0.25);
          transform: translateY(-1px);
        }
        .btn-add-cart:disabled, .btn-buy-now:disabled {
          background: #e0e0e0;
          color: #9e9e9e;
          border-color: #e0e0e0;
          box-shadow: none;
          cursor: not-allowed;
          transform: none;
        }
        .card-delete-confirm-wrapper {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 30;
          display: flex;
          gap: 4px;
          background: rgba(255, 255, 255, 0.95);
          padding: 4px;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          border: 1px solid var(--border);
        }
        .card-admin-delete-confirm-btn {
          background: rgba(255, 23, 68, 0.95);
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 800;
          cursor: pointer;
        }
        .card-admin-delete-confirm-btn:hover {
          background: #c60029;
        }
        .card-admin-delete-cancel-btn {
          background: #f1f5f9;
          color: #475569;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 800;
          cursor: pointer;
        }
        .card-admin-delete-cancel-btn:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};
export default ProductCard;
