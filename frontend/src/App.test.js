import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App and login heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /car dealership inventory/i });
  expect(headingElement).toBeInTheDocument();
});

