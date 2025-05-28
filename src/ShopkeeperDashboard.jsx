import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from './services/orderService';
import { getProducts, addProduct, updateProduct, deleteProduct } from './services/productService';

function ShopkeeperDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [productForm, setProductForm] = useState({ name: '', price: '', stock: '', category: '', image: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setLoading(true);
        // Test connection by fetching products
        await getProducts();
        setConnectionStatus('connected');
        
        // Fetch initial data
        const [ordersData, productsData] = await Promise.all([
          getOrders(),
          getProducts()
        ]);
        
        setOrders(ordersData);
        setProducts(productsData);
        setError('');
      } catch (err) {
        setConnectionStatus('error');
        setError('Failed to connect to database: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(orders => orders.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProductFormChange = e => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async e => {
    e.preventDefault();
    try {
      const newProduct = await addProduct(productForm);
      setProducts(products => [...products, newProduct]);
      setProductForm({ name: '', price: '', stock: '', category: '', image: '' });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditProduct = product => {
    setEditingProduct(product._id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image || ''
    });
  };

  const handleUpdateProduct = async e => {
    e.preventDefault();
    try {
      const updated = await updateProduct(editingProduct, productForm);
      setProducts(products => products.map(p => p._id === editingProduct ? updated : p));
      setEditingProduct(null);
      setProductForm({ name: '', price: '', stock: '', category: '', image: '' });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async id => {
    try {
      await deleteProduct(id);
      setProducts(products => products.filter(p => p._id !== id));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Shopkeeper Dashboard</h2>
        <div className="mt-2">
          Database Status: 
          <span className={`ml-2 px-2 py-1 rounded ${
            connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
            connectionStatus === 'error' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {connectionStatus === 'connected' ? 'Connected' :
             connectionStatus === 'error' ? 'Connection Error' :
             'Checking Connection...'}
          </span>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <h3>Orders</h3>
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            Order #{order._id} - Status: {order.status}
            <button onClick={() => handleStatusChange(order._id, 'confirmed')}>Confirm</button>
            <button onClick={() => handleStatusChange(order._id, 'packed')}>Pack</button>
            <button onClick={() => handleStatusChange(order._id, 'completed')}>Complete</button>
            <ul>
              {order.items.map(item => (
                <li key={item.product?._id || item.name}>
                  {item.name} x {item.quantity} - ₹{item.price}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <h3>Products</h3>
      <ul>
        {products.map(product => (
          <li key={product._id}>
            {product.name} - ₹{product.price} | Stock: {product.stock} | Category: {product.category}
            <button onClick={() => handleEditProduct(product)}>Edit</button>
            <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
      <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
        <input
          name="name"
          placeholder="Name"
          value={productForm.name}
          onChange={handleProductFormChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={productForm.price}
          onChange={handleProductFormChange}
          required
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={productForm.stock}
          onChange={handleProductFormChange}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={productForm.category}
          onChange={handleProductFormChange}
        />
        <input
          name="image"
          placeholder="Image URL"
          value={productForm.image}
          onChange={handleProductFormChange}
        />
        <button type="submit">{editingProduct ? 'Update' : 'Add'}</button>
        {editingProduct && (
          <button type="button" onClick={() => {
            setEditingProduct(null);
            setProductForm({ name: '', price: '', stock: '', category: '', image: '' });
          }}>Cancel</button>
        )}
      </form>
    </div>
  );
}

export default ShopkeeperDashboard;