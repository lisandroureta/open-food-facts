import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  // acá guardaremos el código de barras que la cámara detecte
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (permission && !permission.granted && permission.canAskAgain) {
        const result = await requestPermission();
        if (!result.granted) {
          router.back();
        }
      }
    })();
  }, [permission]);

  if (!permission || !permission.granted) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
        }}
        // Si ya tenemos un código, le pasamos undefined al lector para que deje de escanear y "congele" la acción.
        onBarcodeScanned={
          scannedCode
            ? undefined
            : ({ data }) => {
                setScannedCode(data);
              }
        }
      />

      {/* Botón para cerrar la cámara e ir hacia atrás */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="close" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Si atrapamos un código, dibujamos la interfaz inferior */}
      {scannedCode && (
        <View style={styles.bottomOverlay}>
          <View style={styles.resultCard}>
            <MaterialCommunityIcons
              name="barcode-scan"
              size={32}
              color="#27AE60"
            />
            <Text style={styles.codeText}>{scannedCode}</Text>

            {/* El botón de Ver Producto */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push(`/product/${scannedCode}`)}
            >
              <Text style={styles.primaryButtonText}>Ver producto</Text>
            </TouchableOpacity>

            {/* Botón secundario por si se equivocó de código */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setScannedCode(null)}
            >
              <Text style={styles.secondaryButtonText}>Escanear de nuevo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  closeButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40, // Espacio extra para los celulares sin botones físicos
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  codeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginTop: 12,
    marginBottom: 24,
    letterSpacing: 2,
  },
  primaryButton: {
    backgroundColor: "#27AE60",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#7F8C8D",
    fontSize: 14,
    fontWeight: "600",
  },
});
