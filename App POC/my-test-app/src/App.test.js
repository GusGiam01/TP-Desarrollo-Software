import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import App from './App';

// Limpia el DOM después de cada test
afterEach(() => {
  cleanup();
});

//1. Verificar si el texto "Bienvenido a mi App" está presente
test('renders Bienvenido a mi App link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Bienvenido a mi App/i);
  expect(linkElement).toBeInTheDocument();
});

//2. Verificar si el logo de React está presente
test('renders React logo', () => {
    render(<App />);
    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
  });

//3. Verificar que un enlace abre una nueva ventana
test('renders a link to React documentation with target _blank', () => {
    render(<App />);
    const linkElement = screen.getByText(/Aprende React/i);
    expect(linkElement).toHaveAttribute('target', '_blank');
  });

//4. Verificar que el enlace tiene el href correcto
test('renders a link with the correct href', () => {
    render(<App />);
    const linkElement = screen.getByText(/Aprende React/i);
    expect(linkElement).toHaveAttribute('href', 'https://reactjs.org');
  });

//5. Verificar que el componente se renderiza correctamente
  test('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

//6. Pruebas de Atributos y Clases de CSS
  test('renders the logo with the correct class', () => {
    render(<App />);
    const logo = screen.getByAltText('logo');
    expect(logo).toHaveClass('App-logo');
  });

  //7. Verificar que el campo de texto se actualiza cuando el usuario escribe
  test('actualiza el campo de texto cuando el usuario escribe', () => {
    render(<App />);
    
    const input = screen.getByLabelText(/ingresa un texto/i);
    
    // Simular que el usuario escribe en el campo de texto
    fireEvent.change(input, { target: { value: 'Hola Mundo' } });
    
  // Verificar que el valor del input se ha actualizado
    expect(input.value).toBe('Hola Mundo');
  });
  
  //8. Verificar que el texto enviado se muestra después de hacer clic en "Enviar".
  test('muestra el texto enviado cuando se hace clic en "Enviar"', () => {
    render(<App />);
    
    const input = screen.getByLabelText(/ingresa un texto/i);
    const submitButton = screen.getByText(/enviar/i);
    
    // Simular que el usuario escribe y hace clic en enviar
    fireEvent.change(input, { target: { value: 'Prueba de formulario' } });
    fireEvent.click(submitButton);
    
    // Verificar que el texto enviado aparece en la interfaz
    expect(screen.getByText(/texto enviado: prueba de formulario/i)).toBeInTheDocument();
  });


  //9. Verifica que al enviar el formulario con el campo vacío no ocurra ningún error.
  test('submitting empty form does not crash', () => {
    render(<App />);
    fireEvent.submit(screen.getByRole('button', { name: /enviar/i }));
    expect(screen.getByText(/ingresa un texto/i)).toBeInTheDocument();
  });

  //10. Verifica que el botón esté deshabilitado si no hay texto en el input.
  test('button is disabled when input is empty', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /enviar/i });
    expect(button).toBeDisabled();
  });