import React, { useState } from 'react';
import type { Sweet } from '../services/api';
import './AdminSweetCard.css';

interface AdminSweetCardProps {
  sweet: Sweet;
  onEdit: (sweet: Sweet) => void;
  onDelete: (id: number) => void;
  onRestock: (id: number, quantity: number) => void;
  onOutOfStock: (id: number) => void;
}

const AdminSweetCard: React.FC<AdminSweetCardProps> = ({
  sweet,
  onEdit,
  onDelete,
  onRestock,
  onOutOfStock,
}) => {
  const [restockQuantity, setRestockQuantity] = useState('');

  const handleRestock = (e: React.MouseEvent) => {
    e.preventDefault();
    const qty = parseFloat(restockQuantity);
    if (qty > 0) {
      onRestock(sweet.id, qty);
      setRestockQuantity('');
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(sweet);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    onDelete(sweet.id);
  };

  const handleOutOfStock = (e: React.MouseEvent) => {
    e.preventDefault();
    onOutOfStock(sweet.id);
  };

  return (
    <div className="admin-sweet-card">
      <div className="admin-card-header">
        <h3>{sweet.name}</h3>
        <span className="category-badge">{sweet.category}</span>
      </div>

      <div className="admin-card-body">
        <div className="info-row">
          <span className="label">Price per kg:</span>
          <span className="value">₹{(sweet.pricePerKilo || sweet.price).toFixed(2)}</span>
        </div>
        <div className="info-row">
          <span className="label">Stock:</span>
          <span className={`value ${sweet.quantity === 0 ? 'stock-out' : ''}`}>
            {sweet.quantity.toFixed(2)} kg
          </span>
        </div>
        <div className="info-row">
          <span className="label">Prices:</span>
          <span className="value" style={{ fontSize: '0.85rem' }}>
            250g: ₹{((sweet.pricePerKilo || sweet.price) * 0.25).toFixed(2)} | 
            500g: ₹{((sweet.pricePerKilo || sweet.price) * 0.5).toFixed(2)} | 
            1kg: ₹{(sweet.pricePerKilo || sweet.price).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="restock-section">
        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Quantity (kg)"
          value={restockQuantity}
          onChange={(e) => setRestockQuantity(e.target.value)}
          className="restock-input"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleRestock(e as any);
            }
          }}
        />
        <button type="button" onClick={handleRestock} className="restock-btn">
          Restock (kg)
        </button>
        <button 
          type="button" 
          onClick={handleOutOfStock} 
          className="out-of-stock-btn"
          disabled={sweet.quantity === 0}
        >
          Out of Stock
        </button>
      </div>

      <div className="admin-actions">
        <button type="button" onClick={handleEdit} className="edit-btn">
          Edit
        </button>
        <button type="button" onClick={handleDelete} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminSweetCard;

