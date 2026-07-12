import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/auth.css'; // Reuse form card styling

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setFetchLoading(true);
        setFetchError('');
        const response = await api.get(`/vehicles/${id}`);
        const vehicle = response.data;
        if (vehicle) {
          setMake(vehicle.make || '');
          setModel(vehicle.model || '');
          setCategory(vehicle.category || '');
          setYear(vehicle.year || '');
          setPrice(vehicle.price || '');
          setQuantity(vehicle.quantity || '');
        }
      } catch (err) {
        setFetchError('Failed to load vehicle data.');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdateLoading(true);

    try {
      await api.put(`/vehicles/${id}`, {
        make,
        model,
        category,
        year: Number(year),
        price: Number(price),
        quantity: Number(quantity)
      });

      setSuccess('Vehicle updated successfully.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setUpdateLoading(false);
      const backendMessage = err.response?.data?.message || err.response?.data;
      setError(typeof backendMessage === 'string' ? backendMessage : 'Failed to update vehicle.');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (fetchLoading) {
    return (
      <main className="auth-container">
        <section className="auth-card">
          <p className="empty-state">Loading vehicle data...</p>
        </section>
      </main>
    );
  }

  if (fetchError) {
    return (
      <main className="auth-container">
        <section className="auth-card">
          <p className="empty-state">{fetchError}</p>
          <button 
            className="auth-button" 
            type="button" 
            onClick={handleCancel}
            style={{ backgroundColor: '#6c757d' }}
          >
            Back to Dashboard
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-container">
      <section className="auth-card">
        <header className="auth-header">
          <h1 className="auth-title">Edit Vehicle</h1>
          <p className="auth-subtitle">Modify details of the vehicle below</p>
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

          <button className="auth-button" type="submit" disabled={updateLoading}>
            {updateLoading ? 'Updating Vehicle...' : 'Update Vehicle'}
          </button>
          
          <button 
            className="auth-button" 
            type="button" 
            onClick={handleCancel}
            style={{ backgroundColor: '#6c757d', marginTop: '10px' }}
            disabled={updateLoading}
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

export default EditVehicle;

