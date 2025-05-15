// ShopkeeperDashboard.jsx - Shopkeeper dashboard page skeleton
import React, { useEffect, useState, useContext } from 'react';
import './ShopkeeperDashboard.css';
import { getProducts, addProduct, updateProduct, deleteProduct } from './services/productService';
import { AuthContext } from './context/AuthContext';
import OrderList from './components/OrderList';
import toast from 'react-hot-toast';

function ShopkeeperDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', stock: '', category: '', image: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editing) {
        await updateProduct(editing, form);
        toast.success('Product updated!');
      } else {
        await addProduct(form);
        toast.success('Product added!');
      }
      setForm({ name: '', price: '', stock: '', category: '', image: '' });
      setEditing(null);
      fetchProducts();
    } catch (error) {
      toast.error('An error occurred!');
    }
  };

  const handleEdit = p => {
    setForm({ name: p.name, price: p.price, stock: p.stock, category: p.category, image: p.image });
    setEditing(p._id);
  };

  const handleDelete = async id => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted!');
      fetchProducts();
    } catch (error) {
      toast.error('An error occurred!');
    }
  };

  return (
    <div className="dashboard-root">
      <div className="dashboard-title">Shopkeeper Dashboard <button className="btn-outline" style={{float:'right'}} onClick={logout}>Logout</button></div>
      <form className="product-form" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required className="register-input" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" required className="register-input" />
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" required className="register-input" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="register-input" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="register-input" />
        <button className="btn-accent" type="submit">{editing ? 'Update' : 'Add'} Product</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', price: '', stock: '', category: '', image: '' }); }}>Cancel</button>}
      </form>
      {loading ? <div>Loading...</div> : (
        <table className="product-table">
          <thead>
            <tr><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Image</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>{p.category}</td>
                <td>{p.image ? <img src={p.image} alt={p.name} style={{ width: 40 }} /> : '-'}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <OrderList shopkeeper />
    </div>
  );
}

export default ShopkeeperDashboard;
