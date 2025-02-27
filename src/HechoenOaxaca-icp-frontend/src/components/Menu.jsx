import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useAuthContext } from "./authContext";
import "../index.scss";

const Menu = () => {
  const { isAuthenticated, userRole, handleDisconnect, handleLogin } = useAuthContext();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <div>
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid custom-container">
          <Link to="/" className="custom-brand">
            Hecho en Oaxaca
          </Link>
          <div className="custom-links-container">
            {/* ✅ Mostrar botón de "Iniciar Sesión" si NO está autenticado */}
            {!isAuthenticated ? (
              <button className="custom-button login-button" onClick={handleLogin}>
                Iniciar Sesión
              </button>
            ) : (
              <>
                {/* ✅ Mostrar Dashboard según el rol del usuario */}
                {userRole === "cliente" && <Link to="/cliente-dashboard">Dashboard Cliente</Link>}
                {userRole === "artesano" && <Link to="/artesano-dashboard">Dashboard Artesano</Link>}
                {userRole === "intermediario" && (
                  <Link to="/intermediario-dashboard">Dashboard Intermediario</Link>
                )}
                {/* ✅ Botón de cerrar sesión */}
                <button className="custom-button logout-button" onClick={() => setShowLogoutModal(true)}>
                  Salir
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ Modal de Confirmación de Cierre de Sesión */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro de que quiere salir?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowLogoutModal(false);
              handleDisconnect();
            }}
          >
            Salir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// ✅ Exportación por defecto para evitar errores en `App.jsx`
export default Menu;
