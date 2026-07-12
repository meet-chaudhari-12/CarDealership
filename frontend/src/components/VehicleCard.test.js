import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VehicleCard from './VehicleCard';
import api from '../services/api';

jest.mock('../services/api');

const dummyVehicle = {
  id: "1",
  make: "Toyota",
  model: "Camry",
  category: "Sedan",
  year: 2022,
  price: 1800000,
  quantity: 5
};

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('VehicleCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('role', 'ADMIN');
  });

  test('displays all vehicle information correctly', () => {
    renderWithRouter(<VehicleCard vehicle={dummyVehicle} />);

    expect(screen.getByRole('heading', { name: /toyota camry/i })).toBeInTheDocument();
    expect(screen.getByText(/category: sedan/i)).toBeInTheDocument();
    expect(screen.getByText(/year: 2022/i)).toBeInTheDocument();
    expect(screen.getByText(/stock: 5/i)).toBeInTheDocument();
    expect(screen.getByText(/₹18,00,000/i)).toBeInTheDocument();

    const badge = screen.getByText(/available/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('status-badge', 'available');

    expect(screen.getByRole('link', { name: /edit/i })).toHaveAttribute('href', '/edit-vehicle/1');
    
    // Purchase button renders
    expect(screen.getByRole('button', { name: /^purchase$/i })).toBeInTheDocument();
  });


  test('handles successful purchase request and triggers callback', async () => {
    api.post.mockResolvedValueOnce({ data: {} });
    const onPurchaseSuccessMock = jest.fn();

    renderWithRouter(<VehicleCard vehicle={dummyVehicle} onPurchaseSuccess={onPurchaseSuccessMock} />);

    const purchaseButton = screen.getByRole('button', { name: /^purchase$/i });
    fireEvent.click(purchaseButton);

    expect(purchaseButton).toBeDisabled();
    expect(screen.getByRole('button', { name: /purchasing\.\.\./i })).toBeInTheDocument();

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/vehicles/1/purchase');
      expect(screen.getByText(/purchase successful!/i)).toBeInTheDocument();
    });

    expect(onPurchaseSuccessMock).toHaveBeenCalled();
  });

  test('handles failed purchase request correctly', async () => {
    const errorMessage = 'Insufficient stock';
    api.post.mockRejectedValueOnce({
      response: {
        data: { message: errorMessage }
      }
    });

    renderWithRouter(<VehicleCard vehicle={dummyVehicle} />);

    fireEvent.click(screen.getByRole('button', { name: /^purchase$/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /^purchase$/i })).not.toBeDisabled();
  });

  test('disables purchase button and displays Out of Stock when quantity is 0', () => {
    const outOfStockVehicle = { ...dummyVehicle, quantity: 0 };
    renderWithRouter(<VehicleCard vehicle={outOfStockVehicle} />);

    const badge = screen.getByText(/out of stock/i, { selector: 'span' });
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('status-badge', 'sold');

    const purchaseButton = screen.getByRole('button', { name: /out of stock/i });
    expect(purchaseButton).toBeDisabled();
  });

  test('handles vehicle delete confirmation and request', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    api.delete.mockResolvedValueOnce({ data: {} });
    const onPurchaseSuccessMock = jest.fn();

    renderWithRouter(<VehicleCard vehicle={dummyVehicle} onPurchaseSuccess={onPurchaseSuccessMock} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this Toyota Camry?');
    
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/vehicles/1');
      expect(screen.getByText(/vehicle deleted successfully\./i)).toBeInTheDocument();
    });

    expect(onPurchaseSuccessMock).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  test('handles vehicle restock prompt and request', async () => {
    const promptSpy = jest.spyOn(window, 'prompt').mockReturnValue('10');
    api.post.mockResolvedValueOnce({ data: {} });
    const onPurchaseSuccessMock = jest.fn();

    renderWithRouter(<VehicleCard vehicle={dummyVehicle} onPurchaseSuccess={onPurchaseSuccessMock} />);

    const restockButton = screen.getByRole('button', { name: /restock/i });
    fireEvent.click(restockButton);

    expect(promptSpy).toHaveBeenCalledWith('Enter restock quantity:');

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/vehicles/1/restock', { quantity: 10 });
      expect(screen.getByText(/vehicle restocked successfully!/i)).toBeInTheDocument();
    });

    expect(onPurchaseSuccessMock).toHaveBeenCalled();
    promptSpy.mockRestore();
  });
});