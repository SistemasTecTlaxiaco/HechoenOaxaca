// authContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useConnect } from '@connect2ic/react';

export const AuthContext = createContext();

// Hook personalizado para acceder al contexto de autenticación
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Eliminamos `isConnected` si no se necesita
  const { principal, disconnect } = useConnect();

  useEffect(() => {
    setIsAuthenticated(!!principal);
    setIsLoading(false);
  }, [principal]);

  const handleDisconnect = () => {
    disconnect().then(() => {
      setIsAuthenticated(false);
      window.location.href = '/';
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, handleDisconnect }}>
      {children}
    </AuthContext.Provider>
  );
};
