import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FaTrash } from "react-icons/fa";
import "../cliente.scss";

const CarritoDeCliente = ({ carrito, setCarrito }) => {
  const navigate = useNavigate();

  // Función para eliminar un producto del carrito
  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter((producto) => producto.id !== id);
    setCarrito(nuevoCarrito);
  };

  // Función para calcular el total del carrito
  const calcularTotal = () => {
    return carrito.reduce((total, producto) => total + producto.precio, 0).toFixed(2);
  };

  // Función para proceder al checkout
  const procederAlCheckout = () => {
    navigate("/checkout", { state: { carrito, total: calcularTotal() } });
  };

  return (
    <div className="carrito-de-cliente">
      <h2 className="text-center">Mi Carrito</h2>

      {carrito.length === 0 ? (
        <p className="text-center">Tu carrito está vacío.</p>
      ) : (
        <div className="productos-en-carrito">
          {carrito.map((producto) => (
            <Card key={producto.id} className="mb-3">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title>{producto.nombre}</Card.Title>
                  <Card.Text>
                    <strong>Precio:</strong> ${producto.precio.toFixed(2)}
                  </Card.Text>
                </div>
                <Button variant="danger" onClick={() => eliminarProducto(producto.id)}>
                  <FaTrash />
                </Button>
              </Card.Body>
            </Card>
          ))}
          <div className="total text-center">
            <h4>Total: ${calcularTotal()}</h4>
            <Button variant="success" onClick={procederAlCheckout}>
              Proceder al Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarritoDeCliente;