// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu';
import WalletComponent from './components/WalletComponent'; // Importa tu componente de la wallet
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';

function App() {
  return (
    <div className='container'>
      <Router>
        {/* El componente Menu ahora manejará la navegación */}
        <Menu />
        
        {/* Rutas para la navegación */}
        <Routes>
          {/* Ruta principal o cualquier otra que tengas */}
          <Route path="/" element={<Home />} />
          
          {/* Ruta para la Wallet */}
          <Route path="/wallet" element={<WalletComponent />} />
          
          {/* Otras rutas que puedas tener */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
