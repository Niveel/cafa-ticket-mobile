import { View, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import colors from "@/config/colors";
import type { MyEvent } from "@/types/dash-events.types";

type Props = {
    events: MyEvent[];
    onSelectEvent: (eventId: number) => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
    onLoadMore?: () => void;
};

const EventSelector = ({ events, onSelectEvent, hasMore = false, isLoadingMore = false, onLoadMore }: Props) => {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!search.trim()) return events;
        const q = search.toLowerCase();
        return events.filter(
            (e) =>
                e.title.toLowerCase().includes(q) ||
                e.venue_name.toLowerCase().includes(q) ||
                e.venue_city.toLowerCase().includes(q) ||
                e.category.name.toLowerCase().includes(q)
        );
    }, [events, search]);

    const formatDate = (date: string, time: string) =>
        new Date(`${date}T${time}`).toLocaleDateString("en-GH", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    // Empty state — no events at all
    if (events.length === 0) {
        return (
            <View className="items-center py-16 px-4">
                <View
                    className="w-20 h-20 rounded-full items-center justify-center mb-4"
                    style={{ backgroundColor: colors.primary200 }}
                >
                    <Ionicons name="calendar-outline" size={40} color={colors.accent50} style={{ opacity: 0.5 }} />
                </View>
                <AppText styles="text-lg text-white text-center" font="font-ibold">
                    No Upcoming Events
                </AppText>
                <AppText styles="text-xs text-white text-center mt-2" font="font-iregular" style={{ opacity: 0.5, maxWidth: 280 }}>
                    You don't have any upcoming or ongoing events to check in attendees for.
                </AppText>
            </View>
        );
    }

    return (
        <View className="gap-4">
            {/* Title + count */}
            <View className="flex-row items-center justify-between">
                <AppText styles="text-base text-white" font="font-ibold">
                    Select Event
                </AppText>
                <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                    {filtered.length} of {events.length}
                </AppText>
            </View>

            {/* Search input */}
            <View
                className="flex-row items-center rounded-xl border-2 px-4"
                style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D", height: 48 }}
            >
                <Ionicons name="search-outline" size={18} color={colors.accent50} style={{ opacity: 0.5 }} />
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search by name, venue, or category…"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={{ flex: 1, color: "#fff", marginLeft: 10, fontSize: 14 }}
                    autoCorrect={false}
                    autoCapitalize="none"
                    clearButtonMode="while-editing"
                />
            </View>

            {/* No search results */}
            {filtered.length === 0 && search.trim() ? (
                <View className="items-center py-10">
                    <View
                        className="w-16 h-16 rounded-full items-center justify-center mb-3"
                        style={{ backgroundColor: colors.primary200 }}
                    >
                        <Ionicons name="search-outline" size={32} color={colors.accent50} style={{ opacity: 0.4 }} />
                    </View>
                    <AppText styles="text-sm text-white text-center" font="font-ibold">
                        No Events Found
                    </AppText>
                    <AppText styles="text-xs text-white text-center mt-1" font="font-iregular" style={{ opacity: 0.5 }}>
                        No events match "{search}"
                    </AppText>
                    <TouchableOpacity
                        onPress={() => setSearch("")}
                        className="mt-3 px-4 py-2 rounded-lg"
                        style={{ backgroundColor: colors.accent }}
                        activeOpacity={0.7}
                    >
                        <AppText styles="text-xs text-white" font="font-ibold">
                            Clear Search
                        </AppText>
                    </TouchableOpacity>
                </View>
            ) : (
                /* Event cards */
                <View className="gap-3">
                    {filtered.map((event) => {
                        const checkedIn = event.analytics.tickets_checked_in;
                        const totalSold = event.analytics.tickets_sold;
                        const pct = totalSold > 0 ? (checkedIn / totalSold) * 100 : 0;
                        const isOngoing = event.status === "ongoing";

                        return (
                            <TouchableOpacity
                                key={event.id}
                                onPress={() => onSelectEvent(event.id)}
                                activeOpacity={0.7}
                                className="rounded-xl overflow-hidden border-2"
                                style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                                accessibilityRole="button"
                                accessibilityLabel={`Select event: ${event.title}, ${isOngoing ? "Ongoing" : "Upcoming"}, ${checkedIn} of ${totalSold} checked in`}
                            >
                                {/* Status + category badges row */}
                                <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
                                    <View
                                        className="px-2.5 py-1 rounded-md border"
                                        style={{
                                            backgroundColor: isOngoing ? "#10b98122" : "#3b82f622",
                                            borderColor: isOngoing ? "#10b98144" : "#3b82f644",
                                        }}
                                    >
                                        <AppText styles="text-xs" font="font-isemibold" style={{ color: isOngoing ? "#34d399" : "#60a5fa" }}>
                                            {isOngoing ? "Ongoing" : "Upcoming"}
                                        </AppText>
                                    </View>
                                    <View
                                        className="px-2.5 py-1 rounded-md border"
                                        style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "33" }}
                                    >
                                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                                            {event.category.name}
                                        </AppText>
                                    </View>
                                </View>

                                {/* Title */}
                                <View className="px-4">
                                    <AppText styles="text-base text-white" font="font-ibold">
                                        {event.title}
                                    </AppText>
                                </View>

                                {/* Meta row: date + venue */}
                                <View className="px-4 mt-2 gap-1.5">
                                    <View className="flex-row items-center gap-2">
                                        <Ionicons name="calendar-outline" size={14} color={colors.accent50} style={{ opacity: 0.6 }} />
                                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                            {formatDate(event.start_date, event.start_time)}
                                        </AppText>
                                    </View>
                                    <View className="flex-row items-center gap-2">
                                        <Ionicons name="location-outline" size={14} color={colors.accent50} style={{ opacity: 0.6 }} />
                                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                            {event.venue_name}, {event.venue_city}
                                        </AppText>
                                    </View>
                                    <View className="flex-row items-center gap-2">
                                        <Ionicons name="people-outline" size={14} color={colors.accent50} style={{ opacity: 0.6 }} />
                                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                            {checkedIn} / {totalSold} checked in
                                        </AppText>
                                    </View>
                                </View>

                                {/* Progress bar + CTA */}
                                <View className="px-4 pb-4 mt-3">
                                    <View className="flex-row items-center justify-between mb-1.5">
                                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.4 }}>
                                            Check-in Progress
                                        </AppText>
                                        <AppText styles="text-xs text-white" font="font-isemibold" style={{ opacity: 0.7 }}>
                                            {pct.toFixed(1)}%
                                        </AppText>
                                    </View>
                                    <View className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.primary200 }}>
                                        <View
                                            className="h-full rounded-full"
                                            style={{ width: `${pct}%`, backgroundColor: "#34d399" }}
                                        />
                                    </View>

                                    {/* Start Check-in row */}
                                    <View className="flex-row items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: colors.accent + "33" }}>
                                        <AppText styles="text-xs" font="font-ibold" style={{ color: colors.accent50 }}>
                                            Start Check-in
                                        </AppText>
                                        <Ionicons name="chevron-forward-outline" size={18} color={colors.accent50} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                    {/* Load more footer */}
                    {isLoadingMore ? (
                        <View className="items-center py-4">
                            <ActivityIndicator size="small" color={colors.accent} />
                        </View>
                    ) : hasMore && !search.trim() ? (
                        <TouchableOpacity
                            onPress={onLoadMore}
                            className="items-center py-3"
                            activeOpacity={0.6}
                        >
                            <AppText styles="text-xs" font="font-isemibold" style={{ color: colors.accent50 }}>
                                Load More Events
                            </AppText>
                        </TouchableOpacity>
                    ) : null}
                </View>
            )}
        </View>
    );
};

export default EventSelector;