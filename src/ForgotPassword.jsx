// ForgotPassword.jsx - Request password reset via email
import React, { useState } from 'react';
import './Login.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send reset email');
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-root">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-title">Forgot Password</div>
        <div className="login-form">
          <input
            className="login-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={sent}
          />
          <button className="login-btn" type="submit" disabled={sent}>Send Reset Link</button>
        </div>
        {sent && <div className="login-link">Check your email for a reset link.</div>}
        {error && <div className="login-link" style={{color:'red'}}>{error}</div>}
      </form>
    </div>
  );
}

export default ForgotPassword;
