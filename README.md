# `HechoenOaxaca-icp`

Bienvenido a **HechoenOaxaca-icp**, un proyecto de plataforma marketplace desarrollado sobre **Internet Computer**. Este marketplace permite a los usuarios registrarse y participar en diferentes roles dentro de la plataforma, según sus intereses y objetivos:

- **Productores Artesanos:** Creadores de productos artesanales que pueden vender sus productos en la plataforma.
- **Socios Estratégicos:** Usuarios que apoyan la comercialización y distribución de los productos.
- **Consumidores:** Personas interesadas en adquirir productos exclusivos hechos en Oaxaca.

El objetivo de este proyecto es facilitar la comercialización de productos artesanales oaxaqueños utilizando tecnologías descentralizadas para garantizar transparencia, seguridad y accesibilidad global.

## Requisitos Previos
Para desarrollar y ejecutar este proyecto localmente, asegúrate de tener instalados los siguientes programas y herramientas:

### 1. Instalación de Dependencias Básicas

#### **Node.js y npm** (para gestionar paquetes y ejecutar el frontend)
- Descarga e instala [Node.js](https://nodejs.org/), asegurándote de incluir `npm`.
- Verifica la instalación ejecutando:
  ```bash
  node -v
  npm -v
  ```

#### **DFX SDK** (para desplegar canisters en Internet Computer)
- Instala el SDK de Internet Computer con:
  ```bash
  sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
  ```
- Verifica la instalación con:
  ```bash
  dfx --version
  ```

#### **Ubuntu (WSL2, para Windows)**
Si usas Windows, es recomendable instalar **WSL2 (Windows Subsystem for Linux)** y una distribución de Ubuntu para ejecutar `dfx` y otros comandos sin problemas.
- Sigue la guía oficial de instalación de [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install).

## Estructura del Proyecto
Al clonar este repositorio, encontrarás los siguientes archivos y carpetas principales:
- **src/backend/** → Código del canister backend en Motoko.
- **src/frontend/** → Código de la interfaz gráfica de usuario.
- **dfx.json** → Configuración del proyecto en Internet Computer.

## Despliegue y Ejecución Local
Si quieres probar el proyecto localmente, sigue estos pasos:

### 1. Iniciar el Replica Local
```bash
cd HechoenOaxaca-icp/
dfx start --background
```
Este comando inicia el entorno local de Internet Computer.

### 2. Desplegar los Canisters
```bash
dfx deploy
```
Este proceso genera los canisters backend y frontend y proporciona los enlaces de acceso.

- **Backend:** URL del servicio backend para procesar la lógica de negocio.
- **Frontend:** Enlace donde se aloja la interfaz de usuario.
- **Internet Identity:** Servicio de autenticación de Internet Computer.

### 3. Iniciar el Servidor de Desarrollo (Frontend)
```bash
npm install  # Instalar dependencias del frontend
npm run start
```
Esto iniciará el servidor de desarrollo y la aplicación estará disponible en:
- `http://localhost:3000` para la interfaz gráfica.
- `http://localhost:8080` si usa un proxy para API.

## Desarrollo y Modificaciones
Si realizas cambios en el backend, genera una nueva interfaz Candid con:
```bash
npm run generate
```
Esto garantiza la compatibilidad entre el backend y el frontend.

## Documentación Adicional
Si necesitas más información sobre el desarrollo en Internet Computer, revisa:
- [Guía de Instalación](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Introducción a Motoko](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Referencia Rápida de Motoko](https://internetcomputer.org/docs/current/motoko/main/language-manual)

## Contribuciones y Contacto
Si deseas contribuir o tienes dudas sobre el proyecto, puedes abrir un issue en este repositorio o contactar al equipo de desarrollo.

¡Bienvenido a **HechoenOaxaca-icp**! 🚀

