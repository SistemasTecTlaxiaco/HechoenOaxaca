import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HechoenOaxaca_icp_backend } from "../../../declarations/HechoenOaxaca-icp-backend";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FaBell, FaRegMoneyBillAlt, FaShoppingCart } from "react-icons/fa";
import "../cliente.scss";

const Cliente = ({ principalId }) => {
  const [productos, setProductos] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productosRes = await HechoenOaxaca_icp_backend.readProductos();
        const perfilRes = await HechoenOaxaca_icp_backend.obtenerPerfil(principalId);
        
        setProductos(productosRes);
        setPerfil(perfilRes);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [principalId]);

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  return (
    <div className="cliente-dashboard">
      <h2 className="text-center">Bienvenido, Cliente</h2>

      {/* Botones superiores */}
      <div className="botones-superiores d-flex justify-content-center gap-3 my-3">
        <Button className="btn-wallet" onClick={() => navigate("/wallet")}> 
          <FaRegMoneyBillAlt size={20} /> Wallet
        </Button>
        <Button className="btn-notificaciones" onClick={() => navigate("/notificaciones-cliente")}> 
          <FaBell size={20} /> Notificaciones
        </Button>
        <Button className="btn-carrito" onClick={() => navigate("/carrito", { state: { carrito } })}> 
          <FaShoppingCart size={20} /> Carrito
        </Button>
      </div>

      {/* Perfil del cliente */}
      {perfil && (
        <div className="perfil text-center">
          <h4>Mi Perfil</h4>
          <p><strong>Nombre:</strong> {perfil.nombreCompleto}</p>
          <p><strong>Teléfono:</strong> {perfil.telefono}</p>
          <p><strong>Lugar de Origen:</strong> {perfil.lugarOrigen}</p>
        </div>
      )}

      {/* Productos disponibles */}
      <div className="productos-disponibles">
        <h4 className="text-center">Explorar Productos</h4>
        {loading ? (
          <p className="text-center">Cargando productos...</p>
        ) : (
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {productos.map((producto) => (
              <Card key={producto.id} style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>{producto.nombre}</Card.Title>
                  <Card.Text>
                    <strong>Precio:</strong> ${producto.precio.toFixed(2)}
                  </Card.Text>
                  <Card.Text>{producto.descripcion}</Card.Text>
                  <Button variant="primary" onClick={() => navigate(`/producto/${producto.id}`, { state: producto })}>
                    Ver más
                  </Button>
                  <Button variant="success" onClick={() => agregarAlCarrito(producto)}>
                    Agregar al Carrito
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cliente;