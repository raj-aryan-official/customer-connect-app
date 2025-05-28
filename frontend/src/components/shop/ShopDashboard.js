import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const ShopDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: '',
    stock: '',
  });
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState({
    submit: false,
    orders: false,
    products: false,
    status: false,
    payment: false
  });
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    const socket = io('http://localhost:5000');
    const user = JSON.parse(localStorage.getItem('user'));

    socket.emit('join', user.id);

    socket.on('newOrder', (data) => {
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

  const fetchOrders = async () => {
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders/shop-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/products/my-products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      setError('Failed to fetch products');
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const handleProductChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const validateProduct = (formData) => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) errors.price = 'Valid price is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (formData.image && formData.image.size > 5 * 1024 * 1024) {
      errors.image = 'Image size should be less than 5MB';
    }
    return errors;
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const errors = validateProduct(newProduct);
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewProduct({
        name: '',
        price: '',
        description: '',
        category: '',
        image: '',
        stock: '',
      });
      fetchProducts();
    } catch (error) {
      setError('Failed to add product');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setLoading(prev => ({ ...prev, status: true }));
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
    } catch (error) {
      setError('Failed to update order status');
    } finally {
      setLoading(prev => ({ ...prev, status: false }));
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      setLoading(prev => ({ ...prev, payment: true }));
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/payment`,
        { paymentStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
    } catch (error) {
      setError('Failed to update payment status');
    } finally {
      setLoading(prev => ({ ...prev, payment: false }));
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    const matchesDateRange = (!dateRange.start || new Date(order.createdAt) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(order.createdAt) <= new Date(dateRange.end));
    
    const matchesPriceRange = (!priceRange.min || order.totalAmount >= parseFloat(priceRange.min)) &&
      (!priceRange.max || order.totalAmount <= parseFloat(priceRange.max));
    
    return matchesSearch && matchesStatus && matchesDateRange && matchesPriceRange;
  });

  const categories = [...new Set(products.map(product => product.category))];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductForm({ ...productForm, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setUploadError('');
    
    const errors = validateProduct(productForm);
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, submit: true }));
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      if (productForm.image) {
        formData.append('image', productForm.image);
      }

      const response = await axios.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setProducts([...products, response.data]);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null
      });
      setImagePreview(null);
      setError('');
    } catch (error) {
      if (error.response?.data?.message) {
        setUploadError(error.response.data.message);
      } else {
        setUploadError('Failed to upload product. Please try again.');
      }
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'new') {
      setShowNewCategoryInput(true);
      setProductForm({ ...productForm, category: '' });
    } else {
      setShowNewCategoryInput(false);
      setProductForm({ ...productForm, category: value });
    }
  };

  const handleNewCategorySubmit = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      setProductForm({ ...productForm, category: newCategory.trim() });
      setShowNewCategoryInput(false);
      setNewCategory('');
    }
  };

  const calculateOrderStats = () => {
    const stats = {
      total: orders.length,
      totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      byStatus: {},
      byDate: {}
    };

    orders.forEach(order => {
      // Count by status
      stats.byStatus[order.status] = (stats.byStatus[order.status] || 0) + 1;

      // Count by date
      const date = new Date(order.createdAt).toLocaleDateString();
      stats.byDate[date] = (stats.byDate[date] || 0) + 1;
    });

    return stats;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shop Owner Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Products Management */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleAddProduct} className="space-y-4 mb-8">
            {uploadError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{uploadError}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setUploadError('');
                  }}
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              {showNewCategoryInput ? (
                <form onSubmit={handleNewCategorySubmit} className="mt-1 flex space-x-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategoryInput(false);
                      setNewCategory('');
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <select
                  name="category"
                  value={productForm.category}
                  onChange={handleCategoryChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                  <option value="new">Add New Category</option>
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading.submit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading.submit ? 'Adding Product...' : 'Add Product'}
            </button>
          </form>

          <div className="space-y-4">
            {products.map(product => (
              <div key={product._id} className="border rounded-lg p-4">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-sm text-gray-500">{product.description}</p>
                <p className="text-sm text-gray-500">Category: {product.category}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Management */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
          
          {/* Order Filters */}
          <div className="mb-6 space-y-4">
            <input
              type="text"
              placeholder="Search orders by customer name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="packed">Packed</option>
                <option value="ready_for_pickup">Ready for Pickup</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="End Date"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min Amount"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Max Amount"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setDateRange({ start: '', end: '' });
                  setPriceRange({ min: '', max: '' });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Order Statistics */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Order Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
                <p className="text-3xl font-bold text-blue-600">{calculateOrderStats().total}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
                <p className="text-3xl font-bold text-green-600">
                  ${calculateOrderStats().totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Average Order Value</h3>
                <p className="text-3xl font-bold text-purple-600">
                  ${(calculateOrderStats().totalAmount / (calculateOrderStats().total || 1)).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Orders by Status</h3>
                <div className="space-y-2">
                  {Object.entries(calculateOrderStats().byStatus).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <span className="capitalize">{status.replace('_', ' ')}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Recent Orders</h3>
                <div className="space-y-2">
                  {Object.entries(calculateOrderStats().byDate)
                    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                    .slice(0, 5)
                    .map(([date, count]) => (
                      <div key={date} className="flex justify-between items-center">
                        <span>{date}</span>
                        <span className="font-semibold">{count} orders</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                    <p className="text-sm text-gray-500">
                      Customer: {order.customer.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map(item => (
                    <div key={item._id} className="flex justify-between items-center">
                      <span>{item.product.name}</span>
                      <span className="text-gray-600">
                        {item.quantity} x ${item.price}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <p className="text-lg font-semibold mb-4">
                    Total: ${order.totalAmount}
                  </p>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Order Status</label>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        disabled={loading.status}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="packed">Packed</option>
                        <option value="ready_for_pickup">Ready for Pickup</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                        disabled={loading.payment}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard; 