// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Connect2ICProvider } from "@connect2ic/react";
import { createClient } from "@connect2ic/core";
import { InternetIdentity } from "@connect2ic/core/providers/internet-identity";
import * as Productos_backend from "declarations/HechoenOaxaca-icp-backend";
import { AuthProvider } from "./components/authContext";  
import Menu from "./components/Menu";
import CrearProducto from "./components/CrearProducto";
import Products from "./components/Products";
import Home from "./components/Home";
import Compra from "./components/Compra";
import Registro from "./components/Registro";
import Wallet from "./components/Wallet";
import Artesano from "./components/Artesano";
import ClienteDashboard from "./components/Cliente";
import IntermediarioDashboard from "./components/Intermediario";
import NotificacionesCliente from "./components/NotificacionesCliente";
import CarritoDeCliente from "./components/CarritoDeCliente";

const client = createClient({
  canisters: {
    "HechoenOaxaca-icp-backend": Productos_backend,
  },
  providers: [
    new InternetIdentity({
      providerUrl: "http://be2us-64aaa-aaaaa-qaabq-cai.localhost:4943/",
    }),
  ],
  globalProviderConfig: {
    dev: true,
  },
});

function App() {
  return (
    <Connect2ICProvider client={client}>
      <Router>  {/*  Mover Router arriba */}
        <AuthProvider>  {/*  Ahora AuthProvider está dentro de Router */}
          <Menu />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nuevo-producto/*" element={<CrearProducto />} />
            <Route path="/products/*" element={<Products />} />
            <Route path="/compra" element={<Compra />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/wallet/*" element={<Wallet />} />
            <Route path="/Artesano-dashboard" element={<Artesano />} />
            <Route path="/cliente-dashboard" element={<ClienteDashboard />} />
            <Route path="/intermediario-dashboard" element={<IntermediarioDashboard />} />
            <Route path="/notificaciones-cliente" element={<NotificacionesCliente />} />
            <Route path="/carrito" element={<CarritoDeCliente />} />
          </Routes>
        </AuthProvider>  {/*  Cierra AuthProvider */}
      </Router>
    </Connect2ICProvider>
  );
}

export default App;
