import React, { useState, useEffect } from 'react';
import type { Order } from '../services/api';
import { ordersAPI } from '../services/api';
import './AdminOrders.css';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getAll();
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getQuantityLabel = (qty: number) => {
    if (qty === 1.0) return '1 kg';
    if (qty === 0.5) return '500 g';
    return '250 g';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTotalRevenue = () => {
    return orders.reduce((total, order) => total + order.total_price, 0);
  };

  if (loading) {
    return (
      <div className="admin-orders-container">
        <div className="loading">Loading orders... 📦</div>
      </div>
    );
  }

  return (
    <div className="admin-orders-container">
      <div className="orders-header">
        <h1>📦 Orders & Transactions</h1>
        <div className="orders-stats">
          <div className="stat-card">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{orders.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">₹{getTotalRevenue().toFixed(2)}</span>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders yet. Orders will appear here when users make purchases.</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Sweet</th>
                <th>Quantity</th>
                <th>Price/Kg</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <div className="customer-info">
                      <strong>{order.user_name || 'N/A'}</strong>
                      <span className="customer-email">{order.user_email}</span>
                    </div>
                  </td>
                  <td>{order.user_phone || 'N/A'}</td>
                  <td>
                    <div className="sweet-info">
                      <strong>{order.sweet_name}</strong>
                      <span className="sweet-category">{order.sweet_category}</span>
                    </div>
                  </td>
                  <td>{getQuantityLabel(order.quantity)}</td>
                  <td>₹{order.price_per_kg.toFixed(2)}</td>
                  <td className="total-price">₹{order.total_price.toFixed(2)}</td>
                  <td>{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

