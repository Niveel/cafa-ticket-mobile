import { View, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";

import { AppText, RequireAuth, EditEventForm } from "@/components";
import { getMyCreatedEventDetails } from "@/lib/dashboard";
import type { MyEventDetailsResponse } from "@/types/dash-events.types";
import colors from "@/config/colors";

const EditEventScreen = () => {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const [event, setEvent] = useState<MyEventDetailsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!slug) return;

            try {
                setIsLoading(true);
                setError(null);
                const eventData = await getMyCreatedEventDetails(slug);
                setEvent(eventData);
            } catch (err: any) {
                console.error("Error fetching event:", err);
                setError(err.message || "Failed to load event");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();
    }, [slug]);

    // Check if event has started or ended
    const getEventStatus = () => {
        if (!event) return null;

        const now = new Date();
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        const hasStarted = now >= startDate;
        const hasEnded = now > endDate;

        return { hasStarted, hasEnded };
    };

    const eventStatus = getEventStatus();

    return (
        <RequireAuth>
            <View className="flex-1" style={{ backgroundColor: colors.primary }}>
                <Stack.Screen
                    options={{
                        headerShown: true,
                        headerStyle: { backgroundColor: colors.primary },
                        headerTintColor: colors.white,
                        headerTitle: "Edit Event",
                        headerLeft: () => (
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="w-10 h-10 items-center justify-center"
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="arrow-back" size={24} color={colors.white} />
                            </TouchableOpacity>
                        ),
                    }}
                />

                {/* Loading State */}
                {isLoading && (
                    <View className="flex-1 items-center justify-center p-6">
                        <ActivityIndicator size="large" color={colors.accent} />
                        <AppText styles="text-sm text-white mt-4" style={{ opacity: 0.6 }}>
                            Loading event details...
                        </AppText>
                    </View>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <ScrollView className="flex-1">
                        <View className="p-6">
                            <View
                                className="p-6 rounded-xl border-2"
                                style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                            >
                                <View className="items-center">
                                    <Ionicons name="alert-circle" size={48} color={colors.accent} />
                                    <AppText styles="text-lg text-white mt-4 mb-2 font-nunbold">
                                        Event Not Found
                                    </AppText>
                                    <AppText
                                        styles="text-sm text-white text-center mb-6"
                                        style={{ opacity: 0.8 }}
                                    >
                                        The event you're looking for doesn't exist or you don't have access to it.
                                    </AppText>
                                    <TouchableOpacity
                                        onPress={() => router.push("/dashboard/events")}
                                        className="flex-row items-center gap-2 px-6 py-3 rounded-xl"
                                        style={{ backgroundColor: colors.accent }}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="arrow-back" size={18} color={colors.white} />
                                        <AppText styles="text-sm text-white font-nunbold">
                                            Back to My Events
                                        </AppText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                )}

                {/* Cannot Edit - Event Started/Ended */}
                {!isLoading && event && eventStatus && (eventStatus.hasStarted || eventStatus.hasEnded) && (
                    <ScrollView className="flex-1">
                        <View className="p-6">
                            <View
                                className="p-6 rounded-xl border-2"
                                style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                            >
                                <View className="items-center">
                                    <Ionicons name="lock-closed" size={48} color={colors.accent} />
                                    <AppText styles="text-lg text-white mt-4 mb-2 font-nunbold">
                                        Cannot Edit Event
                                    </AppText>
                                    <AppText
                                        styles="text-sm text-white text-center mb-6"
                                        style={{ opacity: 0.8 }}
                                    >
                                        {eventStatus.hasEnded
                                            ? "This event has already ended and cannot be edited."
                                            : "This event has already started and cannot be edited."}
                                    </AppText>
                                    <TouchableOpacity
                                        onPress={() => router.back()}
                                        className="flex-row items-center gap-2 px-6 py-3 rounded-xl"
                                        style={{ backgroundColor: colors.accent }}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="arrow-back" size={18} color={colors.white} />
                                        <AppText styles="text-sm text-white font-nunbold">
                                            Back to Event Details
                                        </AppText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                )}

                {/* Edit Form */}
                {!isLoading && event && eventStatus && !eventStatus.hasStarted && !eventStatus.hasEnded && (
                    <View className="flex-1">
                        {/* Page Header */}
                        <View className="px-6 py-4" style={{ backgroundColor: colors.primary100 }}>
                            <AppText styles="text-base text-white mb-1 font-nunbold">
                                Edit Event
                            </AppText>
                            <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                                Update your event details and settings
                            </AppText>
                        </View>

                        {/* Form Container */}
                        <View className="flex-1 px-6 pt-6">
                            <View
                                className="flex-1 rounded-xl border-2 p-4"
                                style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                            >
                                <EditEventForm event={event} />
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </RequireAuth>
    );
};

export default EditEventScreen;