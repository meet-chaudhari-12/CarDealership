import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VehicleCard from './VehicleCard';

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

  test('displays all vehicle information correctly', () => {

    renderWithRouter(<VehicleCard vehicle={dummyVehicle} />);

    // Displays make and model
    expect(
      screen.getByRole('heading', { name: /toyota camry/i })
    ).toBeInTheDocument();

    // Displays category
    expect(
      screen.getByText(/category: sedan/i)
    ).toBeInTheDocument();

    // Displays year
    expect(
      screen.getByText(/year: 2022/i)
    ).toBeInTheDocument();

    // Displays stock
    expect(
      screen.getByText(/stock: 5/i)
    ).toBeInTheDocument();

    // Displays formatted price
    expect(
      screen.getByText(/₹18,00,000/i)
    ).toBeInTheDocument();

    // Displays availability badge
    const badge = screen.getByText(/available/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('status-badge', 'available');

    // Edit button
    const editButton = screen.getByRole('link', { name: /edit/i });
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveAttribute('href', '/edit-vehicle/1');

    // View button
    expect(
      screen.getByRole('button', { name: /view/i })
    ).toBeInTheDocument();

  });

  test('clicking View should call console.log()', () => {

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    renderWithRouter(<VehicleCard vehicle={dummyVehicle} />);

    fireEvent.click(
      screen.getByRole('button', { name: /view/i })
    );

    expect(consoleSpy).toHaveBeenCalledWith(dummyVehicle);

    consoleSpy.mockRestore();

  });

  test('Edit button should render the correct navigation link', () => {

    renderWithRouter(<VehicleCard vehicle={dummyVehicle} />);

    expect(
      screen.getByRole('link', { name: /edit/i })
    ).toHaveAttribute('href', '/edit-vehicle/1');

  });

});