import { View, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import type { Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback, useEffect } from "react";

import AppText from "../ui/AppText";
import { Event } from "@/types";
import { getFullImageUrl } from "@/utils/imageUrl";
import colors from "@/config/colors";

import { useFormatMoney } from "@/hooks/useFormatMoney";

interface EventCardProps {
    event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
    const imageUri = getFullImageUrl(event.featured_image) || undefined;
    const isOngoing = event.status === "ongoing";
    const ticketPercentage = Math.round((event.tickets_sold / event.total_tickets) * 100);
    const isTrending = ticketPercentage >= 60;
    const formatMoney = useFormatMoney();

    useEffect(() => {
        if (!__DEV__) return;

        console.log("[EventsScreen][EventImageURI]", {
            id: event.id,
            slug: event.slug,
            title: event.title,
            featured_image_raw: event.featured_image,
            featured_image_resolved: imageUri ?? null,
        });
    }, [event.id, event.slug, event.title, event.featured_image, imageUri]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate().toString(),
            month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
            weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
        };
    };

    const { day, month, weekday } = formatDate(event.start_date);

    const formatTime = (time: string) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const showPriceRange = event.lowest_price !== event.highest_price;

    const handlePress = useCallback(() => {
        router.push(`/events/${event.slug}` as Href);
    }, [event.slug]);

    return (
        <View className="bg-primary rounded-2xl overflow-hidden border-2 border-accent">
            {/* Image Section */}
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.9}
                className="relative"
                style={{ aspectRatio: 4 / 3 }}
            >
                <Image
                    source={{ uri: imageUri }}
                    className="w-full h-full"
                    resizeMode="cover"
                    onError={(nativeEvent) => {
                        if (!__DEV__) return;
                        console.warn("[EventsScreen][EventImageLoadError]", {
                            id: event.id,
                            slug: event.slug,
                            title: event.title,
                            uri: imageUri ?? null,
                            error: nativeEvent?.nativeEvent?.error ?? "unknown",
                        });
                    }}
                />

                {/* Gradient Overlay */}
                <View
                    className="absolute inset-0"
                    style={{
                        backgroundColor: "rgba(15, 23, 42, 0.35)",
                    }}
                />

                {/* Top Badges */}
                <View className="absolute top-4 left-4 right-4 flex-row justify-between items-start">
                    {/* Category Badge */}
                    <View className="px-3 py-1.5 bg-accent/90 rounded-lg border border-accent">
                        <AppText styles="text-xs text-white font-nunbold">
                            {event.category.name}
                        </AppText>
                    </View>

                    {/* Status Badges */}
                    <View className="gap-2">
                        {isOngoing && (
                            <View className="flex-row items-center gap-1.5 px-3 py-1.5 bg-accent/95 rounded-lg border-2 border-accent">
                                <View className="w-2 h-2 bg-white rounded-full" />
                                <AppText styles="text-xs text-white font-nunbold">
                                    LIVE NOW
                                </AppText>
                            </View>
                        )}
                        {isTrending && !isOngoing && (
                            <View className="flex-row items-center gap-1.5 px-3 py-1.5 bg-primary/90 rounded-lg border border-accent">
                                <Ionicons name="trending-up" size={14} color={colors.accent50} />
                                <AppText styles="text-xs text-accent-50 font-nunbold">
                                    Trending
                                </AppText>
                            </View>
                        )}
                    </View>
                </View>

                {/* Date Badge */}
                <View className="absolute bottom-4 left-4">
                    <View
                        className="w-12 h-12 rounded-xl bg-accent/95 items-center justify-center border-2 border-accent"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                        }}
                    >
                        <AppText styles="text-xs text-white/80 font-nunbold">
                            {month}
                        </AppText>
                        <AppText styles="text-xl text-white font-nunbold">
                            {day}
                        </AppText>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Content Section */}
            <View className="p-2">
                {/* Event Title */}
                <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
                    <AppText
                        styles="text-base text-white mb-2"
                        numberOfLines={2}
                    >
                        {event.title}
                    </AppText>
                </TouchableOpacity>

                {/* Event Meta */}
                <View className="gap-2 mb-2">
                    {/* Date & Time */}
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="calendar-outline" size={16} color={colors.accent50} />
                        <AppText styles="text-sm text-slate-200">
                            {weekday}, {month} {day} • {formatTime(event.start_time)}
                        </AppText>
                    </View>

                    {/* Location */}
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="location-outline" size={16} color={colors.accent50} />
                        <AppText
                            styles="text-sm text-slate-200 flex-1"
                            numberOfLines={1}
                        >
                            {event.venue_name}, {event.venue_city}
                        </AppText>
                    </View>
                </View>

                {/* Organizer Info */}
                <View
                    className="flex-row items-center gap-3 py-1"
                    style={{ borderTopWidth: 1, borderTopColor: colors.accent }}
                >
                    <View
                        className="w-8 h-8 rounded-full overflow-hidden"
                        style={{ borderWidth: 2, borderColor: colors.accent }}
                    >
                        <Image
                            source={{ uri: getFullImageUrl(event.organizer?.profile_image) || undefined }}
                            className="w-full h-full bg-white"
                            resizeMode="cover"
                        />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-xs text-slate-300">
                            Organized by
                        </AppText>
                        <AppText
                            styles="text-sm text-white capitalize"
                            numberOfLines={1}
                        >
                            {event.organizer?.full_name || `@${event.organizer?.username}`}
                        </AppText>
                    </View>
                </View>

                {/* Price & Tickets */}
                <View
                    className="flex-row justify-between items-center py-1 mb-1"
                    style={{ borderTopWidth: 1, borderTopColor: colors.accent }}
                >
                    {/* Price */}
                    <View>
                        <AppText styles="text-xs text-slate-300 mb-1">
                            {showPriceRange ? 'From' : 'Price'}
                        </AppText>
                        <View className="flex-row items-baseline">
                            <AppText styles="text-lg text-white font-nunbold">
                                {formatMoney(event.lowest_price)}
                            </AppText>
                            {showPriceRange && (
                                <AppText styles="text-sm text-slate-300 ml-1">
                                    - {formatMoney(event.highest_price)}
                                </AppText>
                            )}
                        </View>
                    </View>

                    {/* Tickets Status */}
                    <View className="items-end">
                        <AppText styles="text-xs text-slate-300 mb-1">
                            Available
                        </AppText>
                        <AppText styles="text-sm text-white font-nunbold">
                            {event.tickets_available} left
                        </AppText>
                    </View>
                </View>

                {/* CTA Button */}
                <TouchableOpacity
                    onPress={handlePress}
                    className="w-full py-3 px-4 bg-accent rounded-xl items-center active:opacity-90"
                    activeOpacity={0.8}
                >
                    <AppText styles="text-sm text-white font-nunbold">
                        View Details
                    </AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default memo(EventCard, (prevProps, nextProps) => {
    return (
        prevProps.event.id === nextProps.event.id &&
        prevProps.event.tickets_available === nextProps.event.tickets_available &&
        prevProps.event.status === nextProps.event.status
    );
});
