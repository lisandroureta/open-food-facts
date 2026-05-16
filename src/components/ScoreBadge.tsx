// src/components/ScoreBadge.tsx
import { StyleSheet, View } from "react-native";
import { Typography } from "./Typography";

// 1. Definimos las Props aceptadas, incluyendo la nueva prop 'variant'
interface ScoreBadgeProps {
  type: "nutri" | "eco" | "nova";
  grade: "A" | "B" | "C" | "D" | "E" | 1 | 2 | 3 | 4;
  variant?: "default" | "card"; // Patrón de diseño por variantes
  backgroundColor?: string;
}

export function ScoreBadge({
  type,
  grade,
  variant = "default",
  backgroundColor,
}: ScoreBadgeProps) {
  // Lógica de colores (compartida para ambas variantes)
  const getGradeColor = () => {
    if (grade === "A" || grade === 1) return "#008A47";
    if (grade === "B" || grade === 2) return "#82E0AA";
    if (grade === "C" || grade === 3) return "#F1C40F";
    if (grade === "D" || grade === 4) return "#E67E22";
    return "#E74C3C";
  };

  // Variante 'card'. Diseño expandido utilizado en la pantalla de Detalle
  if (variant === "card") {
    const getTitle = () => {
      if (type === "nutri") return "NUTRI-\nSCORE";
      if (type === "nova") return "NOVA\nGROUP";
      return "ECO-\nSCORE";
    };

    return (
      <View
        style={[
          styles.cardContainer,
          backgroundColor ? { backgroundColor } : {},
        ]}
      >
        <Typography variant="caption" color="#7F8C8D" style={styles.cardTitle}>
          {getTitle()}
        </Typography>
        <View
          style={[styles.cardGradeBox, { backgroundColor: getGradeColor() }]}
        >
          <Typography variant="body" color="white" style={styles.cardGradeText}>
            {grade}
          </Typography>
        </View>
      </View>
    );
  }

  // Variante 'default'. Diseño compacto en pastilla utilizado en Listas
  const getPillText = () => {
    if (type === "nova") return `NOVA ${grade}`; // Caso raro en lista
    return `${type === "nutri" ? "NUTRI-SCORE" : "ECO-SCORE"} ${grade}`;
  };

  return (
    <View style={[styles.pillContainer, { backgroundColor: getGradeColor() }]}>
      <Typography variant="caption" color="white" style={styles.pillText}>
        {getPillText()}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  // Estilos encapsulados por variante para evitar colisiones visuales en tiempo de ejecución
  cardContainer: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 12,
  },
  cardGradeBox: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 6 },
  cardGradeText: { fontSize: 16, fontWeight: "bold" },

  pillContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  pillText: {
    fontSize: 10,
    fontWeight: "bold",
  },
});
