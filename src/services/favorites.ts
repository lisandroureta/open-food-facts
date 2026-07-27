import { supabase } from "./supabase";

// Acceso a la tabla `favorites` de Supabase: solo guarda el product_id (barcode),
// no un snapshot del producto.

export async function getFavoriteProductIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("favorites")
    .select("product_id")
    .eq("user_id", userId);

  if (error) throw error;

  return data.map((row) => row.product_id as string);
}

export async function insertFavorite(
  userId: string,
  productId: string,
): Promise<void> {
  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, product_id: productId });

  if (error) throw error;
}

export async function deleteFavorite(
  userId: string,
  productId: string,
): Promise<void> {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw error;
}
