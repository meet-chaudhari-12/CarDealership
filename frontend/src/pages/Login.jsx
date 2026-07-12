import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
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

          <button className="auth-button" type="submit">Login</button>
        </form>

        <footer className="auth-footer">
          <span>Don't have an account?</span>
          <Link className="auth-link" to="/register">Register</Link>
        </footer>
      </section>
    </main>
  );
};

export default Login;

