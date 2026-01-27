import { View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Href } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

import { AppText } from "@/components";
import { EventDetails, SimilarEvent } from "@/types";
import { getFullImageUrl } from "@/utils/imageUrl";
import colors from "@/config/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.7;

interface SimilarEventsSectionProps {
    event: EventDetails;
}

const SimilarEventCard = ({ event }: { event: SimilarEvent }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate().toString(),
            month: date.toLocaleDateString("en-US", { month: "short" }),
        };
    };

    const { day, month } = formatDate(event.start_date);

    return (
        <TouchableOpacity
            onPress={() => router.push(`/events/${event.slug}` as Href)}
            className="bg-primary-100 rounded-2xl overflow-hidden mr-3"
            style={{ width: CARD_WIDTH, borderWidth: 2, borderColor: colors.accent }}
            activeOpacity={0.9}
        >
            {/* Image */}
            <View style={{ height: 180 }}>
                <Image
                    source={{ uri: getFullImageUrl(event.featured_image) || undefined }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                    transition={200}
                />

                {/* Date Badge */}
                <View
                    className="absolute top-4 left-4 w-14 h-14 rounded-xl items-center justify-center"
                    style={{ backgroundColor: colors.accent }}
                >
                    <AppText styles="text-xs text-white" font="font-ibold">
                        {month}
                    </AppText>
                    <AppText styles="text-2xl text-white" font="font-ibold">
                        {day}
                    </AppText>
                </View>
            </View>

            {/* Content */}
            <View className="p-4">
                <AppText styles="text-base text-white mb-2" font="font-ibold" numberOfLines={2}>
                    {event.title}
                </AppText>

                <View className="flex-row items-center gap-2 mb-3">
                    <Ionicons name="location-outline" size={16} color={colors.accent50} />
                    <AppText styles="text-xs text-slate-300" font="font-iregular">
                        {event.venue_city}
                    </AppText>
                </View>

                <View className="flex-row justify-between items-center">
                    <View>
                        <AppText styles="text-xs text-slate-400" font="font-iregular">
                            From
                        </AppText>
                        <AppText styles="text-base text-white" font="font-ibold">
                            GHS {parseFloat(event.lowest_price).toFixed(0)}
                        </AppText>
                    </View>
                    <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: colors.accent }}>
                        <Ionicons name="arrow-forward" size={20} color={colors.white} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const SimilarEventsSection = ({ event }: SimilarEventsSectionProps) => {
    if (!event.similar_events || event.similar_events.length === 0) return null;

    return (
        <Animated.View entering={FadeInDown.delay(1400)} className="bg-primary-100 py-8">
            <View>
                {/* Header */}
                <View className="px-4 mb-6">
                    <View className="flex-row items-center gap-3 mb-3">
                        <View
                            className="w-12 h-12 rounded-xl items-center justify-center"
                            style={{ backgroundColor: colors.accent + "33", borderWidth: 1, borderColor: colors.accent }}
                        >
                            <Ionicons name="sparkles-outline" size={24} color={colors.accent50} />
                        </View>
                        <AppText styles="text-xl text-white" font="font-ibold">
                            You Might Also Like
                        </AppText>
                    </View>
                    <AppText styles="text-sm text-slate-300 leading-relaxed" font="font-iregular">
                        Check out these similar events that might interest you.
                    </AppText>
                </View>

                {/* Horizontal Scrollable Cards */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                >
                    {event.similar_events.slice(0, 6).map((similarEvent) => (
                        <SimilarEventCard key={similarEvent.id} event={similarEvent} />
                    ))}
                </ScrollView>

                {/* Explore All Button */}
                <View className="px-4 mt-6">
                    <TouchableOpacity
                        onPress={() => router.push("/events" as Href)}
                        className="w-full py-3 px-6 rounded-xl items-center"
                        style={{ backgroundColor: colors.accent }}
                        activeOpacity={0.8}
                    >
                        <AppText styles="text-sm text-white" font="font-ibold">
                            Explore All Events
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
};

export default SimilarEventsSection;