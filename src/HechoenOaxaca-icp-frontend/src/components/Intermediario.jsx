import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HechoenOaxaca_icp_backend } from "../../../declarations/HechoenOaxaca-icp-backend";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const Intermediario = ({ principalId }) => {
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Cargar pedidos asignados al intermediario
  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const pedidosRes = await HechoenOaxaca_icp_backend.listarPedidosIntermediario(principalId);
      setPedidos(pedidosRes);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
      setError("No se pudieron cargar los pedidos.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // Manejar selección de un pedido
  const handleShowDetails = (pedido) => {
    setSelectedPedido(pedido);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setSelectedPedido(null);
    setShowDetailsModal(false);
  };

  // Marcar pedido como entregado
  const marcarComoEntregado = async (idPedido) => {
    try {
      setLoading(true);
      const result = await HechoenOaxaca_icp_backend.marcarPedidoEntregado(idPedido);
      if (result.ok) {
        setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.id !== idPedido));
      } else {
        setError("No se pudo marcar el pedido como entregado.");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error al marcar como entregado:", err);
      setError("Error al procesar la solicitud.");
      setLoading(false);
    }
  };

  return (
    <div className="intermediario-dashboard">
      <h2>Bienvenido, Intermediario</h2>
      <p>Gestiona los pedidos asignados y realiza entregas.</p>

      {loading && <p className="text-primary">Cargando...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="pedidos">
        <h4>Pedidos Asignados</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length > 0 ? (
              pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>{pedido.clienteNombre}</td>
                  <td>{pedido.direccion}</td>
                  <td>{pedido.estado}</td>
                  <td>
                    <Button
                      variant="info"
                      className="me-2"
                      onClick={() => handleShowDetails(pedido)}
                    >
                      Detalles
                    </Button>
                    {pedido.estado === "Pendiente" && (
                      <Button
                        variant="success"
                        onClick={() => marcarComoEntregado(pedido.id)}
                      >
                        Marcar como Entregado
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay pedidos asignados.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal para Detalles del Pedido */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPedido ? (
            <>
              <p>
                <strong>ID del Pedido:</strong> {selectedPedido.id}
              </p>
              <p>
                <strong>Cliente:</strong> {selectedPedido.clienteNombre}
              </p>
              <p>
                <strong>Dirección:</strong> {selectedPedido.direccion}
              </p>
              <p>
                <strong>Estado:</strong> {selectedPedido.estado}
              </p>
              <p>
                <strong>Productos:</strong>
              </p>
              <ul>
                {selectedPedido.productos.map((producto, index) => (
                  <li key={index}>{producto.nombre} - {producto.cantidad}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>No hay detalles disponibles.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Intermediario;
