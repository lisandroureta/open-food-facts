import { APIProduct, APIProductResponse } from "../types/product";

// Centralizamos la URL base
const BASE_URL = "https://world.openfoodfacts.org/api/v0/product";
const USER_AGENT = "DigitalEpicurean - React Native App - Academic Project";

/**
 * Función asíncrona (Promesa) para buscar un producto específico.
 * @param barcode El código de barras escaneado o solicitado.
 * @returns Retorna los datos del producto tipados, o 'null' si falla.
 */
export const getProductByBarcode = async (
  barcode: string,
): Promise<APIProductResponse | null> => {
  try {
    // armamos la URL inyectando el código dinámico
    const url = `${BASE_URL}/${barcode}.json?fields=code,product_name,brands,image_url,nutriscore_grade,ecoscore_grade,nova_group,ingredients_text,allergens,nutriments`;

    // la petición
    const response = await fetch(url);

    // manejo de red
    if (!response.ok) {
      throw new Error(`Error de red. Código HTTP: ${response.status}`);
    }

    // el parseo
    const data: APIProductResponse = await response.json();

    // lógica de negocio
    if (data.status === 0) {
      console.warn(
        `El producto con código ${barcode} no se encontró en Open Food Facts.`,
      );
      return null; // Devolvemos null para que la UI sepa que debe mostrar la pantalla de "No encontrado"
    }

    // si es éxito, devolvemos los datos limpios y tipados
    return data;
  } catch (error) {
    console.error("Fallo catastrófico en la conexión:", error);
    return null;
  }
};

export interface SearchResult {
  products: APIProduct[];
  totalCount: number;
  error: string | null;
}

// Parámetro discriminado: búsqueda de texto libre vs. filtrado por tags de taxonomía
export type SearchQuery =
  | { type: "text"; query: string }
  | { type: "tags"; categoryTag?: string; brandTag?: string };

const SEARCH_FIELDS =
  "code,product_name,brands,image_url,nutriscore_grade,ecoscore_grade,nova_group";
const PAGE_SIZE = 10;

export const searchProducts = async (
  searchQuery: SearchQuery,
  page: number = 1,
): Promise<SearchResult> => {
  try {
    const url =
      searchQuery.type === "text"
        ? `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
            searchQuery.query,
          )}&search_simple=1&action=process&json=1&page_size=${PAGE_SIZE}&page=${page}&fields=${SEARCH_FIELDS}`
        : buildTagSearchUrl(searchQuery, page);

    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
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

function buildTagSearchUrl(
  searchQuery: { categoryTag?: string; brandTag?: string },
  page: number,
): string {
  const params = new URLSearchParams({
    page_size: PAGE_SIZE.toString(),
    page: page.toString(),
    fields: SEARCH_FIELDS,
  });

  if (searchQuery.categoryTag) {
    params.set("categories_tags", searchQuery.categoryTag);
  }
  if (searchQuery.brandTag) {
    params.set("brands_tags", searchQuery.brandTag);
  }

  return `https://world.openfoodfacts.org/api/v2/search?${params.toString()}`;
}
