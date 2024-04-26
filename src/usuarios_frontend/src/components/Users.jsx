import { useCanister, useConnect } from "@connect2ic/react";
import React, { useEffect, useState } from "react";
import Home from './Home'

const Users = () => {
  
  const [usersBackend] = useCanister("usuarios_backend");
  const {principal} = useConnect();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState("");


  useEffect(() => {
      obtieneUsuarios();
  }, []);

 
  const obtieneUsuarios = async () => {
      setLoading("Loading...");
      try {
        var usersRes = await usersBackend.readUsers();
        setUsers(usersRes);   
        // usersRes.forEach((user, index) => {
        //   console.log("user" +user.nombre);
        // });   
        setLoading("");

      } catch(e) {
          console.log(e);
          setLoading("Error happened fetching users list");
      }

  }
  
  const deleteUser = async (e) => {
    e.preventDefault();
   
    var id = e.target[0].value;

    setLoading("Loading...");

    await usersBackend.deleteUser(id);
    setLoading("");
    {
        document.getElementById('btnUserList').click();
    }
  }
  


  return(
    <>
    { principal 
      ? 
      <div className="row  mt-5">
        <div className="col">
          {loading != "" 
            ? 
              <div className="alert alert-primary">{loading}</div>
            :
              <div></div>
          }
        <div className="card">
          <div className="card-header">
          Lista de usuarios
          </div>
          <div className="card-body">
          <table className="table">
              <thead>
              <tr>
                  <th>Nombre</th>
                  <th>Primer apellido</th>
                  <th>Segundo apellido</th>
                  <th>Alias</th>
                  <th colSpan="2">Opciones</th>
              </tr>
              </thead>
              <tbody id="tbody">
              {users.map((user) => {
                return (
                  <tr key={user.id}>
                      <td>{user.nombre}</td>
                      <td>{user.primerApellido}</td>
                      <td>{user.segundoApellido}</td>
                      <td>{user.alias}</td>
                      <td><button className="btn btn-primary btnEditarArea" data-id="{user.id}">Editar</button></td>
                      <td>
                        <form onSubmit={deleteUser} method="post">
                          <input type="hidden" value={user.id} name="id" />
                          <button 
                              type="submit"
                              className="btn btn-danger btnEliminarModal" 
                            >
                              Eliminar
                          </button>
                          </form>
                      </td>
                  </tr>
                );
                })}
              </tbody>
          </table>         
          </div>
          </div>
        </div>
        <div className="modal fade" id="eliminarModal" tabIndex="-1" aria-labelledby="eliminarModalLabel" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content">
              <div className="modal-header">
                  <h1 className="modal-title fs-5" id="eliminarModalLabel">Confirmación</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div className="modal-body" id="modalBody"></div>
              <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                  <button type="button" id="btnEliminarArea" className="btn btn-danger">Eliminar</button>
              </div>
              </div>
          </div>
        </div>
      </div>
    : 
      <Home />
    }
    </>
  )
}
  
  
export default Users