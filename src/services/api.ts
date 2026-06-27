import { APIProduct, APIProductResponse } from "../types/product";

// Centralizamos la URL base. Si el día de mañana la API cambia de versión (ej: v1 en lugar de v0),
// solo lo modificamos en esta línea y toda la aplicación se actualiza. (Principio DRY)
const BASE_URL = "https://world.openfoodfacts.org/api/v0/product";

/**
 * Función asíncrona (Promesa) para buscar un producto específico.
 * @param barcode El código de barras escaneado o solicitado.
 * @returns Retorna los datos del producto tipados, o 'null' si falla.
 */
export const getProductByBarcode = async (
  barcode: string,
): Promise<APIProductResponse | null> => {
  try {
    // 1. OPTIMIZACIÓN: Armamos la URL inyectando el código dinámico
    const url = `${BASE_URL}/${barcode}.json?fields=code,product_name,brands,image_url,nutriscore_grade,ecoscore_grade,nova_group,ingredients_text,allergens,nutriments`;

    // 2. LA PETICIÓN: fetch() va a internet. 'await' le dice al código:
    // "Espera aquí el ticket (Promesa) hasta que el servidor de Francia responda, pero no congeles la pantalla"
    const response = await fetch(url);

    // 3. MANEJO DE RED: Si el servidor está caído o hay un error 404/500
    if (!response.ok) {
      throw new Error(`Error de red. Código HTTP: ${response.status}`);
    }

    // 4. PARSEO: Convertimos el texto de respuesta a un objeto JSON que TypeScript entiende
    const data: APIProductResponse = await response.json();

    // 5. LÓGICA DE NEGOCIO: Validamos el status 0 (que descubrimos en Postman cuando un producto no existe)
    if (data.status === 0) {
      console.warn(
        `El producto con código ${barcode} no se encontró en Open Food Facts.`,
      );
      return null; // Devolvemos null para que la UI sepa que debe mostrar la pantalla de "No encontrado"
    }

    // ¡Éxito! Devolvemos los datos limpios y tipados
    return data;
  } catch (error) {
    // Si el usuario está en Modo Avión o se corta el Wi-Fi, evitamos que la app crashee violentamente
    console.error("Fallo catastrófico en la conexión:", error);
    return null;
  }
};

export interface SearchResult {
  products: APIProduct[];
  totalCount: number;
  error: string | null;
}

export const searchProducts = async (
  query: string,
  page: number = 1,
): Promise<SearchResult> => {
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=10&page=${page}&fields=code,product_name,brands,image_url,nutriscore_grade,ecoscore_grade,nova_group`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "DigitalEpicurean - React Native App - Academic Project",
      },
    });

    if (!response.ok) {
      return {
        products: [],
        totalCount: 0,
        error: `El servidor está saturado. Intenta de nuevo.`,
      };
    }

    const data = await response.json();

    return {
      products: data.products || [],
      totalCount: data.count || 0,
      error: null,
    };
  } catch (error) {
    return { products: [], totalCount: 0, error: "Error de conexión." };
  }
};
