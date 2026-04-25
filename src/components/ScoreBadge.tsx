import { StyleSheet, View } from "react-native";
import { Typography } from "./Typography";

interface ScoreBadgeProps {
  type: "nutri" | "eco";
  grade: "A" | "B" | "C" | "D" | "E";
}

export function ScoreBadge({ type, grade }: ScoreBadgeProps) {
  // Lógica de colores según la letra
  const getBackgroundColor = () => {
    if (grade === "A") return "#27AE60"; // Verde oscuro
    if (grade === "B") return "#82E0AA"; // Verde claro
    if (grade === "C") return "#F1C40F"; // Amarillo
    if (grade === "D") return "#E67E22"; // Naranja
    return "#E74C3C"; // Rojo (E)
  };

  return (
    <View style={[styles.badge, { backgroundColor: getBackgroundColor() }]}>
      <Typography variant="caption" color="white" style={styles.text}>
        {type === "nutri" ? "NUTRI-SCORE" : "ECO-SCORE"} {grade}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  text: { fontSize: 10, fontWeight: "bold" },
});
