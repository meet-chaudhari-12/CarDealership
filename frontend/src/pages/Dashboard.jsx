import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import api from '../services/api';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/vehicles');
        setVehicles(response.data || []);
      } catch (err) {
        setError('Unable to load vehicles.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Vehicle Inventory</h1>
        <p className="dashboard-subtitle">Manage your dealership inventory</p>
      </header>

      <section className="action-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by make or model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>
        <Link to="/add-vehicle" className="btn-add-vehicle">Add Vehicle</Link>
      </section>

      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : error ? (
        <p className="empty-state">{error}</p>
      ) : vehicles.length === 0 ? (
        <p className="empty-state">No vehicles found.</p>
      ) : (
        <section className="vehicle-grid">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </section>
      )}
    </main>
  );
};

export default Dashboard;


