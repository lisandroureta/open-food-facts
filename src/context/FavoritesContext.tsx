import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getFavorites, toggleFavorite as toggleFavoriteInStorage } from "../services/storage";
import { ProductSummary } from "../types/product";

interface FavoritesContextValue {
  favorites: ProductSummary[];
  isLoading: boolean;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (product: ProductSummary) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFavorites().then((savedFavorites) => {
      setFavorites(savedFavorites);
      setIsLoading(false);
    });
  }, []);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((product) => product.id)),
    [favorites],
  );

  const isFavorite = useCallback(
    (id: string) => favoriteIds.has(id),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(async (product: ProductSummary) => {
    const isNowFavorite = await toggleFavoriteInStorage(product);
    setFavorites((current) =>
      isNowFavorite
        ? [product, ...current]
        : current.filter((fav) => fav.id !== product.id),
    );
  }, []);

  const value = useMemo(
    () => ({ favorites, isLoading, isFavorite, toggleFavorite }),
    [favorites, isLoading, isFavorite, toggleFavorite],
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
