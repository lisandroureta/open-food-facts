import { StyleSheet, Text, View } from "react-native";

// Esta es la pantalla de resultados. Aquí es donde el usuario verá la lista de resultados después de realizar una búsqueda o acción que genere resultados.

export default function ResultsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Lista de Resultados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});
