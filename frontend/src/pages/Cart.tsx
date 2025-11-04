import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const getQuantityLabel = (qty: number) => {
    if (qty === 1.0) return '1 kg';
    if (qty === 0.5) return '500 g';
    return '250 g';
  };

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/payment');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h2>🛒 Your Cart is Empty</h2>
          <p>Add some delicious sweets to your cart!</p>
          <button onClick={() => navigate('/dashboard')} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>🛒 Shopping Cart</h1>
        <button onClick={clearCart} className="clear-cart-btn">
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => {
            const pricePerKilo = item.sweet.pricePerKilo || item.sweet.price;
            return (
              <div key={`${item.sweet.id}-${item.quantity}`} className="cart-item">
                <div className="cart-item-info">
                  <h3>{item.sweet.name}</h3>
                  <p className="cart-item-category">{item.sweet.category}</p>
                  <p className="cart-item-quantity">Quantity: {getQuantityLabel(item.quantity)}</p>
                  <p className="cart-item-price">₹{pricePerKilo.toFixed(2)}/kg × {item.quantity}kg = ₹{item.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-actions">
                  <button
                    onClick={() => removeFromCart(item.sweet.id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items ({cartItems.length}):</span>
            <span>₹{getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{getTotalPrice().toFixed(2)}</span>
          </div>
          <button onClick={handleProceedToPayment} className="checkout-btn">
            Proceed to Payment
          </button>
          <button onClick={() => navigate('/dashboard')} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

