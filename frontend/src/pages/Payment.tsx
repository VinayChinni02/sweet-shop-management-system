import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { sweetsAPI } from '../services/api';
import './Payment.css';

const Payment: React.FC = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Process all cart items as purchases
      for (const item of cartItems) {
        try {
          await sweetsAPI.purchase(item.sweet.id, item.quantity);
        } catch (err: any) {
          console.error(`Failed to purchase ${item.sweet.name}:`, err);
          throw new Error(`Failed to purchase ${item.sweet.name}. ${err.response?.data?.error || 'Please try again.'}`);
        }
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clear cart after successful payment
      clearCart();

      alert(`✅ Payment Successful! Your order has been placed. Total: ₹${getTotalPrice().toFixed(2)}`);
      navigate('/dashboard');
    } catch (error: any) {
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getQuantityLabel = (qty: number) => {
    if (qty === 1.0) return '1 kg';
    if (qty === 0.5) return '500 g';
    return '250 g';
  };

  return (
    <div className="payment-container">
      <div className="payment-content">
        <div className="payment-form-section">
          <h1>💳 Payment</h1>
          <p className="payment-subtitle">Complete your purchase</p>

          <form onSubmit={handlePayment} className="payment-form">
            <div className="payment-method-selection">
              <h3>Select Payment Method</h3>
              <div className="payment-methods">
                <label className={`payment-method-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                  />
                  <span>💳 Credit/Debit Card</span>
                </label>
                <label className={`payment-method-option ${paymentMethod === 'upi' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'upi')}
                  />
                  <span>📱 UPI</span>
                </label>
                <label className={`payment-method-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                  />
                  <span>💰 Cash on Delivery</span>
                </label>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-details">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={cardDetails.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                      const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                      setCardDetails({ ...cardDetails, cardNumber: formatted });
                    }}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardDetails.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setCardDetails({ ...cardDetails, expiryDate: value });
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={3}
                      value={cardDetails.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                        setCardDetails({ ...cardDetails, cvv: value });
                      }}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder={user?.name || 'Your Name'}
                    value={cardDetails.cardName}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="upi-details">
                <div className="form-group">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="cod-info">
                <p>💰 Pay cash when your order is delivered.</p>
                <p>Delivery charges may apply.</p>
              </div>
            )}

            <button type="submit" className="pay-button" disabled={loading}>
              {loading ? 'Processing...' : `Pay ₹${getTotalPrice().toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cartItems.map((item, index) => (
              <div key={index} className="order-item">
                <div>
                  <h4>{item.sweet.name}</h4>
                  <p>{getQuantityLabel(item.quantity)}</p>
                </div>
                <span>₹{item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-total">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₹{getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="total-row final-total">
              <span>Total:</span>
              <span>₹{getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

