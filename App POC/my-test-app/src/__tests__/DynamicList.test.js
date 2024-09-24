import { render, fireEvent, screen,cleanup } from '@testing-library/react';
import DynamicList from '../DynamicList';

// Limpia el DOM después de cada test
afterEach(() => {
    cleanup();
  });

describe('DynamicList Component', () => {
  test('renders input and button', () => {
    render(<DynamicList />);
    expect(screen.getByPlaceholderText(/agregar un nuevo item/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /agregar/i })).toBeInTheDocument();
  });

  test('adds item to the list', () => {
    render(<DynamicList />);
    fireEvent.change(screen.getByPlaceholderText(/agregar un nuevo item/i), { target: { value: 'Item 1' } });
    fireEvent.click(screen.getByRole('button', { name: /agregar/i }));
    expect(screen.getByText(/item 1/i)).toBeInTheDocument();
  });

  test('removes item from the list', () => {
    render(<DynamicList />);
    fireEvent.change(screen.getByPlaceholderText(/agregar un nuevo item/i), { target: { value: 'Item 1' } });
    fireEvent.click(screen.getByRole('button', { name: /agregar/i }));
    fireEvent.click(screen.getByRole('button', { name: /eliminar/i }));
    expect(screen.queryByText(/item 1/i)).not.toBeInTheDocument();
  });
});