import { StyleSheet, Text, View } from "react-native";

// Esta es la pantalla de detalle del producto. Aquí es donde el usuario verá la información detallada de un producto específico después de seleccionarlo de una lista o realizar una búsqueda.

export default function ProductDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Detalle del Producto</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});
