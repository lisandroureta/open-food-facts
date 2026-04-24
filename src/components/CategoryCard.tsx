import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { Typography } from "./Typography";

// Calculamos el ancho para que entren 2 por fila con margen
const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2; // Pantalla menos márgenes laterales

interface CategoryCardProps {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  colors: readonly [string, string];
  onPress: () => void;
}

export function CategoryCard({
  title,
  icon,
  colors,
  onPress,
}: CategoryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
    >
      {/* Reemplazamos la View base por LinearGradient */}
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }} // Arriba a la izquierda
        end={{ x: 1, y: 1 }} // Abajo a la derecha
        style={styles.card}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={icon}
            size={32}
            color="white"
            style={styles.icon}
          />
        </View>
        <Typography variant="caption" color="white" style={styles.title}>
          {title}
        </Typography>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    borderRadius: 16,
    padding: 16,
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  iconContainer: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  icon: {
    opacity: 0.5, // Estilo sutil como en el diseño
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "lowercase", // Para que coincida con el diseño "beverages"
  },
});
