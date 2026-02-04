import { View, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../ui/AppText";
import colors from "@/config/colors";
import { useUserLocation } from "@/hooks/useUserLocation";

// City data mapping (can be moved to a constants file)
const cityImages: Record<string, string> = {
    Accra: "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d",
    Kumasi: "https://images.unsplash.com/photo-1546640646-89b1e0f628d4",
    Takoradi: "https://images.unsplash.com/photo-1505142468610-359e7d316be0",
    "Cape Coast": "https://images.unsplash.com/photo-1523805009345-7448845a9e53",
    Tema: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b",
    // Fallback image for unknown cities
    default: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
};

interface ExploreByLocationSectionProps {
    isLoading?: boolean;
    eventCount?: string; // e.g., "120+"
}

const ExploreByLocationSection = ({ isLoading = false, eventCount = "50+" }: ExploreByLocationSectionProps) => {
    const { location, isLoading: isLoadingLocation, hasPermission } = useUserLocation();

    if (!hasPermission || isLoadingLocation || !location.city) {
        return null;
    }

    const handleCityPress = () => {
        router.push({
            pathname: "/(tabs)/events",
            params: { city: location.city },
        });
    };

    const cityImage = cityImages[location.city] || cityImages.default;

    // Loading skeleton
    if (isLoading) {
        return (
            <View className="mb-6">
                <View className="flex-row items-center justify-between mb-4 px-2">
                    <View className="h-6 w-40 bg-white/10 rounded" />
                </View>
                <View className="px-2">
                    <View className="h-28 bg-white/5 rounded-2xl" />
                </View>
            </View>
        );
    }

    return (
        <View className="mb-6">
            {/* Section Header */}
            <View className="flex-row items-center justify-between mb-4 px-2">
                <View className="flex-row items-center gap-2">
                    <View
                        className="w-10 h-10 rounded-xl items-center justify-center"
                        style={{ backgroundColor: colors.accent + "33" }}
                    >
                        <Ionicons name="location" size={20} color={colors.accent} />
                    </View>
                    <View>
                        <AppText styles="text-lg text-white font-nunbold">
                            Events Near You
                        </AppText>
                        <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                            In {location.city}
                        </AppText>
                    </View>
                </View>
            </View>

            {/* City Card */}
            <View className="px-2">
                <TouchableOpacity
                    onPress={handleCityPress}
                    className="rounded-2xl overflow-hidden"
                    style={{ backgroundColor: colors.primary100 }}
                    activeOpacity={0.8}
                >
                    <View className="flex-row h-28">
                        {/* Image */}
                        <View className="w-28 h-full">
                            <Image
                                source={{ uri: cityImage }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                            {/* Overlay */}
                            <View
                                className="absolute inset-0"
                                style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                            />
                        </View>

                        {/* Content */}
                        <View className="flex-1 p-4 justify-between">
                            <View>
                                <AppText styles="text-base text-white mb-1 font-nunbold">
                                    {location.city}
                                </AppText>
                                <AppText
                                    styles="text-xs text-white"
                                    style={{ opacity: 0.6 }}
                                >
                                    {location.country || "Ghana"}
                                </AppText>
                            </View>

                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center gap-1">
                                    <Ionicons name="calendar-outline" size={14} color={colors.accent50} />
                                    <AppText styles="text-xs" style={{ color: colors.accent50 }}>
                                        {eventCount} events
                                    </AppText>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color={colors.white} style={{ opacity: 0.6 }} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ExploreByLocationSection;