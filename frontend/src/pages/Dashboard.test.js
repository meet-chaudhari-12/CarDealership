import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('Dashboard Component', () => {
  test('renders all dashboard header and action bar elements', () => {
    renderWithRouter(<Dashboard />);

    // 1. Renders the page heading
    expect(screen.getByRole('heading', { name: /vehicle inventory/i })).toBeInTheDocument();

    // 2. Renders the subtitle
    expect(screen.getByText(/manage your dealership inventory/i)).toBeInTheDocument();

    // 3. Renders the search input
    const searchInput = screen.getByPlaceholderText(/search by make or model/i);
    expect(searchInput).toBeInTheDocument();

    // 4. Renders the filter dropdown
    const filterDropdown = screen.getByRole('combobox');
    expect(filterDropdown).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Available' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Sold' })).toBeInTheDocument();

    // 5. Renders the Add Vehicle button
    const addButton = screen.getByRole('link', { name: /add vehicle/i });
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveAttribute('href', '/add-vehicle');
  });

  test('renders exactly 6 vehicle cards from the dummy data', () => {
    renderWithRouter(<Dashboard />);

    // Each vehicle card contains an article element
    const vehicleCards = screen.getAllByRole('article');
    expect(vehicleCards).toHaveLength(6);
  });
});
