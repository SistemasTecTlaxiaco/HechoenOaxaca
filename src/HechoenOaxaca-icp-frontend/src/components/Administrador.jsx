import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HechoenOaxaca_icp_backend } from "../../../declarations/HechoenOaxaca-icp-backend";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const Administrador = ({ principalId }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [newAdminPrincipal, setNewAdminPrincipal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Cargar la lista de usuarios
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const usuariosRes = await HechoenOaxaca_icp_backend.listarUsuarios();
      setUsuarios(usuariosRes);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Agregar un nuevo administrador
  const agregarAdministrador = async () => {
    if (!newAdminPrincipal) {
      setError("El Principal ID es obligatorio.");
      return;
    }

    try {
      setLoading(true);
      const result = await HechoenOaxaca_icp_backend.asignarAdministrador(
        newAdminPrincipal
      );
      if (result.ok) {
        setSuccess("Administrador agregado exitosamente.");
        setError("");
        setNewAdminPrincipal("");
      } else {
        setError("Error al agregar administrador. Verifica el Principal ID.");
        setSuccess("");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error al agregar administrador:", err);
      setError("Ocurrió un error inesperado.");
      setLoading(false);
    }
  };

  // Renderización del panel de administración
  return (
    <div className="admin-dashboard">
      <h2>Panel de Administrador</h2>

      {/* Lista de usuarios */}
      <div className="usuarios">
        <h4>Lista de Usuarios</h4>
        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Principal ID</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.principalId}>
                  <td>{usuario.nombreCompleto}</td>
                  <td>{usuario.telefono}</td>
                  <td>{usuario.rol}</td>
                  <td>{usuario.principalId}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Asignar nuevo administrador */}
      <div className="nuevo-admin">
        <h4>Agregar Nuevo Administrador</h4>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Principal ID del nuevo administrador"
          value={newAdminPrincipal}
          onChange={(e) => setNewAdminPrincipal(e.target.value)}
        />
        <Button variant="primary" onClick={agregarAdministrador}>
          Agregar Administrador
        </Button>
        {error && <p className="text-danger mt-2">{error}</p>}
        {success && <p className="text-success mt-2">{success}</p>}
      </div>
    </div>
  );
};

export default Administrador;
