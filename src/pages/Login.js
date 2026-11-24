import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axiosInstance';

const Login = () => {
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', form);
      loginUser(res.data);
      // New users with no skills yet go straight to their profile to add some
      const u = res.data.user;
      const hasSkills = (u.skillsOffered?.length || 0) + (u.skillsWanted?.length || 0) > 0;
      navigate(hasSkills ? '/dashboard' : '/edit-profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-grid">
      <div className="auth-copy">
        <div className="eyebrow">Welcome back</div>
        <h1>Your next swap is <em>waiting.</em></h1>
        <p>Log in to see who matches your skills and pick up your conversations.</p>
      </div>
      <div className="card-app auth-card">
        <h2>Log in</h2>
        {error && <div className="alert-app alert-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" className="input-app" name="email" type="email" required
              autoComplete="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" className="input-app" name="password" type="password" required
              autoComplete="current-password" value={form.password} onChange={handleChange} />
          </div>
          <button className="btn-app btn-primary-app btn-block" disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        <p className="auth-foot">New here? <Link to="/register">Create an account</Link></p>
      </div>
    </div>
  );
};

export default Login;
