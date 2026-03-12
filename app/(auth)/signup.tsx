import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useState } from "react";
import { router, Link } from "expo-router";
import type { Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

import {
  AppText,
  AppForm,
  AppFormField,
  SubmitButton,
  AppErrorMessage,
  Screen,
  FormLoader,
} from "@/components";
import { SignupValidationSchema, SignupFormValues } from "@/data/validationSchema";
import colors from "@/config/colors";
import { API_BASE_URL } from "@/config/settings";
import EmailVerificationPrompt from "@/components/auth/EmailVerificationPrompt";

const SignupScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const handleSubmit = async (
    values: SignupFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        username: values.username,
        email: values.email,
        full_name: values.username, // Using username as full_name fallback
        password: values.password,
        password_confirm: values.confirmPassword,
      };

      const response = await axios.post(
        `${API_BASE_URL}/auth/users/`,
        payload
      );

      // Success - show email verification prompt
      setRegisteredEmail(values.email);
      resetForm();
    } catch (err: any) {
      console.error("Signup error:", err);

      // Priority 1: Check for backend validation errors in 'details' object
      if (err?.response?.data?.details) {
        const details = err.response.data.details;

        if (details.password) {
          setError(
            Array.isArray(details.password)
              ? details.password[0]
              : details.password
          );
        } else if (details.username) {
          setError(
            Array.isArray(details.username)
              ? details.username[0]
              : details.username
          );
        } else if (details.email) {
          setError(
            Array.isArray(details.email) ? details.email[0] : details.email
          );
        } else {
          const firstError = Object.values(details)[0];
          setError(
            Array.isArray(firstError) ? firstError[0] : String(firstError)
          );
        }
        return;
      }

      // Priority 2: Check for top-level field errors
      if (err?.response?.data?.username) {
        setError(
          Array.isArray(err.response.data.username)
            ? err.response.data.username[0]
            : err.response.data.username
        );
        return;
      }
      if (err?.response?.data?.email) {
        setError(
          Array.isArray(err.response.data.email)
            ? err.response.data.email[0]
            : err.response.data.email
        );
        return;
      }
      if (err?.response?.data?.password) {
        setError(
          Array.isArray(err.response.data.password)
            ? err.response.data.password[0]
            : err.response.data.password
        );
        return;
      }

      // Priority 3: General error messages
      if (
        err?.response?.data?.message &&
        err.response.data.message !== "The data provided is invalid"
      ) {
        setError(err.response.data.message);
        return;
      }

      // Fallback
      setError(
        err?.response?.data?.error ||
        err?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show email verification prompt after successful signup
  if (registeredEmail) {
    return <EmailVerificationPrompt email={registeredEmail} />;
  }

  return (
    <Screen statusBarStyle="dark-content" statusBarBg={colors.white}>
      <FormLoader visible={isLoading} />

      <LinearGradient
        colors={[colors.primary, colors.primary200, colors.primary]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
          bounces={true}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="ml-2 mt-4 w-10 h-10 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 px-4 py-8">
              {/* Header Section */}
              <View className="mb-8">
                <View className="flex-row items-center gap-3 mb-4">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <Ionicons name="ticket" size={24} color="white" />
                  </View>
                  <View>
                    <AppText styles="text-xl text-white font-nunbold">
                      Cafa Tickets
                    </AppText>
                    <AppText
                      styles="text-xs text-slate-300"
                    >
                      Join the Community
                    </AppText>
                  </View>
                </View>

                <AppText
                  styles="text-3xl text-white mb-2 font-nunbold"
                >
                  Create Account
                </AppText>
              </View>

              {/* Form Card */}
              <View className="bg-primary-100/80">
                <AppForm
                  initialValues={{
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                  }}
                  onSubmit={handleSubmit}
                  validationSchema={SignupValidationSchema}
                >
                  {error && (
                    <View className="mb-4">
                      <AppErrorMessage error={error} visible={!!error} />
                    </View>
                  )}

                  {/* Username */}
                  <View className="mb-4">
                    <AppFormField
                      name="username"
                      placeholder="e.g. john_doe"
                      label="Username"
                      autoCapitalize="none"
                      autoCorrect={false}
                      icon="person-outline"
                    />
                  </View>

                  {/* Email */}
                  <View className="mb-4">
                    <AppFormField
                      name="email"
                      placeholder="you@example.com"
                      label="Email Address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      icon="mail-outline"
                    />
                  </View>

                  {/* Password */}
                  <View className="mb-4">
                    <AppFormField
                      name="password"
                      placeholder="Enter password"
                      label="Password"
                      icon={showPassword ? "eye-off-outline" : "eye-outline"}
                      iconClick={() => setShowPassword((prev) => !prev)}
                      iconAria={showPassword ? "Hide password" : "Show password"}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  {/* Confirm Password */}
                  <View className="mb-4">
                    <AppFormField
                      name="confirmPassword"
                      placeholder="Confirm password"
                      label="Confirm Password"
                      icon={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      iconClick={() => setShowConfirmPassword((prev) => !prev)}
                      iconAria={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  {/* Terms & Conditions */}
                  <View className="mb-4 p-4 bg-primary/50 rounded-xl border border-accent/30">
                    <AppText
                      styles="text-xs text-slate-100 leading-5"
                    >
                      By creating an account, you agree to our{" "}
                      <Link href="/terms" asChild>
                        <AppText
                          styles="text-xs text-white underline font-nunbold"
                        >
                          Terms of Service
                        </AppText>
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" asChild>
                        <AppText
                          styles="text-xs text-white underline font-nunbold"
                        >
                          Privacy Policy
                        </AppText>
                      </Link>
                    </AppText>
                  </View>

                  {/* Submit Button */}
                  <View className="mb-4">
                    <SubmitButton title="Create Account" />
                  </View>

                  {/* Divider */}
                  <View className="flex-row items-center my-6">
                    <View className="flex-1 h-[1px] bg-accent/30" />
                    <AppText
                      styles="mx-4 text-sm text-slate-300"
                    >
                      Already have an account?
                    </AppText>
                    <View className="flex-1 h-[1px] bg-accent/30" />
                  </View>

                  {/* Sign In Link */}
                  <TouchableOpacity
                    onPress={() => router.push("/(auth)/login" as Href)}
                    className="flex-row items-center justify-center gap-2 py-3 border-2 border-accent rounded-xl"
                    activeOpacity={0.7}
                  >
                    <AppText
                      styles="text-sm text-white font-nunbold"
                    >
                      Sign In
                    </AppText>
                    <Ionicons name="arrow-forward" size={16} color="white" />
                  </TouchableOpacity>
                </AppForm>
              </View>

              {/* Bottom spacing */}
              <View className="h-8" />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default SignupScreen;
