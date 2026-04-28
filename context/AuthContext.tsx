import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { usePostHog } from "posthog-react-native";
import * as Sentry from '@sentry/react-native';
import { CurrentUser, LoginCredentials, SignupData } from "@/types";
import {
  login as loginApi,
  signup as signupApi,
  logout as logoutApi,
  getCurrentUser,
  getStoredToken,
} from "@/lib/auth";

interface AuthContextType {
  user: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const posthog = usePostHog();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const token = await getStoredToken();
      if (token) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      Sentry.captureException(error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await loginApi(credentials);
    posthog.capture("user_logged_in");
    setUser(response.user);
  }, [posthog]);

  const signup = useCallback(async (data: SignupData) => {
    const response = await signupApi(data);
    posthog.capture("user_signed_up");
    setUser(response.user);
  }, [posthog]);

  const logout = useCallback(async () => {
    await logoutApi();
    posthog.capture("user_logged_out");
    posthog.reset();
    setUser(null);
  }, [posthog]);

  const refreshUser = useCallback(async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    posthog.identify(String(user.id), {
      email: user.email,
      full_name: user.full_name,
      username: user.username,
      is_organizer: user.is_organizer,
      is_email_verified: user.is_email_verified,
    });
  }, [
    posthog,
    user?.email,
    user?.full_name,
    user?.id,
    user?.is_email_verified,
    user?.is_organizer,
    user?.username,
  ]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
