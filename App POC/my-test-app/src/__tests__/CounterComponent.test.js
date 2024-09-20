import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import CounterComponent from '../CounterComponent';

// Limpia el DOM después de cada test
afterEach(() => {
  cleanup();
});

//2. Comprobación de estados iniciales y finales
//Vamos a crear un componente de contador que cambie el estado al hacer clic en un botón.

test('should start with count 0 and increment the count when button is clicked', () => {
  render(<CounterComponent />);

  // Verificar el estado inicial
  const countText = screen.getByText(/count: 0/i);
  expect(countText).toBeInTheDocument();

  // Hacer clic en el botón para incrementar
  const button = screen.getByRole('button', { name: /increment/i });
  fireEvent.click(button);

  // Verificar que el contador ha incrementado
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
