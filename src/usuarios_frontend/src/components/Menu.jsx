// src/Menu.jsx
import React, { useEffect } from 'react';
import { Link, BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConnectButton, ConnectDialog, useConnect } from "@connect2ic/react";
import Home from "./Home";
import Users from "./Users";
import UserCreate from "./UserCreate";
import WalletComponent from "./WalletComponent"; // Importa el WalletComponent
import * as usuarios_backend from "declarations/usuarios_backend";
import { createClient } from "@connect2ic/core";
import { InternetIdentity } from "@connect2ic/core/providers/internet-identity";

// Función para detectar cuando un elemento está disponible en el DOM
function onElementAvailable(selector, callback) {
  const observer = new MutationObserver(mutations => {
    if (document.querySelector(selector)) {
      observer.disconnect();
      callback();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

const Menu = () => {
  const { principal, isConnected } = useConnect(); // Usamos solo principal e isConnected

  useEffect(() => {
    // Estilos personalizados cuando se detecta el botón de Internet Identity (ii-styles)
    onElementAvailable(".ii-styles", () => {
      const btn2 = Array.from(document.getElementsByClassName('ii-styles'));
      const custom_style = {
        "color": "red",
        "background-color": "blue",
        "padding": "3px",
        "margin-left": "4px"
      };
      Object.assign(btn2[0].style, custom_style);

      const texto = Array.from(document.getElementsByClassName('button-label'));
      if (texto[0]) texto[0].remove();  // Remover texto si existe

      const img = Array.from(document.getElementsByClassName('img-styles'));
      img[0].style.height = "25px";  // Ajustar altura de la imagen
    });

    // Estilos personalizados cuando se detecta el botón de conexión
    onElementAvailable(".connect-button", () => {
      const btn = Array.from(document.getElementsByClassName('connect-button'));
      const custom_style = {
        "background-color": "blue",
        "font-size": "17px",
      };
      Object.assign(btn[0].style, custom_style);

      // Cambiar texto según el estado de conexión
      if (btn[0].textContent === 'Connect' || btn[0].textContent === 'Conectar II')
        btn[0].textContent = 'Conectar II';
      else
        btn[0].textContent = 'Desconectar II';
    });
  }, [isConnected]);  // Ejecutar useEffect cuando cambie el estado de conexión

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        {isConnected && principal ? (
          <div className="container-fluid">
            <Link to='/' className="navbar-brand">Mercado</Link>
            <Link to='/nuevo-usuario' className="navbar-brand">Nuevo</Link>
            <Link to='/usuarios' className="navbar-brand" id="btnUserList">Usuarios</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#"></a>
                </li>
              </ul>

              <div className="d-flex ms-auto"> {/* Alinear los botones a la derecha */}
                <Link to='/wallet' className="btn btn-secondary me-2" id="btnWallet">Wallet</Link>
                <ConnectButton /> {/* Botón para conectar/desconectar */}
              </div>

              <ConnectDialog />
            </div>
          </div>
        ) : (
          <div className="container-fluid">
            <a className="navbar-brand" href="#">Mercado</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#"></a>
                </li>
              </ul>
              <ConnectButton /> {/* Botón de conexión cuando no está conectado */}
              <ConnectDialog />
            </div>
          </div>
        )}
      </nav>

      {/* Rutas del sistema */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/nuevo-usuario" element={<UserCreate />} />
        <Route path="/wallet" element={<WalletComponent />} /> {/* Ruta para la Wallet */}
      </Routes>
    </BrowserRouter>
  );
};

// Configuración del cliente de conexión para Internet Identity y otros canisters
const client = createClient({
  canisters: {
    usuarios_backend,
  },
  providers: [
    new InternetIdentity({ providerUrl: "http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/" })
  ],
  globalProviderConfig: {
    dev: true,  // Modo desarrollo, cambiar en producción
  },
});

export default () => (
  <Connect2ICProvider client={client}>
    <Menu />
  </Connect2ICProvider>
);
