import { View, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";

import { Screen, RequireAuth, Nav, AppText, EditTicketForm } from "@/components";
import { getMyCreatedEventDetails } from "@/lib/dashboard";
import type { MyEventDetailsResponse, EventTicketType } from "@/types/dash-events.types";
import colors from "@/config/colors";

const EditTicketScreen = () => {
    const { slug, ticket_id } = useLocalSearchParams<{ slug: string; ticket_id: string }>();

    const [event, setEvent] = useState<MyEventDetailsResponse | null>(null);
    const [ticket, setTicket] = useState<EventTicketType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEventAndTicket = async () => {
            if (!slug || !ticket_id) return;

            try {
                setIsLoading(true);
                setError(null);

                const eventData = await getMyCreatedEventDetails(slug);

                if (!eventData) {
                    setError("Event not found");
                    return;
                }

                setEvent(eventData);

                // Find the ticket
                const foundTicket = eventData.ticket_types.find((t) => t.id.toString() === ticket_id);

                if (!foundTicket) {
                    setError("Ticket type not found");
                    return;
                }

                setTicket(foundTicket);
            } catch (err: any) {
                console.error("Error fetching event/ticket:", err);
                setError(err.message || "Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEventAndTicket();
    }, [slug, ticket_id]);

    return (
        <Screen>
            <RequireAuth>
                <Nav title="Edit Ticket Type" />

                <View className="flex-1" style={{ backgroundColor: colors.primary }}>
                    {/* Loading State */}
                    {isLoading && (
                        <View className="flex-1 items-center justify-center p-6">
                            <ActivityIndicator size="large" color={colors.accent} />
                            <AppText
                                styles="text-sm text-white mt-4"
                                style={{ opacity: 0.6 }}
                            >
                                Loading ticket details...
                            </AppText>
                        </View>
                    )}

                    {/* Error State */}
                    {!isLoading && error && (
                        <ScrollView className="flex-1">
                            <View className="p-6">
                                <View
                                    className="p-6 rounded-xl border-2"
                                    style={{
                                        backgroundColor: colors.accent + "1A",
                                        borderColor: colors.accent,
                                    }}
                                >
                                    <View className="items-center">
                                        <Ionicons name="alert-circle" size={48} color={colors.accent} />
                                        <AppText styles="text-lg text-white mt-4 mb-2 font-nunbold">
                                            {error === "Event not found" ? "Event Not Found" : "Ticket Type Not Found"}
                                        </AppText>
                                        <AppText
                                            styles="text-sm text-white text-center"
                                            style={{ opacity: 0.8 }}
                                        >
                                            {error === "Event not found"
                                                ? "The event you're looking for doesn't exist or you don't have access to it."
                                                : "The ticket type you're looking for doesn't exist."}
                                        </AppText>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    )}

                    {/* Main Content */}
                    {!isLoading && event && ticket && (
                        <View className="flex-1 px-2 pt-4">
                            {/* Page Header */}
                            <View className="mb-4">
                                <AppText
                                    styles="text-sm text-white"
                                    style={{ opacity: 0.7 }}
                                >
                                    {ticket.name} • {event.title}
                                </AppText>
                            </View>

                            {/* Form Container */}
                            <View
                                className="flex-1 rounded-xl border-2 p-4"
                                style={{
                                    backgroundColor: colors.primary100,
                                    borderColor: colors.accent + "4D",
                                }}
                            >
                                <EditTicketForm ticket={ticket} eventSlug={slug!} />
                            </View>
                        </View>
                    )}
                </View>
            </RequireAuth>
        </Screen>
    );
};

export default EditTicketScreen;