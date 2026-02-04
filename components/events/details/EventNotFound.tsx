import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Href } from "expo-router";

import AppText from "../../ui/AppText";
import Screen from "../../ui/Screen";
import colors from "@/config/colors";

const EventNotFound = () => {
    return (
        <Screen>
            <View className="flex-1 justify-center items-center px-4">
                {/* Error Icon */}
                <View className="w-20 h-20 rounded-full items-center justify-center mb-6" style={{ backgroundColor: "#ef444420" }}>
                    <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
                </View>

                {/* Title */}
                <AppText styles="text-2xl text-white text-center mb-3 font-nunbold">
                    Event Not Found
                </AppText>

                {/* Description */}
                <AppText styles="text-sm text-slate-300 text-center mb-6 leading-relaxed">
                    The event you're looking for doesn't exist or may have been deleted by the organizer.
                </AppText>

                {/* Suggestions Box */}
                <View
                    className="w-full max-w-sm bg-primary-100 rounded-xl p-4 mb-6"
                    style={{ borderWidth: 1, borderColor: colors.accent + "30" }}
                >
                    <AppText styles="text-sm text-slate-300 mb-2">
                        Here are some things you can try:
                    </AppText>
                    <View style={{ gap: 8 }}>
                        {[
                            "Check the URL for typos",
                            "The event may have ended",
                            "The organizer may have cancelled it",
                        ].map((text, i) => (
                            <View key={i} className="flex-row items-start gap-2">
                                <AppText styles="text-sm text-accent-50 font-nunbold">
                                    •
                                </AppText>
                                <AppText styles="text-xs text-slate-300">
                                    {text}
                                </AppText>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3 w-full max-w-sm">
                    <TouchableOpacity
                        onPress={() => router.push("/events" as Href)}
                        className="flex-1 py-3 px-6 rounded-xl items-center"
                        style={{ backgroundColor: colors.accent }}
                        activeOpacity={0.8}
                    >
                        <AppText styles="text-sm text-white font-nunbold">
                            Browse Events
                        </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/" as Href)}
                        className="flex-1 py-3 px-6 bg-primary-100 rounded-xl items-center"
                        style={{ borderWidth: 2, borderColor: colors.accent }}
                        activeOpacity={0.8}
                    >
                        <AppText styles="text-sm text-white font-nunbold">
                            Go Home
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </Screen>
    );
};

export default EventNotFound;