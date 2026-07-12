import React from 'react';
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  const { id, make, model, category, year, price, quantity } = vehicle;

  const handleView = () => {
    console.log(vehicle);
  };

  const availability = quantity > 0 ? "Available" : "Out of Stock";

  return (
    <article className="vehicle-card">
      <div>
        <div className="vehicle-card-header">
          <h3 className="vehicle-title">
            {make} {model}
          </h3>

          <span
            className={`status-badge ${quantity > 0 ? "available" : "sold"
              }`}
          >
            {availability}
          </span>
        </div>

        <div className="vehicle-card-details">
          <p>Category: {category}</p>
          <p>Year: {year}</p>
          <p>Stock: {quantity}</p>
          <p className="vehicle-price">
            ₹{Number(price).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="vehicle-card-actions">
        <Link to={`/edit-vehicle/${id}`} className="btn btn-edit">
          Edit
        </Link>

        <button onClick={handleView} className="btn btn-view">
          View
        </button>
      </div>
    </article>
  );
};

export default VehicleCard;