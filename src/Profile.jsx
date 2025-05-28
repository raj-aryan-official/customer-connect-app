import React, { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { updateProfile, changePassword } from './services/userService';
import './Register.css';

function Profile() {
  const { user, logout, login } = useContext(AuthContext);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProfile = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const data = await updateProfile({ name: form.name });
      setSuccess('Profile updated!');
      // Optionally update context user
      login({ ...user, name: form.name }, localStorage.getItem('token'));
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePassword = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirm) {
      setError('Passwords do not match!');
      return;
    }
    try {
      await changePassword({ password, newPassword });
      setSuccess('Password changed!');
      setPassword('');
      setNewPassword('');
      setConfirm('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-root">
      <form className="register-card" onSubmit={handleProfile}>
        <div className="register-title">Profile</div>
        <div className="register-form">
          <input name="name" value={form.name} onChange={handleChange} className="register-input" placeholder="Name" required />
          <input name="email" value={form.email} className="register-input" placeholder="Email" required disabled />
          <button className="register-btn" type="submit">Update Profile</button>
        </div>
      </form>
      <form className="register-card" onSubmit={handlePassword} style={{marginTop:24}}>
        <div className="register-title">Change Password</div>
        <div className="register-form">
          <input type="password" className="register-input" placeholder="Current password" value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="password" className="register-input" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          <input type="password" className="register-input" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          <button className="register-btn" type="submit">Change Password</button>
        </div>
      </form>
      {(error || success) && (
        <div className="register-link" style={{color: error ? 'red' : 'green', marginTop: 16}}>
          {error || success}
        </div>
      )}
      <button className="btn-outline" style={{marginTop:32}} onClick={logout}>Logout</button>
    </div>
  );
}

export default Profile;