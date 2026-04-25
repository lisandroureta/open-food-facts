export interface Product {
  id: string;
  name: string;
  brand: string;
  brandId: string; // Para filtrar por marca
  categoryId: string; // Para filtrar por categoría
  tastes: string[]; // Para filtrar por etiquetas
  imageUrl: string;
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
