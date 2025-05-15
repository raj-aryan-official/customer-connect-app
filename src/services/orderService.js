// orderService.js - Handles order API calls
const API = '/api/orders';

export async function getOrders() {
  const res = await fetch(API, { credentials: 'include' });
  return res.json();
}

export async function createOrder(order) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(order)
  });
  return res.json();
}

export async function updateOrderStatus(id, status) {
  const res = await fetch(`${API}/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status })
  });
  return res.json();
}
