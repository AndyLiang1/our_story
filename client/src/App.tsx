import React from 'react';
import { HomePage } from './pages/HomePage';

function App() {
  const handleButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:3002/');
      const data = await response.json();
      console.log(data); // Handle the response data as needed
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      I love you
      <button onClick={handleButtonClick}>Hit Backend</button>
      <HomePage />
    </div>
  );
}

export default App;