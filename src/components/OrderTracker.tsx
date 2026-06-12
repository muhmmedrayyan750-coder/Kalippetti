import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, ClipboardCheck, Truck, Gift, AlertCircle, Calendar, MapPin, Phone } from 'lucide-react';

interface OrderTrackerProps {
  orderIdParam?: string;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ orderIdParam = '' }) => {
  const [searchId, setSearchId] = useState(orderIdParam);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (orderIdParam) {
      setSearchId(orderIdParam);
      handleTrack(orderIdParam);
    }
  }, [orderIdParam]);

  const handleTrack = (targetId: string) => {
    if (!targetId.trim()) return;
    setHasSearched(true);

    const ordersJson = localStorage.getItem('kalippetti_orders');
    if (ordersJson) {
      const orders = JSON.parse(ordersJson);
      const foundOrder = orders.find(
        (o: any) => o.id.toUpperCase() === targetId.trim().toUpperCase()
      );
      setActiveOrder(foundOrder || null);
    } else {
      setActiveOrder(null);
    }
  };

  const getStatusIndex = (status: string) => {
    const statuses = ['placed', 'confirmed', 'shipped', 'delivered'];
    return statuses.indexOf(status.toLowerCase());
  };

  const steps = [
    { label: 'Order Placed', desc: 'Awaiting confirmation', icon: ShoppingBag },
    { label: 'Confirmed', desc: 'Packed & ready', icon: ClipboardCheck },
    { label: 'Shipped', desc: 'On the way', icon: Truck },
    { label: 'Delivered', desc: 'Enjoy your toys!', icon: Gift },
  ];

  const currentStatusIdx = activeOrder ? getStatusIndex(activeOrder.status) : 0;

  return (
    <div className="tracker-container animate-slide-in">
      <h1 className="tracker-title">Track Your Toy Box</h1>
      <p className="tracker-subtitle">Enter your Order ID (sent via WhatsApp, e.g. KP-1234) to see real-time updates.</p>

      {/* Tracker Search Bar */}
      <div className="tracker-search-card wavy-card">
        <div className="tracker-search-row">
          <input 
            type="text" 
            placeholder="Enter Order ID (e.g., KP-5432)" 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="form-input tracker-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTrack(searchId);
            }}
          />
          <button 
            onClick={() => handleTrack(searchId)}
            className="btn btn-primary tracker-search-btn"
          >
            <Search size={18} />
            <span>Track Order</span>
          </button>
        </div>
      </div>

      {/* Results */}
      {hasSearched && activeOrder && (
        <div className="tracker-results">
          {/* Status Tracker Bar */}
          <div className="tracker-status-card wavy-card">
            <div className="tracker-meta-header">
              <div className="meta-left">
                <span className="order-id-label">Order {activeOrder.id}</span>
                <span className={`status-badge status-${activeOrder.status.toLowerCase()}`}>
                  {activeOrder.status}
                </span>
              </div>
              <div className="meta-right">
                <Calendar size={16} />
                <span>Placed on {activeOrder.date}</span>
              </div>
            </div>

            {/* Stepper */}
            <div className="tracker-stepper">
              {steps.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = idx <= currentStatusIdx;
                const isActive = idx === currentStatusIdx;
                
                return (
                  <div key={idx} className={`step-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                    <div className="step-icon-wrapper">
                      <StepIcon size={22} />
                      {idx < steps.length - 1 && <div className="step-connector-line" />}
                    </div>
                    <div className="step-details">
                      <h4 className="step-label">{step.label}</h4>
                      <p className="step-desc">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="tracker-details-grid">
            {/* Delivery Info */}
            <div className="tracker-details-card wavy-card">
              <h3>Shipping Information</h3>
              <div className="tracker-info-list">
                <div className="info-row">
                  <MapPin size={18} color="var(--primary)" />
                  <div>
                    <h4>Delivery Address</h4>
                    <p>{activeOrder.customerName}</p>
                    <p>{activeOrder.address}</p>
                    <p>{activeOrder.cityState} - <b>{activeOrder.pincode}</b></p>
                  </div>
                </div>

                <div className="info-row">
                  <Phone size={18} color="var(--primary)" />
                  <div>
                    <h4>Contact Phone</h4>
                    <p>{activeOrder.phone}</p>
                    {activeOrder.altPhone && activeOrder.altPhone !== 'None' && (
                      <p className="alt-phone-label">Alt: {activeOrder.altPhone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Items Summary */}
            <div className="tracker-details-card wavy-card">
              <h3>Items Summary</h3>
              <div className="tracker-items-list">
                {activeOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="tracker-item">
                    <div className="item-qty-name">
                      <span className="item-qty">{item.quantity}x</span>
                      <span className="item-name">{item.title}</span>
                    </div>
                    <span className="item-total">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="tracker-total-block">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>Rs. {activeOrder.subtotal}</span>
                </div>
                <div className="total-row">
                  <span>Shipping</span>
                  <span>{activeOrder.shippingCharge === 0 ? 'FREE' : `Rs. ${activeOrder.shippingCharge}`}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Grand Total</span>
                  <span>Rs. {activeOrder.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasSearched && !activeOrder && (
        <div className="tracker-no-result wavy-card animate-slide-in">
          <AlertCircle size={40} color="var(--danger)" />
          <h3>Order Not Found</h3>
          <p>We couldn't find any toy box order associated with ID <b>"{searchId}"</b>. Please double check the ID and try again.</p>
          <div className="p-4 bg-orange-light text-orange text-sm border-orange">
            💡 <b>Tip:</b> Check the message sent on WhatsApp to copy the exact Order ID.
          </div>
        </div>
      )}

      <style>{`
        .tracker-container {
          max-width: 900px;
          margin: 40px auto 80px;
          padding: 0 24px;
        }
        .tracker-title {
          font-size: 2.2rem;
          margin-bottom: 8px;
          text-align: center;
        }
        .tracker-subtitle {
          font-size: 1.05rem;
          color: var(--neutral-gray);
          margin-bottom: 36px;
          text-align: center;
        }
        .tracker-search-card {
          padding: 24px;
          background: var(--white);
          margin-bottom: 36px;
        }
        .tracker-search-row {
          display: flex;
          gap: 16px;
        }
        .tracker-input {
          font-size: 1.1rem;
          padding: 14px 20px;
          flex-grow: 1;
        }
        .tracker-search-btn {
          padding: 14px 28px;
        }
        .tracker-status-card {
          padding: 30px;
          background: var(--white);
          margin-bottom: 32px;
        }
        .tracker-meta-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid var(--border);
          padding-bottom: 16px;
          margin-bottom: 30px;
        }
        .meta-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .order-id-label {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--primary);
        }
        .status-badge {
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .status-placed { background: #e3f2fd; color: #1e88e5; }
        .status-confirmed { background: #e8f5e9; color: #2e7d32; }
        .status-shipped { background: #fff8e1; color: #f57f17; }
        .status-delivered { background: #f3e5f5; color: #7b1fa2; }
        
        .meta-right {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--neutral-gray);
          font-weight: 500;
        }
        .tracker-stepper {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          position: relative;
        }
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          z-index: 1;
        }
        .step-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--neutral-light);
          border: 3px solid var(--border);
          color: var(--neutral-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          position: relative;
          transition: var(--transition-bouncy);
        }
        .step-connector-line {
          position: absolute;
          top: 22px;
          left: 50px;
          width: calc(100vw * 0.25 - 50px);
          max-width: 170px;
          height: 4px;
          background: var(--border);
          z-index: -1;
          transition: var(--transition-smooth);
        }
        .step-item.completed .step-icon-wrapper {
          background: var(--primary-light);
          border-color: var(--primary);
          color: var(--primary);
        }
        .step-item.completed .step-connector-line {
          background: var(--primary);
        }
        .step-item.active .step-icon-wrapper {
          background: var(--secondary-light);
          border-color: var(--secondary);
          color: var(--secondary);
          transform: scale(1.15);
          box-shadow: 0 0 0 5px rgba(255, 107, 0, 0.15);
        }
        .step-label {
          font-size: 1rem;
          font-weight: 700;
          color: var(--neutral-gray);
          margin-bottom: 4px;
        }
        .step-item.completed .step-label, .step-item.active .step-label {
          color: var(--neutral-dark);
        }
        .step-desc {
          font-size: 0.75rem;
          color: var(--neutral-gray);
        }
        .tracker-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .tracker-details-card {
          padding: 24px;
          background: var(--white);
        }
        .tracker-details-card h3 {
          font-size: 1.25rem;
          margin-bottom: 16px;
          border-bottom: 2px solid var(--border);
          padding-bottom: 8px;
        }
        .tracker-info-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .info-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .info-row h4 {
          font-size: 0.95rem;
          margin-bottom: 4px;
        }
        .info-row p {
          font-size: 0.85rem;
          line-height: 1.4;
        }
        .alt-phone-label {
          color: var(--neutral-gray);
          font-style: italic;
        }
        .tracker-items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 16px;
          margin-bottom: 16px;
        }
        .tracker-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }
        .item-qty-name {
          display: flex;
          gap: 8px;
        }
        .item-qty {
          color: var(--primary);
          font-weight: 700;
        }
        .item-name {
          color: var(--neutral-dark);
          font-weight: 500;
        }
        .item-total {
          font-weight: 700;
          color: var(--neutral-dark);
        }
        .tracker-total-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .total-row.grand-total {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--primary);
          margin-top: 4px;
          border-top: 1px dashed var(--border);
          padding-top: 8px;
        }
        .tracker-no-result {
          padding: 40px;
          background: var(--white);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .tracker-no-result p {
          max-width: 400px;
          margin-bottom: 12px;
        }
        @media (max-width: 768px) {
          .tracker-stepper {
            grid-template-columns: 1fr;
            gap: 24px;
            padding-left: 20px;
          }
          .step-item {
            flex-direction: row;
            text-align: left;
            align-items: flex-start;
            gap: 16px;
          }
          .step-icon-wrapper {
            margin-bottom: 0;
            flex-shrink: 0;
          }
          .step-connector-line {
            width: 4px;
            height: 30px;
            top: 50px;
            left: 20px;
            max-width: none;
          }
          .tracker-details-grid {
            grid-template-columns: 1fr;
          }
          .tracker-search-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};
export default OrderTracker;
