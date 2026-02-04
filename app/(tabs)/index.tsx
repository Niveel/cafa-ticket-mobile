import { useEffect, useState, useCallback } from "react";
import { RefreshControl, View, StatusBar } from "react-native";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/config/colors";
import { Event, PublicStats } from "@/types";
import { EventCategory } from "@/types/tickets.types";
import { getEvents, getEventCategories, getPastEvents } from "@/lib/events";
import { getPublicStats } from "@/lib/general";
import { isWithinDays } from "@/utils/format";
import { AppText } from "@/components";
import {
    HomeHeader,
    SearchBar,
    CategoriesSection,
    SoonEventsSection,
    UpcomingEventsSection,
    StatsSection,
    PopularEventsSection,
    PastEventsSection,
    ExploreByLocationSection,
    QuickActionsSection,
    EmptyStateCard,
} from "@/components/home";
import { FeaturedEventCard } from "@/components/cards";
import { useScrollTabBar } from "@/hooks";

export default function HomeScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [popularEvents, setPopularEvents] = useState<Event[]>([]);
    const [pastEvents, setPastEvents] = useState<Event[]>([]);
    const [categories, setCategories] = useState<EventCategory[]>([]);
    const [stats, setStats] = useState<PublicStats | null>(null);

    const scrollHandler = useScrollTabBar();

    const fetchData = useCallback(async () => {
        try {
            const [eventsData, categoriesData, statsData, popularData, pastData] = await Promise.all([
                getEvents({ status: "upcoming", ordering: "start_date" }),
                getEventCategories(),
                getPublicStats(),
                getEvents({ ordering: "-popularity", page_size: 6 }), // Popular events
                getPastEvents({ ordering: "-start_date", page: 1 }), // Recent past events
            ]);

            setEvents(eventsData.results);
            setCategories(categoriesData);
            setStats(statsData);
            setPopularEvents(popularData.results);
            setPastEvents(pastData?.results || []);
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
    const upcomingEvents = events.filter((e) => e.id !== featuredEvent?.id).slice(0, 12);

    // Check if we have no events at all
    const hasNoEvents = events.length === 0;
    const hasNoSoonEvents = soonEvents.length === 0;
    const hasNoUpcomingEvents = upcomingEvents.length === 0;

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
                {hasNoSoonEvents ? (
                    <View className="mb-6 px-2">
                        <View className="mb-4">
                            <View className="flex-row items-center gap-2">
                                <View
                                    className="w-10 h-10 rounded-xl items-center justify-center"
                                    style={{ backgroundColor: colors.accent + "33" }}
                                >
                                    <Ionicons name="calendar" size={20} color={colors.accent} />
                                </View>
                                <View>
                                    <AppText styles="text-lg text-white font-nunbold">
                                        Events Happening Soon
                                    </AppText>
                                    <AppText
                                        styles="text-xs text-white"
                                        style={{ opacity: 0.6 }}
                                    >
                                        Within the next 7 days
                                    </AppText>
                                </View>
                            </View>
                        </View>
                        <EmptyStateCard type="soon" />
                    </View>
                ) : (
                    <SoonEventsSection events={soonEvents} isLoading={isLoading} />
                )}

                {/* Popular Events (show when no upcoming events) */}
                {(hasNoUpcomingEvents || hasNoEvents) && (
                    <PopularEventsSection events={popularEvents} isLoading={isLoading} />
                )}

                {/* Explore by Location (show when content is sparse) */}
                {(hasNoEvents || hasNoSoonEvents) && <ExploreByLocationSection isLoading={isLoading} />}

                {/* Upcoming Events */}
                {hasNoUpcomingEvents ? (
                    <View className="mb-6 px-2">
                        <View className="mb-4">
                            <View className="flex-row items-center gap-2">
                                <View
                                    className="w-10 h-10 rounded-xl items-center justify-center"
                                    style={{ backgroundColor: colors.accent + "33" }}
                                >
                                    <Ionicons name="calendar-outline" size={20} color={colors.accent} />
                                </View>
                                <View>
                                    <AppText styles="text-lg text-white font-nunbold">
                                        Upcoming Events
                                    </AppText>
                                    <AppText
                                        styles="text-xs text-white"
                                        style={{ opacity: 0.6 }}
                                    >
                                        Events coming up
                                    </AppText>
                                </View>
                            </View>
                        </View>
                        <EmptyStateCard type="upcoming" />
                    </View>
                ) : (
                    <UpcomingEventsSection events={upcomingEvents} isLoading={isLoading} />
                )}

                {/* Quick Actions (show always for engagement) */}
                <QuickActionsSection isLoading={isLoading} />

                {/* Past Events (show for content richness) */}
                <PastEventsSection events={pastEvents} isLoading={isLoading} />

                {/* Bottom spacing for tab bar */}
                <View className="h-24" />
            </Animated.ScrollView>
        </View>
    );
}
