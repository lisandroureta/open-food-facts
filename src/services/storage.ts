import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProductSummary } from "../types/product";

// Definimos el nombre de la "carpeta" dentro del celular donde guardar las cosas
const FAVORITES_KEY = "@digital_epicurean_favorites";

// Va al cajón del teléfono y trae la lista de todos los favoritos guardados.
export const getFavorites = async (): Promise<ProductSummary[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    // Si hay datos, los convertimos de texto a objeto. Si está vacío, devolvemos un array [].
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error leyendo la mochila de favoritos:", e);
    return [];
  }
};

// Revisa si un producto ya es favorito (para saber si pintar el corazón de verde o dejarlo gris).
export const checkIsFavorite = async (productId: string): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.some((fav) => fav.id === productId);
};

// Función "Toggle": Si el producto no está, lo agrega. Si ya está, lo elimina.
// Recibe el producto ya adaptado (ProductSummary) para no guardar toda la basura de la API.
export const toggleFavorite = async (
  product: ProductSummary,
): Promise<boolean> => {
  try {
    const currentFavorites = await getFavorites();
    const existsIndex = currentFavorites.findIndex(
      (fav) => fav.id === product.id,
    );

    let newFavorites;
    if (existsIndex >= 0) {
      // Si ya estaba en la lista, lo sacamos (el usuario lo des-likeó)
      newFavorites = currentFavorites.filter((fav) => fav.id !== product.id);
    } else {
      // Si no estaba, lo agregamos al principio de la lista
      newFavorites = [product, ...currentFavorites];
    }

    // Convertimos la lista a texto y la guardamos en el teléfono
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));

    // Devolvemos true si quedó guardado, o false si lo eliminamos
    return existsIndex < 0;
  } catch (e) {
    console.error("Error guardando el favorito:", e);
    return false;
  }
};
