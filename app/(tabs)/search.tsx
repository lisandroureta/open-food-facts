// app/(tabs)/search.tsx
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import { Header } from "../../src/components/Header";
import { ProductListItem } from "../../src/components/ProductListItem";
import { SearchBar } from "../../src/components/SearchBar";
import { Typography } from "../../src/components/Typography";
import { searchProducts } from "../../src/services/api";

export default function SearchTabScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // controlador de búsqueda
  useEffect(() => {
    // Debounce de para evitar colapsar la API con peticiones por cada letra que se escribe
    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      // Reiniciamos el contador de páginas a 1 porque iniciamos una búsqueda nueva
      setPage(1);

      // Si el buscador está vacío pasamos un espacio en blanco para forzar a la API a devolvernos el catálogo general paginado
      const queryToSearch = searchQuery.trim() !== "" ? searchQuery : " ";

      const { products, totalCount } = await searchProducts(queryToSearch, 1);

      setProducts(products);
      setTotalCount(totalCount);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // controlador del scroll infinito
  const handleLoadMore = async () => {
    // Validamos que no haya una descarga en curso o que ya hayamos llegado al límite total de productos en el servidor
    if (isFetchingMore || isLoading || products.length >= totalCount) return;

    setIsFetchingMore(true);
    const nextPage = page + 1;
    const queryToSearch = searchQuery.trim() !== "" ? searchQuery : " ";

    const { products: newProducts } = await searchProducts(
      queryToSearch,
      nextPage,
    );

    // Si la API nos devuelve nuevos datos, los anexamos al final del arreglo existente manteniendo la lista en memoria
    if (newProducts.length > 0) {
      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      setPage(nextPage);
    }

    setIsFetchingMore(false);
  };

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
          onEndReached={handleLoadMore}
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
          renderItem={({ item }) => {
            // Mapeamos los nombres crudos de Open Food Facts a nuestra estructura de tipados
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
  subtitle: { marginTop: 4, letterSpacing: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  centerIndicator: { flex: 1, justifyContent: "center", alignItems: "center" },
});
