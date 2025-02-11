// Home.jsx
import { useCanister } from "@connect2ic/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Compra from './Compra';
import '../index.scss';

const Home = () => {
  const [marketplaceBackend] = useCanister('HechoenOaxaca-icp-backend');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productsRes = await marketplaceBackend.readProductos();
      
      // Procesar las imágenes en productos para que sean utilizables en el frontend
      const processedProducts = productsRes.map(product => ({
        ...product,
        imagenes: product.imagenes.map(imagen =>
          URL.createObjectURL(new Blob([new Uint8Array(imagen)], { type: "image/jpeg" }))
        )
      }));

      setProducts(processedProducts);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleShowDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handlePurchase = (product) => {
    setShowModal(false);
    navigate('/compra', { state: { product } }); // Redirige a PrincipaldeCompra con los datos del producto
  };

  return (
    <section className="mt-5 text-center">
      <h1 className="eslogan">Hecho a mano, Hecho con el corazón</h1>
      <div className="container mt-4">
        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <div className="row">
            {products.map((product) => (
              <div key={product.id} className="col-md-4 mb-4">
                <Card>
                  {product.imagenes.length > 0 && (
                    <Card.Img
                      variant="top"
                      src={product.imagenes[0]} // Muestra la primera imagen
                      alt={`Imagen de ${product.nombre}`}
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{product.nombre}</Card.Title>
                    <Card.Text>{product.descripcion}</Card.Text>
                    <Card.Text>Precio: ICP {product.precio}</Card.Text>
                    <Button variant="primary" onClick={() => handleShowDetails(product)}>
                      Ver Detalles
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalles del producto */}
      <Compra
        show={showModal}
        onClose={() => setShowModal(false)}
        product={selectedProduct}
        onPurchase={handlePurchase}
      />
    </section>
  );
};

export default Home;