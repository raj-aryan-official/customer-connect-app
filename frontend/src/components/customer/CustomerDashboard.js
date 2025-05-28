import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState({
    products: false,
    orders: false,
    cart: false
  });

  useEffect(() => {
    const socket = io('http://localhost:5000');
    const user = JSON.parse(localStorage.getItem('user'));

    socket.emit('join', user.id);

    socket.on('orderStatusUpdate', (data) => {
      setNotifications(prev => [...prev, data]);
      fetchOrders();
    });

    socket.on('paymentStatusUpdate', (data) => {
      setNotifications(prev => [...prev, data]);
      fetchOrders();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, priceRange]);

  const filterProducts = () => {
    let filtered = [...products];

    // Search by name
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Filter by price range
    if (priceRange.min) {
      filtered = filtered.filter(product =>
        product.price >= parseFloat(priceRange.min)
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(product =>
        product.price <= parseFloat(priceRange.max)
      );
    }

    setFilteredProducts(filtered);
  };

  const fetchOrders = async () => {
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      setError('');
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      setError('Failed to fetch products. Please try again later.');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const addToCart = async (product) => {
    try {
      setLoading(prev => ({ ...prev, cart: true }));
      setError('');
      
      // Check if product is already in cart
      const existingItem = cart.find(item => item._id === product._id);
      if (existingItem) {
        setCart(cart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
    } catch (error) {
      setError('Failed to add item to cart. Please try again.');
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(prev => ({ ...prev, cart: false }));
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart(cart.map(item =>
      item._id === productId ? { ...item, quantity: parseInt(quantity) } : item
    ));
  };

  const submitOrder = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, submit: true }));
      const token = localStorage.getItem('token');
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shopOwnerId: selectedShop,
        totalAmount: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
      };

      await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart([]);
      setSelectedShop(null);
      fetchOrders();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit order');
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      packed: 'bg-purple-100 text-purple-800',
      ready_for_pickup: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const categories = [...new Set(products.map(product => product.category))];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-white border-l-4 border-green-500 text-gray-700 p-4 mb-4 rounded shadow-lg"
              role="alert"
            >
              <p className="font-bold">{notification.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Loading States */}
      {loading.orders && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-lg">Loading orders...</p>
          </div>
        </div>
      )}

      {loading.products && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-lg">Loading products...</p>
          </div>
        </div>
      )}

      {loading.submit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-lg">Submitting order...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Products Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Products</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => setError('')}
                className="text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          )}
          
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading.products ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            /* Product List */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {product.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={`http://localhost:5000${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                    <p className="text-blue-600 font-bold">${product.price}</p>
                    <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={loading.cart}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {loading.cart ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4 mb-4">
                {cart.map(item => (
                  <div key={item._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-600">${item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item._id, e.target.value)}
                          className="w-16 px-2 py-1 border rounded"
                        />
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <p className="text-lg font-semibold">
                  Total: ${cart.reduce((total, item) => total + (item.price * item.quantity), 0)}
                </p>
                <button
                  onClick={submitOrder}
                  className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Submit Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Orders Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
        <div className="grid grid-cols-1 gap-4">
          {orders.map(order => (
            <div key={order._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item._id} className="flex justify-between items-center">
                    <span>{item.product.name}</span>
                    <span className="text-gray-600">
                      {item.quantity} x ${item.price}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-lg font-semibold">
                  Total: ${order.totalAmount}
                </p>
                <p className="text-sm text-gray-500">
                  Payment Status: {order.paymentStatus}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard; 