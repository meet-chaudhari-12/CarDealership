import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
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
    localStorage.setItem('role', 'ADMIN');
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

  test('refreshes the dashboard vehicle list after a successful purchase', async () => {
    // 1. Initial GET /vehicles resolves to the mockVehicles array
    api.get.mockResolvedValueOnce({ data: [
      { id: 1, make: 'Toyota', model: 'Camry', year: 2022, price: 1800000, category: 'Sedan', quantity: 5 },
      { id: 2, make: 'Honda', model: 'City', year: 2021, price: 1250000, category: 'Sedan', quantity: 0 },
    ] });
    
    // 2. Mock api.post for purchase to resolve successfully
    api.post.mockResolvedValueOnce({ data: {} });
    
    // 3. Second GET /vehicles (refresh) resolves to updated mockVehicles
    const updatedMockVehicles = [
      { id: 1, make: 'Toyota', model: 'Camry', year: 2022, price: 1800000, category: 'Sedan', quantity: 4 },
      { id: 2, make: 'Honda', model: 'City', year: 2021, price: 1250000, category: 'Sedan', quantity: 0 },
    ];
    api.get.mockResolvedValueOnce({ data: updatedMockVehicles });

    renderWithRouter(<Dashboard />);

    // Wait for the first fetch to load
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('heading', { name: /toyota camry/i })).toBeInTheDocument();
    });

    // Trigger purchase on the first card
    const purchaseButtons = screen.getAllByRole('button', { name: /^purchase$/i });
    fireEvent.click(purchaseButtons[0]);

    // Wait for the post to be resolved and the second fetch to be triggered
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/vehicles/1/purchase');
      expect(api.get).toHaveBeenCalledTimes(2);
    });

    // Verify the second fetch results are rendered
    await waitFor(() => {
      expect(screen.getByText(/stock: 4/i)).toBeInTheDocument();
    });
  });

  test('handles debounced vehicle search', async () => {
    // Initial fetch resolves to mockVehicles
    api.get.mockResolvedValueOnce({ data: mockVehicles });
    
    // Mock search API response
    const searchResults = [
      { id: 1, make: 'Toyota', model: 'Camry', year: 2022, price: 1800000, category: 'Sedan', quantity: 5 }
    ];
    api.get.mockResolvedValueOnce({ data: searchResults });

    jest.useFakeTimers();
    renderWithRouter(<Dashboard />);

    // Wait for initial fetch to resolve
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/vehicles');
    });

    // Type into the search input
    const searchInput = screen.getByPlaceholderText(/search by make or model/i);
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });

    // Displays "Searching..." immediately during debounce delay
    expect(screen.getByText(/searching\.\.\./i)).toBeInTheDocument();

    // Fast-forward 500ms debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Wait for the api call to be resolved
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/vehicles/search?keyword=Toyota');
      expect(screen.getByRole('heading', { name: /toyota camry/i })).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  test('refetches all vehicles if search input is cleared', async () => {
    api.get.mockResolvedValueOnce({ data: mockVehicles });
    
    jest.useFakeTimers();
    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/vehicles');
    });

    const searchInput = screen.getByPlaceholderText(/search by make or model/i);
    
    // Search for Toyota
    api.get.mockResolvedValueOnce({ data: [] });
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/vehicles/search?keyword=Toyota');
    });

    // Clear search
    api.get.mockResolvedValueOnce({ data: mockVehicles });
    fireEvent.change(searchInput, { target: { value: '' } });
    act(() => {
      jest.advanceTimersByTime(500);
    });
    await waitFor(() => {
      expect(api.get).toHaveBeenLastCalledWith('/vehicles');
    });

    jest.useRealTimers();
  });

  test('filters vehicles on the frontend based on selected status option', async () => {
    const mockVehiclesList = [
      { id: 1, make: 'Toyota', model: 'Camry', year: 2022, price: 1800000, category: 'Sedan', quantity: 5 },
      { id: 2, make: 'Honda', model: 'City', year: 2021, price: 1250000, category: 'Sedan', quantity: 0 },
    ];
    api.get.mockResolvedValueOnce({ data: mockVehiclesList });

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /toyota camry/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /honda city/i })).toBeInTheDocument();
    });

    const filterSelect = screen.getByRole('combobox');

    // 1. Select "Available"
    fireEvent.change(filterSelect, { target: { value: 'Available' } });
    expect(screen.getByRole('heading', { name: /toyota camry/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /honda city/i })).not.toBeInTheDocument();

    // 2. Select "Out of Stock"
    fireEvent.change(filterSelect, { target: { value: 'Out of Stock' } });
    expect(screen.queryByRole('heading', { name: /toyota camry/i })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /honda city/i })).toBeInTheDocument();

    // 3. Select "All"
    fireEvent.change(filterSelect, { target: { value: 'All' } });
    expect(screen.getByRole('heading', { name: /toyota camry/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /honda city/i })).toBeInTheDocument();
  });
});

