# 🍃 Taller de Nuevas Tecnologías

Este proyecto es una entrega parcial para la aplicación mobile de la cursada. Es un catálogo enfocado en el descubrimiento consciente de productos alimenticios y bebidas.

El proyecto está construido con **React Native** y **Expo**, utilizando **TypeScript** para garantizar la seguridad de tipos y una arquitectura escalable.

---

## 🏗️ Arquitectura y Estructura del Proyecto

El proyecto sigue el principio de **Separación de Responsabilidades (Separation of Concerns)** y adopta un enfoque basado en componentes atómicos. La estructura de carpetas está diseñada para escalar fluidamente cuando se integre una API real en el futuro.

```text
📦 open-food-facts
 ┣ 📂 app/                  # Capa de Enrutamiento (Expo Router)
 ┃ ┣ 📜 index.tsx           # Pantalla de Inicio (Home Screen)
 ┃ ┣ 📜 results.tsx         # Pantalla de Lista/Filtros de Productos
 ┃ ┗ 📂 product/
 ┃   ┗ 📜 [id].tsx          # Pantalla de Detalle (Dynamic Route)
 ┣ 📂 assets/               # Recursos Locales (Offline-first approach)
 ┃ ┗ 📂 images/             # Banco de imágenes del proyecto
 ┃   ┣ 📂 brands/           # Logos de marcas
 ┃   ┗ 📂 products/         # Fotografías de productos
 ┣ 📂 src/                  # Código fuente modular
 ┃ ┣ 📂 components/         # Sistema de Diseño y UI Atómica
 ┃ ┣ 📂 constants/          # Capa de Datos Simulados (Mocking)
 ┃ ┣ 📂 hooks/              # [Reservado] Custom hooks para lógica y estado global (Post-API)
 ┃ ┣ 📂 services/           # [Reservado] Módulos de peticiones HTTP / Fetch (Post-API)
 ┃ ┣ 📂 types/              # Contratos y Tipado Estricto (TypeScript)
 ┃ ┗ 📂 utils/              # [Reservado] Funciones helper y formateadores (Post-API)
 ┗ 📜 package.json          # Dependencias y scripts

Aclaración:
 La separación de src fuera de app se debe a una convención técnica de Expo Router.
 Expo Router escanea de forma automática cada archivo y carpeta dentro del directorio app para transformarlo en una pantalla o ruta de navegación accesible.
 Arquitectónicamente, la carpeta app se reserva de forma exclusiva para definir el mapa de navegación de la aplicación.
 Mantener la carpeta src afuera significa que todo el motor de la app queda aislado de la infraestructura de rutas.
 Incluir src dentro de app serviría si se tratase de un proyecto estructurado bajo un esquema de navegación tradicional (como React Navigation), donde las rutas se escriben por código y no dependen de la ubicación física de las carpetas.
```
