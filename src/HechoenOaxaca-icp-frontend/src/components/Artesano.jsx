import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import CrearProducto from "./CrearProducto.jsx";
import Products from "./Products";

const Artesano = () => {
  return (
    <div className="artesano-dashboard">
      <h2>Bienvenido, Artesano</h2>
      <p>Gestiona tus productos y añade nuevos a tu inventario.</p>

      {/* Opciones principales */}
      <div className="artesano-options">
        <Link to="/crear-producto" className="btn btn-primary me-2">
          Crear Producto
        </Link>
        <Link to="/mis-productos" className="btn btn-secondary">
          Mis Productos
        </Link>
      </div>

      {/* Configuración de rutas */}
      <Routes>
        <Route path="/crear-producto" element={<CrearProducto />} />
        <Route path="/mis-productos" element={<Products />} />
      </Routes>
    </div>
  );
};

export default Artesano;
