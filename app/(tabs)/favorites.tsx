import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Header } from "../../src/components/Header";
import { ProductListItem } from "../../src/components/ProductListItem";
import { Typography } from "../../src/components/Typography";
import { useFavorites } from "../../src/context/FavoritesContext";

export default function FavoritesScreen() {
  const router = useRouter();

  const { favorites, isLoading } = useFavorites();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Implementamos nuestro header personalizado */}
      <Header leftIcon="menu" rightElement="avatar" />

      <View style={styles.titleSection}>
        <Typography variant="h1" style={styles.title}>
          Favorites
        </Typography>
        <Typography variant="caption" color="gray" style={styles.subtitle}>
          {isLoading
            ? "CARGANDO..."
            : `${favorites.length} PRODUCTOS GUARDADOS`}
        </Typography>
      </View>

      {/* manejando el renderizado */}
      {isLoading ? (
        <View style={styles.centerIndicator}>
          <ActivityIndicator size="large" color="#27AE60" />
        </View>
      ) : favorites.length === 0 ? (
        // estado vacío
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="heart-broken"
            size={64}
            color="#D5DBDB"
          />
          <Typography variant="h3" style={{ marginTop: 16, color: "#7F8C8D" }}>
            Aún no tienes favoritos
          </Typography>
          <Typography
            variant="body"
            style={{ textAlign: "center", marginTop: 8, color: "#95A5A6" }}
          >
            Explora productos y toca el corazón para guardarlos aquí.
          </Typography>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductListItem
              product={item}
              // Reutilizamos la navegación hacia el detalle
              onPress={() => router.push(`/product/${item.id}`)}
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
});
