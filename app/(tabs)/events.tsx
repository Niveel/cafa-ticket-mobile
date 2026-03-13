import { View, TouchableOpacity, ScrollView } from "react-native";
import { useState, useEffect, useCallback, useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import type { Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  EventsHero,
  EventsCategoryTabs,
  EventsFilter,
  EventsSortTab,
  ActiveFiltersDisplay,
  EventsResultsHeader,
  EventsGrid,
  EventsEmptyState,
  FilterOptions,
  Screen,
  AppText,
  Animation
} from "@/components";
import colors from "@/config/colors";
import { tickets } from "@/assets";
import { useDebounce } from "@/hooks";
import { Event, EventFilters } from "@/types";
import { EventCategory } from "@/types/tickets.types";
import { getEvents, getEventCategories } from "@/lib/events";

const EventsScreen = () => {
  // Get URL params for category and city
  const params = useLocalSearchParams<{ category?: string; city?: string }>();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    city: null,
    status: "all",
    date_from: "",
    date_to: "",
    price_min: "",
    price_max: "",
  });
  const [sortBy, setSortBy] = useState("-start_date");

  // Events state
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Set category and city from URL params on mount
  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category);
    }
    if (params.city) {
      setFilters(prev => ({ ...prev, city: params.city as string }));
    }
  }, [params.category, params.city]);

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getEventCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    loadCategories();
  }, []);

  // Fetch events
  const fetchEvents = useCallback(
    async (page: number, resetEvents: boolean = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const filterParams: EventFilters = {
          page,
          ordering: sortBy,
        };

        if (debouncedSearchQuery) filterParams.search = debouncedSearchQuery;
        if (selectedCategory) filterParams.category = selectedCategory;
        if (filters.city) filterParams.city = filters.city;
        if (filters.status !== "all") filterParams.status = filters.status;
        if (filters.date_from) filterParams.date_from = filters.date_from;
        if (filters.date_to) filterParams.date_to = filters.date_to;
        if (filters.price_min) filterParams.price_min = filters.price_min;
        if (filters.price_max) filterParams.price_max = filters.price_max;

        const data = await getEvents(filterParams);

        if (resetEvents) {
          setEvents(data.results);
        } else {
          setEvents((prev) => [...prev, ...data.results]);
        }

        setTotalCount(data.count);
        setCurrentPage(data.current_page || page);
        setTotalPages(data.total_pages || Math.ceil(data.count / 10));
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again.");
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    },
    [debouncedSearchQuery, selectedCategory, filters, sortBy]
  );

  // Load more events
  const handleLoadMore = useCallback(() => {
    if (currentPage < totalPages && !isLoading) {
      fetchEvents(currentPage + 1, false);
    }
  }, [currentPage, totalPages, isLoading, fetchEvents]);

  // Reset and fetch when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchEvents(1, true);
  }, [debouncedSearchQuery, selectedCategory, filters, sortBy]);

  // Clear all filters
  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setFilters({
      city: null,
      status: "all",
      date_from: "",
      date_to: "",
      price_min: "",
      price_max: "",
    });
    setSortBy("-start_date");
  };

  // Get active filters
  const activeFilters = useMemo(() => {
    const active: Array<{ key: string; label: string; value: string }> = [];

    if (debouncedSearchQuery)
      active.push({ key: "search", label: "Search", value: debouncedSearchQuery });
    if (selectedCategory)
      active.push({ key: "category", label: "Category", value: selectedCategory });
    if (filters.city) active.push({ key: "city", label: "City", value: filters.city });
    if (filters.status !== "all")
      active.push({ key: "status", label: "Status", value: filters.status });
    if (filters.date_from)
      active.push({ key: "date_from", label: "From", value: filters.date_from });
    if (filters.date_to)
      active.push({ key: "date_to", label: "To", value: filters.date_to });
    if (filters.price_min)
      active.push({
        key: "price_min",
        label: "Min Price",
        value: `GHS ${filters.price_min}`,
      });
    if (filters.price_max)
      active.push({
        key: "price_max",
        label: "Max Price",
        value: `GHS ${filters.price_max}`,
      });

    return active;
  }, [debouncedSearchQuery, selectedCategory, filters]);

  // Remove single filter
  const handleRemoveFilter = (key: string) => {
    if (key === "search") setSearchQuery("");
    else if (key === "category") setSelectedCategory(null);
    else if (key === "city") setFilters({ ...filters, city: null });
    else if (key === "status") setFilters({ ...filters, status: "all" });
    else if (key === "date_from") setFilters({ ...filters, date_from: "" });
    else if (key === "date_to") setFilters({ ...filters, date_to: "" });
    else if (key === "price_min") setFilters({ ...filters, price_min: "" });
    else if (key === "price_max") setFilters({ ...filters, price_max: "" });
  };

  const hasActiveFilters = activeFilters.length > 0;

  // Header component for FlashList
  const renderHeader = () => (
    <>
      {/* Hero Section */}
      <EventsHero
        totalEvents={totalCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Category Tabs */}
      <EventsCategoryTabs
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        categories={categories}
      />

      {/* Main Content */}
      <View className="px-4 pt-4">
        {/* Filters & Sort Bar */}
        <View className="flex-row items-center justify-between gap-3 mb-4">
          <EventsFilter
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={handleClearAllFilters}
            activeFiltersCount={activeFilters.length}
          />
          <EventsSortTab selectedSort={sortBy} onSortChange={setSortBy} />
        </View>

        {/* Active Filters */}
        {hasActiveFilters && (
          <View className="mb-6">
            <ActiveFiltersDisplay
              activeFilters={activeFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          </View>
        )}

        {/* Link to Past Events */}
        <TouchableOpacity
          onPress={() => router.push("/events/past" as Href)}
          className="flex-row items-center gap-2 p-4 bg-primary-100 rounded-xl border border-accent mb-6"
          activeOpacity={0.7}
        >
          <Ionicons name="time" size={20} color={colors.accent50} />
          <AppText styles="text-sm text-black flex-1 font-nunbold">
            View Past Events
          </AppText>
          <Ionicons name="chevron-forward" size={20} color={colors.white} />
        </TouchableOpacity>

        {/* Error State */}
        {error && (
          <View className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AppText styles="text-sm text-red-400">
              {error}
            </AppText>
            <TouchableOpacity
              onPress={() => fetchEvents(1, true)}
              className="mt-2"
              activeOpacity={0.7}
            >
              <AppText styles="text-xs text-accent-50 font-nunbold">
                Try Again
              </AppText>
            </TouchableOpacity>
          </View>
        )}

        {/* Results Header */}
        {!isInitialLoad && events.length > 0 && (
          <EventsResultsHeader
            totalCount={totalCount}
            currentCount={events.length}
            isFiltered={hasActiveFilters}
          />
        )}
      </View>
    </>
  );

  return (
    <Screen statusBarStyle="dark-content" statusBarBg={colors.primary}>
      {/* Initial Loading State */}
      {isInitialLoad ? (
        <View className="flex-1 items-center justify-center">
          <Animation
            isVisible={true}
            path={tickets}
            style={{ width: 200, height: 200 }}
          />
          <AppText styles="text-sm text-slate-400 mt-4">
            Loading events...
          </AppText>
        </View>
      ) : events.length > 0 ? (
        /* Events Grid with Header */
        <EventsGrid
          events={events}
          isLoading={isLoading}
          hasMore={currentPage < totalPages}
          onLoadMore={handleLoadMore}
          headerComponent={renderHeader()}
        />
      ) : (
        /* Empty State with Header */
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
          {renderHeader()}
          <View className="px-4">
            <EventsEmptyState
              hasFilters={hasActiveFilters}
              onClearFilters={handleClearAllFilters}
            />
          </View>
        </ScrollView>
      )}
    </Screen>
  );
};

export default EventsScreen;
