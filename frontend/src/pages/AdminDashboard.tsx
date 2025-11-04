import React, { useState, useEffect } from 'react';
import type { Sweet } from '../services/api';
import { sweetsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import AdminSweetCard from '../components/AdminSweetCard';
import AdminOrders from '../components/AdminOrders';
import SweetForm from '../components/SweetForm';
import './AdminDashboard.css';

type TabType = 'inventory' | 'orders';

const AdminDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('inventory');
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadSweets();
    }
  }, [authLoading, user]);

  const loadSweets = async () => {
    try {
      setLoading(true);
      const data = await sweetsAPI.getAll();
      setSweets(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (sweetData: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await sweetsAPI.create(sweetData);
      await loadSweets();
      setShowForm(false);
      setEditingSweet(null);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create sweet');
      throw err;
    }
  };

  const handleUpdate = async (id: number, updates: Partial<Sweet>) => {
    try {
      await sweetsAPI.update(id, updates);
      await loadSweets();
      setEditingSweet(null);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update sweet');
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sweet?')) {
      return;
    }

    try {
      await sweetsAPI.delete(id);
      await loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete sweet');
    }
  };

  const handleRestock = async (id: number, quantity: number) => {
    try {
      await sweetsAPI.restock(id, quantity);
      await loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to restock sweet');
    }
  };

  const handleOutOfStock = async (id: number) => {
    if (!confirm('Set this sweet to out of stock (quantity = 0)?')) {
      return;
    }
    try {
      await sweetsAPI.update(id, { quantity: 0 });
      await loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to set out of stock');
    }
  };

  const startEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingSweet(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading sweets... 🍬</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>⚙️ Admin Dashboard</h1>
        <p className="subtitle">Manage your sweet inventory and orders</p>
      </div>

      <div className="admin-tabs">
        <button
          type="button"
          className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          📦 Inventory
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📋 Orders
        </button>
      </div>

      {activeTab === 'inventory' && (
        <>
          <div className="admin-actions">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowForm(!showForm);
              }}
              className="add-sweet-btn"
            >
              {showForm ? 'Cancel' : '+ Add New Sweet'}
            </button>
          </div>

          {showForm && (
            <div className="form-container">
              <SweetForm
                sweet={editingSweet}
                onSubmit={editingSweet ? (data) => handleUpdate(editingSweet.id, data) : handleCreate}
                onCancel={cancelEdit}
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="sweets-grid">
            {sweets.length === 0 ? (
              <div className="no-results">
                <p>No sweets found. Add your first sweet!</p>
              </div>
            ) : (
              sweets.map((sweet) => (
                <AdminSweetCard
                  key={sweet.id}
                  sweet={sweet}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                  onRestock={handleRestock}
                  onOutOfStock={handleOutOfStock}
                />
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'orders' && <AdminOrders />}
    </div>
  );
};

export default AdminDashboard;

