import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EditVehicle from './EditVehicle';
import api from '../services/api';

jest.mock('../services/api');

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

// Mock useParams to return a specific ID
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '123' }),
  useNavigate: () => mockNavigate,
}));

const mockNavigate = jest.fn();

const mockVehicle = {
  id: '123',
  make: 'Honda',
  model: 'Civic',
  category: 'Sedan',
  year: 2021,
  price: 1500000,
  quantity: 3
};

describe('EditVehicle Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially and pre-fills form on success', async () => {
    // API mock returns the mock vehicle
    api.get.mockResolvedValueOnce({ data: mockVehicle });

    renderWithRouter(<EditVehicle />);

    // 1. Loading vehicle data displayed
    expect(screen.getByText(/loading vehicle data\.\.\./i)).toBeInTheDocument();

    // Wait for API to resolve and load data
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/vehicles/123');
      expect(screen.getByLabelText(/make/i).value).toBe('Honda');
      expect(screen.getByLabelText(/model/i).value).toBe('Civic');
      expect(screen.getByLabelText(/category/i).value).toBe('Sedan');
      expect(screen.getByLabelText(/year/i).value).toBe('2021');
      expect(screen.getByLabelText(/price/i).value).toBe('1500000');
      expect(screen.getByLabelText(/quantity/i).value).toBe('3');
    });
  });

  test('handles fetch failure correctly', async () => {
    api.get.mockRejectedValueOnce(new Error('Fetch failed'));

    renderWithRouter(<EditVehicle />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load vehicle data\./i)).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: /back to dashboard/i });
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('submits updated values successfully and redirects', async () => {
    api.get.mockResolvedValueOnce({ data: mockVehicle });
    api.put.mockResolvedValueOnce({ data: {} });
    jest.useFakeTimers();

    renderWithRouter(<EditVehicle />);

    // Wait for data load
    await waitFor(() => {
      expect(screen.getByLabelText(/make/i).value).toBe('Honda');
    });

    // Change some values
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '1450000' } });
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '2' } });

    fireEvent.click(screen.getByRole('button', { name: /^update vehicle$/i }));

    // Button should be disabled and show loading text
    expect(screen.getByRole('button', { name: /updating vehicle\.\.\./i })).toBeDisabled();

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/vehicles/123', {
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        year: 2021,
        price: 1450000,
        quantity: 2
      });
      expect(screen.getByText(/vehicle updated successfully\./i)).toBeInTheDocument();
    });

    jest.advanceTimersByTime(1000);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');

    jest.useRealTimers();
  });

  test('displays backend error message on update failure', async () => {
    api.get.mockResolvedValueOnce({ data: mockVehicle });
    
    const errorMessage = 'Quantity cannot be negative';
    api.put.mockRejectedValueOnce({
      response: {
        data: { message: errorMessage }
      }
    });

    renderWithRouter(<EditVehicle />);

    await waitFor(() => {
      expect(screen.getByLabelText(/make/i).value).toBe('Honda');
    });

    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '-1' } });
    fireEvent.click(screen.getByRole('button', { name: /^update vehicle$/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /^update vehicle$/i })).not.toBeDisabled();
  });

  test('displays generic error message on default update failure', async () => {
    api.get.mockResolvedValueOnce({ data: mockVehicle });
    api.put.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(<EditVehicle />);

    await waitFor(() => {
      expect(screen.getByLabelText(/make/i).value).toBe('Honda');
    });

    fireEvent.click(screen.getByRole('button', { name: /^update vehicle$/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to update vehicle\./i)).toBeInTheDocument();
    });
  });

  test('cancel button returns to dashboard', async () => {
    api.get.mockResolvedValueOnce({ data: mockVehicle });

    renderWithRouter(<EditVehicle />);

    await waitFor(() => {
      expect(screen.getByLabelText(/make/i).value).toBe('Honda');
    });

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
