// Profile.jsx - User profile management (update info, change password)
import React, { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import toast from 'react-hot-toast';
import './Register.css';
import { updateProfile, changePassword } from './services/userService';

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProfile = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(form);
      if (res && res.message && res.message.toLowerCase().includes('updated')) {
        toast.success('Profile updated!');
      } else {
        toast.error(res.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    }
    setLoading(false);
  };

  const handlePassword = async e => {
    e.preventDefault();
    if (newPassword !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await changePassword({ password, newPassword });
      if (res && res.message && res.message.toLowerCase().includes('changed')) {
        toast.success('Password changed!');
        setPassword(''); setNewPassword(''); setConfirm('');
      } else {
        toast.error(res.message || 'Failed to change password');
      }
    } catch (err) {
      toast.error('Failed to change password');
    }
    setLoading(false);
  };

  return (
    <div className="register-root">
      <form className="register-card" onSubmit={handleProfile}>
        <div className="register-title">Profile</div>
        <div className="register-form">
          <input name="name" value={form.name} onChange={handleChange} className="register-input" placeholder="Name" required />
          <input name="email" value={form.email} onChange={handleChange} className="register-input" placeholder="Email" required disabled />
          <button className="register-btn" type="submit" disabled={loading}>Update Profile</button>
        </div>
      </form>
      <form className="register-card" onSubmit={handlePassword} style={{marginTop:24}}>
        <div className="register-title">Change Password</div>
        <div className="register-form">
          <input type="password" className="register-input" placeholder="Current password" value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="password" className="register-input" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          <input type="password" className="register-input" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          <button className="register-btn" type="submit" disabled={loading}>Change Password</button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
