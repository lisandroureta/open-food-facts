import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Typography } from "./Typography";

interface AlertBoxProps {
  title: string;
  message: string;
}

export function AlertBox({ title, message }: AlertBoxProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="alert-circle"
        size={20}
        color="#C0392B"
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Typography variant="caption" color="#C0392B" style={styles.title}>
          {title}
        </Typography>
        <Typography variant="body" color="#C0392B" style={styles.message}>
          {message}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FDEDEC", // Rojo muy clarito
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  icon: { marginRight: 12, marginTop: 2 },
  textContainer: { flex: 1 },
  title: { fontWeight: "bold", marginBottom: 4 },
  message: { fontSize: 14 },
});
