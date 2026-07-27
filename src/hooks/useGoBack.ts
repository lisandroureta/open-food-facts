import { useRouter } from "expo-router";

// Vuelve atrás en el stack de navegación si hay una pantalla anterior. Si no la
// hay (ej. la pantalla se abrió directamente por URL en el target web), va al Home
// en vez de que expo-router tire el warning "GO_BACK was not handled".
export function useGoBack() {
  const router = useRouter();

  return () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };
}
