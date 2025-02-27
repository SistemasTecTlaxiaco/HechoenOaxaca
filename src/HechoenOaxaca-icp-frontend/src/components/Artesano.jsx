// src/components/Artesano.jsx
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import CrearProducto from "./CrearProducto";
import Products from "./Products";
import Wallet from "./Wallet";
import { FaBell, FaWallet, FaPlusCircle, FaShoppingCart } from "react-icons/fa";
const Artesano = () => {
  return (
    <div className="artesano-dashboard min-h-screen bg-gray-50 px-4 py-6">
      <header className="dashboard-header text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Bienvenido, Artesano</h1>
        <p className="text-gray-600 mt-2">
          Gestiona tus productos, añade nuevos a tu inventario, y más.
        </p>
      </header>

      {/* Opciones principales */}
      <div className="artesano-options">
        <Link to="/nuevo-producto" className="custom-btn btn-primary">
          <FaPlusCircle size={20} />
          Crear Producto
        </Link>
        <Link to="/products" className="custom-btn btn-secondary">
          <FaShoppingCart size={20} />
          Mis Productos
        </Link>
        <Link to="/wallet" className="custom-btn wallet-btn">
            <FaWallet size={20} />
            Wallet
         </Link>
        <Link to="/notificaciones" className="custom-btn notifications-btn">
          <FaBell size={20} />
          Notificaciones
        </Link>
      </div>

      {/* Configuración de rutas */}
      <div className="artesano-routes container mx-auto">
        <Routes>
          <Route path="/nuevo-producto" element={<CrearProducto />} />
          <Route path="/mis-productos" element={<Products />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/notificaciones" element={<div>Notificaciones en construcción</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default Artesano;
