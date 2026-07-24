// app/(tabs)/search.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import { toProductSummary } from "../../src/adapters/product";
import { Header } from "../../src/components/Header";
import { ProductListItem } from "../../src/components/ProductListItem";
import { SearchBar } from "../../src/components/SearchBar";
import { Typography } from "../../src/components/Typography";
import { useProductSearch } from "../../src/hooks/useProductSearch";

export default function SearchTabScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const { products, isLoading, isFetchingMore, totalCount, loadMore } =
    useProductSearch({ text: searchQuery });

  return (
    <View style={styles.container}>
      {/* Implementamos nuestro header personalizado */}
      <Header leftIcon="menu" rightElement="avatar" />

      <View style={styles.titleSection}>
        <Typography variant="h1" style={styles.title}>
          Buscar
        </Typography>
        <Typography variant="caption" color="gray" style={styles.subtitle}>
          {isLoading ? "BUSCANDO..." : `${totalCount} PRODUCTOS ENCONTRADOS`}
        </Typography>
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
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              // Desplegamos el escáner poniendolo encima de la navegación del Stack
              onBarcodePress={() => router.push("/scanner")}
            />
          }
          // Disparamos la carga de la siguiente página cuando el usuario se acerca al 50% del final de la pantalla activa
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator
                size="small"
                color="#27AE60"
                style={{ marginVertical: 20 }}
              />
            ) : null
          }
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
  subtitle: { marginTop: 4, letterSpacing: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  centerIndicator: { flex: 1, justifyContent: "center", alignItems: "center" },
});
