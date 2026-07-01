import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, Send } from 'lucide-react';
import type { CartItem } from './CartDrawer';
import type { SiteSettings } from '../types';

interface CheckoutFormProps {
  cartItems: CartItem[];
  onBack: () => void;
  onOrderPlaced: (orderId: string) => void;
  siteSettings: SiteSettings;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cartItems,
  onBack,
  onOrderPlaced,
  siteSettings,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    altPhone: '',
    address: '',
    landmark: '',
    pincode: '',
    cityState: '',
    email: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingCharge = subtotal >= 499 ? 0 : 40;
  const total = subtotal + shippingCharge;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      tempErrors.phone = 'Phone number must be exactly 10 digits';
    }
    if (formData.altPhone && !/^\d{10}$/.test(formData.altPhone.trim())) {
      tempErrors.altPhone = 'Alternative phone must be exactly 10 digits';
    }
    if (!formData.address.trim()) tempErrors.address = 'Address is required';
    if (!formData.pincode.trim()) {
      tempErrors.pincode = 'Pin code is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      tempErrors.pincode = 'Pin code must be exactly 6 digits';
    }
    if (!formData.cityState.trim()) tempErrors.cityState = 'City and State are required';
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      tempErrors.email = 'Please enter a valid email address';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // 1. Generate Order ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `KP-${randomNum}`;

    // 2. Create Order Object
    const orderDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newOrder = {
      id: orderId,
      customerName: formData.name,
      phone: formData.phone,
      altPhone: formData.altPhone || 'None',
      address: `${formData.address}${formData.landmark ? `, Landmark: ${formData.landmark}` : ''}`,
      pincode: formData.pincode,
      cityState: formData.cityState,
      items: cartItems.map((item) => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        category: item.product.category,
      })),
      email: formData.email ? formData.email.trim() : '',
      subtotal,
      shippingCharge,
      total,
      status: 'Placed',
      date: orderDate,
    };

    // 3. Save Order to localStorage (accumulate)
    const existingOrdersJson = localStorage.getItem('kalippetti_orders');
    const existingOrders = existingOrdersJson ? JSON.parse(existingOrdersJson) : [];
    existingOrders.push(newOrder);
    localStorage.setItem('kalippetti_orders', JSON.stringify(existingOrders));

    // 4. Format WhatsApp Message
    const shopUrl = window.location.origin;
    let itemsText = '';
    cartItems.forEach((item) => {
      itemsText += `- *${item.quantity}x* ${item.product.title} (Rs. ${item.product.price}/each)\n`;
    });

    const whatsAppMessage = `🧸 *NEW ORDER: ${siteSettings.siteName}* 🧸\n` +
      `--------------------------------------\n` +
      `*Order ID:* ${orderId}\n` +
      `*Date:* ${orderDate}\n\n` +
      `*Customer Details:*\n` +
      `*Name:* ${formData.name}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Alt Phone:* ${formData.altPhone || 'N/A'}\n` +
      `*Address:* ${formData.address}\n` +
      `${formData.landmark ? `*Landmark:* ${formData.landmark}\n` : ''}` +
      `*City & State:* ${formData.cityState}\n` +
      `*Pin Code:* ${formData.pincode}\n\n` +
      `*Items Ordered:*\n` +
      `${itemsText}\n` +
      `*Subtotal:* Rs. ${subtotal}\n` +
      `*Shipping:* ${shippingCharge === 0 ? 'FREE' : `Rs. ${shippingCharge}`}\n` +
      `*Total Payable:* *Rs. ${total}*\n` +
      `--------------------------------------\n` +
      `*Track your order here:*\n` +
      `${shopUrl}/?track=${orderId}\n` +
      `--------------------------------------\n` +
      `Please confirm my order. Thank you!`;

    const encodedText = encodeURIComponent(whatsAppMessage);
    const whatsappUrl = `https://wa.me/917012780209?text=${encodedText}`;

    // 5. Open WhatsApp Web or App
    window.open(whatsappUrl, '_blank');

    // 6. Complete Order flow trigger
    onOrderPlaced(orderId);
  };

  return (
    <div className="checkout-container animate-slide-in">
      <div className="checkout-header-actions">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Back to Shop</span>
        </button>
      </div>

      <h1 className="checkout-title">Verify & Place Order</h1>
      <p className="checkout-subtitle">Fill in your delivery details and proceed to WhatsApp to complete your purchase!</p>

      <div className="checkout-grid">
        {/* Verification / Address Form */}
        <div className="checkout-form-card wavy-card">
          <h3>Delivery Details</h3>

          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="E.g. Rayyan"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (10 digits) *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Primary phone number"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Alternative Phone (Optional)</label>
                <input
                  type="tel"
                  name="altPhone"
                  value={formData.altPhone}
                  onChange={handleChange}
                  placeholder="Emergency phone number"
                  className={`form-input ${errors.altPhone ? 'error' : ''}`}
                />
                {errors.altPhone && <span className="field-error">{errors.altPhone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Pin Code (6 digits) *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="E.g. 670001"
                  maxLength={6}
                  className={`form-input ${errors.pincode ? 'error' : ''}`}
                />
                {errors.pincode && <span className="field-error">{errors.pincode}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="For order updates"
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Full Address (House, Street name, Area) *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete shipping address"
                className={`form-textarea ${errors.address ? 'error' : ''}`}
              />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="E.g. Near Big School"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">City & State *</label>
                <input
                  type="text"
                  name="cityState"
                  value={formData.cityState}
                  onChange={handleChange}
                  placeholder="E.g. Calicut, Kerala"
                  className={`form-input ${errors.cityState ? 'error' : ''}`}
                />
                {errors.cityState && <span className="field-error">{errors.cityState}</span>}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-secondary w-full submit-order-btn animate-pulse-soft"
            >
              <Send size={18} />
              <span>Confirm & Place Order on WhatsApp</span>
            </button>
          </form>
        </div>

        {/* Order Summary Card */}
        <div className="checkout-summary-card wavy-card">
          <div className="summary-title-row">
            <ShoppingBag size={20} color="var(--primary)" />
            <h3>Order Summary</h3>
          </div>

          <div className="summary-items-list">
            {cartItems.map((item) => (
              <div key={item.product.id} className="summary-item">
                <div className="summary-item-left">
                  <span className="summary-item-qty">{item.quantity}x</span>
                  <span className="summary-item-name">{item.product.title}</span>
                </div>
                <span className="summary-item-subtotal">Rs. {item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="summary-cost-details">
            <div className="cost-row">
              <span>Subtotal</span>
              <span>Rs. {subtotal}</span>
            </div>

            <div className="cost-row">
              <span>Shipping Charge</span>
              <span>{shippingCharge === 0 ? 'FREE' : `Rs. ${shippingCharge}`}</span>
            </div>

            {shippingCharge > 0 && (
              <p className="shipping-tip">💡 Add toys worth Rs. {499 - subtotal} more to unlock <b>FREE SHIPPING!</b></p>
            )}

            <div className="cost-row grand-total">
              <span>Total Payable</span>
              <span>Rs. {total}</span>
            </div>
          </div>

          <div className="whatsapp-info-banner">
            <div className="whatsapp-info-icon">💬</div>
            <div className="whatsapp-info-text">
              <h4>WhatsApp Checkout</h4>
              <p>Once you click confirm, we will redirect you to WhatsApp to instantly complete your order with the seller.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-container {
          max-width: 1200px;
          margin: 40px auto 80px;
          padding: 0 24px;
        }
        .checkout-header-actions {
          margin-bottom: 24px;
        }
        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--primary);
          font-weight: 700;
          font-size: 1rem;
          padding: 8px 16px;
          border-radius: 20px;
        }
        .btn-back:hover {
          background: var(--primary-light);
        }
        .checkout-title {
          font-size: 2.2rem;
          margin-bottom: 8px;
        }
        .checkout-subtitle {
          font-size: 1.05rem;
          color: var(--neutral-gray);
          margin-bottom: 36px;
        }
        .checkout-grid {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 32px;
          align-items: start;
        }
        .checkout-form-card {
          padding: 30px;
        }
        .checkout-form-card h3, .checkout-summary-card h3 {
          font-size: 1.4rem;
          margin-bottom: 20px;
          color: var(--neutral-dark);
        }
        .checkout-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .field-error {
          color: var(--danger);
          font-size: 0.8rem;
          font-weight: 600;
          margin-top: 4px;
        }
        .form-input.error, .form-textarea.error {
          border-color: var(--danger);
          background: rgba(255, 23, 68, 0.02);
        }
        .submit-order-btn {
          margin-top: 10px;
          padding: 16px;
          font-size: 1.1rem;
        }
        .checkout-summary-card {
          padding: 30px;
          background: var(--white);
        }
        .summary-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 2px solid var(--border);
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .summary-title-row h3 {
          margin-bottom: 0;
        }
        .summary-items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 200px;
          overflow-y: auto;
          border-bottom: 2px solid var(--border);
          padding-bottom: 16px;
          margin-bottom: 16px;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
        }
        .summary-item-left {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .summary-item-qty {
          background: var(--primary-light);
          color: var(--primary);
          font-weight: 700;
          font-size: 0.8rem;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .summary-item-name {
          font-weight: 600;
          color: var(--neutral-dark);
        }
        .summary-item-subtotal {
          font-weight: 700;
          color: var(--neutral-dark);
        }
        .summary-cost-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-bottom: 2px solid var(--border);
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .cost-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          font-weight: 600;
        }
        .shipping-tip {
          font-size: 0.75rem;
          color: var(--secondary);
          margin-top: -6px;
        }
        .grand-total {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary);
        }
        .whatsapp-info-banner {
          display: flex;
          gap: 12px;
          background: #e8f5e9;
          border: 1px solid #c8e6c9;
          border-radius: var(--border-radius-md);
          padding: 16px;
        }
        .whatsapp-info-icon {
          font-size: 1.5rem;
        }
        .whatsapp-info-text h4 {
          color: #2e7d32;
          font-size: 0.95rem;
          margin-bottom: 4px;
        }
        .whatsapp-info-text p {
          color: #4caf50;
          font-size: 0.8rem;
          line-height: 1.4;
          font-weight: 500;
        }
        @media (max-width: 992px) {
          .checkout-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 576px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};
export default CheckoutForm;
