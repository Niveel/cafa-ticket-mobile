import { View, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
    Screen,
    RequireAuth,
    Nav,
    CheckInScanner,
    CheckInHistory,
    AppText,
    Animation,
} from "@/components";
import { getMyCreatedEventDetails, getMyCreatedEventAnalytics } from "@/lib/dashboard";
import colors from "@/config/colors";
import type { MyEventDetailsResponse, MyEventAnalytics } from "@/types/dash-events.types";
import type { CheckInSuccessResponse, CheckInHistoryItem } from "@/types/dashboard.types";
import { tickets } from "@/assets";

const EventCheckInScreen = () => {
    const { slug } = useLocalSearchParams<{ slug: string }>();

    const [event, setEvent] = useState<MyEventDetailsResponse | null>(null);
    const [analytics, setAnalytics] = useState<MyEventAnalytics | null>(null);
    const [latestCheckIn, setLatestCheckIn] = useState<CheckInHistoryItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!slug) return;

        try {
            setIsLoading(true);
            setError(null);

            const [eventData, analyticsData] = await Promise.all([
                getMyCreatedEventDetails(slug),
                getMyCreatedEventAnalytics(slug),
            ]);

            if (!eventData) {
                setError("Event not found");
                return;
            }

            setEvent(eventData);
            setAnalytics(analyticsData);
        } catch (err) {
            console.error("Failed to fetch check-in screen data:", err);
            setError("Failed to load check-in interface");
        } finally {
            setIsLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCheckInSuccess = (data: CheckInSuccessResponse) => {
        const item: CheckInHistoryItem = {
            ticket_id: data.ticket.ticket_id,
            attendee_name: data.ticket.attendee_name,
            attendee_email: data.ticket.attendee_email,
            ticket_type: data.ticket.ticket_type,
            checked_in_at: data.ticket.checked_in_at,
            checked_in_by: data.ticket.checked_in_by,
        };
        setLatestCheckIn(item);
    };

    const handleChangeEvent = () => { 
        router.replace("/dashboard/check-in");
    };

    const ticketsSold = analytics?.overview?.tickets_sold ?? 0;
    const ticketsCheckedIn = analytics?.overview?.tickets_checked_in ?? 0;

    if (isLoading) {
        return (
            <Screen>
                <RequireAuth>
                    <Nav title="Check-in" />
                    <View className="flex-1 items-center justify-center">
                        <Animation
                            isVisible={true}
                            path={tickets}
                            style={{ width: 200, height: 200 }}
                        />
                        <AppText styles="text-sm text-black mt-4" style={{ opacity: 0.6 }}>
                            Loading check-in...
                        </AppText>
                    </View>
                </RequireAuth>
            </Screen>
        );
    }

    if (error || !event) {
        return (
            <Screen>
                <RequireAuth>
                    <Nav title="Check-in" />
                    <View className="flex-1 p-6 justify-center">
                        <View
                            className="rounded-xl p-6 border-2 items-center"
                            style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "55" }}
                        >
                            <Ionicons name="alert-circle-outline" size={40} color={colors.accent50} />
                            <AppText styles="text-base text-black mt-3 text-center" font="font-ibold">
                                {error || "Unable to load event"}
                            </AppText>
                            <TouchableOpacity
                                onPress={() => router.replace("/dashboard/check-in")}
                                className="flex-row items-center gap-2 mt-4 px-4 py-2 rounded-lg"
                                style={{ backgroundColor: colors.accent }}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="arrow-back-outline" size={16} color="#fff" />
                                <AppText styles="text-xs text-black" font="font-ibold">
                                    Back to Events
                                </AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </RequireAuth>
            </Screen>
        );
    }

    return (
        <Screen>
            <RequireAuth>
                <Nav title={`Check-in - ${event.title.length > 15 ? event.title.slice(0, 15) + "..." : event.title}`} />

                <View className="flex-1">
                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingTop: 16, paddingBottom: 50 }}
                        accessibilityLabel={`Check-in interface for ${event.title}`}
                        accessibilityHint="Use QR scanner or manual entry to check in attendees, then review recent check-ins."
                    >
                        <View className="gap-5">
                            <CheckInScanner
                                event={{
                                    title: event.title,
                                    slug: event.slug,
                                    venue_name: event.venue_name,
                                    venue_city: event.venue_city,
                                }}
                                ticketsSold={ticketsSold}
                                ticketsCheckedIn={ticketsCheckedIn}
                                onSuccess={handleCheckInSuccess}
                                onChangeEvent={handleChangeEvent}
                            />

                            <CheckInHistory
                                eventSlug={event.slug}
                                latestCheckIn={latestCheckIn}
                            />
                        </View>
                    </ScrollView>
                </View>
            </RequireAuth>
        </Screen>
    );
};

export default EventCheckInScreen;
