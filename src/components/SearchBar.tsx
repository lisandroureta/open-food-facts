import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onBarcodePress?: () => void;
}

// SearchBar es como un componente "tonto". No maneja su propio estado interno,
// sino que delega el control al componente padre (ResultsScreen) vía props (value/onChangeText).
export function SearchBar({
  value,
  onChangeText,
  onBarcodePress,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="magnify"
        size={24}
        color="#95A5A6"
        style={styles.searchIcon}
      />

      <TextInput
        style={styles.input}
        placeholder="Search juices, craft sodas, teas..."
        placeholderTextColor="#95A5A6"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Si nos pasan la función onBarcodePress, dibujamos el botón */}
      {onBarcodePress && (
        <TouchableOpacity onPress={onBarcodePress} style={styles.barcodeButton}>
          <MaterialCommunityIcons
            name="barcode-scan"
            size={24}
            color="#2C3E50"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F4F4",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
    height: "100%",
  },
  barcodeButton: {
    padding: 8,
    marginLeft: 8,
  },
});
