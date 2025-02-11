// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Connect2ICProvider } from "@connect2ic/react";
import { createClient } from "@connect2ic/core";
import { InternetIdentity } from "@connect2ic/core/providers/internet-identity";
import * as Productos_backend from "declarations/HechoenOaxaca-icp-backend";
import Menu from "./components/Menu";
import CrearProducto from "./components/CrearProducto";
import Products from "./components/Products";
import Home from "./components/Home";
import Compra from "./components/Compra";
import Registro from "./components/Registro";
import Wallet from './components/Wallet';

const client = createClient({
  canisters: {
    "HechoenOaxaca-icp-backend": Productos_backend,
  },
  providers: [
    new InternetIdentity({
      providerUrl: "http://aax3a-h4aaa-aaaaa-qaahq-cai.localhost:4943/",
    }),
  ],
  globalProviderConfig: {
    dev: true,
  },
});

function App() {
  return (
    <Connect2ICProvider client={client}>
      <Router>
        {/* Menu se muestra en todas las rutas */}
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nuevo-producto" element={<CrearProducto />} />
          <Route path="/products" element={<Products />} />
          <Route path="/compra" element={<Compra />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/wallet" element={<Wallet />} />
          {/* Otras rutas necesarias */}
        </Routes>
      </Router>
    </Connect2ICProvider>
  );
}

export default App;
