// Menu.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Solo importamos Link
import { ConnectButton, ConnectDialog, useConnect } from "@connect2ic/react";

const Menu = () => {
  const { principal } = useConnect();

  return (
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      {principal ? (
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
            <ConnectButton />
            <ConnectDialog />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Menu;
