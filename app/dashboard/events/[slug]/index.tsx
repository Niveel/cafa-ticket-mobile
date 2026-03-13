import { View, ScrollView, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
    Screen,
    AppText,
    MyEventDetailsHeader,
    MyEventInfo,
    MyEventTicketTypes,
    MyEventAnalyticsOverview,
    MyEventSalesByTicketType,
    MyEventTrafficStats,
    MyEventRecentSales,
    MyEventImageGallery,
    Nav,
    AppBottomSheet
} from "@/components";
import type { AppBottomSheetRef } from "@/components";
import { getMyCreatedEventDetails, getMyCreatedEventAnalytics } from "@/lib/dashboard";
import { deleteMyEvent } from "@/lib/events";
import type { MyEventDetailsResponse, MyEventAnalytics, EventTicketType } from "@/types/dash-events.types";
import colors from "@/config/colors";

const MyEventDetailsScreen = () => {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const deleteEventSheetRef = useRef<AppBottomSheetRef>(null);
    const deleteTicketSheetRef = useRef<AppBottomSheetRef>(null);

    const [eventDetails, setEventDetails] = useState<MyEventDetailsResponse | null>(null);
    const [eventAnalytics, setEventAnalytics] = useState<MyEventAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Event deletion state
    const [deletingEvent, setDeletingEvent] = useState(false);
    const [deleteEventError, setDeleteEventError] = useState<string | null>(null);

    // Ticket deletion state
    const [deleteTicketTarget, setDeleteTicketTarget] = useState<EventTicketType | null>(null);
    const [deletingTicket, setDeletingTicket] = useState(false);
    const [deleteTicketError, setDeleteTicketError] = useState<string | null>(null);

    const fetchData = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) setIsLoading(true);
            setError(null);

            const [details, analytics] = await Promise.all([
                getMyCreatedEventDetails(slug!),
                getMyCreatedEventAnalytics(slug!),
            ]);

            if (!details || !analytics) {
                throw new Error("Failed to load event data");
            }

            setEventDetails(details);
            setEventAnalytics(analytics);
        } catch (err) {
            console.error("Error fetching event data:", err);
            setError(err instanceof Error ? err.message : "Failed to load event");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [slug]);

    useEffect(() => {
        if (slug) {
            fetchData();
        }
    }, [slug, fetchData]);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchData(false);
    }, [fetchData]);

    const handleOpenDeleteEventModal = useCallback(() => {
        deleteEventSheetRef.current?.open();
    }, []);

    const handleDeleteEvent = async () => {
        if (!eventDetails) return;

        try {
            setDeletingEvent(true);
            setDeleteEventError(null);

            const result = await deleteMyEvent(eventDetails.slug);

            console.log("Delete event result:", result);

            if (!result.success) {
                console.log("Error deleting event:", result);
                throw new Error(result.message || "Failed to delete event");
            }

            deleteEventSheetRef.current?.close();
            Alert.alert("Success", "Event deleted successfully", [
                {
                    text: "OK",
                    onPress: () => router.replace("/dashboard/events"),
                },
            ]);
        } catch (error: any) {
            console.error("Error deleting event:", error);
            setDeleteEventError(error.message || "Failed to delete event");
        } finally {
            setDeletingEvent(false);
        }
    };

    const handleOpenDeleteTicketModal = useCallback((ticket: EventTicketType) => {
        setDeleteTicketTarget(ticket);
        setDeleteTicketError(null);
        deleteTicketSheetRef.current?.open();
    }, []);

    const handleDeleteTicket = async () => {
        if (!deleteTicketTarget) return;

        try {
            setDeletingTicket(true);
            setDeleteTicketError(null);

            // TODO: Implement delete ticket type API
            // const result = await deleteTicketType(slug!, deleteTicketTarget.id);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            deleteTicketSheetRef.current?.close();
            Alert.alert("Success", "Ticket type deleted successfully");

            // Refresh event data
            fetchData(false);
        } catch (error: any) {
            console.error("Error deleting ticket:", error);
            setDeleteTicketError(error.message || "Failed to delete ticket");
        } finally {
            setDeletingTicket(false);
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <Screen statusBarStyle="dark-content" statusBarBg={colors.primary}>
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.accent} />
                    <AppText styles="text-sm text-slate-400 mt-4">
                        Loading event details...
                    </AppText>
                </View>
            </Screen>
        );
    }

    // Error State
    if (error || !eventDetails || !eventAnalytics) {
        return (
            <Screen statusBarStyle="dark-content" statusBarBg={colors.primary}>
                <View className="flex-1 items-center justify-center px-4">
                    <View
                        className="w-20 h-20 rounded-2xl items-center justify-center mb-6"
                        style={{ backgroundColor: colors.accent + "33" }}
                    >
                        <Ionicons name="alert-circle-outline" size={40} color={colors.accent50} />
                    </View>
                    <AppText styles="text-xl text-white text-center mb-3 font-nunbold">
                        Event Not Found
                    </AppText>
                    <AppText styles="text-sm text-slate-300 text-center mb-6">
                        {error || "The event you're looking for doesn't exist or you don't have access to it."}
                    </AppText>
                    <TouchableOpacity
                        onPress={() => router.replace("/dashboard/events")}
                        className="flex-row items-center gap-2 px-6 py-3 rounded-xl"
                        style={{ backgroundColor: colors.accent }}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="chevron-back" size={18} color="#fff" />
                        <AppText styles="text-sm text-white font-nunbold">
                            Back to My Events
                        </AppText>
                    </TouchableOpacity>
                </View>
            </Screen>
        );
    }

    return (
        <Screen statusBarStyle="dark-content" statusBarBg={colors.primary}>
            <Nav title={eventDetails.title.length > 20 ? `${eventDetails.title.slice(0, 20)}...` : eventDetails.title} />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100, gap: 16 }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.accent}
                        colors={[colors.accent]}
                    />
                }
            >
                {/* Event Header */}
                <MyEventDetailsHeader
                    event={eventDetails}
                    onOpenDeleteModal={handleOpenDeleteEventModal}
                />

                {/* Event Information */}
                <MyEventInfo event={eventDetails} />

                {/* Image Gallery */}
                {eventDetails.additional_images && eventDetails.additional_images.length > 0 && (
                    <MyEventImageGallery
                        images={eventDetails.additional_images}
                        eventTitle={eventDetails.title}
                    />
                )}

                {/* Divider */}
                <View className="border-t-2 border-accent/30" />

                {/* Ticket Types Management */}
                <MyEventTicketTypes
                    ticketTypes={eventDetails.ticket_types}
                    eventSlug={slug!}
                    onOpenDeleteModal={handleOpenDeleteTicketModal}
                />

                {/* Divider */}
                <View className="border-t-2 border-accent/30" />

                {/* Analytics Overview */}
                <MyEventAnalyticsOverview analytics={eventAnalytics.overview} />

                {/* Sales by Ticket Type */}
                <MyEventSalesByTicketType
                    salesByTicketType={eventAnalytics.sales_by_ticket_type}
                />

                {/* Traffic Stats */}
                <MyEventTrafficStats
                    traffic={eventAnalytics.traffic}
                    ticketsSold={eventAnalytics.overview.tickets_sold}
                />

                {/* Recent Sales */}
                <MyEventRecentSales recentSales={eventAnalytics.recent_sales} />
            </ScrollView>

            {/* Delete Event Confirmation Bottom Sheet */}
            <AppBottomSheet ref={deleteEventSheetRef} snapPoints={["40%"]}>
                <View className="p-6">
                    <View className="flex-row items-center gap-3 mb-4">
                        <View
                            className="w-12 h-12 rounded-xl items-center justify-center"
                            style={{ backgroundColor: "#ef4444" + "33" }}
                        >
                            <Ionicons name="alert-circle" size={24} color="#ef4444" />
                        </View>
                        <View className="flex-1">
                            <AppText styles="text-lg text-red-400 mb-1 font-nunbold">
                                Delete Event?
                            </AppText>
                            <AppText styles="text-xs text-slate-400">
                                This action cannot be undone
                            </AppText>
                        </View>
                    </View>

                    <View className="mb-4">
                        <AppText styles="text-sm text-slate-300 mb-2">
                            Are you sure you want to delete{" "}
                            <AppText styles="text-sm text-white font-nunbold">
                                "{eventDetails.title}"
                            </AppText>
                            ?
                        </AppText>
                        <AppText styles="text-xs text-slate-400">
                            All tickets, attendees, and analytics data will be permanently deleted.
                        </AppText>
                    </View>

                    {deleteEventError && (
                        <View
                            className="mb-4 p-3 rounded-lg border"
                            style={{ backgroundColor: "#ef4444" + "1A", borderColor: "#ef4444" + "33" }}
                        >
                            <AppText styles="text-xs text-red-400">
                                {deleteEventError}
                            </AppText>
                        </View>
                    )}

                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={handleDeleteEvent}
                            disabled={deletingEvent}
                            className="flex-1 px-4 py-3 rounded-xl items-center"
                            style={{ backgroundColor: "#ef4444", opacity: deletingEvent ? 0.5 : 1 }}
                            activeOpacity={0.8}
                        >
                            <AppText styles="text-sm text-white font-nunbold">
                                {deletingEvent ? "Deleting..." : "Yes, Delete"}
                            </AppText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                deleteEventSheetRef.current?.close();
                                setDeleteEventError(null);
                            }}
                            disabled={deletingEvent}
                            className="flex-1 px-4 py-3 bg-primary-200 rounded-xl border border-accent items-center"
                            style={{ opacity: deletingEvent ? 0.5 : 1 }}
                            activeOpacity={0.8}
                        >
                            <AppText styles="text-sm text-white" >
                                Cancel
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </AppBottomSheet>

            {/* Delete Ticket Type Confirmation Bottom Sheet */}
            <AppBottomSheet ref={deleteTicketSheetRef} snapPoints={["40%"]}>
                <View className="p-6">
                    <View className="flex-row items-center gap-3 mb-4">
                        <View
                            className="w-12 h-12 rounded-xl items-center justify-center"
                            style={{ backgroundColor: "#ef4444" + "33" }}
                        >
                            <Ionicons name="alert-circle" size={24} color="#ef4444" />
                        </View>
                        <View className="flex-1">
                            <AppText styles="text-lg text-red-400 mb-1 font-nunbold">
                                Delete Ticket Type?
                            </AppText>
                            <AppText styles="text-xs text-slate-400">
                                This action cannot be undone
                            </AppText>
                        </View>
                    </View>

                    {deleteTicketTarget && (
                        <View className="mb-4">
                            <AppText styles="text-sm text-slate-300 mb-2">
                                Deleting{" "}
                                <AppText styles="text-sm text-white font-nunbold">
                                    "{deleteTicketTarget.name}"
                                </AppText>{" "}
                                ticket type.
                            </AppText>
                            <AppText styles="text-xs text-slate-400">
                                Tickets already sold will not be affected.
                            </AppText>
                        </View>
                    )}

                    {deleteTicketError && (
                        <View
                            className="mb-4 p-3 rounded-lg border"
                            style={{ backgroundColor: "#ef4444" + "1A", borderColor: "#ef4444" + "33" }}
                        >
                            <AppText styles="text-xs text-red-400">
                                {deleteTicketError}
                            </AppText>
                        </View>
                    )}

                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={handleDeleteTicket}
                            disabled={deletingTicket}
                            className="flex-1 px-4 py-3 rounded-xl items-center"
                            style={{ backgroundColor: "#ef4444", opacity: deletingTicket ? 0.5 : 1 }}
                            activeOpacity={0.8}
                        >
                            <AppText styles="text-sm text-white font-nunbold">
                                {deletingTicket ? "Deleting..." : "Yes, Delete"}
                            </AppText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                deleteTicketSheetRef.current?.close();
                                setDeleteTicketError(null);
                            }}
                            disabled={deletingTicket}
                            className="flex-1 px-4 py-3 bg-primary-200 rounded-xl border border-accent items-center"
                            style={{ opacity: deletingTicket ? 0.5 : 1 }}
                            activeOpacity={0.8}
                        >
                            <AppText styles="text-sm text-white font-nunbold">
                                Cancel
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </AppBottomSheet>
        </Screen>
    );
};

export default MyEventDetailsScreen;
