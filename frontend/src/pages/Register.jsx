import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/auth.css';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', { name: fullName, email, password });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setLoading(false);
      const backendMessage = err.response?.data?.message || err.response?.data;
      setError(typeof backendMessage === 'string' ? backendMessage : 'Registration failed. Please try again.');
    }
  };

  return (
    <main className="auth-container">
      <section className="auth-card">
        <header className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Register to continue</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="fullName">Full Name</label>
            <input
              className="auth-input"
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              className="auth-input"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {error && <div className="auth-error-message" role="alert">{error}</div>}
        {success && <div className="auth-success-message" role="alert">{success}</div>}

        <footer className="auth-footer">
          <span>Already have an account?</span>
          <Link className="auth-link" to="/">Login</Link>
        </footer>
      </section>
    </main>
  );
};

export default Register;


