import { useCanister } from "@connect2ic/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CrearProducto = () => {
  const [marketplaceBackend] = useCanister("HechoenOaxaca-icp-backend");
  const [loading, setLoading] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    if (selectedImages.length > 3) {
      alert("Puedes subir un máximo de 3 imágenes.");
      return;
    }

    for (const image of selectedImages) {
      if (!["image/jpeg", "image/png"].includes(image.type)) {
        alert("Solo se permiten imágenes en formato JPEG o PNG.");
        return;
      }
    }

    setImages(selectedImages);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const form = e.target;
    const nombre = form.nombre.value;
    const precio = parseFloat(form.precio.value);
    const descripcion = form.descripcion.value;
    const artesano = form.artesano.value;
    const tipo = form.tipo.value;

    if (!images.length) {
      alert("Debes subir al menos una imagen.");
      return;
    }

    setLoading("Cargando...");

    try {
      // Convertir imágenes a Uint8Array
      const imageBlobs = await Promise.all(
        images.map(async (image) => {
          const buffer = await image.arrayBuffer(); // Obtener el contenido de la imagen
          return Array.from(new Uint8Array(buffer)); // Convertirlo a un array de números
        })
      );

      console.log("Imágenes convertidas para enviar al backend:", imageBlobs);

      // Llamar al backend para crear el producto
      await marketplaceBackend.createProducto(nombre, precio, descripcion, artesano, tipo, imageBlobs);

      alert("Producto agregado exitosamente.");
      setImages([]);
      form.reset();
      navigate("/productos");
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Ocurrió un error al agregar el producto. Intenta nuevamente.");
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="row mt-5">
      <div className="col-2"></div>
      <div className="col-8">
        {loading && <div className="alert alert-primary">{loading}</div>}
        <div className="card">
          <div className="card-header">Registrar Producto</div>
          <div className="card-body">
            <form onSubmit={saveProduct}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Producto</label>
                <input type="text" className="form-control" id="nombre" placeholder="Ej: Olla de barro" required />
              </div>
              <div className="form-group">
                <label htmlFor="precio">Precio</label>
                <input type="number" step="0.01" className="form-control" id="precio" placeholder="Ej: 15.99" required />
              </div>
              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <input type="text" className="form-control" id="descripcion" placeholder="Descripción breve" required />
              </div>
              <div className="form-group">
                <label htmlFor="artesano">Nombre del Artesano</label>
                <input type="text" className="form-control" id="artesano" placeholder="Nombre del artesano" required />
              </div>
              <div className="form-group">
                <label htmlFor="tipo">Tipo de Producto</label>
                <select className="form-control" id="tipo" required>
                  <option value="textil">Textil</option>
                  <option value="artesania">Artesanía</option>
                  <option value="dulces">Dulces tradicionales</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="imagenes">Subir Imágenes (Máximo 3)</label>
                <input
                  type="file"
                  className="form-control"
                  id="imagenes"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={handleImageChange}
                  required
                />
              </div>
              <br />
              <div className="form-group">
                <input type="submit" className="btn btn-success" value="Agregar Producto" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="col-2"></div>
    </div>
  );
};

export default CrearProducto;