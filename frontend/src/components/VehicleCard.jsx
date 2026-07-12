import React from 'react';
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  const { id, make, model, year, price, status } = vehicle;

  const handleView = () => {
    console.log(vehicle);
  };

  return (
    <article className="vehicle-card">
      <div>
        <div className="vehicle-card-header">
          <h3 className="vehicle-title">{make} {model}</h3>
          <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
        </div>
        <div className="vehicle-card-details">
          <p className="vehicle-year">Year: {year}</p>
          <p className="vehicle-price">₹{price.toLocaleString('en-IN')}</p>
        </div>
      </div>
      <div className="vehicle-card-actions">
        <Link to={`/edit-vehicle/${id}`} className="btn btn-edit">Edit</Link>
        <button onClick={handleView} className="btn btn-view">View</button>
      </div>
    </article>
  );
};

export default VehicleCard;

