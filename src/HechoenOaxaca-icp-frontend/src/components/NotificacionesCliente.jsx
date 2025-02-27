import React, { useState, useEffect } from "react";
import { HechoenOaxaca_icp_backend } from "../../../declarations/HechoenOaxaca-icp-backend";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

const NotificacionesCliente = ({ principalId }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch notificaciones del backend
  const fetchNotificaciones = async () => {
    try {
      setLoading(true);
      const notificacionesRes = await HechoenOaxaca_icp_backend.getNotificacionesByCliente(
        principalId
      );
      setNotificaciones(notificacionesRes);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
  }, [principalId]);

  return (
    <div className="notificaciones-cliente container mt-4">
      <h2 className="text-center mb-4">Mis Notificaciones</h2>

      {loading ? (
        <p className="text-center">Cargando notificaciones...</p>
      ) : notificaciones.length > 0 ? (
        <ListGroup>
          {notificaciones.map((notificacion, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="mb-1">{notificacion.titulo}</h5>
                <p className="mb-1">{notificacion.mensaje}</p>
                <small className="text-muted">
                  Fecha: {new Date(notificacion.fecha).toLocaleDateString()}
                </small>
              </div>
              <Button variant="primary" size="sm" onClick={() => alert("Notificación leída")}>
                Marcar como leído
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-center">No tienes notificaciones nuevas.</p>
      )}
    </div>
  );
};

export default NotificacionesCliente;
