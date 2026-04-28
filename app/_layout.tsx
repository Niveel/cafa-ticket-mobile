import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, SplashScreen, router, usePathname, useSegments } from "expo-router";
import { NativeModules, useColorScheme } from "react-native";
import { useEffect, useState, useCallback, useRef } from 'react';
import { useFonts } from "expo-font";
import { PostHogProvider, usePostHog } from 'posthog-react-native';

import "../global.css";
import { TabBarProvider } from "@/context/TabBarContext";
import { AuthProvider, CurrencyProvider, useAuth } from "@/context";
import * as Sentry from '@sentry/react-native';
import NoInternet from "@/components/ui/NoInternet";

Sentry.init({
  dsn: 'https://c2a31ca6c3c55404f2c5521b59499bed@o4510828002148352.ingest.us.sentry.io/4510828003917824',

  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function ScreenTracker() {
  const pathname = usePathname();
  const segments = useSegments();
  const posthog = usePostHog();
  const lastTrackedRef = useRef("");

  useEffect(() => {
    if (!pathname) return;

    const screenName = pathname === "/" ? "home" : pathname.replace(/^\//, "");
    if (lastTrackedRef.current === screenName) return;

    lastTrackedRef.current = screenName;
    posthog.screen(screenName, {
      path: pathname,
      segments: segments.join("/"),
    });
  }, [pathname, posthog, segments]);

  return null;
}

function AppOpenedTracker() {
  const posthog = usePostHog();
  const pathname = usePathname();
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) return;
    hasTrackedRef.current = true;

    posthog.capture("app_opened", {
      initialPath: pathname || "/",
    });
    (posthog as { flush?: () => void }).flush?.();
  }, [pathname, posthog]);

  return null;
}

function AppNavigator({
  hasConnectionState,
  hasInternet,
  isCheckingConnection,
  handleRetryConnection,
  colorScheme,
}: {
  hasConnectionState: boolean;
  hasInternet: boolean;
  isCheckingConnection: boolean;
  handleRetryConnection: () => Promise<void>;
  colorScheme: "light" | "dark" | null;
}) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const didInitialProtectedRouteCheck = useRef(false);

  useEffect(() => {
    if (didInitialProtectedRouteCheck.current) return;
    if (isLoading) return;

    didInitialProtectedRouteCheck.current = true;

    const isProtectedEntryRoute = pathname?.startsWith("/dashboard");
    if (!user && isProtectedEntryRoute) {
      router.replace({
        pathname: "/login",
        params: { from: pathname },
      });
    }
  }, [isLoading, user, pathname]);

  if (hasConnectionState && !hasInternet) {
    return <NoInternet onRetry={handleRetryConnection} isRetrying={isCheckingConnection} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
        },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default Sentry.wrap(function RootLayout() {
  const [hasInternet, setHasInternet] = useState(true);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [hasConnectionState, setHasConnectionState] = useState(false);
  const [fontsLoaded, error] = useFonts({
    "Rhodium-Regular": require("../assets/fonts/Rhodium-Regular.ttf"),
    "Nunito-Medium": require("../assets/fonts/Nunito-Medium.ttf"),
    "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-Light": require("../assets/fonts/Nunito-Light.ttf"),
    "Metrophobic-Regular": require("../assets/fonts/Metrophobic-Regular.ttf"),
  });

  const colorScheme = useColorScheme();
  const posthogApiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY || process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
  const posthogHost = process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
  const loadNetInfo = useCallback(async () => {
    try {
      // Prevent runtime crash when native module is not bundled in the current app binary.
      if (!NativeModules?.RNCNetInfo) {
        console.warn("NetInfo native module not found in this build. Skipping offline monitoring.");
        return null;
      }

      const NetInfoModule = await import("@react-native-community/netinfo");
      return NetInfoModule.default;
    } catch (netInfoError) {
      console.warn("NetInfo native module unavailable. Run a native rebuild and restart the app.", netInfoError);
      return null;
    }
  }, []);

  const isOnline = useCallback((state: { isConnected: boolean | null; isInternetReachable: boolean | null }) => {
    if (state.isConnected === false) return false;
    if (state.isInternetReachable === false) return false;
    return true;
  }, []);

  useEffect(() => {
    if (error) {
      console.error(error, "Error loading fonts");
    }

    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    const setupNetInfo = async () => {
      const NetInfo = await loadNetInfo();
      if (!isMounted) return;

      if (!NetInfo) {
        setHasConnectionState(true);
        setHasInternet(true);
        return;
      }

      const syncConnectionState = (state: { isConnected: boolean | null; isInternetReachable: boolean | null }) => {
        setHasInternet(isOnline(state));
        setHasConnectionState(true);
      };

      unsubscribe = NetInfo.addEventListener(syncConnectionState);
      const initialState = await NetInfo.fetch();
      if (isMounted) {
        syncConnectionState(initialState);
      }
    };

    setupNetInfo();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [isOnline, loadNetInfo]);

  const handleRetryConnection = useCallback(async () => {
    setIsCheckingConnection(true);
    try {
      const NetInfo = await loadNetInfo();
      if (!NetInfo) return;

      const state = await NetInfo.fetch();
      setHasInternet(isOnline(state));
      setHasConnectionState(true);
    } finally {
      setIsCheckingConnection(false);
    }
  }, [isOnline, loadNetInfo]);

  if (!fontsLoaded && !error) return null;

  if (!posthogApiKey) {
    console.warn("[analytics] Missing PostHog key. Set EXPO_PUBLIC_POSTHOG_KEY.");
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {posthogApiKey ? (
        <PostHogProvider
          apiKey={posthogApiKey}
          options={{
            host: posthogHost,
            captureAppLifecycleEvents: true,
          }}
        >
          <AuthProvider>
            <CurrencyProvider>
              <TabBarProvider>
                <ScreenTracker />
                <AppOpenedTracker />
                <AppNavigator
                  hasConnectionState={hasConnectionState}
                  hasInternet={hasInternet}
                  isCheckingConnection={isCheckingConnection}
                  handleRetryConnection={handleRetryConnection}
                  colorScheme={colorScheme}
                />
              </TabBarProvider>
            </CurrencyProvider>
          </AuthProvider>
        </PostHogProvider>
      ) : (
        <AuthProvider>
          <CurrencyProvider>
            <TabBarProvider>
              <AppNavigator
                hasConnectionState={hasConnectionState}
                hasInternet={hasInternet}
                isCheckingConnection={isCheckingConnection}
                handleRetryConnection={handleRetryConnection}
                colorScheme={colorScheme}
              />
            </TabBarProvider>
          </CurrencyProvider>
        </AuthProvider>
      )}
    </GestureHandlerRootView>
  );
});
