import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

describe('App Routing and Protection', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders App and login heading at root', () => {
    render(<App />);
    const headingElement = screen.getByRole('heading', { name: /car dealership inventory/i });
    expect(headingElement).toBeInTheDocument();
  });

  test('redirects non-ADMIN users from /add-vehicle to /dashboard', async () => {
    localStorage.setItem('role', 'USER');
    localStorage.setItem('token', 'mock-token');
    
    // Set route path using window.history
    window.history.pushState({}, 'Add Vehicle Page', '/add-vehicle');
    
    render(<App />);
    
    // Should render Dashboard or redirect to /dashboard
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });
  });

  test('redirects non-ADMIN users from /edit-vehicle/1 to /dashboard', async () => {
    localStorage.setItem('role', 'USER');
    localStorage.setItem('token', 'mock-token');
    
    window.history.pushState({}, 'Edit Vehicle Page', '/edit-vehicle/1');
    
    render(<App />);
    
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });
  });
});
