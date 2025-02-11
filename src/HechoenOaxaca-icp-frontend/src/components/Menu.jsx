// Menu.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { AuthClient } from "@dfinity/auth-client";
import { HechoenOaxaca_icp_backend } from "../../../declarations/HechoenOaxaca-icp-backend";
import "../index.scss";

const Menu = () => {
  const [isConnected, setIsConnected] = useState(false); // Estado de conexión
  const [principalId, setPrincipalId] = useState(null); // Principal ID del usuario
  const [userRole, setUserRole] = useState(null); // Rol del usuario
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Modal de logout
  const navigate = useNavigate();

  // Maneja la autenticación con NFID
  const handleLogin = async () => {
    const authClient = await AuthClient.create();
    const APP_NAME = "Hecho en Oaxaca";
    const APP_LOGO = "https://example.com/logo.png"; // Cambia por la URL de tu logo
    const identityProvider = `https://nfid.one/authenticate?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`;

    authClient.login({
      identityProvider,
      onSuccess: async () => {
        const principal = authClient.getIdentity().getPrincipal().toText();
        setPrincipalId(principal);
        setIsConnected(true);

        try {
          const role = await HechoenOaxaca_icp_backend.getUserRole(principal);
          if (role) {
            setUserRole(role);
            navigate(`/${role}-dashboard`); // Redirige al dashboard según el rol
          } else {
            setUserRole(null); // Si no tiene rol, redirige al registro
            navigate("/registro");
          }
        } catch (err) {
          console.error("Error al obtener el rol del usuario:", err);
          setUserRole(null);
          navigate("/registro");
        }
      },
      onError: (error) => {
        console.error("Error de autenticación:", error);
      },
    });
  };

  // Maneja la desconexión
  const handleDisconnect = () => {
    setIsConnected(false);
    setPrincipalId(null);
    setUserRole(null);
    navigate("/");
  };

  // Redirige al inicio si la sesión expira (15 minutos)
  useEffect(() => {
    if (isConnected) {
      const timeout = setTimeout(() => {
        handleDisconnect();
      }, 15 * 60 * 1000); // 15 minutos en milisegundos
      return () => clearTimeout(timeout); // Limpia el timeout si el componente se desmonta
    }
  }, [isConnected]);

  // Consulta el rol del usuario si está conectado
  useEffect(() => {
    const fetchUserRole = async () => {
      if (principalId) {
        try {
          const role = await HechoenOaxaca_icp_backend.getUserRole(principalId);
          setUserRole(role);
        } catch (err) {
          console.error("Error al obtener el rol del usuario:", err);
        }
      }
    };
    fetchUserRole();
  }, [principalId]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid custom-container">
          <Link to="/" className="custom-brand">
            Hecho en Oaxaca
          </Link>
          <div className="custom-links-container">
            {isConnected ? (
              <>
                {/* Enlaces dinámicos según el rol del usuario */}
                {userRole === "cliente" && (
                  <Link to="/cliente" className="custom-link">
                    Mi Dashboard
                  </Link>
                )}
                {userRole === "artesano" && (
                  <Link to="/artesano" className="custom-link">
                    Artesano
                  </Link>
                )}
                {userRole === "intermediario" && (
                  <Link to="/intermediario" className="custom-link">
                    Dashboard Intermediario
                  </Link>
                )}
                {userRole === "administrador" && (
                  <Link to="/administrador" className="custom-link">
                    Panel de Administración
                  </Link>
                )}
                {/* Enlace a la wallet */}
                <Link to="/wallet" className="custom-btn wallet-btn">
                  Wallet
                </Link>
                {/* Botón de logout */}
                <button
                  className="custom-btn logout-btn"
                  onClick={() => setShowLogoutModal(true)}
                >
                  Salir
                </button>
              </>
            ) : (
              <button className="custom-btn connect-btn" onClick={handleLogin}>
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Modal de confirmación de salida */}
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
              setShowLogoutModal(false); // Cierra el modal
              handleDisconnect(); // Desconectar al usuario
            }}
          >
            Salir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Menu;
