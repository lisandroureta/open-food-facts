import { AlertBox } from "@/src/components/AlertBox";
import { NutritionRow } from "@/src/components/NutritionRow";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "../../src/components/Header";
import { ScoreBadge } from "../../src/components/ScoreBadge";
import { Typography } from "../../src/components/Typography";
import { getProductByBarcode } from "../../src/services/api";
import { checkIsFavorite, toggleFavorite } from "../../src/services/storage";
import { APIProduct } from "../../src/types/product";

// Esta es la pantalla de detalle del producto. Aquí es donde el usuario verá la información detallada de un producto específico después de seleccionarlo de una lista o realizar una búsqueda.

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  // Normalizamos la variable asegurándonos de que sea un texto simple (y si no existe, un texto vacío)
  const safeId = Array.isArray(id) ? id[0] : id || "";

  // MEMORIA (ESTADO)
  const [product, setProduct] = useState<APIProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // CICLO DE VIDA (CONEXIÓN A INTERNET)
  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      setError(null);

      // TRUCO TEMPORAL: Si vienes del Home tocando la botella de Oatly (id '3'),
      // forzamos a que busque la Coca-Cola para probar la API real.
      // Si ya le pasas un código de barras real, usa ese.
      const barcodeToSearch =
        safeId === "3" ? "5449000000996" : (safeId as string);

      const data = await getProductByBarcode(barcodeToSearch);

      if (data && data.product) {
        setProduct(data.product);
        // Revisamos si este código de barras ya está guardado en el teléfono
        const favoriteStatus = await checkIsFavorite(barcodeToSearch);
        setIsFavorite(favoriteStatus);
      } else {
        setError("Producto no encontrado en la base de datos mundial.");
      }

      setIsLoading(false);
    };

    fetchProductData();
  }, [safeId]);

  // Función que se ejecuta al tocar el corazón
  const handleToggleFavorite = async () => {
    if (!product) return;

    // Armamos un producto "ligero" solo con lo que necesitamos para la lista de favoritos
    const compactProduct = {
      id: product.code,
      name: product.product_name || "Sin Nombre",
      brand: product.brands || "Marca desconocida",
      imageUrl: product.image_url ? { uri: product.image_url } : null,
      nutriscore: product.nutriscore_grade
        ? product.nutriscore_grade.toUpperCase()
        : "?",
      ecoscore: product.ecoscore_grade
        ? product.ecoscore_grade.toUpperCase()
        : "?",
      novaGroup: product.nova_group || null,
    };

    // Mandamos la orden al disco duro
    const isNowFavorite = await toggleFavorite(compactProduct);

    // Actualizamos la pantalla al instante
    setIsFavorite(isNowFavorite);
  };

  // RENDERIZADO DE ESTADOS DE CARGA Y ERROR
  if (isLoading) {
    return (
      <View style={[styles.rootContainer, styles.center]}>
        <ActivityIndicator size="large" color="#27AE60" />
        <Typography variant="body" color="gray" style={{ marginTop: 16 }}>
          Conectando con Open Food Facts...
        </Typography>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.rootContainer, styles.center]}>
        <Header onLeftPress={() => router.back()} />
        <Typography
          variant="h2"
          color="#C0392B"
          style={{ textAlign: "center", padding: 20 }}
        >
          {error}
        </Typography>
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header anclado (sticky) fuera del flujo del Scroll, con Z-Index 10 para que siempre esté por encima de todo */}
      <View style={styles.stickyHeader}>
        <Header onLeftPress={() => router.back()} rightElement="share" />
      </View>

      {/* Fondo de color absoluto (que depende del producto). Cubre la mitad de la pantalla y queda detrás del contenido (Z-Index 1) */}
      <View style={[styles.colorBackground, { backgroundColor: "#E5E7E9" }]} />

      {/* ScrollView. Contiene la imagen del producto y la tarjeta flotante. Z-Index 5 */}
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Sección de la Imagen */}
        <View style={styles.imageSection}>
          {product.image_url && (
            <>
              {/* Mostramos una rueda de carga SOLO si la imagen sigue bajando */}
              {isImageLoading && (
                <ActivityIndicator
                  size="large"
                  color="#27AE60"
                  style={{ position: "absolute", zIndex: 1 }}
                />
              )}

              <Image
                source={{ uri: product.image_url }}
                style={styles.productImage}
                resizeMode="contain"
                // React Native nos avisa cuando empieza y termina de descargar
                onLoadStart={() => setIsImageLoading(true)}
                onLoadEnd={() => setIsImageLoading(false)}
              />
            </>
          )}
        </View>

        {/* Tarjeta blanca flotante */}
        <View style={styles.card}>
          {/* Botón interactivo de favoritos */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color="#27AE60"
            />
          </TouchableOpacity>

          <Typography variant="caption" color={"#27AE60"} style={styles.brand}>
            {product.brands || "Marca Desconocida"}
          </Typography>
          <Typography variant="h1" style={styles.title}>
            {product.product_name || "Sin Nombre"}
          </Typography>

          {/* Badges de puntuación */}
          <View style={styles.scoresRow}>
            {product.nutriscore_grade && (
              <ScoreBadge
                type="nutri"
                grade={product.nutriscore_grade.toUpperCase() as any}
                variant="card"
                backgroundColor={"#F4F6F6"}
              />
            )}

            {product.ecoscore_grade && (
              <ScoreBadge
                type="eco"
                grade={product.ecoscore_grade.toUpperCase() as any}
                variant="card"
                backgroundColor={"#F4F6F6"}
              />
            )}

            {product.nova_group && (
              <ScoreBadge
                type="nova"
                grade={product.nova_group as any}
                variant="card"
                backgroundColor={"#F4F6F6"}
              />
            )}
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
                {product.nutriments?.energy}
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
                {product.nutriments?.fat}
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
                {product.nutriments?.proteins}
              </Typography>
            </View>
            <View style={styles.nutrientBadge}>
              <Typography
                variant="caption"
                color={"#1D8348"}
                style={styles.nutrientBadgeText}
              >
                CARBS
              </Typography>
              <Typography
                variant="h3"
                color={"#1D8348"}
                style={styles.nutrientBadgeValue}
              >
                {product.nutriments?.carbohydrates}
              </Typography>
            </View>
          </View>

          {/* Sección de ingredientes */}
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
              {product.ingredients_text}
            </Typography>

            {product.allergens && (
              <AlertBox
                title="ALLERGEN INFORMATION"
                message={product.allergens}
              />
            )}
          </View>

          {/* Tabla nutricional usando los componentes modulares */}
          <View style={styles.nutritionSection}>
            <Typography variant="h3" style={{ marginBottom: 16 }}>
              Nutritional Values (per 100ml)
            </Typography>

            {product.nutriments && (
              <View>
                <NutritionRow
                  label="Energy"
                  value={product.nutriments.energy?.toString() || "-"}
                />
                <NutritionRow
                  label="Fat"
                  value={product.nutriments.fat?.toString() || "-"}
                />
                <NutritionRow
                  label="of which saturates"
                  value={product.nutriments["saturated-fat"]?.toString() || "-"}
                  indent
                />
                <NutritionRow
                  label="Carbohydrate"
                  value={product.nutriments.carbohydrates?.toString() || "-"}
                />
                <NutritionRow
                  label="of which sugars"
                  value={product.nutriments.sugars?.toString() || "-"}
                  indent
                />
                <NutritionRow
                  label="Fibre"
                  value={product.nutriments.fiber?.toString() || "-"}
                />
                <NutritionRow
                  label="Protein"
                  value={product.nutriments.proteins?.toString() || "-"}
                />
                <NutritionRow
                  label="Salt"
                  value={product.nutriments.salt?.toString() || "-"}
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
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
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
