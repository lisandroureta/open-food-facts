import { ImageSourcePropType } from "react-native";

// Este archivo define los tipos relacionados con los productos

export type Grade = "A" | "B" | "C" | "D" | "E" | "?";

// Modelo mínimo para contextos de lista (búsqueda, resultados, favoritos)
export interface ProductSummary {
  id: string;
  name: string;
  brand: string;
  imageUrl: ImageSourcePropType | null;
  nutriscore: Grade;
  ecoscore: Grade;
  novaGroup: number | null;
}

// Modelo extendido para la pantalla de detalle
export interface ProductDetail extends ProductSummary {
  ingredients: string;
  allergens: string | null;
  nutriments: {
    energy: string;
    fat: string;
    saturatedFat: string;
    carbs: string;
    sugars: string;
    fiber: string;
    protein: string;
    salt: string;
  };
}

// Los modelos basados en las especificaciones de la api de Open Food Facts
export interface APIProduct {
  code: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  nutriscore_grade?: string;
  ecoscore_grade?: string;
  nova_group?: number;
  ingredients_text?: string;
  allergens?: string;
  nutriments?: {
    energy?: string | number;
    fat?: string | number;
    "saturated-fat"?: string | number; // Open Food Facts usa guiones, por eso las comillas
    carbohydrates?: string | number;
    sugars?: string | number;
    fiber?: string | number;
    proteins?: string | number;
    salt?: string | number;
  };
}

export interface APIProductResponse {
  code: string;
  status: number;
  product: APIProduct;
  status_verbose: string;
}

// Representa la respuesta de la API cuando buscamos una lista de productos
export interface APISearchResponse {
  count: number;
  page: number;
  page_size: number;
  products: APIProduct[]; // ¡Ojo a los corchetes! Significa "una lista de APIProducts"
}
