import React, { useState } from 'react';

function ButtonComponent() {
  const [text, setText] = useState('Click me');

  const handleClick = () => {
    setText('You clicked me!');
  };

  return <button onClick={handleClick}>{text}</button>;
}

export default ButtonComponent;