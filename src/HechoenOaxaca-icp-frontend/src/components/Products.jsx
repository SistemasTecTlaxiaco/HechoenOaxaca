import React, { useEffect, useState } from "react";
import { useCanister, useConnect } from "@connect2ic/react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Home from "./Home";

const Products = () => {
  const [marketplaceBackend] = useCanister("HechoenOaxaca-icp-backend");
  const { principal } = useConnect();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState("");
  const [idProduct, setIdProduct] = useState("");
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  // Cargar productos desde el backend
  const fetchProducts = async () => {
    setLoading("Cargando...");
    try {
      const productsRes = await marketplaceBackend.readProductos();

      // Procesar imágenes
      const processedProducts = productsRes.map((product) => ({
        ...product,
        imagenes: product.imagenes.map((img) => {
          try {
            const blob = new Blob([new Uint8Array(img)], { type: "image/jpeg" });
            return URL.createObjectURL(blob);
          } catch (error) {
            console.error("Error procesando imagen:", error);
            return null; // Si hay error, asignar null
          }
        }),
      }));

      setProducts(processedProducts);
      setLoading("");
    } catch (e) {
      console.error("Error al cargar productos:", e);
      setLoading("Error al cargar los productos.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Manejar cambio de imágenes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("Puedes subir un máximo de 3 imágenes.");
      return;
    }
    setSelectedImages(files);
  };

  // Actualizar producto
  const updateProduct = async () => {
    const form = document.getElementById("formEditar");
    const nombre = form.nombre.value;
    const precio = parseFloat(form.precio.value);
    const descripcion = form.descripcion.value;
    const artesano = form.artesano.value;
    const tipo = form.tipo.value;

    setLoading("Actualizando producto...");

    try {
      const imageBlobs = await Promise.all(
        selectedImages.map((image) =>
          image.arrayBuffer().then((buffer) => new Blob([buffer], { type: image.type }))
        )
      );

      await marketplaceBackend.updateProducto(idProduct, nombre, precio, descripcion, artesano, tipo, imageBlobs);

      setLoading("");
      setShowModalEditar(false);
      fetchProducts();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      setLoading("Error al actualizar el producto. Intenta nuevamente.");
    }
  };

  // Mostrar modal de edición
  const handleShowModalEditar = async (idProducto) => {
    setShowModalEditar(true);
    setIdProduct(idProducto);
    const producto = await marketplaceBackend.readProductoById(idProducto);

    if (producto) {
      const form = document.getElementById("formEditar");
      form.nombre.value = producto[0].nombre;
      form.precio.value = producto[0].precio;
      form.descripcion.value = producto[0].descripcion;
      form.artesano.value = producto[0].artesano;
      form.tipo.value = producto[0].tipo;
    }
  };

  const handleShowModalEliminar = (idProducto) => {
    setShowModalEliminar(true);
    setIdProduct(idProducto);
  };

  const deleteProduct = async () => {
    setLoading("Eliminando producto...");
    try {
      await marketplaceBackend.deleteProducto(idProduct);
      setShowModalEliminar(false);
      fetchProducts();
      setLoading("");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setLoading("Error al eliminar el producto. Intenta nuevamente.");
    }
  };

  return (
    <>
      {principal ? (
        <div className="row mt-5">
          <div className="col">
            {loading && <div className="alert alert-primary">{loading}</div>}
            <div className="card">
              <div className="card-header">Lista de productos</div>
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Descripción</th>
                      <th>Artesano</th>
                      <th>Imágenes</th>
                      <th>Tipo</th>
                      <th colSpan="2">Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.nombre}</td>
                        <td>{product.precio}</td>
                        <td>{product.descripcion}</td>
                        <td>{product.artesano}</td>
                        <td>
                          {product.imagenes.length > 0 ? (
                            product.imagenes.map(
                              (src, index) =>
                                src && (
                                  <img
                                    key={index}
                                    src={src}
                                    alt={`Imagen de ${product.nombre}`}
                                    style={{ maxWidth: "50px", maxHeight: "50px", marginRight: "5px" }}
                                  />
                                )
                            )
                          ) : (
                            <span>Sin imagen</span>
                          )}
                        </td>
                        <td>{product.tipo}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleShowModalEditar(product.id)}
                          >
                            Editar
                          </button>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleShowModalEliminar(product.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modales */}
            {/* Aquí van los modales de editar y eliminar */}

             {/* Modal para editar producto */}
             <Modal show={showModalEditar} onHide={() => setShowModalEditar(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Actualizar producto</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form id="formEditar">
                  <ul className="list-unstyled">
                    <li className="form-group mb-3">
                      <label htmlFor="nombre">Nombre del producto</label>
                      <input type="text" className="form-control" id="nombre" />
                    </li>
                    <li className="form-group mb-3">
                      <label htmlFor="precio">Precio</label>
                      <div className="input-group">
                        <span className="input-group-text">ICP</span>
                        <input type="number" step="0.01" className="form-control" id="precio" />
                      </div>
                    </li>
                    <li className="form-group mb-3">
                      <label htmlFor="descripcion">Descripción</label>
                      <input type="text" className="form-control" id="descripcion" />
                    </li>
                    <li className="form-group mb-3">
                      <label htmlFor="artesano">Nombre del artesano</label>
                      <input type="text" className="form-control" id="artesano" />
                    </li>
                    <li className="form-group mb-3">
                      <label htmlFor="tipo">Tipo de producto</label>
                      <select className="form-control" id="tipo">
                        <option value="textil">Textil</option>
                        <option value="artesania">Artesanía</option>
                        <option value="dulces">Dulces tradicionales</option>
                      </select>
                    </li>
                    <li className="form-group mb-3">
                      <label htmlFor="imagenes">Imágenes (máximo 3)</label>
                      <input
                        type="file"
                        className="form-control"
                        id="imagenes"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                      />
                    </li>
                  </ul>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModalEditar(false)}>
                  Cerrar
                </Button>
                <Button variant="primary" onClick={updateProduct}>
                  Guardar
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Modal para eliminar producto */}
            <Modal show={showModalEliminar} onHide={() => setShowModalEliminar(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Confirmación</Modal.Title>
              </Modal.Header>
              <Modal.Body>¿Seguro que quieres eliminar este producto?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModalEliminar(false)}>
                  Cancelar
                </Button>
                <Button variant="danger" onClick={deleteProduct}>
                  Eliminar
                </Button>
              </Modal.Footer>
            </Modal>
            
          </div>
        </div>
      ) : (
        <Home />
      )}
    </>
  );
};

export default Products;