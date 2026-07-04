# 🍃 Taller de Nuevas Tecnologías

Este proyecto es la entrega funcional para la aplicación mobile de la cursada. Es un catálogo enfocado en el descubrimiento de productos alimenticios y bebidas, consumiendo datos reales a nivel global.

El proyecto está construido con **React Native** y **Expo**, utilizando **TypeScript** y una arquitectura escalable.

---

## 🚀 Nuevas Funcionalidades Implementadas (segunda entrega)

En esta fase del proyecto, evolucionamos de un prototipo estático a una aplicación dinámica conectada al hardware del dispositivo:

- **Consumo de API Real (Open Food Facts):** Reemplazamos los datos _mockeados_ por un motor de búsqueda real. Utilizamos `fetch` nativo para evitar dependencias innecesarias, aplicando contramedidas para el manejo de errores de saturación del servidor.
- **Paginación y Scroll Infinito:** El catálogo se descarga en bloques de 10 productos. Al acercarse al final de la lista, la app solicita automáticamente la siguiente página sin bloquear la interfaz.
- **Hardware y Escáner Óptico:** Integración nativa de la cámara (`expo-camera`) para escanear códigos de barras, con manejo de permisos del sistema y congelamiento de lente mediante estado de memoria.
- **Persistencia de Datos Local:** Implementación de `AsyncStorage` para guardar los productos "Favoritos" en el dispositivo del usuario, permitiendo que la lista sobreviva a los reinicios de la aplicación.
- **Navegación Híbrida (Stack + Tabs):** Arquitectura de rutas que combina una barra inferior persistente para las vistas principales, pero que se oculta automáticamente (Stack) al entrar a la vista de detalle para maximizar el espacio de lectura.

---

### 🧠 Decisiones Técnicas y Convenciones

1.  **Carpeta `src` aislada:** La separación de `src` fuera de `app` se debe a una convención técnica de Expo Router. La carpeta `app` se reserva exclusivamente para el mapa de navegación. Mantener `src` afuera significa que la lógica pura y los componentes quedan protegidos de la infraestructura de rutas automáticas.
2.  **Grupos de Rutas `(tabs)`:** Se utilizaron paréntesis en la nomenclatura para crear un "Route Group". Esto permite envolver pantallas específicas con una barra de navegación inferior sin afectar la estética de pantallas de lectura profunda (como Detalles o Resultados).
3.  **Eliminación de Mocks:** La carpeta de constantes y datos falsos fue eliminada intencionalmente del repositorio bajo el principio de mantener el código limpio de artefactos sin uso en la fase de producción/API.
4.  **Patrón de Servicios vs. Custom Hooks:** La carpeta `hooks/` se mantiene intencionalmente vacía como un _placeholder_ arquitectónico para futura escalabilidad. En esta etapa, se decidió delegar la lógica de negocio y persistencia a una capa de **Servicios** pura en TypeScript (`services/api.ts` y `services/storage.ts`), manteniendo los componentes visuales limpios utilizando únicamente los hooks nativos de React y Expo (`useState`, `useEffect`, `useFocusEffect`).

---

## 🏗️ Arquitectura y Estructura del Proyecto

El proyecto sigue el principio de **Separación de Responsabilidades**. Se eliminó la capa de datos simulados (`constants/`) al pasar a un entorno de consumo real.

```text
📦 open-food-facts
 ┣ 📂 app/                  # Capa de enrutamiento (Expo Router)
 ┃ ┣ 📂 (tabs)/             # Grupo de Navegación Inferior (oculto en URLs)
 ┃ ┃ ┣ 📜 _layout.tsx       # Configuración visual de la navegación inferior
 ┃ ┃ ┣ 📜 index.tsx         # Pantalla de Inicio (Home)
 ┃ ┃ ┣ 📜 search.tsx        # Motor de búsqueda general
 ┃ ┃ ┗ 📜 favorites.tsx     # Lista persistente de favoritos
 ┃ ┣ 📜 _layout.tsx         # Root Layout (maneja el Stack vs Tabs)
 ┃ ┣ 📜 results.tsx         # Resultados categorizados (oculta la barra de navegación)
 ┃ ┣ 📜 scanner.tsx         # Interfaz de hardware (cámara)
 ┃ ┗ 📂 product/
 ┃   ┗ 📜 [id].tsx          # Pantalla de Detalle
 ┣ 📂 assets/               # Recursos Locales
 ┣ 📂 src/                  # Código fuente
 ┃ ┣ 📂 components/         # Sistema de diseño y UI atómica (reutilizable)
 ┃ ┣ 📂 services/           # Lógica de negocio aislada de la UI
 ┃ ┃ ┣ 📜 api.ts            # Peticiones HTTP, paginación y formateo
 ┃ ┃ ┗ 📜 storage.ts        # Motor de lectura/escritura en disco (AsyncStorage)
 ┃ ┗ 📂 types/              # Contratos y Tipado Estricto (TypeScript)
 ┗ 📜 package.json          # Dependencias y scripts
```
