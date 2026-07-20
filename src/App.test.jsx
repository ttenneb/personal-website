import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home page', () => {
  window.history.pushState({}, '', '/');

  render(<App />);

  expect(screen.getByText(/Full-Stack Software Engineering & Mathematics/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Portfolio/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Contact/i })).toBeInTheDocument();
});
