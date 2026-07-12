import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VehicleCard from './VehicleCard';

const dummyVehicle = {
  id: 1,
  make: 'Toyota',
  model: 'Camry',
  year: 2022,
  price: 1800000,
  status: 'Available'
};

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('VehicleCard Component', () => {
  test('displays all vehicle information correctly', () => {
    renderWithRouter(<VehicleCard vehicle={dummyVehicle} />);

    // 1. Displays make and model
    expect(screen.getByRole('heading', { name: /toyota camry/i })).toBeInTheDocument();

    // 2. Displays year
    expect(screen.getByText(/year: 2022/i)).toBeInTheDocument();

    // 3. Displays formatted price
    expect(screen.getByText(/₹18,00,000/i)).toBeInTheDocument();

    // 4. Displays status badge
    const badge = screen.getByText(/available/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('status-badge', 'available');

    // 5. Renders Edit button
    const editButton = screen.getByRole('link', { name: /edit/i });
    expect(editButton).toBeInTheDocument();

    // 6. Renders View button
    const viewButton = screen.getByRole('button', { name: /view/i });
    expect(viewButton).toBeInTheDocument();
  });

  test('clicking View should call console.log()', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    renderWithRouter(<VehicleCard vehicle={dummyVehicle} />);

    const viewButton = screen.getByRole('button', { name: /view/i });
    fireEvent.click(viewButton);

    expect(consoleSpy).toHaveBeenCalledWith(dummyVehicle);
    consoleSpy.mockRestore();
  });

  test('Edit button should render the correct navigation link', () => {
    renderWithRouter(<VehicleCard vehicle={dummyVehicle} />);

    const editButton = screen.getByRole('link', { name: /edit/i });
    expect(editButton).toHaveAttribute('href', '/edit-vehicle/1');
  });
});
