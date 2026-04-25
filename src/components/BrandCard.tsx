import { Dimensions, StyleSheet, View } from "react-native";
import { Typography } from "./Typography";

// Calculamos el ancho para 2 columnas
const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

interface BrandCardProps {
  name: string;
}

export function BrandCard({ name }: BrandCardProps) {
  return (
    <View style={styles.card}>
      {/* Contenedor del logo: un círculo blanco sobre el fondo gris claro */}
      <View style={styles.logoContainer}>
        <Typography variant="caption" color="#B2BABB" style={styles.logoText}>
          {name.substring(0, 2)} {/* Simulamos un logo con iniciales */}
        </Typography>
      </View>
      <Typography variant="body" style={styles.name}>
        {name}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 160,
    backgroundColor: "#F2F4F4", // Gris muy suave
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    // Sombra sutil para el círculo del logo
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoText: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
    textTransform: "lowercase",
    color: "#1C2833",
  },
});
