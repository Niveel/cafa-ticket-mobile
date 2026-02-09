import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  Screen,
  RequireAuth,
  Nav,
  AppText,
  ChangePasswordForm,
  ChangeEmailForm,
  ChangeUsernameForm,
} from "@/components";
import colors from "@/config/colors";

const SecuritySettingsScreen = () => {
  return (
    <Screen>
      <RequireAuth>
        <Nav title="Security Settings" />

        <View className="flex-1">
          <KeyboardAvoidingView
            className="flex-1"
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          >
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
              <View className="gap-6">
                {/* Header */}
                <View className="flex-row items-center gap-3">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: colors.primary200 + "80" }}
                  >
                    <Ionicons name="shield-checkmark-outline" size={24} color={colors.accent50} />
                  </View>
                  <View className="flex-1">
                    <AppText styles="text-xs text-black" style={{ opacity: 0.7 }}>
                      Manage your password, email, and account security
                    </AppText>
                  </View>
                </View>

                {/* Security Info Banner */}
                <View
                  className="p-4 rounded-xl border"
                  style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                >
                  <View className="flex-row items-start gap-3">
                    <Ionicons name="warning-outline" size={20} color={colors.accent50} style={{ marginTop: 2 }} />
                    <View className="flex-1">
                      <AppText styles="text-sm text-white mb-2 font-nunbold">
                        Security Best Practices
                      </AppText>
                      <View className="gap-1">
                        <AppText styles="text-xs text-white" style={{ opacity: 0.7 }}>
                          • Use a strong, unique password (at least 8 characters)
                        </AppText>
                        <AppText styles="text-xs text-white" style={{ opacity: 0.7 }}>
                          • Don't share your password with anyone
                        </AppText>
                        <AppText styles="text-xs text-white" style={{ opacity: 0.7 }}>
                          • Changing email or username requires verification
                        </AppText>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Change Password Form */}
                <ChangePasswordForm />

                {/* Change Email Form */}
                <ChangeEmailForm />

                {/* Change Username Form */}
                <ChangeUsernameForm />
              </View>
            </ScrollView>

          </KeyboardAvoidingView>
        </View>
      </RequireAuth>
    </Screen>
  );
};

export default SecuritySettingsScreen;