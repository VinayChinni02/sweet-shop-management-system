import React, { useState, useEffect } from 'react';
import type { Sweet } from '../services/api';
import './SweetForm.css';

interface SweetFormProps {
  sweet?: Sweet | null;
  onSubmit: (data: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

const SweetForm: React.FC<SweetFormProps> = ({ sweet, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    pricePerKilo: '',
    quantity: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        pricePerKilo: (sweet.pricePerKilo || sweet.price || 0).toString(),
        quantity: sweet.quantity.toString(),
      });
    }
  }, [sweet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const pricePerKilo = parseFloat(formData.pricePerKilo);
      const quantity = parseFloat(formData.quantity) || 0;

      if (pricePerKilo < 0 || quantity < 0) {
        throw new Error('Price per kilo and quantity must be non-negative');
      }

      await onSubmit({
        name: formData.name,
        category: formData.category,
        pricePerKilo,
        price: pricePerKilo, // Keep for backward compatibility
        quantity,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to save sweet');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="sweet-form">
      <h2>{sweet ? 'Edit Sweet' : 'Add New Sweet'}</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Sweet name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="Category"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pricePerKilo">Price per Kilogram (₹) *</label>
          <input
            type="number"
            id="pricePerKilo"
            name="pricePerKilo"
            value={formData.pricePerKilo}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
          <small className="form-hint">Price for 1 kg. Prices for 250g, 500g will be calculated automatically.</small>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Stock Quantity (kg) *</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
          <small className="form-hint">Quantity in kilograms</small>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Saving...' : sweet ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default SweetForm;

