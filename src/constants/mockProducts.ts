export interface Product {
  id: string;
  name: string;
  brand: string;
  brandId: string; // Para filtrar por marca
  categoryId: string; // Para filtrar por categoría
  tastes: string[]; // Para filtrar por etiquetas
  imageUrl: string;
  nutriscore: "A" | "B" | "C" | "D" | "E";
  ecoscore: "A" | "B" | "C" | "D" | "E";
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Organic Cold Pressed Kale & Ginger",
    brand: "Green Garden Co.",
    brandId: "danone",
    categoryId: "beverages",
    tastes: ["organic", "vegan", "gluten-free"],
    imageUrl:
      "https://images.openfoodfacts.org/images/products/322/084/011/0827/front_es.162.400.jpg",
    nutriscore: "A",
    ecoscore: "A",
  },
  {
    id: "2",
    name: "Artisan Sparkling Botanical Mist",
    brand: "Mist & Flora",
    brandId: "coca-cola",
    categoryId: "beverages",
    tastes: ["vegan", "no-added-sugar"],
    imageUrl:
      "https://images.openfoodfacts.org/images/products/544/900/021/4911/front_es.178.400.jpg",
    nutriscore: "C",
    ecoscore: "B",
  },
  {
    id: "3",
    name: "The Original Oatly Oat Milk",
    brand: "Oatly",
    brandId: "nestle",
    categoryId: "dairies",
    tastes: ["vegan", "lactose-free"],
    imageUrl:
      "https://images.openfoodfacts.org/images/products/731/131/118/4887/front_es.52.400.jpg",
    nutriscore: "A",
    ecoscore: "A",
  },
  // Podrías agregar más productos aquí...
];
