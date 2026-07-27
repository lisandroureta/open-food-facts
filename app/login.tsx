import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AlertBox } from "../src/components/AlertBox";
import { Header } from "../src/components/Header";
import { Typography } from "../src/components/Typography";
import { useAuth } from "../src/context/AuthContext";
import { useGoBack } from "../src/hooks/useGoBack";

// Pantalla única de autenticación: alterna entre "Iniciar sesión" y "Registrarse" con el mismo formulario.

type AuthMode = "sign-in" | "sign-up";

export default function LoginScreen() {
  const goBack = useGoBack();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignIn = mode === "sign-in";

  const handleToggleMode = () => {
    setMode(isSignIn ? "sign-up" : "sign-in");
    setError(null);
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Completá tu email y contraseña.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { error: authError } = isSignIn
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password);

    setIsSubmitting(false);

    if (authError) {
      setError(authError);
      return;
    }

    goBack();
  };

  return (
    <View style={styles.rootContainer}>
      <Header onLeftPress={goBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.content}>
          <Typography variant="h1" style={styles.title}>
            {isSignIn ? "Iniciar sesión" : "Registrarse"}
          </Typography>
          <Typography variant="body" color="#7F8C8D" style={styles.subtitle}>
            {isSignIn
              ? "Ingresá con tu email y contraseña."
              : "Creá una cuenta con tu email y contraseña."}
          </Typography>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#95A5A6"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            editable={!isSubmitting}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#95A5A6"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            editable={!isSubmitting}
          />

          {error && <AlertBox title="ERROR" message={error} />}

          <TouchableOpacity
            style={[
              styles.primaryButton,
              isSubmitting && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Typography
                variant="body"
                color="#FFFFFF"
                style={styles.primaryButtonText}
              >
                {isSignIn ? "Iniciar sesión" : "Registrarse"}
              </Typography>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleToggleMode}
            disabled={isSubmitting}
          >
            <Typography
              variant="body"
              color="#7F8C8D"
              style={styles.secondaryButtonText}
            >
              {isSignIn
                ? "¿No tenés cuenta? Registrate"
                : "¿Ya tenés cuenta? Iniciá sesión"}
            </Typography>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1, backgroundColor: "#FDFEFE" },
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 32 },
  input: {
    backgroundColor: "#F2F4F4",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
    color: "#2C3E50",
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#27AE60",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  disabledButton: { opacity: 0.6 },
  primaryButtonText: { fontWeight: "bold" },
  secondaryButton: { paddingVertical: 16, alignItems: "center" },
  secondaryButtonText: { fontWeight: "600" },
});
