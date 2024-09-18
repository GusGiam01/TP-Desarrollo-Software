import { render, screen } from '@testing-library/react';
import App from './App';


//1. Verifica si el texto "learn react" está presente
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});


//2. Verifica si el logo de React está presente
test('renders React logo', () => {
  render(<App />);
  const logo = screen.getByAltText(/logo/i);
  expect(logo).toBeInTheDocument();
});

//3. Verifica que un enlace abre una nueva ventana
test('renders a link to React documentation with target _blank', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toHaveAttribute('target', '_blank');
});

//4. Verifica que el enlace tiene el href correcto
test('renders a link with the correct href', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toHaveAttribute('href', 'https://reactjs.org');
});

