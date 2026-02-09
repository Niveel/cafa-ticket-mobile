import { View, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../ui/AppText";
import colors from "@/config/colors";
import { getCheckInHistory } from "@/lib/dashboard";
import type { CheckInHistoryItem } from "@/types/dashboard.types";

type Props = {
    eventSlug: string;
    latestCheckIn?: CheckInHistoryItem | null;
};

const CheckInHistory = ({ eventSlug, latestCheckIn }: Props) => {
    const [history, setHistory] = useState<CheckInHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await getCheckInHistory(eventSlug);
            if (!data) throw new Error("Failed to fetch check-in history");
            setHistory(data);
        } catch (err) {
            console.error("Check-in history error:", err);
            setError(err instanceof Error ? err.message : "Failed to load history");
        } finally {
            setIsLoading(false);
        }
    }, [eventSlug]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // Prepend latest check-in when it arrives
    useEffect(() => {
        if (!latestCheckIn) return;
        setHistory((prev) => {
            if (prev.some((item) => item.ticket_id === latestCheckIn.ticket_id)) return prev;
            return [latestCheckIn, ...prev].slice(0, 20);
        });
    }, [latestCheckIn]);

    const formatTime = (dt: string) =>
        new Date(dt).toLocaleString("en-GH", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

    // Loading
    if (isLoading) {
        return (
            <View
                className="rounded-xl p-6 border-2 items-center justify-center"
                style={{ backgroundColor: colors.primary100, borderColor: colors.accent, minHeight: 120 }}
            >
                <ActivityIndicator size="small" color={colors.accent} />
                <AppText styles="text-xs text-white mt-2" font="font-iregular" style={{ opacity: 0.5 }}>
                    Loading history…
                </AppText>
            </View>
        );
    }

    // Error
    if (error) {
        return (
            <View
                className="rounded-xl p-6 border-2 items-center"
                style={{ backgroundColor: colors.primary100, borderColor: "#ef444433" }}
            >
                <AppText styles="text-xs text-center" font="font-iregular" style={{ color: "#f87171" }}>
                    {error}
                </AppText>
                <TouchableOpacity
                    onPress={fetchHistory}
                    className="flex-row items-center gap-1.5 mt-3 px-4 py-2 rounded-lg"
                    style={{ backgroundColor: colors.accent }}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Retry loading history"
                >
                    <Ionicons name="refresh-outline" size={14} color="#fff" />
                    <AppText styles="text-xs text-white" font="font-ibold">
                        Retry
                    </AppText>
                </TouchableOpacity>
            </View>
        );
    }

    // Empty
    if (history.length === 0) {
        return (
            <View
                className="rounded-xl p-6 border-2 items-center"
                style={{ backgroundColor: colors.primary100, borderColor: colors.accent, minHeight: 120, justifyContent: "center" }}
            >
                <Ionicons name="time-outline" size={32} color="rgba(255,255,255,0.15)" />
                <AppText styles="text-xs text-white mt-2 text-center" font="font-iregular" style={{ opacity: 0.4 }}>
                    No check-ins yet
                </AppText>
            </View>
        );
    }

    // List
    return (
        <View
            className="rounded-xl border-2 overflow-hidden"
            style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center gap-3">
                    <View className="w-9 h-9 rounded-lg items-center justify-center" style={{ backgroundColor: "#a855f733" }}>
                        <Ionicons name="time-outline" size={18} color="#c084fc" />
                    </View>
                    <View>
                        <AppText styles="text-sm text-white" font="font-ibold">
                            Recent Check-ins
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                            Last {history.length} check-in{history.length !== 1 ? "s" : ""}
                        </AppText>
                    </View>
                </View>

                {/* Refresh button */}
                <TouchableOpacity
                    onPress={fetchHistory}
                    className="w-8 h-8 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.primary200 }}
                    activeOpacity={0.6}
                    accessibilityRole="button"
                    accessibilityLabel="Refresh history"
                >
                    <Ionicons name="refresh-outline" size={16} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Scrollable list — capped height so it doesn't blow the page */}
            <ScrollView
                style={{ maxHeight: 360 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
            >
                <View className="gap-2">
                    {history.map((item, index) => (
                        <View
                            key={`${item.ticket_id}-${index}`}
                            className="flex-row items-start gap-3 p-3 rounded-lg border"
                            style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "33" }}
                            accessibilityLabel={`${item.attendee_name} checked in at ${formatTime(item.checked_in_at)}`}
                        >
                            {/* Avatar circle */}
                            <View className="w-9 h-9 rounded-full items-center justify-center shrink-0" style={{ backgroundColor: "#10b98133" }}>
                                <Ionicons name="person-outline" size={18} color="#34d399" />
                            </View>

                            {/* Details */}
                            <View className="flex-1">
                                <View className="flex-row items-center justify-between">
                                    <AppText styles="text-xs text-white" font="font-ibold">
                                        {item.attendee_name}
                                    </AppText>
                                    {/* Checked In badge */}
                                    <View
                                        className="px-2 py-0.5 rounded-md border"
                                        style={{ backgroundColor: "#10b98122", borderColor: "#10b98144" }}
                                    >
                                        <AppText styles="text-xs" font="font-isemibold" style={{ color: "#34d399" }}>
                                            ✓ Checked In
                                        </AppText>
                                    </View>
                                </View>

                                {/* Ticket ID + type */}
                                <View className="flex-row items-center gap-3 mt-1">
                                    <View className="flex-row items-center gap-1">
                                        <Ionicons name="ticket-outline" size={12} color="rgba(255,255,255,0.3)" />
                                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.4, fontFamily: "monospace" }}>
                                            {item.ticket_id}
                                        </AppText>
                                    </View>
                                    {item.ticket_type && (
                                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.4 }}>
                                            • {item.ticket_type.name}
                                        </AppText>
                                    )}
                                </View>

                                {/* Time + by */}
                                <View className="flex-row items-center gap-1 mt-1">
                                    <Ionicons name="time-outline" size={11} color="rgba(255,255,255,0.25)" />
                                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.35 }}>
                                        {formatTime(item.checked_in_at)}
                                    </AppText>
                                    {item.checked_in_by && (
                                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.35 }}>
                                            {" "}· by {typeof item.checked_in_by === "string" ? item.checked_in_by : item.checked_in_by.full_name}
                                        </AppText>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default CheckInHistory;
