// CustomerDashboard.jsx - Customer dashboard page skeleton
import React, { useState, useContext } from 'react';
import './CustomerDashboard.css';
import ProductList from './components/ProductList';
import { createOrder } from './services/orderService';
import OrderList from './components/OrderList';
import { AuthContext } from './context/AuthContext';
import toast from 'react-hot-toast';

function CustomerDashboard() {
  const [selected, setSelected] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { logout } = useContext(AuthContext);

  const handleSelect = (product) => {
    if (selected.find(p => p._id === product._id)) return;
    setSelected([...selected, { ...product, quantity: 1 }]);
  };

  const handleQuantity = (id, qty) => {
    setSelected(selected.map(p => p._id === id ? { ...p, quantity: qty } : p));
  };

  const handleRemove = (id) => {
    setSelected(selected.filter(p => p._id !== id));
  };

  const handleOrder = async () => {
    setSubmitting(true);
    try {
      // TODO: Select shopkeeper, for now use first product's shopkeeper
      const shopkeeper = selected[0]?.shopkeeper;
      if (!shopkeeper) throw new Error('No shopkeeper found for selected products');
      const items = selected.map(p => ({
        productId: p._id,
        name: p.name,
        quantity: p.quantity,
        price: p.price
      }));
      const total = selected.reduce((sum, p) => sum + p.price * p.quantity, 0);
      const res = await createOrder({ shopkeeper, items, total });
      if (!res || res.error) throw new Error(res?.message || 'Order failed');
      setOrderStatus(res.status || 'pending');
      setSelected([]);
      toast.success('Order placed!');
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    }
    setSubmitting(false);
  };

  return (
    <div className="dashboard-root">
      <div className="dashboard-title">Customer Dashboard <button className="btn-outline" style={{float:'right'}} onClick={logout}>Logout</button></div>
      <ProductList onSelect={handleSelect} />
      {selected.length > 0 && (
        <div className="order-section">
          <h3>Your Order</h3>
          <table className="order-table">
            <thead>
              <tr><th>Product</th><th>Qty</th><th>Price</th><th>Remove</th></tr>
            </thead>
            <tbody>
              {selected.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.quantity}
                      onChange={e => handleQuantity(item._id, Number(e.target.value))}
                      style={{ width: 50 }}
                    />
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td><button onClick={() => handleRemove(item._id)}>X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="order-total">Total: ₹{selected.reduce((sum, p) => sum + p.price * p.quantity, 0)}</div>
          <button className="btn-accent" onClick={handleOrder} disabled={submitting} aria-label="Place Order">Place Order</button>
        </div>
      )}
      {orderStatus && (
        <div className="order-status">Order status: <span className="status-badge">{orderStatus}</span></div>
      )}
      <OrderList />
    </div>
  );
}

export default CustomerDashboard;
