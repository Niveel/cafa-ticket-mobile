import { View, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback, useRef } from "react";

import { Screen, MyEventsHeader, MyEventsFilters, MyEventsGrid, MyEventsEmptyState, AppBottomSheet, ConfirmAction, AppText, Nav, RequireAuth, Animation } from "@/components";
import type { AppBottomSheetRef } from "@/components";
import type { MyEvent } from "@/types/dash-events.types";
import { getMyEvents, deleteMyEvent } from "@/lib/events";
import { useAuth } from "@/context";
import colors from "@/config/colors";
import { tickets } from "@/assets";

interface Filters {
  status: string;
  is_published: string;
  category: string;
  search: string;
  sort_by: string;
}

const DashboardEventsScreen = () => {
  const { user } = useAuth();
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);
  const filtersSheetRef = useRef<AppBottomSheetRef>(null);

  const [events, setEvents] = useState<MyEvent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: number;
    slug: string;
    title: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    status: "all",
    is_published: "true",
    category: "",
    search: "",
    sort_by: "-start_date",
  });

  const fetchEvents = useCallback(async (currentFilters: Filters, page: number, append: boolean = false) => {
    if (append) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await getMyEvents({
        status: currentFilters.status,
        is_published: currentFilters.is_published,
        category: currentFilters.category,
        search: currentFilters.search,
        sort_by: currentFilters.sort_by,
        page,
        page_size: 20,
      });

      if (append) {
        setEvents((prev) => [...prev, ...data.results]);
      } else {
        setEvents(data.results);
      }

      setTotalPages(Math.ceil(data.count / 20));
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setIsInitialLoad(false);
      setIsLoading(false);
    }
  }, []);

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchEvents(newFilters, 1, false);
    filtersSheetRef.current?.close();
  }, [fetchEvents]);

  const handleLoadMore = useCallback(() => {
    if (currentPage < totalPages && !isLoading) {
      fetchEvents(filters, currentPage + 1, true);
    }
  }, [filters, currentPage, totalPages, isLoading, fetchEvents]);

  const handleDeleteClick = useCallback((eventId: number, eventSlug: string, eventTitle: string) => {
    setDeleteConfirm({ id: eventId, slug: eventSlug, title: eventTitle });
    bottomSheetRef.current?.open();
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirm) return;

    try {
      setDeleting(true);

      const result = await deleteMyEvent(deleteConfirm.slug);

      if (!result.success) {
        throw new Error(result.message || "Failed to delete event");
      }

      setEvents((prev) => prev.filter((event) => event.id !== deleteConfirm.id));
      bottomSheetRef.current?.close();
      setDeleteConfirm(null);
    } catch (error: unknown) {
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  }, [deleteConfirm]);

  useEffect(() => {
    fetchEvents(filters, 1, false);
  }, []);

  if (isInitialLoad) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <Animation
            isVisible={true}
            path={tickets}
            style={{ width: 200, height: 200 }}
          />
          <AppText styles="text-sm text-slate-400 mt-4">
            Loading your events...
          </AppText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <RequireAuth>
        <Nav title="My Events" />
        <View className="flex-1">
          <MyEventsHeader currentUser={user} onOpenFilters={() => filtersSheetRef.current?.open()} />

          {error && (
            <View className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AppText styles="text-sm text-red-400">{error}</AppText>
            </View>
          )}

          {events.length > 0 ? (
            <MyEventsGrid
              events={events}
              isLoading={isLoading}
              hasMore={currentPage < totalPages}
              onLoadMore={handleLoadMore}
              onDelete={handleDeleteClick}
            />
          ) : (
            <MyEventsEmptyState />
          )}
        </View>

        {/* Filters Bottom Sheet */}
        <AppBottomSheet ref={filtersSheetRef} customSnapPoints={["95%"]} scrollable>
          <MyEventsFilters onFilterChange={handleFilterChange} currentFilters={filters} />
        </AppBottomSheet>

        {/* Delete Confirmation */}
        <AppBottomSheet ref={bottomSheetRef} customSnapPoints={["40%"]}>
          {deleteConfirm && (
            <ConfirmAction
              title="Delete Event?"
              desc={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
              onCancel={() => bottomSheetRef.current?.close()}
              onConfirm={handleDeleteConfirm}
              confirmBtnTitle={deleting ? "Deleting..." : "Yes, Delete"}
              isDestructive={true}
            />
          )}
        </AppBottomSheet>
      </RequireAuth>
    </Screen>
  );
};

export default DashboardEventsScreen;
