import React, { useState } from 'react'; // useState importado
import './App.css';
import ButtonComponent from './ButtonComponent'; // Importa el componente
import CounterComponent from './CounterComponent'; // Importa el componente del contador
import DynamicList from './DynamicList'; // Importa el componente de lista dinámica
import logo from './logo.svg';

function App() {
  const [inputValue, setInputValue] = useState(''); // useState para el valor del input
  const [submittedValue, setSubmittedValue] = useState(''); // useState para el valor enviado

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedValue(inputValue);
    setInputValue(''); // Limpiar el campo después de enviar
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Bienvenido a mi App</h1>
        <p className="app-description">
          Edita <code>src/App.js</code> y guarda para recargar.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Aprende React
        </a>

        <div className="form-container">
          <h2>Formulario de prueba</h2>
          <form onSubmit={handleSubmit} className="input-form">
            <label htmlFor="input-text">Ingresa un texto:</label>
            <input
              className="input-field"
              type="text"
              id="input-text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe algo aquí..."
            />
            <button type="submit" className="submit-button" disabled={!inputValue}>Enviar</button>
          </form>
          {submittedValue && (
            <p className="submitted-text">Texto enviado: {submittedValue}</p>
          )}
        </div>

        <div className="components-section">
          <ButtonComponent /> {/* Botón importado */}
          <CounterComponent /> {/* Contador importado */}
          <DynamicList /> {/* Lista dinámica importada */}
        </div>
      </header>
    </div>
  );
}

export default App;
