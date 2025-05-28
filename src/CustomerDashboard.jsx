import React, { useEffect, useState } from 'react';
import { getOrders } from './services/orderService';

function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getOrders()
      .then(setOrders)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Customer Dashboard</h2>
      {loading && <div>Loading your orders...</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
      <h3>Your Orders</h3>
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            Order #{order._id} - Status: {order.status}
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
      {!loading && orders.length === 0 && <div>No orders found.</div>}
    </div>
  );
}

export default CustomerDashboard;