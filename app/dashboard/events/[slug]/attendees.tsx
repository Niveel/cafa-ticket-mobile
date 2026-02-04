import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useCallback } from "react";
import { FlashList } from "@shopify/flash-list";

import {
    AppText,
    RequireAuth,
    EventAttendeesSummary,
    EventAttendeesFilters,
    EventAttendeeCard,
    Nav,
    Screen
} from "@/components";
import { getMyCreatedEventDetails, getMyEventAttendees } from "@/lib/dashboard";
import type { MyEventDetailsResponse, EventAttendees, EventAttendee } from "@/types/dash-events.types";
import colors from "@/config/colors";

const EventAttendeesScreen = () => {
    const { slug } = useLocalSearchParams<{ slug: string }>();

    const [event, setEvent] = useState<MyEventDetailsResponse | null>(null);
    const [attendeesData, setAttendeesData] = useState<EventAttendees | null>(null);
    const [attendees, setAttendees] = useState<EventAttendee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    // Filters
    const [search, setSearch] = useState("");
    const [ticketTypeId, setTicketTypeId] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("paid");
    const [checkInStatus, setCheckInStatus] = useState("all");
    const [sortBy, setSortBy] = useState("-purchase_date");

    // Fetch event and initial attendees
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!slug) return;

            try {
                setIsLoading(true);
                setError(null);

                const [eventData, attendeesResponse] = await Promise.all([
                    getMyCreatedEventDetails(slug),
                    getMyEventAttendees(slug, 1, 20, {
                        search,
                        ticket_type_id: ticketTypeId,
                        payment_status: paymentStatus,
                        check_in_status: checkInStatus,
                        sort_by: sortBy,
                    }),
                ]);

                if (!eventData) {
                    setError("Event not found");
                    return;
                }

                if (!attendeesResponse) {
                    setError("Failed to load attendees");
                    return;
                }

                setEvent(eventData);
                setAttendeesData(attendeesResponse);
                setAttendees(attendeesResponse.results);
                setHasMore(!!attendeesResponse.next);
                setPage(1);
            } catch (err: any) {
                console.error("Error fetching data:", err);
                setError(err.message || "Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [slug]);

    // Refetch when filters change
    useEffect(() => {
        const refetchAttendees = async () => {
            if (!slug || isLoading) return;

            try {
                setIsLoading(true);
                setError(null);

                const attendeesResponse = await getMyEventAttendees(slug, 1, 20, {
                    search,
                    ticket_type_id: ticketTypeId,
                    payment_status: paymentStatus,
                    check_in_status: checkInStatus,
                    sort_by: sortBy,
                });

                if (!attendeesResponse) {
                    setError("Failed to load attendees");
                    return;
                }

                setAttendeesData(attendeesResponse);
                setAttendees(attendeesResponse.results);
                setHasMore(!!attendeesResponse.next);
                setPage(1);
            } catch (err: any) {
                console.error("Error refetching attendees:", err);
                setError(err.message || "Failed to load attendees");
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            refetchAttendees();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search, ticketTypeId, paymentStatus, checkInStatus, sortBy, slug]);

    // Load more attendees (infinite scroll)
    const loadMore = useCallback(async () => {
        if (!slug || isLoadingMore || !hasMore) return;

        try {
            setIsLoadingMore(true);

            const nextPage = page + 1;
            const attendeesResponse = await getMyEventAttendees(slug, nextPage, 20, {
                search,
                ticket_type_id: ticketTypeId,
                payment_status: paymentStatus,
                check_in_status: checkInStatus,
                sort_by: sortBy,
            });

            if (!attendeesResponse) return;

            setAttendees((prev) => [...prev, ...attendeesResponse.results]);
            setHasMore(!!attendeesResponse.next);
            setPage(nextPage);
        } catch (err) {
            console.error("Error loading more attendees:", err);
        } finally {
            setIsLoadingMore(false);
        }
    }, [slug, page, hasMore, isLoadingMore, search, ticketTypeId, paymentStatus, checkInStatus, sortBy]);

    // Pull to refresh
    const onRefresh = useCallback(async () => {
        if (!slug) return;

        setRefreshing(true);
        try {
            const [eventData, attendeesResponse] = await Promise.all([
                getMyCreatedEventDetails(slug),
                getMyEventAttendees(slug, 1, 20, {
                    search,
                    ticket_type_id: ticketTypeId,
                    payment_status: paymentStatus,
                    check_in_status: checkInStatus,
                    sort_by: sortBy,
                }),
            ]);

            if (eventData) setEvent(eventData);
            if (attendeesResponse) {
                setAttendeesData(attendeesResponse);
                setAttendees(attendeesResponse.results);
                setHasMore(!!attendeesResponse.next);
                setPage(1);
            }
        } catch (err) {
            console.error("Error refreshing:", err);
        } finally {
            setRefreshing(false);
        }
    }, [slug, search, ticketTypeId, paymentStatus, checkInStatus, sortBy]);

    // Handle filter changes
    const handleFilterChange = (filters: {
        search: string;
        ticket_type_id: string;
        payment_status: string;
        check_in_status: string;
        sort_by: string;
    }) => {
        setSearch(filters.search);
        setTicketTypeId(filters.ticket_type_id);
        setPaymentStatus(filters.payment_status);
        setCheckInStatus(filters.check_in_status);
        setSortBy(filters.sort_by);
    };

    const clearFilters = () => {
        setSearch("");
        setTicketTypeId("");
        setPaymentStatus("paid");
        setCheckInStatus("all");
        setSortBy("-purchase_date");
    };

    const hasActiveFilters = !!(
        search ||
        ticketTypeId ||
        paymentStatus !== "paid" ||
        checkInStatus !== "all" ||
        sortBy !== "-purchase_date"
    );

    return (
        <Screen>
            <RequireAuth>
                <Nav title="Event Attendees" />
                <View className="flex-1" style={{ backgroundColor: colors.primary }}>

                    {/* Loading State */}
                    {isLoading && !event && (
                        <View className="flex-1 items-center justify-center p-6">
                            <ActivityIndicator size="large" color={colors.accent} />
                            <AppText styles="text-sm text-white mt-4" style={{ opacity: 0.6 }}>
                                Loading attendees...
                            </AppText>
                        </View>
                    )}

                    {/* Error State */}
                    {error && !event && (
                        <ScrollView className="flex-1">
                            <View className="p-6">
                                <View
                                    className="p-6 rounded-xl border-2"
                                    style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                                >
                                    <View className="items-center">
                                        <Ionicons name="alert-circle" size={48} color={colors.accent} />
                                        <AppText styles="text-lg text-white mt-4 mb-2 font-nunbold">
                                            {error === "Event not found" ? "Event Not Found" : "Unable to Load Attendees"}
                                        </AppText>
                                        <AppText
                                            styles="text-sm text-white text-center mb-6"
                                            style={{ opacity: 0.8 }}
                                        >
                                            {error === "Event not found"
                                                ? "The event you're looking for doesn't exist or you don't have access to it."
                                                : "Failed to fetch event attendees. Please try again."}
                                        </AppText>
                                        <TouchableOpacity
                                            onPress={() =>
                                                router.push(
                                                    error === "Event not found"
                                                        ? "/dashboard/events"
                                                        : `/dashboard/events/${slug}`
                                                )
                                            }
                                            className="flex-row items-center gap-2 px-6 py-3 rounded-xl"
                                            style={{ backgroundColor: colors.accent }}
                                            activeOpacity={0.8}
                                        >
                                            <Ionicons name="arrow-back" size={18} color={colors.white} />
                                            <AppText styles="text-sm text-white font-nunbold">
                                                {error === "Event not found" ? "Back to My Events" : "Back to Event Details"}
                                            </AppText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    )}

                    {/* Main Content */}
                    {!isLoading && event && attendeesData && (
                        <View className="flex-1">
                            <ScrollView
                                className="flex-1"
                                showsVerticalScrollIndicator={false}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                            >
                                <View className="p-6 gap-6">
                                    {/* Event Title */}
                                    <View>
                                        <AppText styles="text-xl text-white mb-1 font-nunbold">
                                            Event Attendees
                                        </AppText>
                                        <AppText styles="text-sm text-white" style={{ opacity: 0.7 }}>
                                            {event.title}
                                        </AppText>
                                    </View>

                                    {/* Summary Cards */}
                                    <EventAttendeesSummary summary={attendeesData.summary} />

                                    {/* Filters */}
                                    <EventAttendeesFilters
                                        eventSlug={slug!}
                                        ticketTypes={event.ticket_types.map((tt) => ({ id: tt.id, name: tt.name }))}
                                        search={search}
                                        ticketTypeId={ticketTypeId}
                                        paymentStatus={paymentStatus}
                                        checkInStatus={checkInStatus}
                                        sortBy={sortBy}
                                        onFilterChange={handleFilterChange}
                                        onClearFilters={clearFilters}
                                        hasActiveFilters={hasActiveFilters}
                                    />

                                    {/* Attendees List */}
                                    {attendees.length === 0 ? (
                                        <View
                                            className="p-12 rounded-xl border-2 items-center"
                                            style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                                        >
                                            <View
                                                className="w-20 h-20 rounded-2xl items-center justify-center mb-6"
                                                style={{ backgroundColor: colors.accent + "33" }}
                                            >
                                                <Ionicons name="people-outline" size={40} color={colors.accent50} />
                                            </View>
                                            <AppText styles="text-base text-white mb-3 font-nunbold">
                                                No Attendees Found
                                            </AppText>
                                            <AppText
                                                styles="text-sm text-white text-center mb-6"
                                                style={{ opacity: 0.7 }}
                                            >
                                                {hasActiveFilters
                                                    ? "No attendees match your current filters. Try adjusting your search criteria."
                                                    : "No attendees have purchased tickets for this event yet."}
                                            </AppText>
                                            {hasActiveFilters && (
                                                <TouchableOpacity
                                                    onPress={clearFilters}
                                                    className="flex-row items-center gap-2 px-6 py-3 rounded-xl"
                                                    style={{ backgroundColor: colors.accent }}
                                                    activeOpacity={0.8}
                                                >
                                                    <Ionicons name="close" size={18} color={colors.white} />
                                                    <AppText styles="text-sm text-white font-nunbold">
                                                        Clear All Filters
                                                    </AppText>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    ) : (
                                        <View className="gap-3" style={{ minHeight: 300 }}>
                                            <FlashList
                                                data={attendees}
                                                renderItem={({ item }) => <EventAttendeeCard attendee={item} />}
                                                keyExtractor={(item) => item.ticket_id}
                                                onEndReached={loadMore}
                                                onEndReachedThreshold={0.5}
                                                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                                                ListFooterComponent={
                                                    isLoadingMore ? (
                                                        <View className="py-4 items-center">
                                                            <ActivityIndicator size="small" color={colors.accent} />
                                                        </View>
                                                    ) : hasMore ? null : attendees.length > 0 ? (
                                                        <View className="py-6 items-center">
                                                            <AppText styles="text-xs text-white" style={{ opacity: 0.5 }}>
                                                                No more attendees to load
                                                            </AppText>
                                                        </View>
                                                    ) : null
                                                }
                                            />
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                        </View>
                    )}
                </View>
            </RequireAuth>
        </Screen>
    );
};

export default EventAttendeesScreen;