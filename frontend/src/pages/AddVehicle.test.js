import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AddVehicle from './AddVehicle';
import api from '../services/api';

jest.mock('../services/api');

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

// Mock navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('AddVehicle Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form correctly with all fields and buttons', () => {
    renderWithRouter(<AddVehicle />);

    expect(screen.getByRole('heading', { name: /add new vehicle/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /^add vehicle$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('allows user to type into fields', () => {
    renderWithRouter(<AddVehicle />);

    const makeInput = screen.getByLabelText(/make/i);
    const modelInput = screen.getByLabelText(/model/i);
    const categoryInput = screen.getByLabelText(/category/i);
    const yearInput = screen.getByLabelText(/year/i);
    const priceInput = screen.getByLabelText(/price/i);
    const quantityInput = screen.getByLabelText(/quantity/i);

    fireEvent.change(makeInput, { target: { value: 'Toyota' } });
    fireEvent.change(modelInput, { target: { value: 'Camry' } });
    fireEvent.change(categoryInput, { target: { value: 'Sedan' } });
    fireEvent.change(yearInput, { target: { value: '2022' } });
    fireEvent.change(priceInput, { target: { value: '1800000.50' } });
    fireEvent.change(quantityInput, { target: { value: '5' } });

    expect(makeInput.value).toBe('Toyota');
    expect(modelInput.value).toBe('Camry');
    expect(categoryInput.value).toBe('Sedan');
    expect(yearInput.value).toBe('2022');
    expect(priceInput.value).toBe('1800000.50');
    expect(quantityInput.value).toBe('5');
  });

  test('submits form successfully and redirects to dashboard', async () => {
    api.post.mockResolvedValueOnce({ data: {} });
    jest.useFakeTimers();

    renderWithRouter(<AddVehicle />);

    fireEvent.change(screen.getByLabelText(/make/i), { target: { value: 'Toyota' } });
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: 'Camry' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Sedan' } });
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: '2022' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '1800000' } });
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '5' } });

    fireEvent.click(screen.getByRole('button', { name: /^add vehicle$/i }));

    // Button should show loading state
    expect(screen.getByRole('button', { name: /adding vehicle\.\.\./i })).toBeDisabled();

    // Wait for the api call to be resolved and message to be displayed
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/vehicles', {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        year: 2022,
        price: 1800000,
        quantity: 5
      });
      expect(screen.getByText(/vehicle added successfully\./i)).toBeInTheDocument();
    });

    // Fast-forward 1 second
    jest.advanceTimersByTime(1000);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');

    jest.useRealTimers();
  });

  test('displays backend error message on submission failure', async () => {
    const errorMessage = 'Invalid vehicle year';
    api.post.mockRejectedValueOnce({
      response: {
        data: { message: errorMessage }
      }
    });

    renderWithRouter(<AddVehicle />);

    fireEvent.change(screen.getByLabelText(/make/i), { target: { value: 'Toyota' } });
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: 'Camry' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Sedan' } });
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: '1800' } }); // invalid year
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '1800000' } });
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '5' } });

    fireEvent.click(screen.getByRole('button', { name: /^add vehicle$/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Button should be enabled back on failure
    expect(screen.getByRole('button', { name: /^add vehicle$/i })).not.toBeDisabled();
  });

  test('displays generic error message on default submission failure', async () => {
    api.post.mockRejectedValueOnce(new Error('Network Error'));

    renderWithRouter(<AddVehicle />);

    fireEvent.change(screen.getByLabelText(/make/i), { target: { value: 'Toyota' } });
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: 'Camry' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Sedan' } });
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: '2022' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '1800000' } });
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '5' } });

    fireEvent.click(screen.getByRole('button', { name: /^add vehicle$/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to add vehicle\./i)).toBeInTheDocument();
    });
  });

  test('cancel button redirects to dashboard', () => {
    renderWithRouter(<AddVehicle />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
