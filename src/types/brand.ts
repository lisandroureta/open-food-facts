import { ImageSourcePropType } from "react-native";

// Contrato estricto para Marcas Globales
export interface Brand {
  id: string;
  name: string;
  logo?: ImageSourcePropType;
}
