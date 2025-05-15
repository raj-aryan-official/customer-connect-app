// OrderList.jsx - Displays a list of orders for the current user or shopkeeper
import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../services/orderService';
import toast from 'react-hot-toast';
import './OrderList.css';

function OrderList({ shopkeeper }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;
    const fetchOrders = () => {
      getOrders().then(data => {
        setOrders(data);
        setLoading(false);
      });
    };
    fetchOrders();
    interval = setInterval(fetchOrders, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleMarkPaid = async (id) => {
    try {
      await updateOrderStatus(id, 'completed');
      setOrders(orders => orders.map(o => o._id === id ? { ...o, status: 'completed' } : o));
    } catch (err) {
      toast.error('Failed to mark as paid');
    }
  };

  return (
    <div className="order-list-root">
      <h3>{shopkeeper ? "Shopkeeper's Orders" : "Your Orders"}</h3>
      {loading ? (
        <div className="order-loading" role="status" aria-live="polite">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="order-empty" role="status" aria-live="polite">No orders found.</div>
      ) : (
        <table className="order-list-table" aria-label="Order list">
          <thead>
            <tr><th>Order ID</th><th>Status</th><th>Total</th><th>Date</th>{shopkeeper && <th>Actions</th>}</tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id}
                  tabIndex={0}
                  aria-label={`Order ${order._id}, status ${order.status}, total ₹${order.total}`}
                  onKeyDown={e => {
                    if (shopkeeper && e.key === 'Enter' && order.status !== 'completed') handleMarkPaid(order._id);
                  }}
                  style={{ outline: 'none' }}
                  onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px #2c5fa8'}
                  onBlur={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <td>{order._id}</td>
                <td><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                <td>₹{order.total}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                {shopkeeper && <td>{order.status !== 'completed' && <button aria-label={`Mark order ${order._id} as paid`} onClick={() => handleMarkPaid(order._id)}>Mark as Paid</button>}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderList;
