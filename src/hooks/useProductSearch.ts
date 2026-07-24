import { useCallback, useEffect, useState } from "react";
import { searchProducts, SearchQuery } from "../services/api";
import { APIProduct } from "../types/product";

// Query de texto libre usada cuando no hay texto ni tags: trae el catálogo general paginado
const CATALOG_QUERY = " ";
const DEBOUNCE_MS = 600;

interface UseProductSearchParams {
  text?: string;
  categoryTag?: string;
  brandTag?: string;
}

interface UseProductSearchResult {
  products: APIProduct[];
  isLoading: boolean;
  isFetchingMore: boolean;
  totalCount: number;
  error: string | null;
  loadMore: () => void;
}

// Unifica debounce, paginación infinita y manejo de estados de carga/error
// para búsqueda de texto libre y para filtrado por tags de categoría/marca.
export function useProductSearch({
  text = "",
  categoryTag,
  brandTag,
}: UseProductSearchParams): UseProductSearchResult {
  const [products, setProducts] = useState<APIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const buildQuery = useCallback((): SearchQuery => {
    if (text.trim() !== "") {
      return { type: "text", query: text };
    }
    if (categoryTag || brandTag) {
      return { type: "tags", categoryTag, brandTag };
    }
    return { type: "text", query: CATALOG_QUERY };
  }, [text, categoryTag, brandTag]);

  // controlador de búsqueda
  useEffect(() => {
    // Debounce para evitar colapsar la API con peticiones por cada letra que se escribe
    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      setPage(1);

      const { products: newProducts, totalCount: newTotalCount, error: searchError } =
        await searchProducts(buildQuery(), 1);

      setProducts(newProducts);
      setTotalCount(newTotalCount);
      setError(searchError);
      setIsLoading(false);
    }, DEBOUNCE_MS);

    return () => clearTimeout(delayDebounceFn);
  }, [buildQuery]);

  // controlador del scroll infinito
  const loadMore = useCallback(async () => {
    // Validamos que no haya una descarga en curso o que ya hayamos llegado al límite total de productos en el servidor
    if (isFetchingMore || isLoading || products.length >= totalCount) return;

    setIsFetchingMore(true);
    const nextPage = page + 1;

    const { products: newProducts, error: searchError } = await searchProducts(
      buildQuery(),
      nextPage,
    );

    // Si la API nos devuelve nuevos datos, los anexamos al final del arreglo existente
    if (!searchError && newProducts.length > 0) {
      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      setPage(nextPage);
    }

    setIsFetchingMore(false);
  }, [isFetchingMore, isLoading, products.length, totalCount, page, buildQuery]);

  return { products, isLoading, isFetchingMore, totalCount, error, loadMore };
}
