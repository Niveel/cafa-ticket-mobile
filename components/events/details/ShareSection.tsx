import { View, TouchableOpacity, Share as RNShare, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";

import AppText from "../../ui/AppText";
import { EventDetails } from "@/types";
import colors from "@/config/colors";

interface ShareSectionProps {
    event: EventDetails;
}

const ShareSection = ({ event }: ShareSectionProps) => {
    const [copied, setCopied] = useState(false);
    const eventUrl = `https://cafatickets.com/events/${event.slug}`;

    const handleShare = async () => {
        try {
            await RNShare.share({
                message: `Check out ${event.title}! ${event.short_description}\n\n${eventUrl}`,
                title: event.title,
            });
        } catch (error) {
            console.error("Share error:", error);
        }
    };

    const handleCopyLink = async () => {
        await Clipboard.setStringAsync(eventUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        Alert.alert("Link Copied", "Event link copied to clipboard!");
    };

    return (
        <Animated.View entering={FadeInDown.delay(1200)} className="bg-primary py-8">
            <View className="px-4">
                {/* Header */}
                <View className="items-center mb-6">
                    <View
                        className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
                        style={{ backgroundColor: colors.accent + "33", borderWidth: 1, borderColor: colors.accent }}
                    >
                        <Ionicons name="share-social-outline" size={32} color={colors.accent50} />
                    </View>
                    <AppText styles="text-xl text-white text-center mb-2 font-nunbold">
                        Share This Event
                    </AppText>
                    <AppText styles="text-sm text-slate-300 text-center leading-relaxed">
                        Spread the word! Help your friends discover this amazing event.
                    </AppText>
                </View>

                {/* Share Button */}
                <TouchableOpacity
                    onPress={handleShare}
                    className="w-full py-4 px-6 rounded-xl flex-row items-center justify-center gap-2 mb-4"
                    style={{ backgroundColor: colors.accent }}
                    activeOpacity={0.8}
                >
                    <Ionicons name="share-social" size={20} color={colors.white} />
                    <AppText styles="text-sm text-white font-nunbold">
                        Share Event
                    </AppText>
                </TouchableOpacity>

                {/* Copy Link */}
                <View className="p-4 bg-primary-100 rounded-xl" style={{ borderWidth: 1, borderColor: colors.accent }}>
                    <View className="flex-row items-center gap-3">
                        <View className="flex-1">
                            <AppText styles="text-xs text-slate-400 mb-1">
                                Event Link
                            </AppText>
                            <AppText styles="text-xs text-white" numberOfLines={1}>
                                {eventUrl}
                            </AppText>
                        </View>
                        <TouchableOpacity
                            onPress={handleCopyLink}
                            className="px-4 py-2 rounded-lg flex-row items-center gap-2"
                            style={{ backgroundColor: copied ? "#10b981" : colors.accent }}
                            activeOpacity={0.8}
                        >
                            <Ionicons name={copied ? "checkmark" : "copy-outline"} size={16} color={colors.white} />
                            <AppText styles="text-xs text-white font-nunbold">
                                {copied ? "Copied!" : "Copy"}
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

export default ShareSection;