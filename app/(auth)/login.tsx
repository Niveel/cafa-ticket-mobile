import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams, Link } from "expo-router";
import type { Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import {
  AppText,
  AppForm,
  AppFormField,
  SubmitButton,
  AppErrorMessage,
  Screen,
  FormLoader,
} from "@/components";
import { LoginValidationSchema, LoginFormValues } from "@/data/validationSchema";
import { useAuth } from "@/context";
import colors from "@/config/colors";

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, login, isAuthenticated } = useAuth();
  const { from } = useLocalSearchParams();

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = (from as string) || "/(tabs)";
      router.replace(redirectPath as Href);
    }
  }, [isAuthenticated, user, from]);

  const handleSubmit = async (
    values: LoginFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      await login({
        email: values.emailOrUsername,
        password: values.password,
      });

      resetForm();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen statusBarStyle="dark-content" statusBarBg={colors.white}>
      <FormLoader visible={isLoading} />

      <LinearGradient
        colors={[colors.primary, colors.primary200, colors.primary]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="ml-2 mt-4 w-10 h-10 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <View className="flex-1 px-4 pt-8">
              <View className="items-center mb-8">
                <View
                  className="w-20 h-20 rounded-full items-center justify-center mb-4"
                  style={{ backgroundColor: colors.accent }}
                >
                  <Ionicons name="ticket" size={40} color="white" />
                </View>

                <AppText
                  styles="text-base text-white text-center"
                >
                  Sign in to continue to CafaTickets
                </AppText>
              </View>

              <View className="bg-secondary/5 rounded-md overflow-hidden p-2">
                <AppForm
                  initialValues={{
                    emailOrUsername: "",
                    password: "",
                  }}
                  onSubmit={handleSubmit}
                  validationSchema={LoginValidationSchema}
                >
                  {error && (
                    <View className="mb-4">
                      <AppErrorMessage error={error} visible={!!error} />
                    </View>
                  )}

                  <View className="mb-4">
                    <AppFormField
                      name="emailOrUsername"
                      placeholder="Enter email or username"
                      label="Email or Username"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      icon="person-outline"
                    />
                  </View>

                  <View className="mb-2">
                    <AppFormField
                      name="password"
                      placeholder="Enter your password"
                      label="Password"
                      icon={showPassword ? "eye-off-outline" : "eye-outline"}
                      iconClick={() => setShowPassword((prev) => !prev)}
                      iconAria={showPassword ? "Hide password" : "Show password"}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  <Link href="/forgot-password" className="text-red-300 underline">Forgot Password?</Link>


                  <View className="mb-4">
                    <SubmitButton title="Sign In" />
                  </View>

                  <View className="flex-row items-center my-6">
                    <View className="flex-1 h-[1px] bg-slate-300" />
                    <AppText styles="mx-4 text-sm text-slate-500">
                      OR
                    </AppText>
                    <View className="flex-1 h-[1px] bg-slate-300" />
                  </View>

                  <View className="flex-row justify-center items-center">
                    <AppText styles="text-sm text-slate-200">
                      Don't have an account?{" "}
                    </AppText>
                    <TouchableOpacity onPress={() => router.push("/signup" as Href)}>
                      <AppText styles="text-sm underline font-nunbold" color="text-red-400">
                        Sign Up
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </AppForm>
              </View>

              <View className="items-center mt-6">
                <AppText
                  styles="text-xs text-white text-center px-8"
                >
                  By signing in, you agree to our <Link href="/terms" className="text-red-400 underline">Terms</Link> and <Link href="/privacy" className="text-red-400 underline">Privacy Policy</Link>
                </AppText>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Screen>
  );
};

export default LoginScreen;
