import { Typography } from "@/src/components/Typography";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { toProductSummary } from "../src/adapters/product";
import { Header } from "../src/components/Header";
import { ProductListItem } from "../src/components/ProductListItem";
import { SearchBar } from "../src/components/SearchBar";
import { useProductSearch } from "../src/hooks/useProductSearch";

// Esta es la pantalla de resultados. Acá es donde el usuario verá la lista de resultados después de realizar una búsqueda o acción que genere resultados.

export default function ResultsScreen() {
  const router = useRouter();

  // Extraemos los filtros dinámicos provenientes de la navegación
  const params = useLocalSearchParams();
  const { category, brand, taste } = params;

  const [searchQuery, setSearchQuery] = useState("");

  const { products, isLoading, isFetchingMore, totalCount, error, loadMore } =
    useProductSearch({
      text: searchQuery,
      categoryTag: category as string | undefined,
      brandTag: brand as string | undefined,
    });

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
        {error ? (
          <Typography variant="caption" color="#E74C3C" style={styles.subtitle}>
            {error}
          </Typography>
        ) : (
          <Typography variant="caption" color="gray" style={styles.subtitle}>
            {isLoading ? "BUSCANDO..." : `${totalCount} PRODUCTOS ENCONTRADOS`}
          </Typography>
        )}
      </View>

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
          onEndReached={loadMore} // Qué función llamar al llegar al final
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
          renderItem={({ item }) => (
            <ProductListItem
              product={toProductSummary(item)}
              onPress={() => router.push(`/product/${item.code}`)}
            />
          )}
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
