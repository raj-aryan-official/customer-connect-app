import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { login as loginApi } from './services/authService';
import { AuthContext } from './context/AuthContext';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginApi(email, password);
      if (data && data.user) {
        login(data.user);
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
      setError('Login failed');
      toast.error('Login failed');
    }
  };

  return (
    <div className="login-root">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-title">Sign In</div>
        <div className="login-form">
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
          <Link to="/forgot-password">Forgot password?</Link> | <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
