import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toProductSummary } from "../adapters/product";
import { getProductByBarcode } from "../services/api";
import {
  deleteFavorite,
  getFavoriteProductIds,
  insertFavorite,
} from "../services/favorites";
import { supabase } from "../services/supabase";
import { ProductSummary } from "../types/product";
import { useAuth } from "./AuthContext";

interface FavoritesContextValue {
  favorites: ProductSummary[];
  isLoading: boolean;
  error: string | null;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (product: ProductSummary) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

// La tabla favorites solo guarda el product_id: reconstruimos el producto
// pidiéndoselo a Open Food Facts para poder mostrarlo en la lista.
async function fetchProductSummary(
  productId: string,
): Promise<ProductSummary | null> {
  const data = await getProductByBarcode(productId);
  return data?.product ? toProductSummary(data.product) : null;
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  const [favorites, setFavorites] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Evita pisar el estado con una respuesta de resync vieja si llegan
  // varios cambios seguidos y las respuestas resuelven fuera de orden.
  const resyncCounterRef = useRef(0);

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const resyncFavorites = async () => {
      const requestId = ++resyncCounterRef.current;

      try {
        const productIds = await getFavoriteProductIds(userId);
        const products = await Promise.all(productIds.map(fetchProductSummary));

        if (isCancelled || requestId !== resyncCounterRef.current) return;
        setFavorites(
          products.filter((product): product is ProductSummary => product !== null),
        );
        setError(null);
      } catch (err) {
        console.error("Error cargando favoritos:", err);
        if (isCancelled || requestId !== resyncCounterRef.current) return;
        setError("No se pudo conectar. Revisá tu conexión a internet.");
      } finally {
        if (!isCancelled && requestId === resyncCounterRef.current) {
          setIsLoading(false);
        }
      }
    };

    setIsLoading(true);
    resyncFavorites();

    // Usamos Realtime como señal de "algo cambió", no como fuente de los datos
    // del cambio en sí: no dependemos de que el payload del evento (en
    // particular el de DELETE) traiga todas las columnas de la fila.
    const channel = supabase
      .channel(`favorites-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "favorites",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          resyncFavorites();
        },
      )
      .subscribe();

    return () => {
      isCancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((product) => product.id)),
    [favorites],
  );

  const isFavorite = useCallback(
    (id: string) => favoriteIds.has(id),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    async (product: ProductSummary) => {
      if (!userId) return;

      const wasFavorite = favoriteIds.has(product.id);

      // Actualización optimista: la UI responde al instante
      setFavorites((current) =>
        wasFavorite
          ? current.filter((fav) => fav.id !== product.id)
          : [product, ...current],
      );

      try {
        if (wasFavorite) {
          await deleteFavorite(userId, product.id);
        } else {
          await insertFavorite(userId, product.id);
        }
      } catch (err) {
        console.error("Error guardando el favorito:", err);
        // Revertimos el cambio optimista si la escritura falló
        setFavorites((current) =>
          wasFavorite
            ? [product, ...current]
            : current.filter((fav) => fav.id !== product.id),
        );
      }
    },
    [userId, favoriteIds],
  );

  const value = useMemo(
    () => ({ favorites, isLoading, error, isFavorite, toggleFavorite }),
    [favorites, isLoading, error, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites debe usarse dentro de un FavoritesProvider");
  }
  return context;
}
