import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
    Screen,
    Nav,
    AppText,
    ContactForm,
} from "@/components";
import colors from "@/config/colors";
import { APP_EMAIL } from "@/data/constants";

const ContactScreen = () => {
    return (
        <Screen>
            <Nav title="Contact Us" />

            <View className="flex-1" style={{ backgroundColor: colors.white }}>
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
                                    <Ionicons name="chatbubble-outline" size={24} color={colors.accent50} />
                                </View>
                                <View className="flex-1">
                                    <AppText styles="text-xs text-black" style={{ opacity: 0.7 }}>
                                        Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
                                    </AppText>
                                </View>
                            </View>

                            {/* Email Info Card */}
                            <View
                                className="flex-row items-center gap-4 p-4 rounded-xl border"
                                style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                            >
                                <View
                                    className="w-12 h-12 rounded-xl items-center justify-center"
                                    style={{ backgroundColor: colors.accent + "33" }}
                                >
                                    <Ionicons name="mail-outline" size={24} color={colors.accent50} />
                                </View>
                                <View className="flex-1">
                                    <AppText styles="text-sm text-white font-nunbold">
                                        Email Us
                                    </AppText>
                                    <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                                        Send us an email anytime
                                    </AppText>
                                    <AppText styles="text-xs mt-1 font-nunbold" style={{ color: colors.accent50 }}>
                                        {APP_EMAIL}
                                    </AppText>
                                </View>
                            </View>

                            {/* Contact Form */}
                            <ContactForm />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Screen>
    );
};

export default ContactScreen;