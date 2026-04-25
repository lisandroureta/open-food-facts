import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ProductListItem } from "../src/components/ProductListItem";
import { SearchBar } from "../src/components/SearchBar";
import { Typography } from "../src/components/Typography";
import { MOCK_PRODUCTS } from "../src/constants/mockProducts";

// Esta es la pantalla de resultados. Aquí es donde el usuario verá la lista de resultados después de realizar una búsqueda o acción que genere resultados.

export default function ResultsScreen() {
  const router = useRouter();

  // 1. Atrapamos los parámetros que vienen del Home
  const params = useLocalSearchParams();
  const { category, brand, taste } = params;

  // Estado para el texto de búsqueda
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Filtramos la base de datos simulada según el parámetro que llegó
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    // 1. Filtrado por parámetros del Home
    const matchesCategory = category ? product.categoryId === category : true;
    const matchesBrand = brand ? product.brandId === brand : true;
    const matchesTaste = taste
      ? product.tastes.includes(taste as string)
      : true;

    // 2. Filtrado por texto de búsqueda (nombre del producto o marca)
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesBrand && matchesTaste && matchesSearch;
  });

  // 3. Calculamos el título de la pantalla
  const getHeaderTitle = () => {
    if (category) return category.toString();
    if (brand) return brand.toString();
    if (taste) return taste.toString();
    return "Search";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h1" style={styles.title}>
          {getHeaderTitle()}
        </Typography>
        <Typography variant="caption" color="gray" style={styles.subtitle}>
          {filteredProducts.length} ITEMS FOUND
        </Typography>
      </View>

      {/* Lista de productos con la SearchBar como Header */}
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
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { padding: 20, paddingTop: 40, paddingBottom: 10 },
  title: { textTransform: "capitalize" },
  subtitle: { marginTop: 4, letterSpacing: 1, marginBottom: 10 },
  listContent: { padding: 20 },
});
