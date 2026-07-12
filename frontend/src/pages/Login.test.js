import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
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

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders all elements correctly', () => {
    renderWithRouter(<Login />);
    expect(screen.getByRole('heading', { name: /car dealership inventory/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('allows typing into email and password fields', () => {
    renderWithRouter(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('user@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('submits successfully, stores token, and navigates to /dashboard', async () => {
    const mockToken = 'mock-jwt-token';
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
    api.post.mockResolvedValueOnce({
      data: {
        token: mockToken,
        user: mockUser
      }
    });

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    // Button should show loading state
    expect(screen.getByRole('button', { name: /logging in\.\.\./i })).toBeDisabled();

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'john@example.com',
        password: 'password123',
      });
    });

    // Check localStorage storage
    expect(localStorage.getItem('token')).toBe(mockToken);
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(mockUser);

    // Check navigation
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('displays backend error message on failure', async () => {
    const errorMessage = 'Bad credentials';
    api.post.mockRejectedValueOnce({
      response: {
        data: { message: errorMessage }
      }
    });

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong-pass' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Button should be enabled back
    expect(screen.getByRole('button', { name: /login/i })).not.toBeDisabled();
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('displays generic error message on default failure', async () => {
    api.post.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password\./i)).toBeInTheDocument();
    });
  });
});

