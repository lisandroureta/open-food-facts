import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Product } from "../types";
import { ScoreBadge } from "./ScoreBadge";
import { Typography } from "./Typography";

interface ProductListItemProps {
  product: Product;
  onPress: () => void;
}

export function ProductListItem({ product, onPress }: ProductListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      {/* Imagen */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Info Central */}
      <View style={styles.infoContainer}>
        <Typography variant="h3" style={styles.name} numberOfLines={2}>
          {product.name}
        </Typography>
        <Typography variant="caption" color="#7F8C8D" style={styles.brand}>
          {product.brand}
        </Typography>

        {/* Badges */}
        <View style={styles.badgesContainer}>
          <ScoreBadge type="nutri" grade={product.nutriscore} />
          <ScoreBadge type="eco" grade={product.ecoscore} />
        </View>
      </View>

      {/* Flecha Derecha */}
      <View style={styles.arrowContainer}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color="#BDC3C7"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#F8F9F9",
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
  },
  image: { width: "100%", height: "100%" },
  infoContainer: { flex: 1, justifyContent: "center" },
  name: { fontSize: 16, marginBottom: 4 },
  brand: { marginBottom: 8, textTransform: "uppercase" },
  badgesContainer: { flexDirection: "row" },
  arrowContainer: { marginLeft: 8 },
});
