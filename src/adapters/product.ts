import { ImageSourcePropType } from "react-native";
import { APIProduct, Grade, ProductDetail, ProductSummary } from "../types/product";

const FALLBACK_NAME = "Sin Nombre";
const FALLBACK_BRAND = "Marca desconocida";
const FALLBACK_GRADE: Grade = "?";

function toImageSource(imageUrl?: string): ImageSourcePropType | null {
  return imageUrl ? { uri: imageUrl } : null;
}

function toGrade(grade?: string): Grade {
  return grade ? (grade.toUpperCase() as Grade) : FALLBACK_GRADE;
}

export function toProductSummary(apiProduct: APIProduct): ProductSummary {
  return {
    id: apiProduct.code,
    name: apiProduct.product_name || FALLBACK_NAME,
    brand: apiProduct.brands || FALLBACK_BRAND,
    imageUrl: toImageSource(apiProduct.image_url),
    nutriscore: toGrade(apiProduct.nutriscore_grade),
    ecoscore: toGrade(apiProduct.ecoscore_grade),
    novaGroup: apiProduct.nova_group ?? null,
  };
}

export function toProductDetail(apiProduct: APIProduct): ProductDetail {
  const nutriments = apiProduct.nutriments || {};

  return {
    ...toProductSummary(apiProduct),
    ingredients: apiProduct.ingredients_text || "",
    allergens: apiProduct.allergens || null,
    nutriments: {
      energy: nutriments.energy?.toString() ?? "-",
      fat: nutriments.fat?.toString() ?? "-",
      saturatedFat: nutriments["saturated-fat"]?.toString() ?? "-",
      carbs: nutriments.carbohydrates?.toString() ?? "-",
      sugars: nutriments.sugars?.toString() ?? "-",
      fiber: nutriments.fiber?.toString() ?? "-",
      protein: nutriments.proteins?.toString() ?? "-",
      salt: nutriments.salt?.toString() ?? "-",
    },
  };
}
