// productService.js - Handles product API calls
const API = '/api/products';

export async function getProducts() {
  const res = await fetch(API);
  return res.json();
}

export async function addProduct(product) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(product)
  });
  return res.json();
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(product)
  });
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  return res.json();
}
