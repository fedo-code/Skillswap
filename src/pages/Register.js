import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axiosInstance';

const Register = () => {
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await axios.post('/auth/register', form);
      // log the new user in right away and send them to add their skills
      const res = await axios.post('/auth/login', { email: form.email, password: form.password });
      loginUser(res.data);
      navigate('/edit-profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-grid">
      <div className="auth-copy">
        <div className="eyebrow">Join SkillSwap</div>
        <h1>Trade what you know for what you <em>want.</em></h1>
        <p>Make an account, add your skills, and see who is a match.</p>
        <ul className="auth-points">
          <li><span>1</span> Sign up in a minute</li>
          <li><span>2</span> Add what you teach and want to learn</li>
          <li><span>3</span> Meet your matches</li>
        </ul>
      </div>
      <div className="card-app auth-card">
        <h2>Create account</h2>
        {error && <div className="alert-app alert-error">{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" className="input-app" name="name" required autoComplete="name"
              value={form.name} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" className="input-app" name="email" type="email" required
              autoComplete="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" className="input-app" name="password" type="password" required
              autoComplete="new-password" value={form.password} onChange={handleChange} />
            <div className="hint">At least 6 characters</div>
          </div>
          <button className="btn-app btn-primary-app btn-block" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="auth-foot">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
};

export default Register;
