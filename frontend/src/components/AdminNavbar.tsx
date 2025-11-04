import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const AdminNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <nav className="navbar admin-navbar">
      <div className="navbar-container">
        <Link to="/admin" className="navbar-brand">
          ⚙️ Admin Panel
        </Link>
        <div className="navbar-links">
          <Link to="/admin" className="nav-link active">
            📊 Inventory
          </Link>
          <Link to="/admin/users" className="nav-link">
            👥 Users
          </Link>
          <Link to="/admin/sales" className="nav-link">
            💰 Sales
          </Link>
          <div className="user-info">
            <span className="user-name">{user.name || user.email}</span>
            <span className="user-role-badge">ADMIN</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;

