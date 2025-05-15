// ResetPassword.jsx - Reset password using token from email
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Login.css';

function ResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const token = params.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!token) return <div className="login-root"><div className="login-card">Invalid or missing token.</div></div>;

  return (
    <div className="login-root">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-title">Reset Password</div>
        <div className="login-form">
          <input
            className="login-input"
            type="password"
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={success}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            disabled={success}
          />
          <button className="login-btn" type="submit" disabled={success}>Reset Password</button>
        </div>
        {success && <div className="login-link">Password reset! You may now log in.</div>}
        {error && <div className="login-link" style={{color:'red'}}>{error}</div>}
      </form>
    </div>
  );
}

export default ResetPassword;
