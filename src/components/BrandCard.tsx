import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Typography } from "./Typography";

// Calculamos el ancho para 2 columnas
const SCREEN_WIDTH = Dimensions.get("window").width;
// La pantalla tiene un padding de 20px de cada lado (40px en total)
// Para que el hueco del medio sea de 16 píxeles, la matemática debe ser: 40 (padding) + 16 (hueco) = 56
const CARD_WIDTH = (SCREEN_WIDTH - 56) / 2;

interface BrandCardProps {
  name: string;
  logo?: ImageSourcePropType;
  onPress: () => void;
}

export function BrandCard({ name, logo, onPress }: BrandCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.8 : 1 }]}
    >
      <View style={styles.logoContainer}>
        {logo ? (
          // Si hay logo, mostramos la imagen
          <Image source={logo} style={styles.logoImage} resizeMode="contain" />
        ) : (
          // Si no hay logo en la futura base de datos, mostramos un texto de reserva (Fallback)
          <Typography variant="caption" color="#B2BABB" style={styles.logoText}>
            {name.substring(0, 2)}
          </Typography>
        )}
      </View>
      <Typography variant="body" style={styles.name}>
        {name}
      </Typography>
    </Pressable>
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
  logoImage: { width: 40, height: 40 },
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
