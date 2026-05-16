// Esta es la pantalla de detalle del producto. Aquí es donde el usuario verá la información detallada de un producto específico después de seleccionarlo de una lista o realizar una búsqueda.

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { AlertBox } from "../../src/components/AlertBox";
import { Header } from "../../src/components/Header";
import { NutritionRow } from "../../src/components/NutritionRow";
import { ScoreBadge } from "../../src/components/ScoreBadge";
import { Typography } from "../../src/components/Typography";
import { MOCK_PRODUCTS } from "../../src/constants/mockProducts";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Buscamos el producto específico por su ID
  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.center}>
        <Typography variant="h2">Producto no encontrado</Typography>
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 1. HEADER ANCLADO (FUERA DEL SCROLLVIEW) */}
      <View style={styles.stickyHeader}>
        <Header onLeftPress={() => router.back()} rightElement="share" />
      </View>

      {/* 2. FONDO CORAL (Queda por debajo del header gracias al zIndex) */}
      <View
        style={[
          styles.colorBackground,
          { backgroundColor: product.backgroundColor },
        ]}
      />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Sección de la Imagen */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Tarjeta Blanca Superpuesta */}
        <View style={styles.card}>
          <View style={styles.favoriteButton}>
            <MaterialCommunityIcons name="heart" size={24} color="#27AE60" />
          </View>

          <Typography variant="caption" color={"#27AE60"} style={styles.brand}>
            {product.brand}
          </Typography>
          <Typography variant="h1" style={styles.title}>
            {product.name}
          </Typography>

          {/* Badges de puntuación */}
          <View style={styles.scoresRow}>
            <ScoreBadge
              type="nutri"
              grade={product.nutriscore}
              variant="card"
              backgroundColor={"#F4F6F6"}
            />
            {product.novaGroup && (
              <ScoreBadge
                type="nova"
                grade={product.novaGroup as any}
                variant="card"
                backgroundColor={"#F4F6F6"}
              />
            )}
            <ScoreBadge
              type="eco"
              grade={product.ecoscore}
              variant="card"
              backgroundColor={"#F4F6F6"}
            />
          </View>

          {/* Badges de nutrientes destacados */}
          <View style={styles.scoresRow}>
            <View style={styles.nutrientBadge}>
              <Typography
                variant="caption"
                color={"#1D8348"}
                style={styles.nutrientBadgeText}
              >
                ENERGY
              </Typography>
              <Typography
                variant="h3"
                color={"#1D8348"}
                style={styles.nutrientBadgeValue}
              >
                193 kJ
              </Typography>
            </View>
            <View style={styles.nutrientBadge}>
              <Typography
                variant="caption"
                color={"#1D8348"}
                style={styles.nutrientBadgeText}
              >
                FAT
              </Typography>
              <Typography
                variant="h3"
                color={"#1D8348"}
                style={styles.nutrientBadgeValue}
              >
                {product.nutritionalValues?.fat}
              </Typography>
            </View>
            <View style={styles.nutrientBadge}>
              <Typography
                variant="caption"
                color={"#1D8348"}
                style={styles.nutrientBadgeText}
              >
                PROTEIN
              </Typography>
              <Typography
                variant="h3"
                color={"#1D8348"}
                style={styles.nutrientBadgeValue}
              >
                {product.nutritionalValues?.protein}
              </Typography>
            </View>
          </View>

          {/* Sección de Ingredientes */}
          <View style={styles.ingredientsSection}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="leaf"
                size={20}
                color="#27AE60"
                style={{ marginRight: 8 }}
              />
              <Typography variant="h3">Ingredients</Typography>
            </View>
            <Typography variant="body" color="#5D6D7E" style={styles.paragraph}>
              {product.ingredients}
            </Typography>

            {product.allergens && (
              <AlertBox
                title="ALLERGEN INFORMATION"
                message={product.allergens}
              />
            )}
          </View>

          {/* Tabla Nutricional usando los nuevos componentes modulares */}
          <View style={styles.nutritionSection}>
            <Typography variant="h3" style={{ marginBottom: 16 }}>
              Nutritional Values (per 100ml)
            </Typography>

            {product.nutritionalValues && (
              <View>
                <NutritionRow
                  label="Energy"
                  value={product.nutritionalValues.energy}
                />
                <NutritionRow
                  label="Fat"
                  value={product.nutritionalValues.fat}
                />
                <NutritionRow
                  label="of which saturates"
                  value={product.nutritionalValues.saturatedFat}
                  indent
                />
                <NutritionRow
                  label="Carbohydrate"
                  value={product.nutritionalValues.carbs}
                />
                <NutritionRow
                  label="of which sugars"
                  value={product.nutritionalValues.sugars}
                  indent
                />
                <NutritionRow
                  label="Fibre"
                  value={product.nutritionalValues.fiber}
                />
                <NutritionRow
                  label="Protein"
                  value={product.nutritionalValues.protein}
                />
                <NutritionRow
                  label="Salt"
                  value={product.nutritionalValues.salt}
                />
              </View>
            )}
          </View>

          <View style={{ height: 60 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1, backgroundColor: "#F4F6F6" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  stickyHeader: {
    backgroundColor: "#FFFFFF",
    zIndex: 10, // Súper importante: asegura que el header siempre esté por encima de todo
    elevation: 5, // Sombra sutil en Android para separarlo del fondo
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  colorBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "45%",
  },
  imageSection: {
    width: "100%",
    height: 300,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    marginBottom: -40,
  },
  productImage: { width: "60%", height: "80%" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 24,
    minHeight: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  favoriteButton: {
    position: "absolute",
    top: -24,
    right: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },
  brand: { marginBottom: 8, letterSpacing: 1, fontWeight: "bold" },
  title: { marginBottom: 20 },
  scoresRow: { flexDirection: "row", marginBottom: 16, alignItems: "center" },
  nutrientBadge: {
    backgroundColor: "#D5F5E3",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    alignItems: "center",
  },
  nutrientBadgeText: { fontSize: 10, fontWeight: "bold", marginBottom: 4 },
  nutrientBadgeValue: { fontSize: 16, fontWeight: "bold" },
  ingredientsSection: {
    backgroundColor: "#F4F6F6",
    padding: 20,
    borderRadius: 12,
    marginVertical: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  paragraph: { lineHeight: 22, fontSize: 14, color: "#1C2833" },
  nutritionSection: { paddingVertical: 12 },
});
