// VerifyEmail.jsx - Email OTP verification UI
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Login.css';

function VerifyEmail() {
  const [params] = useSearchParams();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = params.get('userId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');
      toast.success('Email verified! You may now log in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
    setLoading(false);
  };

  if (!userId) return <div className="login-root"><div className="login-card">Invalid or missing user ID.</div></div>;

  return (
    <div className="login-root">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-title">Verify Email</div>
        <div className="login-form">
          <input
            className="login-input"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
            disabled={loading}
          />
          <button className="login-btn" type="submit" disabled={loading}>Verify</button>
        </div>
        {error && <div className="login-link" style={{color:'red'}}>{error}</div>}
      </form>
    </div>
  );
}

export default VerifyEmail;
