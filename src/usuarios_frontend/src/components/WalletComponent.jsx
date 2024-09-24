// WalletComponent.js
import React, { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';

const WalletComponent = () => {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState('');
  const [loading, setLoading] = useState(true); // Estado para mostrar si está cargando
  const [error, setError] = useState(''); // Estado para manejar errores

  useEffect(() => {
    const initAuthClient = async () => {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);
        const isAuthenticated = await client.isAuthenticated();
        if (isAuthenticated) {
          const identity = client.getIdentity();
          setPrincipal(identity.getPrincipal().toText());
          setIsAuthenticated(true);
        }
        setLoading(false); // Termina la carga una vez que se ha inicializado el cliente
      } catch (e) {
        setError('Error al inicializar la wallet.'); // Manejo de errores
        setLoading(false);
      }
    };

    initAuthClient();
  }, []);

  const login = async () => {
    if (!authClient) {
      setError('Cliente de autenticación no disponible.');
      return;
    }

    try {
      await authClient.login({
        identityProvider: "https://identity.ic0.app",
        onSuccess: () => {
          const identity = authClient.getIdentity();
          setPrincipal(identity.getPrincipal().toText());
          setIsAuthenticated(true);
        },
      });
    } catch (e) {
      setError('Error durante la autenticación.');
    }
  };

  const logout = async () => {
    if (!authClient) {
      setError('Cliente de autenticación no disponible.');
      return;
    }

    try {
      await authClient.logout();
      setIsAuthenticated(false);
      setPrincipal('');
    } catch (e) {
      setError('Error al desconectar la wallet.');
    }
  };

  if (loading) {
    return <p>Cargando la wallet...</p>; // Mensaje mientras carga
  }

  return (
    <div>
      <h1>Internet Identity Wallet</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar errores si existen */}
      {isAuthenticated ? (
        <div>
          <p>Conectado como: {principal}</p>
          <button onClick={logout}>Desconectar</button>
        </div>
      ) : (
        <button onClick={login}>Conectar Wallet</button>
      )}
    </div>
  );
};

export default WalletComponent;

