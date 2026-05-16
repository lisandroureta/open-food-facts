// src/components/ProductHeader.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "./Typography";

interface HeaderProps {
  leftIcon?: "arrow-left" | "menu";
  onLeftPress?: () => void;
  title?: string;
  rightElement?: "share" | "avatar" | "none";
  onRightPress?: () => void;
}

export function Header({
  leftIcon = "arrow-left", // Por defecto será la flecha
  onLeftPress,
  title = "Digital Epicurean",
  rightElement = "none",
  onRightPress,
}: HeaderProps) {
  const insets = useSafeAreaInsets(); // Le pedimos al sistema operativo las medidas de la cámara/notch

  // Función para renderizar dinámicamente el lado derecho
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
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <Pressable onPress={onLeftPress || (() => {})} style={styles.iconButton}>
        {/* Usamos el ícono que nos pasen por las props */}
        <MaterialCommunityIcons name={leftIcon} size={32} color="#1D533A" />
      </Pressable>

      <Typography variant="h2" style={styles.headerTitle}>
        {title}
      </Typography>

      <Pressable onPress={onRightPress || (() => {})} style={styles.iconButton}>
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
    //borderRadius: 16,
    //borderWidth: 1.5,
    borderColor: "#1D533A", // Mantenemos el color verde de la marca
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});
