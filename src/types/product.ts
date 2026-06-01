import { ImageSourcePropType } from "react-native";

// Este archivo define los tipos relacionados con los productos

// Estructura provisional del modelo de Producto
export interface Product {
  id: string;
  name: string;
  brand: string;
  brandId: string; // Para filtrar por marca
  categoryId: string; // Para filtrar por categoría
  tastes: string[]; // Para filtrar por etiquetas
  imageUrl: ImageSourcePropType; // Tipado nativo de React Native para recursos locales empaquetados por Metro
  backgroundColor: string; // Para el fondo de la foto en el detalle
  nutriscore: "A" | "B" | "C" | "D" | "E";
  ecoscore: "A" | "B" | "C" | "D" | "E";
  novaGroup?: number;
  ingredients?: string;
  allergens?: string;
  nutritionalValues?: {
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
