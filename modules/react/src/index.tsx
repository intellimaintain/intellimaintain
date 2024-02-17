import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return <h1>Hello World!</h1>;
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
