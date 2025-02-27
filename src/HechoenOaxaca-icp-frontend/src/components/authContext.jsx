import React, { createContext, useContext, useState, useEffect } from "react";
import { Principal } from "@dfinity/principal";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/HechoenOaxaca-icp-backend";
import { useNavigate } from "react-router-dom";

// 🔹 Configuración manual de Canister IDs
const LOCAL_CANISTER_ID = "br5f7-7uaaa-aaaaa-qaaca-cai"; // Canister ID local
const MAINNET_CANISTER_ID = "bkyz2-fmaaa-aaaaa-qaaaq-cai"; // Canister ID en IC

const canisterId =
  process.env.DFX_NETWORK === "ic" ? MAINNET_CANISTER_ID : LOCAL_CANISTER_ID;

export const AuthContext = createContext();

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
  const [userRole, setUserRole] = useState(null);
  const [principalId, setPrincipalId] = useState(null);
  const [identity, setIdentity] = useState(null);

  const navigate = useNavigate();

  // ✅ Crear agente autenticado con la identidad
  const getBackendActor = async (identity) => {
    if (!identity) {
      console.error("❌ No se pudo obtener identidad.");
      return null;
    }

    // 🔹 Configurar el host dependiendo del entorno
    const host =
      process.env.DFX_NETWORK === "ic"
        ? "https://ic0.app"
        : "http://127.0.0.1:4943";

    const agent = new HttpAgent({ host });
    agent.replaceIdentity(identity);

    if (process.env.NODE_ENV === "development") {
      console.log("🔄 Obteniendo clave raíz en desarrollo...");
      await agent.fetchRootKey();
    }

    return Actor.createActor(idlFactory, { agent, canisterId });
  };

  // ✅ Obtener el rol del usuario desde el backend
  const fetchUserRole = async (identity, principal) => {
    try {
      if (!principal) {
        console.warn("⚠️ No hay principal para verificar rol.");
        return;
      }

      console.log("🔹 Obteniendo backend actor...");
      const backendActor = await getBackendActor(identity);
      if (!backendActor) {
        console.error("❌ No se pudo obtener backend actor.");
        return;
      }

      console.log("🎭 Consultando rol en el backend...");
      const principalObj = Principal.fromText(principal);
      const userRoleResponse = await backendActor.getRolUsuario(principalObj);

      if (userRoleResponse && typeof userRoleResponse === "string" && userRoleResponse !== "NoAsignado") {
        console.log("✅ Rol asignado:", userRoleResponse);
        localStorage.setItem("userRole", userRoleResponse.toLowerCase());
        setUserRole(userRoleResponse.toLowerCase());
      } else {
        console.warn("⚠️ Rol no encontrado, redirigiendo al registro.");
        localStorage.removeItem("userRole");
        setUserRole(null);
        navigate("/registro");
      }
    } catch (err) {
      console.error("❌ Error al obtener el rol del usuario:", err);
    }
  };

  // ✅ Iniciar sesión con NFID evitando autenticación anónima
  const handleLogin = async () => {
    try {
      console.log("🔄 Creando AuthClient...");
      const { AuthClient } = await import("@dfinity/auth-client");
      const authClient = await AuthClient.create();

      console.log("🔄 Intentando iniciar sesión con NFID...");
      await authClient.login({
        identityProvider: "https://nfid.one/authenticate",
        derivationOrigin: window.location.origin, // Evita problemas de autenticación
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1_000_000_000), // 7 días
      });

      if (!(await authClient.isAuthenticated())) {
        console.error("🚨 No se pudo autenticar al usuario.");
        alert("Error de autenticación. Intenta nuevamente.");
        return;
      }

      console.log("✅ Autenticación exitosa, obteniendo identidad...");
      const identity = authClient.getIdentity();
      if (!identity || !identity.getPrincipal) {
        console.error("❌ Error: Identidad inválida después de autenticación.");
        alert("Error en la autenticación. Cierra sesión e intenta nuevamente.");
        return;
      }

      const principal = identity.getPrincipal().toText();
      if (!principal || principal === "2vxsx-fae") {
        console.error("🚨 NFID devolvió Principal anónimo.");
        alert("Error en la autenticación. Cierra sesión y vuelve a intentarlo.");
        return;
      }

      console.log("✅ Usuario autenticado con Principal:", principal);
      setPrincipalId(principal);
      setIdentity(identity);
      setIsAuthenticated(true);
      localStorage.setItem("principalId", principal);

      await fetchUserRole(identity, principal);
    } catch (error) {
      console.error("❌ Error en la autenticación:", error);
      alert("Error de autenticación. Ver consola para más detalles.");
    }
  };

  // ✅ Verificar sesión al cargar la página
  useEffect(() => {
    const checkSession = async () => {
      console.log("🔄 Verificando sesión almacenada...");
      const storedPrincipal = localStorage.getItem("principalId");
      const storedRole = localStorage.getItem("userRole");

      if (storedPrincipal) {
        console.log("✅ Principal encontrado en almacenamiento:", storedPrincipal);
        setPrincipalId(storedPrincipal);
        setIsAuthenticated(true);

        const { AuthClient } = await import("@dfinity/auth-client");
        const authClient = await AuthClient.create();
        if (await authClient.isAuthenticated()) {
          console.log("✅ Identidad encontrada en AuthClient.");
          const identity = authClient.getIdentity();
          setIdentity(identity);
          await fetchUserRole(identity, storedPrincipal);
        }
      } else {
        console.log("🔹 No se encontró sesión activa.");
      }

      if (storedRole) {
        console.log("✅ Rol encontrado en almacenamiento:", storedRole);
        setUserRole(storedRole);
      }

      setIsLoading(false);
    };

    checkSession();
  }, []);

  // ✅ Manejo de desconexión
  const handleDisconnect = async () => {
    console.log("🔄 Cerrando sesión...");
    localStorage.clear();
    setIsAuthenticated(false);
    setUserRole(null);
    setPrincipalId(null);
    setIdentity(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        userRole,
        setUserRole,
        principalId,
        setPrincipalId,
        handleDisconnect,
        handleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
