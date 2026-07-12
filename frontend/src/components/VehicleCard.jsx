import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const VehicleCard = ({ vehicle, onPurchaseSuccess }) => {
  const { id, make, model, category, year, price, quantity } = vehicle;

  const [purchasing, setPurchasing] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const role = localStorage.getItem("role");


  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this ${make} ${model}?`);
    if (!confirmDelete) return;

    setMessage('');
    setIsError(false);

    try {
      await api.delete(`/vehicles/${id}`);
      setMessage('Vehicle deleted successfully.');
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }
    } catch (err) {
      setIsError(true);
      const backendMessage = err.response?.data?.message || err.response?.data;
      setMessage(typeof backendMessage === 'string' ? backendMessage : 'Delete failed.');
    }
  };

  const handleRestock = async () => {
    const quantityStr = window.prompt('Enter restock quantity:');
    if (quantityStr === null) return;

    const enteredQuantity = Number(quantityStr);
    if (isNaN(enteredQuantity) || enteredQuantity < 0) {
      setIsError(true);
      setMessage('Please enter a valid positive number.');
      return;
    }

    setMessage('');
    setIsError(false);

    try {
      await api.post(`/vehicles/${id}/restock`, { quantity: enteredQuantity });
      setMessage('Vehicle restocked successfully!');
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }
    } catch (err) {
      setIsError(true);
      const backendMessage = err.response?.data?.message || err.response?.data;
      setMessage(typeof backendMessage === 'string' ? backendMessage : 'Restock failed.');
    }
  };

  const handlePurchase = async () => {
    setMessage('');
    setIsError(false);
    setPurchasing(true);

    try {
      await api.post(`/vehicles/${id}/purchase`);

      setMessage('Purchase successful!');

      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }
    } catch (err) {
      setIsError(true);

      const backendMessage =
        err.response?.data?.message || err.response?.data;

      setMessage(
        typeof backendMessage === 'string'
          ? backendMessage
          : 'Purchase failed.'
      );
    } finally {
      setPurchasing(false);
    }
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
            className={`status-badge ${
              quantity > 0 ? "available" : "sold"
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
        <div className="actions-row row-1">

          <button
            onClick={handlePurchase}
            disabled={purchasing || quantity <= 0}
            className="btn btn-purchase"
          >
            {purchasing
              ? "Purchasing..."
              : quantity <= 0
              ? "Out of Stock"
              : "Purchase"}
          </button>
        </div>

        {role === "ADMIN" && (
          <div className="actions-row row-2">
            <Link
              to={`/edit-vehicle/${id}`}
              className="btn btn-edit"
            >
              Edit
            </Link>

            <button
              onClick={handleRestock}
              className="btn btn-restock"
            >
              Restock
            </button>

            <button
              onClick={handleDelete}
              className="btn btn-delete"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {message && (
        <div
          className={`card-message ${
            isError ? "error" : "success"
          }`}
          role="alert"
        >
          {message}
        </div>
      )}

    </article>
  );
};

export default VehicleCard;