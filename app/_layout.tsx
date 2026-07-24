import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";
import { FavoritesProvider } from "../src/context/FavoritesContext";

// Este es el layout raíz de la aplicación. Acá definimos la estructura de navegación y las pantallas principales.
// Este archivo es como el director de la navegación. Acá le decimos a Expo que queremos usar un Stack junto a una barra de navegación.
// Cada pantalla se define con un nombre y opciones.

export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        {/* Este Stack envuelve TODA la aplicación */}
        <Stack>
          {/* Le decimos que la carpeta (tabs) es la base, y le ocultamos el header por defecto */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Registramos las pantallas sueltas para que puedan montarse POR ENCIMA de las pestañas */}
          <Stack.Screen name="results" options={{ headerShown: false }} />
          <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
      </FavoritesProvider>
    </AuthProvider>
  );
}
