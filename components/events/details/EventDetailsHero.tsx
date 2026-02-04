import { View, ScrollView, TouchableOpacity, Dimensions, Share } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

import AppText from "../../ui/AppText";
import { EventDetails } from "@/types";
import { getFullImageUrl } from "@/utils/imageUrl";
import colors from "@/config/colors";

interface EventDetailsHeroProps {
    event: EventDetails;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.75;

const EventDetailsHero = ({ event }: EventDetailsHeroProps) => {
    const insets = useSafeAreaInsets();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // All images
    const additionalImages = Array.isArray(event.additional_images)
        ? event.additional_images.map(getFullImageUrl).filter(Boolean)
        : [];
    const allImages = [getFullImageUrl(event.featured_image), ...additionalImages];

    // Share functionality
    const handleShare = useCallback(async () => {
        try {
            await Share.share({
                message: `Check out ${event.title}! ${event.short_description}`,
                url: `https://cafatickets.com/events/${event.slug}`,
            });
        } catch (error) {
            console.error("Share error:", error);
        }
    }, [event]);

    return (
        <View className="bg-primary">
            {/* Back Button & Share - Floating over image */}
            <View
                style={{
                    paddingTop: insets.top + 8,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: "rgba(5, 14, 60, 0.9)" }}
                    activeOpacity={0.8}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.white} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleShare}
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: "rgba(5, 14, 60, 0.9)" }}
                    activeOpacity={0.8}
                >
                    <Ionicons name="share-social" size={20} color={colors.white} />
                </TouchableOpacity>
            </View>

            {/* Image Gallery */}
            <View style={{ height: IMAGE_HEIGHT }}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(e) => {
                        const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                        setSelectedImageIndex(index);
                    }}
                >
                    {allImages.map((image, index) => (
                        <Image
                            key={index}
                            source={{ uri: image || undefined }}
                            style={{ width: SCREEN_WIDTH, height: IMAGE_HEIGHT }}
                            contentFit="cover"
                            transition={200}
                        />
                    ))}
                </ScrollView>

                {/* Gradient Overlay at bottom */}
                <View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 120,
                        // background: "linear-gradient(to top, rgba(5, 14, 60, 0.9), transparent)",
                    }}
                />

                {/* Status Badge - Bottom Left */}
                <Animated.View
                    entering={FadeIn.delay(300)}
                    style={{
                        position: "absolute",
                        bottom: 16,
                        left: 16,
                    }}
                >
                    <View
                        className={`px-4 py-2 rounded-xl flex-row items-center gap-2 ${event.status === "ongoing"
                            ? "bg-accent"
                            : event.status === "upcoming"
                                ? "bg-accent-50"
                                : "bg-slate-600"
                            }`}
                    >
                        {event.status === "ongoing" && (
                            <View className="w-2 h-2 bg-white rounded-full" />
                        )}
                        <AppText
                            styles="text-xs text-white font-nunbold"
                        >
                            {event.status === "ongoing" && "LIVE NOW"}
                            {event.status === "upcoming" && "UPCOMING"}
                            {event.status === "past" && "PAST EVENT"}
                        </AppText>
                    </View>
                </Animated.View>

                {/* Image Counter - Bottom Right */}
                {allImages.length > 1 && (
                    <Animated.View
                        entering={FadeIn.delay(300)}
                        style={{
                            position: "absolute",
                            bottom: 16,
                            right: 16,
                        }}
                    >
                        <View className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: "rgba(5, 14, 60, 0.9)" }}>
                            <AppText styles="text-xs text-white font-nunbold">
                                {selectedImageIndex + 1} / {allImages.length}
                            </AppText>
                        </View>
                    </Animated.View>
                )}
            </View>

            {/* Content Below Image */}
            <Animated.View entering={SlideInDown.delay(200)} className="px-4 pt-6 pb-4">
                {/* Category Badge */}
                <TouchableOpacity
                    onPress={() => router.push(`/events?category=${event.category.slug}`)}
                    className="self-start px-3 py-1.5 rounded-lg mb-3"
                    style={{ backgroundColor: colors.accent + "33", borderWidth: 1, borderColor: colors.accent }}
                    activeOpacity={0.8}
                >
                    <AppText styles="text-xs text-accent-50 font-nunbold">
                        {event.category.name}
                    </AppText>
                </TouchableOpacity>

                {/* Title */}
                <AppText styles="text-2xl text-white mb-3 leading-tight font-nunbold">
                    {event.title}
                </AppText>

                {/* Short Description */}
                <AppText styles="text-sm text-slate-300 leading-relaxed mb-4">
                    {event.short_description}
                </AppText>

                {/* Quick Info Cards */}
                <View style={{ gap: 12 }}>
                    {/* Date & Time */}
                    <View className="flex-row items-center gap-3 p-2 bg-primary-100 rounded-xl" style={{ borderWidth: 1, borderColor: colors.accent }}>
                        <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: colors.accent + "33" }}>
                            <Ionicons name="calendar-outline" size={24} color={colors.accent50} />
                        </View>
                        <View className="flex-1">
                            <AppText styles="text-xs text-slate-400 mb-1">
                                {event.is_recurring && event.recurrence_info ? "Recurring Event" : "Date & Time"}
                            </AppText>
                            <AppText styles="text-sm text-white font-nunbold">
                                {new Date(event.start_date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </AppText>
                            <AppText styles="text-xs text-slate-300">
                                {new Date(`2000-01-01T${event.start_time}`).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                })} - {new Date(`2000-01-01T${event.end_time}`).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                            </AppText>
                            {event.is_recurring && event.recurrence_info && (
                                <AppText styles="text-xs text-accent-50 mt-1">
                                    Repeats {event.recurrence_info.frequency} • {event.recurrence_info.total_occurrences} occurrences
                                </AppText>
                            )}
                        </View>
                    </View>

                    {/* Location */}
                    <View className="flex-row items-center gap-3 p-2 bg-primary-100 rounded-xl" style={{ borderWidth: 1, borderColor: colors.accent }}>
                        <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: colors.accent + "33" }}>
                            <Ionicons name="location-outline" size={24} color={colors.accent50} />
                        </View>
                        <View className="flex-1">
                            <AppText styles="text-xs text-slate-400 mb-1">
                                Location
                            </AppText>
                            <AppText styles="text-sm text-white font-nunbold" numberOfLines={1}>
                                {event.venue.name}
                            </AppText>
                            <AppText styles="text-xs text-slate-300" numberOfLines={1}>
                                {event.venue.city}, {event.venue.country}
                            </AppText>
                        </View>
                    </View>

                    {/* Tickets Available */}
                    <View className="flex-row items-center gap-3 p-2 bg-primary-100 rounded-xl" style={{ borderWidth: 1, borderColor: colors.accent }}>
                        <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: colors.accent + "33" }}>
                            <Ionicons name="people-outline" size={24} color={colors.accent50} />
                        </View>
                        <View className="flex-1">
                            <AppText styles="text-xs text-slate-400 mb-1">
                                Availability
                            </AppText>
                            <AppText styles="text-sm text-white font-nunbold">
                                {event.tickets_available.toLocaleString()} tickets remaining
                            </AppText>
                            {/* Progress Bar */}
                            <View className="mt-2 h-2 bg-primary-200 rounded-full overflow-hidden">
                                <View
                                    className="h-full bg-accent-50 rounded-full"
                                    style={{
                                        width: `${(event.tickets_sold / event.max_attendees) * 100}%`,
                                    }}
                                />
                            </View>
                            <AppText styles="text-xs text-slate-400 mt-1">
                                {event.tickets_sold.toLocaleString()} sold • {Math.round((event.tickets_sold / event.max_attendees) * 100)}% capacity
                            </AppText>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

export default EventDetailsHero;