import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import api from '../services/api';

jest.mock('../services/api');

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

const mockVehicles = [
  { id: 1, make: 'Toyota', model: 'Camry', year: 2022, price: 1800000, status: 'Available' },
  { id: 2, make: 'Honda', model: 'City', year: 2021, price: 1250000, status: 'Sold' },
];

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all dashboard header and action bar elements', async () => {
    api.get.mockResolvedValueOnce({ data: mockVehicles });
    renderWithRouter(<Dashboard />);

    expect(screen.getByRole('heading', { name: /vehicle inventory/i })).toBeInTheDocument();
    expect(screen.getByText(/manage your dealership inventory/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search by make or model/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /add vehicle/i })).toHaveAttribute('href', '/add-vehicle');

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/vehicles');
    });
  });

  test('displays loading state while fetching vehicles', () => {
    // Return a promise that does not resolve immediately
    api.get.mockReturnValueOnce(new Promise(() => {}));
    renderWithRouter(<Dashboard />);

    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
  });

  test('renders vehicle cards on successful API response', async () => {
    api.get.mockResolvedValueOnce({ data: mockVehicles });
    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      const vehicleCards = screen.getAllByRole('article');
      expect(vehicleCards).toHaveLength(2);
      expect(screen.getByRole('heading', { name: /toyota camry/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /honda city/i })).toBeInTheDocument();
    });
  });

  test('displays empty message on empty API response', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/no vehicles found\./i)).toBeInTheDocument();
    });
  });

  test('displays error message on failed API response', async () => {
    api.get.mockRejectedValueOnce(new Error('Fetch failed'));
    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/unable to load vehicles\./i)).toBeInTheDocument();
    });
  });
});

