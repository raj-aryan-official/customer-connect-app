import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { login as loginApi } from './services/authService';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginApi(email, password);
      // Defensive checks
      if (!data || !data.user || !data.token) {
        throw new Error(data?.message || 'Login failed');
      }
      if (data.user.role !== role) {
        throw new Error('Role mismatch: Please select the correct role.');
      }
      login(data.user, data.token);
      navigate(role === 'shopkeeper' ? '/dashboard/shopkeeper' : '/dashboard/customer');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="login-root">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-title">Sign In</div>
        <div className="login-form">
          <select className="login-input" value={role} onChange={e => setRole(e.target.value)} style={{marginBottom:'1em'}}>
            <option value="customer">Customer</option>
            <option value="shopkeeper">Shopkeeper</option>
          </select>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className="login-btn" type="submit">Login</button>
        </div>
        {error && <div className="login-link" style={{color:'red'}}>{error}</div>}
        <div className="login-link">
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;