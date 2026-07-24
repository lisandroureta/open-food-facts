import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { Typography } from "./Typography";

// Componente unificado para la cabecera.
// Utiliza un patrón de variantes (leftIcon, rightElement) para adaptarse a las diferentes pantallas sin duplicar código.
// En las pantallas ocultamos el header nativo de Expo Router para tener control total del diseño con este componente personalizado.

// Contrato de propiedades
interface HeaderProps {
  leftIcon?: "arrow-left" | "menu";
  onLeftPress?: () => void;
  title?: string;
  rightElement?: "share" | "avatar" | "none";
  onRightPress?: () => void;
}

export function Header({
  leftIcon = "arrow-left",
  onLeftPress,
  title = "Digital Epicurean",
  rightElement = "none",
  onRightPress,
}: HeaderProps) {
  // Extraemos las medidas físicas del dispositivo (Notch, Dynamic Island, Status Bar de Android)
  // para evitar que el header colisione con la cámara.
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session, signOut } = useAuth();

  // Comportamiento por defecto del ícono de cuenta: sin sesión navega a login,
  // con sesión ofrece cerrar sesión. Solo se aplica si la pantalla no pasó su propio onRightPress.
  const handleAvatarPress = () => {
    if (!session) {
      router.push("/login");
      return;
    }

    // Alert.alert es un no-op en react-native-web: en web usamos confirm() nativo del navegador.
    if (Platform.OS === "web") {
      if (window.confirm("¿Estás seguro que querés cerrar sesión?")) {
        signOut();
      }
      return;
    }

    Alert.alert("Cerrar sesión", "¿Estás seguro que querés cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: () => signOut() },
    ]);
  };

  const resolvedOnRightPress =
    onRightPress ?? (rightElement === "avatar" ? handleAvatarPress : undefined);

  // Función para renderizar dinámicamente el lado derecho según la variante solicitada por la pantalla padre
  const renderRightElement = () => {
    if (rightElement === "share") {
      return (
        <MaterialCommunityIcons
          name="share-variant"
          size={24}
          color="#1D533A"
        />
      );
    }
    if (rightElement === "avatar") {
      return (
        <View style={styles.avatarPlaceholder}>
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={32}
            color="#1D533A"
          />
        </View>
      );
    }
    return <View style={{ width: 24 }} />; // Espaciador invisible para mantener el título centrado
  };

  return (
    // Sumamos el inset superior al padding para empujar el contenido hacia abajo
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <Pressable onPress={onLeftPress || (() => {})} style={styles.iconButton}>
        {/* Usamos el ícono que nos pasen por las props */}
        <MaterialCommunityIcons name={leftIcon} size={32} color="#1D533A" />
      </Pressable>

      <Typography variant="h2" style={styles.headerTitle}>
        {title}
      </Typography>

      <Pressable
        onPress={resolvedOnRightPress || (() => {})}
        style={styles.iconButton}
      >
        {renderRightElement()}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "transparent",
  },
  iconButton: { padding: 8, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontWeight: "bold", color: "#1D533A" },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderColor: "#1D533A",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});
