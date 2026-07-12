import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ fullName, email, password, confirmPassword });
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

          <button className="auth-button" type="submit">Register</button>
        </form>

        <footer className="auth-footer">
          <span>Already have an account?</span>
          <Link className="auth-link" to="/">Login</Link>
        </footer>
      </section>
    </main>
  );
};

export default Register;

