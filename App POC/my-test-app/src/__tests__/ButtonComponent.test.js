import { render, fireEvent, screen } from '@testing-library/react';
import ButtonComponent from '../ButtonComponent';

test('button changes text when clicked', () => {
  render(<ButtonComponent />);
  const button = screen.getByText('Click me');
  fireEvent.click(button);
  expect(button).toHaveTextContent('You clicked me!');
});