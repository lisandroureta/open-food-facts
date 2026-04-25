import { Pressable, StyleSheet } from "react-native";
import { Typography } from "./Typography";

interface FilterTagProps {
  label: string;
}

export function FilterTag({ label }: FilterTagProps) {
  return (
    <Pressable style={styles.tag}>
      <Typography variant="caption" color="#2E7D32">
        {label}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: "#E8F5E9", // Verde muy clarito
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
});
