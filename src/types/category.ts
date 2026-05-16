import { MaterialCommunityIcons } from "@expo/vector-icons";

// Contrato estricto para Categorías Globales
export interface Category {
  id: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  colors: readonly [string, string]; // Tupla de dos colores, ya que es una gradiente
}
