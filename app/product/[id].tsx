// Esta es la pantalla de detalle del producto. Aquí es donde el usuario verá la información detallada de un producto específico después de seleccionarlo de una lista o realizar una búsqueda.

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";
import { AlertBox } from "../../src/components/AlertBox";
import { ScoreBadge } from "../../src/components/ScoreBadge";
import { Typography } from "../../src/components/Typography";
import { MOCK_PRODUCTS } from "../../src/constants/mockProducts";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();

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
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Modificamos el Header nativo para que sea transparente */}
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerTintColor: "#1A1A1A", // Color de la flecha de volver
        }}
      />

      {/* 2. Sección Superior: Imagen con fondo de color */}
      <View
        style={[
          styles.imageBackground,
          { backgroundColor: product.backgroundColor || "#F2F4F4" },
        ]}
      >
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>

      {/* 3. Tarjeta Blanca Superpuesta (El truco del margen negativo) */}
      <View style={styles.card}>
        {/* Botón flotante de Favorito */}
        <View style={styles.favoriteButton}>
          <MaterialCommunityIcons name="heart" size={24} color="#27AE60" />
        </View>

        {/* Info Principal */}
        <Typography variant="caption" color="#27AE60" style={styles.brand}>
          {product.brand}
        </Typography>
        <Typography variant="h1" style={styles.title}>
          {product.name}
        </Typography>

        {/* Badges (Podríamos reutilizar ScoreBadge aquí y acomodarlos en Flexbox) */}
        <View style={styles.scoresRow}>
          <ScoreBadge type="nutri" grade={product.nutriscore} />
          <ScoreBadge type="eco" grade={product.ecoscore} />
          {/* Si tuviéramos un componente NovaBadge, iría aquí */}
        </View>

        <View style={styles.divider} />

        {/* Ingredientes */}
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

        {/* Alerta de Alérgenos */}
        {product.allergens && (
          <AlertBox title="ALLERGEN INFORMATION" message={product.allergens} />
        )}

        <View style={styles.divider} />

        {/* Tabla Nutricional Simulada */}
        <Typography variant="h3" style={{ marginBottom: 16 }}>
          Nutritional Values (per 100ml)
        </Typography>

        {product.nutritionalValues && (
          <View>
            <View style={styles.tableRow}>
              <Typography variant="body" color="#5D6D7E">
                Energy
              </Typography>
              <Typography variant="body" style={{ fontWeight: "bold" }}>
                {product.nutritionalValues.energy}
              </Typography>
            </View>
            <View style={styles.tableRow}>
              <Typography variant="body" color="#5D6D7E">
                Fat
              </Typography>
              <Typography variant="body" style={{ fontWeight: "bold" }}>
                {product.nutritionalValues.fat}
              </Typography>
            </View>
            <View style={styles.tableRow}>
              <Typography variant="body" color="#5D6D7E">
                Saturated Fat
              </Typography>
              <Typography variant="body" style={{ fontWeight: "bold" }}>
                {product.nutritionalValues.saturatedFat}
              </Typography>
            </View>
            <View style={styles.tableRow}>
              <Typography variant="body" color="#5D6D7E">
                Carbs
              </Typography>
              <Typography variant="body" style={{ fontWeight: "bold" }}>
                {product.nutritionalValues.carbs}
              </Typography>
            </View>
            <View style={styles.tableRow}>
              <Typography variant="body" color="#5D6D7E">
                Sugars
              </Typography>
              <Typography variant="body" style={{ fontWeight: "bold" }}>
                {product.nutritionalValues.sugars}
              </Typography>
            </View>
            <View style={styles.tableRow}>
              <Typography variant="body" color="#5D6D7E">
                Fiber
              </Typography>
              <Typography variant="body" style={{ fontWeight: "bold" }}>
                {product.nutritionalValues.fiber}
              </Typography>
            </View>
            <View style={styles.tableRow}>
              <Typography variant="body" color="#5D6D7E">
                Protein
              </Typography>
              <Typography variant="body" style={{ fontWeight: "bold" }}>
                {product.nutritionalValues.protein}
              </Typography>
            </View>
            <View style={styles.tableRow}>
              <Typography variant="body" color="#5D6D7E">
                Salt
              </Typography>
              <Typography variant="body" style={{ fontWeight: "bold" }}>
                {product.nutritionalValues.salt}
              </Typography>
            </View>
            {/* Aquí podrías mapear el resto de los valores nutricionales... */}
          </View>
        )}

        <View style={{ height: 60 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  imageBackground: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.45, // Ocupa el 45% de la pantalla
    paddingTop: 80, // Espacio para el header transparente
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: { width: "60%", height: "80%" },
  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32, // ¡El truco de superposición!
    padding: 24,
    minHeight: SCREEN_HEIGHT * 0.6,
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
  },
  brand: { marginBottom: 8, letterSpacing: 1 },
  title: { marginBottom: 20 },
  scoresRow: { flexDirection: "row", marginBottom: 24 },
  divider: { height: 1, backgroundColor: "#EAEDED", marginVertical: 24 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  paragraph: { lineHeight: 24 },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F4F4",
  },
});
