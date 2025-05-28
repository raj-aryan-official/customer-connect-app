import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CustomerDashboard from './components/customer/CustomerDashboard';
import ShopDashboard from './components/shop/ShopDashboard';

const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/customer/dashboard"
          element={
            <PrivateRoute role="customer">
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/shop/dashboard"
          element={
            <PrivateRoute role="shop_owner">
              <ShopDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App; 