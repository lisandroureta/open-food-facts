import { Stack } from "expo-router";

// Este es el layout raíz de la aplicación. Aquí definimos la estructura de navegación y las pantallas principales.
// Este archivo es el "director de orquesta" de la navegación. Aquí le diremos a Expo que queremos usar un Stack.
// Cada pantalla se define con un nombre y opciones, como el título que aparecerá en la barra superior.

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
