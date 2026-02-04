import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import AppText from "../ui/AppText";
import colors from "@/config/colors";
import { formatNumber } from "@/utils";

interface EventsHeroProps {
    totalEvents: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const EventsHero = ({
    totalEvents,
    searchQuery,
    onSearchChange,
}: EventsHeroProps) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ paddingTop: insets.top }} className="pb-8 rounded-sm overflow-hidden">
            {/* Gradient Background with Decorative Elements */}
            <LinearGradient
                colors={[colors.primary, colors.primary200, colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-4 py-6 rounded-sm overflow-hidden"
            >
                {/* Floating Accent Circles - Decorative */}
                <View className="absolute top-10 right-8 w-32 h-32 rounded-full opacity-10"
                    style={{ backgroundColor: colors.accent50 }}
                />
                <View className="absolute bottom-16 left-4 w-24 h-24 rounded-full opacity-5"
                    style={{ backgroundColor: colors.accent }}
                />

                {/* Compact Header */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-4">
                        {/* Title Section */}
                        <View className="flex-1">
                            <AppText styles="text-2xl text-white mb-1 font-nunbold">
                                Discover Events
                            </AppText>
                            <AppText styles="text-xs text-slate-300">
                                amazing experiences
                            </AppText>
                        </View>
                    </View>
                </View>

                {/* Modern Search Bar with Glass Effect */}
                <View className="mb-6">
                    <BlurView intensity={20} tint="dark" className="rounded-2xl overflow-hidden border-2 border-accent">
                        <View className="flex-row items-center px-4 py-4 bg-primary-100/50">
                            <Ionicons name="search-outline" size={22} color={colors.accent50} />
                            <TextInput
                                value={searchQuery}
                                onChangeText={onSearchChange}
                                placeholder="Search events, venues, cities..."
                                placeholderTextColor="#94a3b8"
                                className="flex-1 ml-3 text-white"
                                style={{ fontFamily: "iregular", fontSize: 15 }}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => onSearchChange("")} activeOpacity={0.7}>
                                    <View className="w-6 h-6 rounded-full bg-accent/20 items-center justify-center">
                                        <Ionicons name="close" size={16} color={colors.white} />
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                    </BlurView>
                </View>

                {/* Quick Stats Cards */}
                <View className="flex-row gap-3">
                    {/* Total Events Card */}
                    <View className="flex-1 bg-primary/50 rounded-2xl border border-accent p-4">
                        <View className="flex-row items-center gap-3">
                            <View
                                className="w-10 h-10 rounded-xl items-center justify-center"
                                style={{ backgroundColor: "rgba(220, 0, 0, 0.2)" }}
                            >
                                <Ionicons name="calendar" size={20} color={colors.accent50} />
                            </View>
                            <View className="flex-1">
                                <AppText styles="text-xl text-white font-nunbold">
                                    {formatNumber(totalEvents)}
                                </AppText>
                                <AppText styles="text-xs text-slate-400">
                                    Events
                                </AppText>
                            </View>
                        </View>
                    </View>

                    {/* Categories Card */}
                    <View className="flex-1 bg-primary/50 rounded-2xl border border-accent p-4">
                        <View className="flex-row items-center gap-3">
                            <View
                                className="w-10 h-10 rounded-xl items-center justify-center"
                                style={{ backgroundColor: "rgba(220, 0, 0, 0.2)" }}
                            >
                                <Ionicons name="grid" size={20} color={colors.accent50} />
                            </View>
                            <View className="flex-1">
                                <AppText styles="text-xl text-white font-nunbold">
                                    10
                                </AppText>
                                <AppText styles="text-xs text-slate-400">
                                    Categories
                                </AppText>
                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

export default EventsHero;