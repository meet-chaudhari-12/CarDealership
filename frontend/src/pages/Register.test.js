import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';
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

describe('Register Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all elements correctly', () => {
    renderWithRouter(<Register />);
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('displays error when passwords do not match', async () => {
    renderWithRouter(<Register />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'different' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  test('submits successfully and redirects to login', async () => {
    api.post.mockResolvedValueOnce({ data: {} });
    jest.useFakeTimers();

    renderWithRouter(<Register />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Button should be disabled and change text
    expect(screen.getByRole('button', { name: /registering\.\.\./i })).toBeDisabled();

    // Wait for the api call to be resolved and DOM to update
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(screen.getByText(/registration successful! redirecting to login\.\.\./i)).toBeInTheDocument();
    });

    // Fast-forward 1 second
    jest.advanceTimersByTime(1000);

    expect(mockNavigate).toHaveBeenCalledWith('/');

    jest.useRealTimers();
  });

  test('displays backend error message on failure', async () => {
    const errorMessage = 'Email already in use';
    api.post.mockRejectedValueOnce({
      response: {
        data: { message: errorMessage }
      }
    });

    renderWithRouter(<Register />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Button should be enabled back on failure
    expect(screen.getByRole('button', { name: /register/i })).not.toBeDisabled();
  });

  test('displays generic error message on default failure', async () => {
    api.post.mockRejectedValueOnce(new Error('Network Error'));

    renderWithRouter(<Register />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/registration failed\. please try again\./i)).toBeInTheDocument();
    });
  });
});

