import { render, fireEvent, screen } from '@testing-library/react';
import ButtonComponent from '../ButtonComponent';

// 5. Simulación de interacción: cambiar el texto del botón (componente personalizado)
test('button changes text when clicked', () => {
  render(<ButtonComponent />);
  const button = screen.getByText('Click me');
  fireEvent.click(button);
  expect(button).toHaveTextContent('You clicked me!');
});