import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";

import { Screen, AppButton, AppText, AttendedEventsList, Nav, RequireAuth, Animation } from "@/components";
import colors from "@/config/colors";
import { tickets } from "@/assets";
import { getMyAttendedEvents } from "@/lib/events";
import type { AttendedEvent } from "@/types/dash-events.types";

const AttendedEventsScreen = () => {
    const [attendedEvents, setAttendedEvents] = useState<AttendedEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasError, setHasError] = useState(false);

    const fetchAttendedEvents = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) setIsLoading(true);
            setHasError(false);

            const response = await getMyAttendedEvents();
            setAttendedEvents(response.results);
        } catch (error) {
            console.error("Error fetching attended events:", error);
            setHasError(true);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchAttendedEvents();
    }, [fetchAttendedEvents]);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchAttendedEvents(false);
    }, [fetchAttendedEvents]);

    return (
        <Screen>
            <RequireAuth>
                <Nav title="Attended Events" />

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            tintColor={colors.accent}
                            colors={[colors.accent]}
                        />
                    }
                >
                    {/* Page Header */}
                    <View className="mb-6">
                        <AppText styles="text-2xl text-white mb-2 font-nunbold">
                            Attended Events
                        </AppText>
                        <AppText styles="text-sm text-slate-300">
                            Your event attendance history
                        </AppText>
                    </View>

                    {/* Loading State */}
                    {isLoading && (
                        <View className="flex-1 items-center justify-center py-20">
                            <Animation
                                isVisible={true}
                                path={tickets}
                                style={{ width: 200, height: 200 }}
                            />
                            <AppText styles="text-sm text-slate-300 mt-4">
                                Loading attended events...
                            </AppText>
                        </View>
                    )}

                    {/* Error State */}
                    {!isLoading && hasError && (
                        <View className="bg-primary rounded-2xl p-8 border-2 border-accent/30 items-center">
                            <View
                                className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
                                style={{ backgroundColor: colors.accent + "33" }}
                            >
                                <Ionicons name="alert-circle-outline" size={32} color={colors.accent50} />
                            </View>
                            <AppText styles="text-lg text-white text-center mb-2 font-nunbold">
                                Unable to Load Events
                            </AppText>
                            <AppText styles="text-sm text-slate-300 text-center mb-4">
                                Something went wrong while fetching your attended events.
                            </AppText>
                            <AppButton
                                title="Try Again"
                                variant="primary"
                                onClick={() => fetchAttendedEvents()}
                                icon={<Ionicons name="refresh" size={16} color={colors.white} />}
                            />
                        </View>
                    )}

                    {/* Content */}
                    {!isLoading && !hasError && (
                        <>
                            {/* Info Card */}
                            <View
                                className="bg-primary rounded-xl p-4 mb-6 border-2"
                                style={{ borderColor: "#3b82f650" }}
                            >
                                <View className="flex-row items-center gap-3 mb-2">
                                    <Ionicons name="information-circle" size={20} color="#60a5fa" />
                                    <AppText styles="text-base text-white font-nunbold">
                                        About Your Attendance History
                                    </AppText>
                                </View>
                                <AppText styles="text-sm text-slate-300">
                                    This page shows all events you've successfully attended. Your check-in was confirmed at the event entrance.
                                </AppText>
                            </View>

                            {/* Attended Events List */}
                            <AttendedEventsList attendedEvents={attendedEvents} />
                        </>
                    )}
                </ScrollView>
            </RequireAuth>
        </Screen>
    );
};

export default AttendedEventsScreen;