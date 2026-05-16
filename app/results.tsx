import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Header } from "../src/components/Header";
import { ProductListItem } from "../src/components/ProductListItem";
import { SearchBar } from "../src/components/SearchBar";
import { Typography } from "../src/components/Typography";
import { MOCK_PRODUCTS } from "../src/constants/mockProducts";

// Esta es la pantalla de resultados. Acá es donde el usuario verá la lista de resultados después de realizar una búsqueda o acción que genere resultados.

export default function ResultsScreen() {
  const router = useRouter();

  // Extraemos los filtros dinámicos provenientes de la navegación
  const params = useLocalSearchParams();
  const { category, brand, taste } = params;

  // Estado para el texto de búsqueda
  const [searchQuery, setSearchQuery] = useState("");

  // Filtramos la base de datos simulada según el parámetro que llegó
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    // Filtrado por parámetros del Home
    const matchesCategory = category ? product.categoryId === category : true;
    const matchesBrand = brand ? product.brandId === brand : true;
    const matchesTaste = taste
      ? product.tastes.includes(taste as string)
      : true;

    // Filtrado por texto de búsqueda (nombre del producto o marca)
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesBrand && matchesTaste && matchesSearch;
  });

  // Calculamos el título de la pantalla
  const getHeaderTitle = () => {
    if (category) return category.toString();
    if (brand) return brand.toString();
    if (taste) return taste.toString();
    return "Search";
  };

  return (
    <View style={styles.container}>
      {/* Ocultamos el header nativo de Expo Router */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Colocamos nuestro Header */}
      <Header onLeftPress={() => router.back()} rightElement="avatar" />

      {/* Títulos de la sección */}
      <View style={styles.titleSection}>
        <Typography variant="h1" style={styles.title}>
          {getHeaderTitle()}
        </Typography>
        <Typography variant="caption" color="gray" style={styles.subtitle}>
          {filteredProducts.length} ITEMS FOUND
        </Typography>
      </View>

      {/* Utilizamos FlatList en lugar de ScrollView por rendimiento.
        FlatList hace lazy rendering para mostrar solo los elementos visibles en pantalla.
      */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductListItem
            product={item}
            // La mejor práctica con Expo Router y TypeScript para rutas dinámicas es pasar el "molde"
            // exacto de la ruta en el pathname y pasar los datos dinámicos a través de params.
            onPress={() =>
              router.push({
                pathname: "/product/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        // Ponemos la barra de búsqueda dentro de la lista para que haga scroll con ella
        // La barra queda como cabecera nativa de la lista.
        // Esto previene fallos de foco con el teclado virtual.
        ListHeaderComponent={
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDFEFE" },
  titleSection: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  title: { textTransform: "capitalize" },
  subtitle: { marginTop: 4, letterSpacing: 1, textTransform: "uppercase" },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
});
