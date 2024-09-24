import React, { useState } from 'react';

function DynamicList() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = (event) => {
    event.preventDefault();
    if (inputValue.trim()) {
      setItems([...items, inputValue]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <div>
      <h2>Lista Dinámica</h2>
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Agregar un nuevo item"
        />
        <button type="submit">Agregar</button>
      </form>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => handleRemoveItem(index)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DynamicList;