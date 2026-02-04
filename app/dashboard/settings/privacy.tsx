import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
    Screen,
    RequireAuth,
    Nav,
    AppText,
    PrivacyInfo,
    DeleteAccountSection,
} from "@/components";
import colors from "@/config/colors";

const PrivacySettingsScreen = () => {
    return (
        <Screen>
            <RequireAuth>
                <Nav title="Privacy & Data" />

                <View className="flex-1" style={{ backgroundColor: colors.primary }}>
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
                                        <Ionicons name="lock-closed-outline" size={24} color={colors.accent50} />
                                    </View>
                                    <View className="flex-1">
                                        <AppText styles="text-xs text-white" style={{ opacity: 0.7 }}>
                                            Manage your privacy settings and account data
                                        </AppText>
                                    </View>
                                </View>

                                {/* Privacy Info */}
                                <PrivacyInfo />

                                {/* Delete Account */}
                                <DeleteAccountSection />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </RequireAuth>
        </Screen>
    );
};

export default PrivacySettingsScreen;