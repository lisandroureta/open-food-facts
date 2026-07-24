import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "../../src/components/Header";
import { ProductListItem } from "../../src/components/ProductListItem";
import { Typography } from "../../src/components/Typography";
import { useAuth } from "../../src/context/AuthContext";
import { useFavorites } from "../../src/context/FavoritesContext";

export default function FavoritesScreen() {
  const router = useRouter();

  const { session, isLoading: isAuthLoading } = useAuth();
  const { favorites, isLoading: isFavoritesLoading } = useFavorites();

  const isLoading = isAuthLoading || (!!session && isFavoritesLoading);

  const renderSubtitle = () => {
    if (isLoading) return "CARGANDO...";
    if (!session) return "INICIÁ SESIÓN PARA VER TUS FAVORITOS";
    return `${favorites.length} PRODUCTOS GUARDADOS`;
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <View style={styles.centerIndicator}>
          <ActivityIndicator size="large" color="#27AE60" />
        </View>
      );
    }

    if (!session) {
      return (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={64}
            color="#D5DBDB"
          />
          <Typography variant="h3" style={{ marginTop: 16, color: "#7F8C8D" }}>
            Iniciá sesión para ver tus favoritos
          </Typography>
          <Typography
            variant="body"
            style={{ textAlign: "center", marginTop: 8, color: "#95A5A6" }}
          >
            Necesitás una cuenta para guardar y ver tus productos favoritos.
          </Typography>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/login")}
            activeOpacity={0.8}
          >
            <Typography
              variant="body"
              color="#FFFFFF"
              style={styles.loginButtonText}
            >
              Iniciar sesión
            </Typography>
          </TouchableOpacity>
        </View>
      );
    }

    if (favorites.length === 0) {
      // estado vacío
      return (
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
      );
    }

    return (
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
    );
  };

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
          {renderSubtitle()}
        </Typography>
      </View>

      {/* manejando el renderizado */}
      {renderBody()}
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
  loginButton: {
    backgroundColor: "#27AE60",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 24,
  },
  loginButtonText: { fontWeight: "bold" },
});
