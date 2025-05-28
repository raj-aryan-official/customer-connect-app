import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ShopDashboard from './components/shop/ShopDashboard';
import CustomerDashboard from './components/customer/CustomerDashboard';
import Layout from './components/layout/Layout';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/shop-dashboard"
            element={
              <PrivateRoute roles={['shop_owner']}>
                <ShopDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer-dashboard"
            element={
              <PrivateRoute roles={['customer']}>
                <CustomerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome to Our Platform
                      </h2>
                      <p className="mt-2 text-center text-sm text-gray-600">
                        Please select your dashboard from the navigation menu
                      </p>
                    </div>
                  </div>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
