import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import AdminDashboard from './pages/AdminDashboard';
import UserNavbar from './components/UserNavbar';
import AdminNavbar from './components/AdminNavbar';
import './App.css';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Auto-redirect admins to admin panel
  if (user.role === 'admin' && !window.location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin" />;
  }
  
  // Auto-redirect regular users to dashboard
  if (user.role === 'user' && window.location.pathname.startsWith('/admin')) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role === 'admin') {
    return <Navigate to="/admin" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <UserRoute>
                  <UserNavbar />
                  <Dashboard />
                </UserRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <UserRoute>
                  <UserNavbar />
                  <Cart />
                </UserRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <UserRoute>
                  <UserNavbar />
                  <Payment />
                </UserRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminNavbar />
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Navigate to="/dashboard" />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

