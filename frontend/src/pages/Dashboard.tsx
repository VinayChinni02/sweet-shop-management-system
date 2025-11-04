import React, { useState, useEffect } from 'react';
import type { Sweet, SearchFilters } from '../services/api';
import { sweetsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import SweetCard from '../components/SweetCard';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
  });
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && user) {
      loadSweets();
    }
  }, [authLoading, user]);

  useEffect(() => {
    applyFilters();
  }, [filters, sweets]);

  const loadSweets = async () => {
    try {
      setLoading(true);
      const data = await sweetsAPI.getAll();
      setSweets(data);
      setFilteredSweets(data);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map((s) => s.category)));
      setCategories(uniqueCategories);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const hasFilters = filters.name || filters.category || filters.minPrice !== undefined || filters.maxPrice !== undefined;
      
      if (hasFilters) {
        const results = await sweetsAPI.search(filters);
        setFilteredSweets(results);
      } else {
        setFilteredSweets(sweets);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Search failed');
    }
  };


  const handleFilterChange = (key: keyof SearchFilters, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading sweets... 🍬</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🍬 Sweet Shop</h1>
        <p className="subtitle">Browse our delicious selection of sweets</p>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Search by Name</label>
            <input
              type="text"
              placeholder="Sweet name..."
              value={filters.name || ''}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Min Price</label>
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={filters.minPrice || ''}
              onChange={(e) =>
                handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)
              }
            />
          </div>

          <div className="filter-group">
            <label>Max Price</label>
            <input
              type="number"
              placeholder="999.99"
              step="0.01"
              min="0"
              value={filters.maxPrice || ''}
              onChange={(e) =>
                handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)
              }
            />
          </div>
        </div>

        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            clearFilters();
          }} 
          className="clear-filters-btn"
        >
          Clear Filters
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="sweets-grid">
        {filteredSweets.length === 0 ? (
          <div className="no-results">
            <p>No sweets found. Try adjusting your filters!</p>
          </div>
        ) : (
          filteredSweets.map((sweet) => (
            <SweetCard key={sweet.id} sweet={sweet} />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;

