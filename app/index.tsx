import { StyleSheet, Text, View } from "react-native";

// Esta es la pantalla de inicio de la aplicación. Aquí es donde el usuario verá el contenido principal al abrir la app.

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla de Inicio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});
