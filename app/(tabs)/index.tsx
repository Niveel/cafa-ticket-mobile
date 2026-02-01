import { useEffect, useState, useCallback } from "react";
import { RefreshControl, View, StatusBar } from "react-native";
import Animated from 'react-native-reanimated';

import colors from "@/config/colors";
import { Event, PublicStats } from "@/types";
import { EventCategory } from "@/types/tickets.types";
import { getEvents, getEventCategories } from "@/lib/events";
import { getPublicStats } from "@/lib/general";
import { isWithinDays } from "@/utils/format";
import {
    HomeHeader,
    SearchBar,
    CategoriesSection,
    SoonEventsSection,
    UpcomingEventsSection,
    StatsSection,
} from "@/components/home";
import { FeaturedEventCard } from "@/components/cards";
import { useScrollTabBar } from "@/hooks";

export default function HomeScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [categories, setCategories] = useState<EventCategory[]>([]);
    const [stats, setStats] = useState<PublicStats | null>(null);

    const scrollHandler = useScrollTabBar();

    const fetchData = useCallback(async () => {
        try {
            const [eventsData, categoriesData, statsData] = await Promise.all([
                getEvents({ status: "upcoming", ordering: "start_date" }),
                getEventCategories(),
                getPublicStats(),
            ]);

            setEvents(eventsData.results);
            setCategories(categoriesData);
            setStats(statsData);
        } catch (error) {
            console.error("Error fetching home data:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchData();
    }, [fetchData]);

    // Get featured event (first live or first upcoming)
    const featuredEvent = events.find((e) => e.status === "ongoing") || events[0];

    // Get events happening within 7 days
    const soonEvents = events.filter((e) => isWithinDays(e.start_date, 7)).slice(0, 10);

    // Get rest of upcoming events (excluding featured)
    const upcomingEvents = events
        .filter((e) => e.id !== featuredEvent?.id)
        .slice(0, 12);

    return (
        <View className="flex-1 px-2" style={{ backgroundColor: colors.primary }}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            <Animated.ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.accent}
                        colors={[colors.accent]}
                    />
                }
            >
                {/* Header */}
                <HomeHeader />

                {/* Search Bar */}
                <View className="mb-6">
                    <SearchBar />
                </View>

                {/* Featured Event */}
                {featuredEvent && (
                    <View className="mb-6">
                        <FeaturedEventCard event={featuredEvent} />
                    </View>
                )}

                {/* Stats */}
                <StatsSection stats={stats} />

                {/* Categories */}
                <CategoriesSection categories={categories} isLoading={isLoading} />

                {/* Events Happening Soon */}
                <SoonEventsSection events={soonEvents} isLoading={isLoading} />

                {/* Upcoming Events */}
                <UpcomingEventsSection events={upcomingEvents} isLoading={isLoading} />

                {/* Bottom spacing for tab bar */}
                <View className="h-24" />
            </Animated.ScrollView>
        </View>
    );
}