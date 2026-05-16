// src/components/NutritionRow.tsx
import { StyleSheet, View } from "react-native";
import { Typography } from "./Typography";

interface NutritionRowProps {
  label: string;
  value: string;
  indent?: boolean;
}

export function NutritionRow({
  label,
  value,
  indent = false,
}: NutritionRowProps) {
  return (
    <View style={[styles.tableRow, indent && styles.indentRow]}>
      <Typography
        variant="body"
        color={indent ? "#7F8C8D" : "#1C2833"}
        style={indent && { fontStyle: "italic", fontSize: 13 }}
      >
        {label}
      </Typography>
      <Typography variant="body" style={{ fontWeight: "bold", fontSize: 15 }}>
        {value}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEDED",
  },
  indentRow: {
    marginLeft: 16,
    borderBottomWidth: 0,
    paddingVertical: 8,
  },
});
