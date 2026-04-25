import { Pressable, StyleSheet } from "react-native";
import { Typography } from "./Typography";

interface FilterTagProps {
  label: string;
  onPress: () => void;
}

export function FilterTag({ label, onPress }: FilterTagProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tag, { opacity: pressed ? 0.7 : 1 }]}
    >
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
