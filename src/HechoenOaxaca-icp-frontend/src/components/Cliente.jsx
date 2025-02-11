import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HechoenOaxaca_icp_backend } from "../../../declarations/HechoenOaxaca-icp-backend";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";

const Cliente = ({ principalId }) => {
  const [productos, setProductos] = useState([]);
  const [historialPedidos, setHistorialPedidos] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPedidoModal, setShowPedidoModal] = useState(false);
  const [pedidoDetalles, setPedidoDetalles] = useState(null);
  const navigate = useNavigate();

  // Fetch productos disponibles
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const productosRes = await HechoenOaxaca_icp_backend.readProductos();
      setProductos(productosRes);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setLoading(false);
    }
  };

  // Fetch historial de pedidos
  const fetchHistorialPedidos = async () => {
    try {
      setLoading(true);
      const pedidosRes = await HechoenOaxaca_icp_backend.getPedidosByCliente(
        principalId
      );
      setHistorialPedidos(pedidosRes);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar historial de pedidos:", error);
      setLoading(false);
    }
  };

  // Fetch perfil del cliente
  const fetchPerfil = async () => {
    try {
      const perfilRes = await HechoenOaxaca_icp_backend.obtenerPerfil(
        principalId
      );
      setPerfil(perfilRes);
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchHistorialPedidos();
    fetchPerfil();
  }, []);

  // Mostrar detalles de un pedido
  const handleVerDetallesPedido = (pedidoId) => {
    const pedido = historialPedidos.find((p) => p.id === pedidoId);
    setPedidoDetalles(pedido);
    setShowPedidoModal(true);
  };

  return (
    <div className="cliente-dashboard">
      <h2>Bienvenido, Cliente</h2>

      {/* Perfil del cliente */}
      {perfil && (
        <div className="perfil">
          <h4>Mi Perfil</h4>
          <p>
            <strong>Nombre:</strong> {perfil.nombreCompleto}
          </p>
          <p>
            <strong>Teléfono:</strong> {perfil.telefono}
          </p>
          <p>
            <strong>Lugar de Origen:</strong> {perfil.lugarOrigen}
          </p>
        </div>
      )}

      {/* Productos disponibles */}
      <div className="productos-disponibles">
        <h4>Explorar Productos</h4>
        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Descripción</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>${producto.precio.toFixed(2)}</td>
                  <td>{producto.descripcion}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() =>
                        navigate(`/producto/${producto.id}`, {
                          state: producto,
                        })
                      }
                    >
                      Ver más
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Historial de pedidos */}
      <div className="historial-pedidos">
        <h4>Mi Historial de Pedidos</h4>
        {loading ? (
          <p>Cargando historial de pedidos...</p>
        ) : historialPedidos.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {historialPedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                  <td>${pedido.total.toFixed(2)}</td>
                  <td>{pedido.estado}</td>
                  <td>
                    <Button
                      variant="info"
                      onClick={() => handleVerDetallesPedido(pedido.id)}
                    >
                      Ver detalles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No hay pedidos registrados.</p>
        )}
      </div>

      {/* Modal para detalles del pedido */}
      <Modal show={showPedidoModal} onHide={() => setShowPedidoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pedidoDetalles ? (
            <>
              <p>
                <strong>ID Pedido:</strong> {pedidoDetalles.id}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(pedidoDetalles.fecha).toLocaleDateString()}
              </p>
              <p>
                <strong>Total:</strong> ${pedidoDetalles.total.toFixed(2)}
              </p>
              <p>
                <strong>Estado:</strong> {pedidoDetalles.estado}
              </p>
              <h5>Productos:</h5>
              <ul>
                {pedidoDetalles.productos.map((producto) => (
                  <li key={producto.id}>{producto.nombre}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>No se encontraron detalles para este pedido.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPedidoModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cliente;
