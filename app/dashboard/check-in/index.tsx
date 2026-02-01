import { View, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback } from "react";

import {
    Screen,
    RequireAuth,
    Nav,
    CheckInHeader,
    EventSelector,
    CheckInScanner,
    CheckInHistory,
} from "@/components";
import { getMyCreatedEvents } from "@/lib/dashboard";
import colors from "@/config/colors";
import type { MyEvent } from "@/types/dash-events.types";
import type { CheckInSuccessResponse, CheckInHistoryItem } from "@/types/dashboard.types";

const CheckInScreen = () => {
    const [events, setEvents] = useState<MyEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [page, setPage] = useState(1);

    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [latestCheckIn, setLatestCheckIn] = useState<CheckInHistoryItem | null>(null);

    const selectedEvent = events.find((e) => e.id === selectedEventId) || null;

    // Fetch upcoming + ongoing events
    const fetchEvents = useCallback(async (pg: number, append = false) => {
        try {
            if (pg === 1) setIsLoading(true);
            else setIsLoadingMore(true);

            const [upcomingData, ongoingData] = await Promise.all([
                getMyCreatedEvents(pg, 20, { status: "upcoming" }),
                getMyCreatedEvents(pg, 20, { status: "ongoing" }),
            ]);

            const combined = [
                ...(upcomingData?.results || []),
                ...(ongoingData?.results || []),
            ];

            setEvents((prev) => (append ? [...prev, ...combined] : combined));
            setHasMore(!!(upcomingData?.next || ongoingData?.next));

            // Auto-select if only one event
            if (pg === 1 && combined.length === 1) {
                setSelectedEventId(combined[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents(1);
    }, [fetchEvents]);

    const handleLoadMore = useCallback(() => {
        if (isLoadingMore || !hasMore) return;
        const next = page + 1;
        setPage(next);
        fetchEvents(next, true);
    }, [isLoadingMore, hasMore, page, fetchEvents]);

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
        setSelectedEventId(null);
        setLatestCheckIn(null);
    };

    // Loading
    if (isLoading) {
        return (
            <Screen>
                <RequireAuth>
                    <Nav title="Check-in" />
                    <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.primary }}>
                        <ActivityIndicator size="large" color={colors.accent} />
                    </View>
                </RequireAuth>
            </Screen>
        );
    }

    return (
        <Screen>
            <RequireAuth>
                <Nav title="Check-in" />

                <View className="flex-1" style={{ backgroundColor: colors.primary }}>
                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 50 }}
                    >
                        <View className="gap-5">
                            {/* Header — only show when no event selected */}
                            {!selectedEventId && <CheckInHeader />}

                            {/* Event selector — shown when no event picked */}
                            {!selectedEventId && (
                                <EventSelector
                                    events={events}
                                    onSelectEvent={setSelectedEventId}
                                    hasMore={hasMore}
                                    isLoadingMore={isLoadingMore}
                                    onLoadMore={handleLoadMore}
                                />
                            )}

                            {/* Scanner + stats + history — shown when event is selected */}
                            {selectedEventId && selectedEvent && (
                                <>
                                    <CheckInScanner
                                        event={selectedEvent}
                                        onSuccess={handleCheckInSuccess}
                                        onChangeEvent={handleChangeEvent}
                                    />
                                    <CheckInHistory
                                        eventSlug={selectedEvent.slug}
                                        latestCheckIn={latestCheckIn}
                                    />
                                </>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </RequireAuth>
        </Screen>
    );
};

export default CheckInScreen;