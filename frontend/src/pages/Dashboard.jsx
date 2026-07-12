import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import '../styles/dashboard.css';

const dummyVehicles = [
  { id: 1, make: 'Toyota', model: 'Camry', year: 2022, price: 1800000, status: 'Available' },
  { id: 2, make: 'Honda', model: 'City', year: 2021, price: 1250000, status: 'Sold' },
  { id: 3, make: 'Hyundai', model: 'Creta', year: 2023, price: 1550000, status: 'Available' },
  { id: 4, make: 'Tata', model: 'Nexon', year: 2022, price: 950000, status: 'Available' },
  { id: 5, make: 'Mahindra', model: 'Thar', year: 2023, price: 1600000, status: 'Sold' },
  { id: 6, make: 'Maruti Suzuki', model: 'Swift', year: 2020, price: 650000, status: 'Available' }
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

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

      {dummyVehicles.length === 0 ? (
        <p className="empty-state">No vehicles found.</p>
      ) : (
        <section className="vehicle-grid">
          {dummyVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </section>
      )}
    </main>
  );
};

export default Dashboard;

