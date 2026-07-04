// app/scanner.tsx
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

export default function ScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    // Apenas cargamos el estado del permiso, disparamos el cartel nativo si hace falta
    (async () => {
      if (permission && !permission.granted && permission.canAskAgain) {
        const result = await requestPermission();
        // Si el usuario le da a "Denegar", lo enviamos de vuelta a la pantalla de búsqueda
        if (!result.granted) {
          router.back();
        }
      }
    })();
  }, [permission]); // Se ejecuta cuando el estado de permission se carga

  // Mientras el usuario decide en el cartel nativo, mostramos un fondo negro liso
  if (!permission || !permission.granted) {
    return <View style={styles.container} />;
  }

  // Permiso concedido y se enciende la cámara
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
        }}
        onBarcodeScanned={({ data }) => {
          console.log("¡CÓDIGO DETECTADO!", data);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
});
