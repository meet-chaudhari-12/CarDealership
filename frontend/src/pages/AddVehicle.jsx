import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/auth.css'; // Reuse form card styling

const AddVehicle = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/vehicles', {
        make,
        model,
        category,
        year: parseInt(year, 10),
        price: parseFloat(price),
        quantity: parseInt(quantity, 10)
      });

      setSuccess('Vehicle added successfully.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setLoading(false);
      const backendMessage = err.response?.data?.message || err.response?.data;
      setError(typeof backendMessage === 'string' ? backendMessage : 'Failed to add vehicle.');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <main className="auth-container">
      <section className="auth-card">
        <header className="auth-header">
          <h1 className="auth-title">Add New Vehicle</h1>
          <p className="auth-subtitle">Enter details to add a new vehicle to inventory</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="make">Make</label>
            <input
              className="auth-input"
              type="text"
              id="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="model">Model</label>
            <input
              className="auth-input"
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="category">Category</label>
            <input
              className="auth-input"
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="year">Year</label>
            <input
              className="auth-input"
              type="number"
              id="year"
              min="1886"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="price">Price</label>
            <input
              className="auth-input"
              type="number"
              id="price"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="quantity">Quantity</label>
            <input
              className="auth-input"
              type="number"
              id="quantity"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
          </button>
          
          <button 
            className="auth-button" 
            type="button" 
            onClick={handleCancel}
            style={{ backgroundColor: '#6c757d', marginTop: '10px' }}
            disabled={loading}
          >
            Cancel
          </button>
        </form>

        {error && <div className="auth-error-message" role="alert">{error}</div>}
        {success && <div className="auth-success-message" role="alert">{success}</div>}
      </section>
    </main>
  );
};

export default AddVehicle;

