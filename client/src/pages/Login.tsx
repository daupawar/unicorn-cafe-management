import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axiosInstance.post('https://unicorn-cafe-management.onrender.com/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      // Redirect based on role
      if (res.data.role === 'manager') {
        navigate('/dashboard');
      } else if (res.data.role === 'staff') {
        navigate('/dashboard'); // or another route for staff
      }
    } catch {
      setError('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Login</h2>
      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
        style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }}
      />
      <button type="submit" style={{ width: '100%', padding: 10 }}>Login</button>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </form>
  );
};

export default Login;