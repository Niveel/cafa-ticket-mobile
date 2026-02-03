import { View, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";

import {
    Screen,
    Nav,
    AppText,
    AppInput,
    EventCard,
    PastEventsSortModal,
    PastEventActiveFiltersDisplay,
} from "@/components";
import { useDebounce } from "@/hooks";
import { getPastEvents } from "@/lib/events";
import type { Event } from "@/types";
import colors from "@/config/colors";

const PastEventsScreen = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    // Filters
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("-start_date");
    const [sortModalVisible, setSortModalVisible] = useState(false);

    // Debounce search
    const debouncedSearch = useDebounce(search, 500);

    // Fetch events
    const fetchEvents = useCallback(
        async (pageNum: number, reset = false) => {
            try {
                if (reset) {
                    setIsLoading(true);
                } else {
                    setIsLoadingMore(true);
                }

                const response = await getPastEvents({
                    page: pageNum,
                    search: debouncedSearch,
                    ordering: sortBy,
                });

                if (response) {
                    if (reset) {
                        setEvents(response.results);
                    } else {
                        setEvents((prev) => [...prev, ...response.results]);
                    }
                    setHasMore(!!response.next);
                    setPage(pageNum);
                }
            } catch (error) {
                console.error("Error fetching past events:", error);
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
                setRefreshing(false);
            }
        },
        [debouncedSearch, sortBy]
    );

    // Initial load & refetch on filter change
    useEffect(() => {
        fetchEvents(1, true);
    }, [fetchEvents]);

    // Load more
    const loadMore = useCallback(() => {
        if (hasMore && !isLoadingMore) {
            fetchEvents(page + 1, false);
        }
    }, [hasMore, isLoadingMore, page, fetchEvents]);

    // Pull to refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchEvents(1, true);
    }, [fetchEvents]);

    // Clear all filters
    const clearFilters = () => {
        setSearch("");
        setSortBy("-start_date");
    };

    // Active filters
    const activeFilters = [];
    if (debouncedSearch) activeFilters.push({ key: "search", label: "Search", value: debouncedSearch });
    if (sortBy !== "-start_date") {
        const sortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || "";
        activeFilters.push({ key: "sort", label: "Sort", value: sortLabel });
    }

    const hasActiveFilters = activeFilters.length > 0;

    const handleRemoveFilter = (key: string) => {
        if (key === "search") setSearch("");
        if (key === "sort") setSortBy("-start_date");
    };

    return (
        <Screen>
            <Nav title="Past Events" />

            <View className="flex-1" style={{ backgroundColor: colors.primary }}>
                {/* Header */}
                <View className="p-2 gap-4 mb-4">

                    {/* Search Bar & Sort */}
                    <View className="flex-row gap-3">
                        <View className="flex-1">
                            <AppInput
                                name="search"
                                value={search}
                                onChangeText={setSearch}
                                placeholder="Search past events..."
                                icon="search"
                            />
                        </View>

                        <TouchableOpacity
                            onPress={() => setSortModalVisible(true)}
                            className="w-12 h-12 rounded-xl items-center justify-center border-2"
                            style={{
                                backgroundColor: sortBy !== "-start_date" ? colors.accent + "33" : colors.primary100,
                                borderColor: sortBy !== "-start_date" ? colors.accent : colors.accent + "4D",
                            }}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="swap-vertical"
                                size={20}
                                color={sortBy !== "-start_date" ? colors.accent : colors.white}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Active Filters */}
                    {hasActiveFilters && (
                        <PastEventActiveFiltersDisplay
                            activeFilters={activeFilters}
                            onRemoveFilter={handleRemoveFilter}
                            onClearAll={clearFilters}
                        />
                    )}
                </View>

                {/* Events List */}
                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={colors.accent} />
                        <AppText styles="text-sm text-white mt-4" font="font-iregular" style={{ opacity: 0.6 }}>
                            Loading past events...
                        </AppText>
                    </View>
                ) : events.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <View
                            className="w-20 h-20 rounded-2xl items-center justify-center mb-6"
                            style={{ backgroundColor: colors.accent + "33" }}
                        >
                            <Ionicons name="search-outline" size={40} color={colors.accent50} />
                        </View>
                        <AppText styles="text-lg text-white mb-3 text-center" font="font-ibold">
                            {hasActiveFilters ? "No Events Found" : "No Past Events"}
                        </AppText>
                        <AppText
                            styles="text-sm text-white text-center mb-6"
                            font="font-iregular"
                            style={{ opacity: 0.7, maxWidth: 300 }}
                        >
                            {hasActiveFilters
                                ? "We couldn't find any past events matching your search. Try adjusting your filters."
                                : "There are no past events available at the moment."}
                        </AppText>
                        {hasActiveFilters && (
                            <TouchableOpacity
                                onPress={clearFilters}
                                className="px-6 py-3 rounded-xl"
                                style={{ backgroundColor: colors.accent }}
                                activeOpacity={0.8}
                            >
                                <AppText styles="text-sm text-white" font="font-ibold">
                                    Clear Filters
                                </AppText>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <FlashList
                        data={events}
                        renderItem={({ item }) => (
                            <View className="mb-4">
                                <EventCard event={item} />
                            </View>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        onEndReached={loadMore}
                        showsVerticalScrollIndicator={false}
                        onEndReachedThreshold={0.5}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        ListFooterComponent={
                            isLoadingMore ? (
                                <View className="py-4 items-center">
                                    <ActivityIndicator size="small" color={colors.accent} />
                                </View>
                            ) : !hasMore && events.length > 0 ? (
                                <View className="py-8 items-center">
                                    <View
                                        className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
                                        style={{ backgroundColor: colors.accent + "33" }}
                                    >
                                        <AppText styles="text-2xl">🎉</AppText>
                                    </View>
                                    <AppText styles="text-base text-white mb-2" font="font-ibold">
                                        You've reached the end!
                                    </AppText>
                                    <AppText
                                        styles="text-sm text-white"
                                        font="font-iregular"
                                        style={{ opacity: 0.6 }}
                                    >
                                        That's all the events we have
                                    </AppText>
                                </View>
                            ) : null
                        }
                    />
                )}
            </View>

            {/* Sort Modal */}
            <PastEventsSortModal
                visible={sortModalVisible}
                selectedSort={sortBy}
                onSelect={(value) => {
                    setSortBy(value);
                    setSortModalVisible(false);
                }}
                onClose={() => setSortModalVisible(false)}
            />
        </Screen>
    );
};

// Sort options
const sortOptions = [
    { value: "-start_date", label: "Latest First", description: "Newest events first" },
    { value: "start_date", label: "Earliest First", description: "Oldest events first" },
    { value: "-created_at", label: "Recently Added", description: "Newly created events" },
    { value: "created_at", label: "Oldest Added", description: "Earliest created events" },
    { value: "price", label: "Price: Low to High", description: "Cheapest tickets first" },
    { value: "-price", label: "Price: High to Low", description: "Most expensive first" },
    { value: "popularity", label: "Most Popular", description: "Highest ticket sales" },
];

export default PastEventsScreen;
