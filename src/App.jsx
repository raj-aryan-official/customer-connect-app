import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import CustomerDashboard from './CustomerDashboard';
import ShopkeeperDashboard from './ShopkeeperDashboard';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Profile from './Profile';
import VerifyEmail from './VerifyEmail';
import { AuthContext } from './context/AuthContext';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Login />;
  if (role && user.role !== role) return <Home />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/customer" element={
          <ProtectedRoute role="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/shopkeeper" element={
          <ProtectedRoute role="shopkeeper">
            <ShopkeeperDashboard />
          </ProtectedRoute>
        } />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
}

export default App;
