import { View, ActivityIndicator, RefreshControl } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";

import {
    Screen,
    RequireAuth,
    Nav,
    AppText,
    MyTicketsFilters,
    MyTicketCard,
    Animation,
} from "@/components";
import { fetchMyTickets } from "@/lib/dashboard";
import { getEventCategories } from "@/lib";
import type { MyTicket } from "@/types/tickets.types";
import type { EventCategory } from "@/types/tickets.types";
import colors from "@/config/colors";
import { tickets as ticketsAnimation } from "@/assets";

const MyTicketsScreen = () => {
    const [tickets, setTickets] = useState<MyTicket[]>([]);
    const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    // Filters
    const [status, setStatus] = useState("all");
    const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);

                const [ticketsResponse, categoriesResponse] = await Promise.all([
                    fetchMyTickets({ status, category, search, page: 1 }),
                    getEventCategories(),
                ]);

                if (ticketsResponse) {
                    setTickets(ticketsResponse.results);
                    setTotalCount(ticketsResponse.count);
                    setHasMore(!!ticketsResponse.next);
                }

                setEventCategories(categoriesResponse);
                setPage(1);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Refetch when filters change
    useEffect(() => {
        const refetchTickets = async () => {
            if (isLoading) return;

            try {
                setIsLoading(true);

                const ticketsResponse = await fetchMyTickets({ status, category, search, page: 1 });

                if (ticketsResponse) {
                    setTickets(ticketsResponse.results);
                    setTotalCount(ticketsResponse.count);
                    setHasMore(!!ticketsResponse.next);
                    setPage(1);
                }
            } catch (error) {
                console.error("Error refetching tickets:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            refetchTickets();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [status, category, search]);

    // Load more tickets
    const loadMore = useCallback(async () => {
        if (isLoadingMore || !hasMore) return;

        try {
            setIsLoadingMore(true);

            const nextPage = page + 1;
            const ticketsResponse = await fetchMyTickets({ status, category, search, page: nextPage });

            if (ticketsResponse) {
                setTickets((prev) => [...prev, ...ticketsResponse.results]);
                setHasMore(!!ticketsResponse.next);
                setPage(nextPage);
            }
        } catch (error) {
            console.error("Error loading more tickets:", error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [page, hasMore, isLoadingMore, status, category, search]);

    // Pull to refresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const [ticketsResponse, categoriesResponse] = await Promise.all([
                fetchMyTickets({ status, category, search, page: 1 }),
                getEventCategories(),
            ]);

            if (ticketsResponse) {
                setTickets(ticketsResponse.results);
                setTotalCount(ticketsResponse.count);
                setHasMore(!!ticketsResponse.next);
                setPage(1);
            }

            setEventCategories(categoriesResponse);
        } catch (error) {
            console.error("Error refreshing:", error);
        } finally {
            setRefreshing(false);
        }
    }, [status, category, search]);

    // Handle filter changes
    const handleFilterChange = (filters: { status: string; category: string; search: string }) => {
        setStatus(filters.status);
        setCategory(filters.category);
        setSearch(filters.search);
    };

    const clearFilters = () => {
        setStatus("all");
        setCategory("");
        setSearch("");
    };

    const hasActiveFilters = status !== "all" || !!category || !!search;

    return (
        <Screen>
            <RequireAuth>
                <Nav title="My Tickets" />

                <View className="flex-1" style={{ backgroundColor: colors.primary }}>
                    {isLoading && tickets.length === 0 ? (
                        <View className="flex-1 items-center justify-center">
                            <Animation
                                isVisible={true}
                                path={ticketsAnimation}
                                style={{ width: 200, height: 200 }}
                            />
                            <AppText styles="text-sm text-white mt-4" style={{ opacity: 0.6 }}>
                                Loading tickets...
                            </AppText>
                        </View>
                    ) : (
                        <View className="flex-1">
                            <FlashList
                                data={tickets}
                                renderItem={({ item }) => <MyTicketCard ticket={item} />}
                                keyExtractor={(item) => item.ticket_id}
                                onEndReached={loadMore}
                                onEndReachedThreshold={0.5}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                                ListHeaderComponent={
                                    <View className="p-2 gap-4">
                                        {/* Header */}
                                        <View className="flex-row items-center gap-3">
                                            <View
                                                className="w-12 h-12 rounded-xl items-center justify-center"
                                                style={{ backgroundColor: colors.primary200 + "80" }}
                                            >
                                                <Ionicons name="ticket-outline" size={24} color={colors.accent50} />
                                            </View>
                                            <View className="flex-1">
                                                <AppText styles="text-sm text-white" style={{ opacity: 0.7 }}>
                                                    {totalCount} ticket{totalCount !== 1 ? "s" : ""} purchased
                                                </AppText>
                                            </View>
                                        </View>

                                        <MyTicketsFilters
                                            search={search}
                                            status={status}
                                            category={category}
                                            eventCategories={eventCategories}
                                            onFilterChange={handleFilterChange}
                                            onClearFilters={clearFilters}
                                            hasActiveFilters={hasActiveFilters}
                                        />
                                    </View>
                                }
                                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                                contentContainerStyle={{ paddingBottom: 24 }}
                                ListEmptyComponent={
                                    <View className="items-center py-12">
                                        <View
                                            className="w-20 h-20 rounded-full items-center justify-center mb-6"
                                            style={{ backgroundColor: hasActiveFilters ? colors.primary200 + "80" : colors.primary200 + "80" }}
                                        >
                                            <Ionicons
                                                name={hasActiveFilters ? "search-outline" : "ticket-outline"}
                                                size={40}
                                                color={colors.white}
                                                style={{ opacity: 0.6 }}
                                            />
                                        </View>
                                        <AppText styles="text-lg text-white mb-3 text-center font-nunbold">
                                            {hasActiveFilters ? "No Tickets Found" : "No Tickets Yet"}
                                        </AppText>
                                        <AppText
                                            styles="text-sm text-white text-center mb-6"
                                            style={{ opacity: 0.7, maxWidth: 300 }}
                                        >
                                            {hasActiveFilters
                                                ? "We couldn't find any tickets matching your filters. Try adjusting your search criteria."
                                                : "You haven't purchased any tickets yet. Browse events and get your tickets!"}
                                        </AppText>
                                    </View>
                                }
                                ListFooterComponent={
                                    isLoadingMore ? (
                                        <View className="py-4 items-center">
                                            <ActivityIndicator size="small" color={colors.accent} />
                                        </View>
                                    ) : hasMore ? null : tickets.length > 0 ? (
                                        <View className="py-6 items-center">
                                            <AppText styles="text-xs text-white" style={{ opacity: 0.5 }}>
                                                No more tickets to load
                                            </AppText>
                                        </View>
                                    ) : null
                                }
                            />
                        </View>
                    )}
                </View>
            </RequireAuth>
        </Screen>
    );
};

export default MyTicketsScreen;