import type { AuthError, Session } from "@supabase/supabase-js";
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
import { supabase } from "../services/supabase";

interface AuthResult {
  error: string | null;
}

interface AuthContextValue {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  setPendingAction: (action: () => void) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Traduce los mensajes de error de Supabase (en inglés) a español para los casos esperables.
function mapAuthErrorMessage(error: AuthError): string {
  const message = error.message.toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "Email o contraseña incorrectos.";
  }
  if (message.includes("already registered") || message.includes("already exists")) {
    return "Ese email ya está registrado. Iniciá sesión en su lugar.";
  }
  if (message.includes("password")) {
    return "La contraseña no cumple con los requisitos mínimos.";
  }
  if (message.includes("email")) {
    return "El email ingresado no es válido.";
  }

  return "Ocurrió un error. Intentá de nuevo.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const pendingActionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setPendingAction = useCallback((action: () => void) => {
    pendingActionRef.current = action;
  }, []);

  const runPendingAction = useCallback(() => {
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    action?.();
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: mapAuthErrorMessage(error) };

      runPendingAction();
      return { error: null };
    },
    [runPendingAction],
  );

  const signUp = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: mapAuthErrorMessage(error) };

      runPendingAction();
      return { error: null };
    },
    [runPendingAction],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({ session, isLoading, signIn, signUp, signOut, setPendingAction }),
    [session, isLoading, signIn, signUp, signOut, setPendingAction],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
