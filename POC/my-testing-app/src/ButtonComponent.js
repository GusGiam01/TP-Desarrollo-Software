import React, { useState } from 'react';

function ButtonComponent() {
  const [text, setText] = useState('Hazme clic');

  const handleClick = () => {
    setText('Has hecho clic!');
  };

  return <button onClick={handleClick}>{text}</button>;
}

export default ButtonComponent;