import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { AppText } from "@/components";
import colors from "@/config/colors";

const privacyRights = [
    {
        title: "Right to Access",
        description: "View all your personal data at any time through your profile.",
    },
    {
        title: "Right to Rectification",
        description: "Update your information anytime from your profile settings.",
    },
    {
        title: "Right to Erasure",
        description: "Delete your account and personal data permanently (see below).",
    },
    {
        title: "Data Retention",
        description:
            "Personal data deleted within 30 days of account deletion. Transaction records may be anonymized and retained for legal compliance (7 years).",
    },
];

const PrivacyInfo = () => {
    return (
        <View className="rounded-xl p-4 border-2" style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}>
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-4">
                <View className="w-10 h-10 rounded-lg items-center justify-center" style={{ backgroundColor: "#10b981" + "33" }}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#34d399" />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-white" font="font-ibold">
                        Your Privacy Rights
                    </AppText>
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                        We comply with GDPR regulations. You have full control over your personal data.
                    </AppText>
                </View>
            </View>

            {/* Rights List */}
            <View className="gap-2">
                {privacyRights.map((right, index) => (
                    <View
                        key={index}
                        className="flex-row items-start gap-3 p-3 rounded-lg"
                        style={{ backgroundColor: colors.primary200 }}
                    >
                        <Ionicons name="information-circle-outline" size={16} color="#60a5fa" style={{ marginTop: 2 }} />
                        <View className="flex-1">
                            <AppText styles="text-xs text-white" font="font-ibold">
                                {right.title}:{" "}
                                <AppText styles="text-xs" font="font-iregular" style={{ opacity: 0.7 }}>
                                    {right.description}
                                </AppText>
                            </AppText>
                        </View>
                    </View>
                ))}
            </View>

            {/* Footer Links */}
            <View className="flex-row items-center gap-1 mt-4 pt-4 border-t flex-wrap" style={{ borderColor: colors.accent + "4D" }}>
                <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                    Read our{" "}
                </AppText>
                <AppText
                    styles="text-xs"
                    font="font-ibold"
                    style={{ color: colors.accent50 }}
                    onPress={() => router.push("/privacy")}
                >
                    Privacy Policy
                </AppText>
                <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                    {" "}and{" "}
                </AppText>
                <AppText
                    styles="text-xs"
                    font="font-ibold"
                    style={{ color: colors.accent50 }}
                    onPress={() => router.push("/terms")}
                >
                    Terms of Service
                </AppText>
            </View>
        </View>
    );
};

export default PrivacyInfo;