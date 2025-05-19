import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as registerApi } from './services/authService';
import './Register.css';

function Register() {
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    businessAddress: ''
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const response = await loginApi({ email, password });
    const data = response.data;
    if (data && data.token && data.user) {
      login({ ...data.user, token: data.token }); // Save user and token in context/localStorage
      toast.success('Login successful!');
      if (data.user.role === 'customer') {
        navigate('/dashboard/customer');
      } else {
        navigate('/dashboard/shopkeeper');
      }
    } else {
      setError(data.message || 'Login failed');
      toast.error(data.message || 'Login failed');
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
    toast.error(err.response?.data?.message || 'Login failed');
  }
};

  return (
    <div className="register-root">
      <form className="register-card" onSubmit={handleSubmit}>
        <div className="register-title">Create Account</div>
        <div className="register-form">
          <select name="role" value={role} onChange={e => setRole(e.target.value)} className="register-input">
            <option value="customer">Customer</option>
            <option value="shopkeeper">Shopkeeper</option>
          </select>
          {role === 'customer' && (
            <input
              className="register-input"
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}
          {role === 'shopkeeper' && (
            <>
              <input
                className="register-input"
                type="text"
                name="shopName"
                placeholder="Shop Name"
                value={form.shopName}
                onChange={handleChange}
                required
              />
              <input
                className="register-input"
                type="text"
                name="businessAddress"
                placeholder="Business Address"
                value={form.businessAddress}
                onChange={handleChange}
                required
              />
            </>
          )}
          <input
            className="register-input"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="register-input"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button className="register-btn" type="submit">Register</button>
        </div>
        {error && <div className="register-link" style={{color:'red'}}>{error}</div>}
        {success && <div className="register-link" style={{color:'green'}}>
          Registration successful! Please check your email for verification. Redirecting to login...
        </div>}
        <div className="register-link">
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
