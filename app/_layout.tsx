import { Stack } from "expo-router";

// Este es el layout raíz de la aplicación. Acá definimos la estructura de navegación y las pantallas principales.
// Este archivo es como el director de la navegación. Acá le decimos a Expo que queremos usar un Stack.
// Cada pantalla se define con un nombre y opciones.

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Inicio" }} />
      <Stack.Screen name="results" options={{ title: "Resultados" }} />
      <Stack.Screen
        name="product/[id]"
        options={{ title: "Detalle del Producto" }}
      />
    </Stack>
  );
}
