import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { Actor } from "@dfinity/agent";
import { HechoenOaxaca_icp_backend } from "../../../declarations/HechoenOaxaca-icp-backend";


const Wallet = () => {
  const navigate = useNavigate();
  const [principalId, setPrincipalId] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const initAuthClient = async () => {
      const authClient = await AuthClient.create();
      if (authClient.isAuthenticated()) {
        const identity = authClient.getIdentity();
        setPrincipalId(identity.getPrincipal().toText());
        Actor.agentOf(HechoenOaxaca_icp_backend).replaceIdentity(identity);

        // Obtener el saldo real si es necesario
        // const realBalance = await fetchBalance();
        // setBalance(realBalance);
      }
    };

    initAuthClient();
  }, []);

  const handleLogin = async () => {
    const authClient = await AuthClient.create();
    const APP_NAME = "Hecho en Oaxaca";
    const APP_LOGO = "/path-to-logo.png";
    const identityProvider = `https://nfid.one/authenticate?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`;

    authClient.login({
      identityProvider,
      onSuccess: () => {
        const identity = authClient.getIdentity();
        setPrincipalId(identity.getPrincipal().toText());
        Actor.agentOf(HechoenOaxaca_backend).replaceIdentity(identity);
      },
    });
  };

  if (!principalId) {
    return (
      <div className="container mt-5">
        <h1>Debes iniciar sesión para acceder a la billetera.</h1>
        <button className="btn btn-primary mt-3" onClick={handleLogin}>
          Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1>Tu Billetera</h1>
      <p>Principal ID: {principalId}</p>
      <p>Saldo: {balance} ICP</p>
      <button
        className="btn btn-secondary mt-3"
        onClick={() => alert("Función de recarga en desarrollo")}
      >
        Recargar Fondos
      </button>
    </div>
  );
};

export default Wallet;
