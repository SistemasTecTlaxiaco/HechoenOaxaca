import { useCanister } from "@connect2ic/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Row, Col } from "react-bootstrap";

const CrearProducto = () => {
  const [marketplaceBackend] = useCanister("HechoenOaxaca-icp-backend");
  const [loading, setLoading] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Manejar cambio de imágenes
  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    if (selectedImages.length > 3) {
      setError("Puedes subir un máximo de 3 imágenes.");
      return;
    }

    for (const image of selectedImages) {
      if (!["image/jpeg", "image/png"].includes(image.type)) {
        setError("Solo se permiten imágenes en formato JPEG o PNG.");
        return;
      }
    }

    setImages(selectedImages);
    setError("");
  };

  // Guardar producto
  const saveProduct = async (e) => {
    e.preventDefault();
    const form = e.target;
    const nombre = form.nombre.value.trim();
    const precio = parseFloat(form.precio.value); // Asegurarse de que sea Float
    const descripcion = form.descripcion.value.trim();
    const artesano = form.artesano.value.trim();
    const tipo = form.tipo.value.trim();

    // Validar campos
    if (!nombre || isNaN(precio) || !descripcion || !artesano || !tipo) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (!images.length) {
      setError("Debes subir al menos una imagen.");
      return;
    }

    setLoading("Cargando...");
    setError("");

    try {
      // Convertir imágenes a Uint8Array
      const imageBlobs = await Promise.all(
        images.map(async (image) => {
          const buffer = await image.arrayBuffer();
          return Array.from(new Uint8Array(buffer)); // Convertir a array de bytes
        })
      );

      console.log("Imágenes convertidas para enviar al backend:", imageBlobs);

      // Llamar al backend para crear el producto
      const result = await marketplaceBackend.createProducto(
        nombre, // Text
        precio, // Float
        descripcion, // Text
        tipo, // Text
        imageBlobs // [Blob]
      );

      // Manejar respuesta del backend
      if ("ok" in result) {
        alert("Producto agregado exitosamente.");
        form.reset();
        setImages([]);
        navigate("/products");
      } else {
        console.error("Error al agregar producto:", result.err);
        setError(`Error: ${result.err}`);
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
      setError("Ocurrió un error al agregar el producto.");
    } finally {
      setLoading("");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4>Registrar Producto</h4>
            </Card.Header>
            <Card.Body>
              {loading && <Alert variant="info">{loading}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={saveProduct}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Producto</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    placeholder="Ej: Olla de barro"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="precio"
                    placeholder="Ej: 15.99"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="descripcion"
                    placeholder="Descripción breve"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Artesano</Form.Label>
                  <Form.Control
                    type="text"
                    name="artesano"
                    placeholder="Nombre del artesano"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Producto</Form.Label>
                  <Form.Select name="tipo" required>
                    <option value="textil">Textil</option>
                    <option value="artesania">Artesanía</option>
                    <option value="dulces">Dulces tradicionales</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Subir Imágenes (Máximo 3)</Form.Label>
                  <Form.Control
                    type="file"
                    name="imagenes"
                    accept="image/jpeg,image/png"
                    multiple
                    onChange={handleImageChange}
                    required
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100">
                  Agregar Producto
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CrearProducto;