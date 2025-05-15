// ProductList.jsx - Displays a list of products with search
import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import toast from 'react-hot-toast';
import './ProductList.css';

function ProductList({ onSelect }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    }).catch(() => {
      toast.error('Failed to load products');
      setLoading(false);
    });
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="product-list-root">
      <input
        className="product-search"
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {loading ? (
        <div className="product-loading">Loading...</div>
      ) : (
        <div className="product-grid">
          {filtered.map(product => (
            <div key={product._id} className="product-card" onClick={() => onSelect && onSelect(product)} aria-label={`Select product ${product.name}`} tabIndex={0} onKeyPress={e => { if (e.key === 'Enter') onSelect && onSelect(product); }}>
              <img src={product.image || 'https://via.placeholder.com/120'} alt={product.name || 'Product'} className="product-img" />
              <div className="product-name">{product.name}</div>
              <div className="product-price">₹{product.price}</div>
              <div className="product-stock">Stock: {product.stock}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
