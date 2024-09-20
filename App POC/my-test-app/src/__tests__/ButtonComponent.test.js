import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import ButtonComponent from '../ButtonComponent';

// Limpia el DOM después de cada test
afterEach(() => {
  cleanup();
});

test('button changes text when clicked', () => {
  render(<ButtonComponent />);
  const button = screen.getByText('Click me');
  fireEvent.click(button);
  expect(button).toHaveTextContent('You clicked me!');
});