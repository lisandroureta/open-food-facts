import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Llamamos a las variables de entorno que guardaste en el archivo .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

// El cliente se inicializa apenas se importa este módulo, y eso dispara la
// recuperación de sesión de inmediato. Bajo el renderizado en servidor del
// export web de Expo (Node, sin `window`) el storage de AsyncStorage para web
// explota al no encontrar `window.localStorage`, así que ahí lo dejamos sin
// storage/persistencia (no aplica: no hay sesión de usuario real en ese contexto).
const hasWindow = typeof window !== "undefined";

// Inicializamos el cliente de Supabase con persistencia local
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: hasWindow ? AsyncStorage : undefined,
    autoRefreshToken: hasWindow,
    persistSession: hasWindow,
    detectSessionInUrl: false,
  },
});