import React, { useState } from 'react';
import type { Sweet } from '../services/api';
import { useCart } from '../contexts/CartContext';
import './SweetCard.css';

interface SweetCardProps {
  sweet: Sweet;
}

const SweetCard: React.FC<SweetCardProps> = ({ sweet }) => {
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0.25); // Default to 250g
  const { addToCart } = useCart();
  const isOutOfStock = sweet.quantity === 0;

  const pricePerKilo = sweet.pricePerKilo || sweet.price;
  
  // Calculate prices for different quantities
  const price250g = pricePerKilo * 0.25;
  const price500g = pricePerKilo * 0.5;
  const price1kg = pricePerKilo * 1.0;

  const handleAddToCart = (quantity: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isOutOfStock && sweet.quantity >= quantity) {
      addToCart(sweet, quantity);
      alert(`Added ${getQuantityLabel(quantity)} of ${sweet.name} to cart!`);
    }
  };

  const getQuantityLabel = (qty: number) => {
    if (qty === 1.0) return '1 kg';
    if (qty === 0.5) return '500 g';
    return '250 g';
  };

  const getPriceForQuantity = (qty: number) => {
    if (qty === 1.0) return price1kg;
    if (qty === 0.5) return price500g;
    return price250g;
  };

  return (
    <div className={`sweet-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="sweet-card-header">
        <h3>{sweet.name}</h3>
        <span className="category-badge">{sweet.category}</span>
      </div>

      <div className="sweet-card-body">
        <div className="price-section">
          <div className="price-per-kilo">₹{pricePerKilo.toFixed(2)}/kg</div>
          <div className="quantity-prices">
            <span className="price-option">250g: ₹{price250g.toFixed(2)}</span>
            <span className="price-option">500g: ₹{price500g.toFixed(2)}</span>
            <span className="price-option">1kg: ₹{price1kg.toFixed(2)}</span>
          </div>
        </div>
        <div className={`stock ${isOutOfStock ? 'stock-out' : 'stock-available'}`}>
          {isOutOfStock ? 'Out of Stock' : `${sweet.quantity.toFixed(2)} kg in stock`}
        </div>
      </div>

      <div className="quantity-selector">
        <div className="quantity-buttons">
          <button
            type="button"
            className={`qty-btn ${selectedQuantity === 0.25 ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setSelectedQuantity(0.25);
            }}
            disabled={isOutOfStock || sweet.quantity < 0.25}
          >
            250g
            <span className="qty-price">₹{price250g.toFixed(2)}</span>
          </button>
          <button
            type="button"
            className={`qty-btn ${selectedQuantity === 0.5 ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setSelectedQuantity(0.5);
            }}
            disabled={isOutOfStock || sweet.quantity < 0.5}
          >
            500g
            <span className="qty-price">₹{price500g.toFixed(2)}</span>
          </button>
          <button
            type="button"
            className={`qty-btn ${selectedQuantity === 1.0 ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setSelectedQuantity(1.0);
            }}
            disabled={isOutOfStock || sweet.quantity < 1.0}
          >
            1 kg
            <span className="qty-price">₹{price1kg.toFixed(2)}</span>
          </button>
        </div>
        <button
          type="button"
          className={`purchase-btn ${isOutOfStock || sweet.quantity < selectedQuantity ? 'disabled' : ''}`}
          onClick={(e) => handleAddToCart(selectedQuantity, e)}
          disabled={isOutOfStock || sweet.quantity < selectedQuantity}
        >
          {isOutOfStock ? 'Out of Stock' : `Add to Cart (${getQuantityLabel(selectedQuantity)}) - ₹${getPriceForQuantity(selectedQuantity).toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default SweetCard;

