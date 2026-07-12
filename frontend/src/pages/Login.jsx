import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      
      if (response.data?.role) {
        localStorage.setItem("role", response.data.role);
      }

      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      const backendMessage = err.response?.data?.message || err.response?.data;
      setError(typeof backendMessage === 'string' ? backendMessage : 'Invalid email or password.');
    }
  };

  return (
    <main className="auth-container">
      <section className="auth-card">
        <header className="auth-header">
          <h1 className="auth-title">Car Dealership Inventory</h1>
          <p className="auth-subtitle">Login to continue</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              className="auth-input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              className="auth-input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && <div className="auth-error-message" role="alert">{error}</div>}

        <footer className="auth-footer">
          <span>Don't have an account?</span>
          <Link className="auth-link" to="/register">Register</Link>
        </footer>
      </section>
    </main>
  );
};

export default Login;


