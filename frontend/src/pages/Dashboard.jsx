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
  const role = localStorage.getItem("role");

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError('');
      let response;
      if (searchTerm.trim() === '') {
        response = await api.get('/vehicles');
      } else {
        response = await api.get(`/vehicles/search?keyword=${encodeURIComponent(searchTerm)}`);
      }
      setVehicles(response.data || []);
    } catch (err) {
      setError('Unable to load vehicles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchVehicles();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);



  const filteredVehicles = vehicles.filter((vehicle) => {
    if (filterStatus === 'Available') {
      return vehicle.quantity > 0;
    }
    if (filterStatus === 'Out of Stock' || filterStatus === 'Sold') {
      return vehicle.quantity === 0;
    }
    return true;
  });

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
          <option value="Out of Stock">Out of Stock</option>
        </select>
        {role === "ADMIN" && (
          <Link to="/add-vehicle" className="btn-add-vehicle">Add Vehicle</Link>
        )}
      </section>

      {loading ? (
        <p className="empty-state">{searchTerm.trim() !== '' ? 'Searching...' : 'Loading...'}</p>
      ) : error ? (
        <p className="empty-state">{error}</p>
      ) : filteredVehicles.length === 0 ? (
        <p className="empty-state">No vehicles found.</p>
      ) : (
        <section className="vehicle-grid">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard 
              key={vehicle.id} 
              vehicle={vehicle} 
              onPurchaseSuccess={fetchVehicles} 
            />
          ))}
        </section>
      )}
    </main>
  );
};

export default Dashboard;


