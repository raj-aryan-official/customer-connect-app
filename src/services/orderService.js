import { apiFetch } from './api';

export function createOrder(order) {
  return apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
}

export function getOrders() {
  return apiFetch('/orders');
}

export function updateOrderStatus(id, status) {
  return apiFetch(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}