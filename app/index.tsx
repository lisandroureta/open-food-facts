import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { CategoryCard } from "../src/components/CategoryCard";
import { Typography } from "../src/components/Typography";
import { MOCK_CATEGORIES } from "../src/constants/mockCategories"; // Importamos la data simulada de categorías

// Esta es la pantalla de inicio de la aplicación. Acá es donde el usuario verá el contenido principal al abrir la app.
// La pantalla index.tsx solo se preocupa por dibujar, no almacena la información.

export default function HomeScreen() {
  const router = useRouter();
  const handleCategoryPress = (categoryName: string) => {
    // Empujamos (push) la pantalla de resultados a la pila
    // Pasamos el nombre de la categoría como parámetro para que la otra pantalla sepa qué mostrar
    router.push({
      pathname: "/results",
      params: { category: categoryName },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Typography variant="caption" color="green" style={styles.subtitle}>
        CURATED FLAVORS
      </Typography>
      <Typography variant="h1" style={styles.title}>
        The art of{" "}
        <Typography variant="h1" color="green" style={{ fontStyle: "italic" }}>
          conscious
        </Typography>{" "}
        discovery.
      </Typography>

      {/* Categorías */}
      <View style={styles.sectionHeader}>
        <Typography variant="h2">Categories</Typography>
        <Typography variant="caption" color="green">
          View Library
        </Typography>
      </View>

      <View style={styles.grid}>
        {MOCK_CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.id}
            title={cat.title}
            icon={cat.icon}
            colors={cat.colors}
            onPress={() =>
              router.push({
                pathname: "/results",
                params: { category: cat.id },
              })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDFEFE" },
  content: { padding: 20 },
  title: { marginBottom: 32 },
  subtitle: { marginBottom: 8, letterSpacing: 1 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { marginBottom: 16 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
