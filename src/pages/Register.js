import React, { useState } from 'react'; 
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // ✅ CSS file linked

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', form); 
      alert('Registered! Now login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister} className="register-form">
        <input name="name" type="text" placeholder="Name" required value={form.name} onChange={handleChange} /> 
        <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" required value={form.password} onChange={handleChange} />
        <button type="submit">Register</button> 
      </form>
    </div>
  );
};

export default Register;
