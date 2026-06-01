import { Typography } from "@/src/components/Typography";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Header } from "../src/components/Header";
import { ProductListItem } from "../src/components/ProductListItem";
import { SearchBar } from "../src/components/SearchBar";
import { searchProducts } from "../src/services/api";
import { APIProduct } from "../src/types/product";

// Esta es la pantalla de resultados. Acá es donde el usuario verá la lista de resultados después de realizar una búsqueda o acción que genere resultados.

export default function ResultsScreen() {
  const router = useRouter();

  // Extraemos los filtros dinámicos provenientes de la navegación
  const params = useLocalSearchParams();
  const { category, brand, taste } = params;

  // --- FASE 1: ESTADOS DE REACT ---
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<APIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // --- FASE 2: EL MOTOR DE BÚSQUEDA (CON DEBOUNCE) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setErrorMessage(null);
      setPage(1); // Reiniciamos la página a 1 ante una nueva búsqueda

      const queryToSearch =
        searchQuery.trim() !== "" ? searchQuery : category || brand || "drink";

      const { products, totalCount, error } = await searchProducts(
        queryToSearch as string,
        1,
      );

      setProducts(products);
      setTotalCount(totalCount);
      if (error) setErrorMessage(error);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, category, brand]);

  // FASE 2: CARGAR MÁS PRODUCTOS (Scroll Infinito)
  const handleLoadMore = async () => {
    // Si ya estamos cargando, o si ya descargamos todos los productos, no hacemos nada
    if (isFetchingMore || isLoading || products.length >= totalCount) return;

    setIsFetchingMore(true);
    const nextPage = page + 1;
    const queryToSearch =
      searchQuery.trim() !== "" ? searchQuery : category || brand || "drink";

    const { products: newProducts, error } = await searchProducts(
      queryToSearch as string,
      nextPage,
    );

    if (!error && newProducts.length > 0) {
      // Sumamos los productos nuevos a los que ya teníamos en memoria
      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      setPage(nextPage);
    }

    setIsFetchingMore(false);
  };

  const getHeaderTitle = () => {
    if (searchQuery) return `Buscando: ${searchQuery}`;
    if (category) return category;
    if (brand) return brand;
    if (taste) return taste;
    return "Descubrir";
  };

  return (
    <View style={styles.container}>
      {/* Ocultamos el header nativo de Expo Router */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Colocamos nuestro Header */}
      <Header onLeftPress={() => router.back()} rightElement="avatar" />

      <View style={styles.titleSection}>
        <Typography variant="h1" style={styles.title}>
          {getHeaderTitle()}
        </Typography>
        {errorMessage ? (
          <Typography variant="caption" color="#E74C3C" style={styles.subtitle}>
            {errorMessage}
          </Typography>
        ) : (
          <Typography variant="caption" color="gray" style={styles.subtitle}>
            {isLoading ? "BUSCANDO..." : `${totalCount} PRODUCTOS ENCONTRADOS`}
          </Typography>
        )}
      </View>

      {/* --- FASE 3: RENDERIZADO DE LA LISTA --- */}
      {isLoading ? (
        <View style={styles.centerIndicator}>
          <ActivityIndicator size="large" color="#27AE60" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item, index) => item.code + index.toString()}
          ListHeaderComponent={
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          }
          // --- MAGIA DEL SCROLL INFINITO AQUÍ ---
          onEndReached={handleLoadMore} // Qué función llamar al llegar al final
          onEndReachedThreshold={0.5} // Qué tan cerca del final debe dispararse (0.5 = a mitad de la última tarjeta)
          ListFooterComponent={
            // Rueda de carga pequeña al final de la lista
            isFetchingMore ? (
              <ActivityIndicator
                size="small"
                color="#27AE60"
                style={{ marginVertical: 20 }}
              />
            ) : null
          }
          // --------------------------------------
          renderItem={({ item }) => {
            const mappedProduct: any = {
              id: item.code,
              name: item.product_name || "Sin Nombre",
              brand: item.brands || "Marca desconocida",
              imageUrl: item.image_url ? { uri: item.image_url } : null,
              nutriscore: item.nutriscore_grade
                ? item.nutriscore_grade.toUpperCase()
                : "?",
              ecoscore: item.ecoscore_grade
                ? item.ecoscore_grade.toUpperCase()
                : "?",
              novaGroup: item.nova_group || null,
            };

            return (
              <ProductListItem
                product={mappedProduct}
                onPress={() => router.push(`/product/${item.code}`)}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDFEFE" },
  titleSection: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  title: { textTransform: "capitalize" },
  subtitle: { marginTop: 4, letterSpacing: 1, textTransform: "uppercase" },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  centerIndicator: { flex: 1, justifyContent: "center", alignItems: "center" },
});
