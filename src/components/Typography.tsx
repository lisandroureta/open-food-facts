// Este componente es una especie de "wrapper" para el componente Text de React Native
// Nos permite definir estilos predefinidos para diferentes tipos de texto (títulos, cuerpo, etc.) y mantener la consistencia en toda la aplicación.
// Además, nos da la flexibilidad de personalizar el color y la alineación del texto según sea necesario.

import { StyleSheet, Text, TextProps } from "react-native";

// Definimos las variantes que detectamos en los diseños
interface TypographyProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "body" | "caption";
  color?: string;
  align?: "auto" | "left" | "right" | "center" | "justify";
}

export function Typography({
  variant = "body", // Por defecto será un texto normal
  color = "#1A1A1A", // Un gris casi negro por defecto (mejor que negro puro)
  align = "left",
  style,
  children,
  ...rest // Permite pasar otras props nativas de Text (ej: numberOfLines)
}: TypographyProps) {
  return (
    <Text
      style={[
        styles[variant],
        { color, textAlign: align },
        style, // Permitimos sobreescribir estilos si es estrictamente necesario
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

// una especie de diccionario de estilos centralizado
const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: -0.5, // Los títulos grandes suelen verse mejor un poco más juntos
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold",
  },
  h3: {
    fontSize: 18,
    fontWeight: "600",
  },
  body: {
    fontSize: 16,
    fontWeight: "normal",
  },
  caption: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase", // Ideal para las letritas pequeñas de las categorías
  },
});
