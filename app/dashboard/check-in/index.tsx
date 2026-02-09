import { View, ScrollView } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Href, router } from "expo-router";

import {
    Screen,
    RequireAuth,
    Nav,
    CheckInHeader,
    EventSelector,
    Animation,
    AppText,
} from "@/components";
import { getMyCreatedEvents } from "@/lib/dashboard";
import type { MyEvent } from "@/types/dash-events.types";
import { tickets } from "@/assets";

const CheckInScreen = () => {
    const [events, setEvents] = useState<MyEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [page, setPage] = useState(1);

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

    const handleSelectEvent = (eventSlug: string) => {
        router.push(`/dashboard/check-in/${eventSlug}` as Href);
    };

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
                            Loading events...
                        </AppText>
                    </View>
                </RequireAuth>
            </Screen>
        );
    }

    return (
        <Screen>
            <RequireAuth>
                <Nav title="Check-in" />

                <View className="flex-1">
                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingTop: 16, paddingBottom: 50 }}
                    >
                        <View className="gap-5">
                            <CheckInHeader />
                            <EventSelector
                                events={events}
                                onSelectEvent={handleSelectEvent}
                                hasMore={hasMore}
                                isLoadingMore={isLoadingMore}
                                onLoadMore={handleLoadMore}
                            />
                        </View>
                    </ScrollView>
                </View>
            </RequireAuth>
        </Screen>
    );
};

export default CheckInScreen;
