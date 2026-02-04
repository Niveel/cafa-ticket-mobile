import { View, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Href } from "expo-router";

import {
    Screen,
    RequireAuth,
    Nav,
    AppText,
    TicketDetailsHeader,
    TicketQRSection,
    TicketEventDetails,
    TicketAttendeeInfo,
    TicketPurchaseInfo,
    TicketActions,
} from "@/components";
import { getMyTicketDetails } from "@/lib/dashboard";
import colors from "@/config/colors";
import type { TicketDetails } from "@/types/tickets.types";

const MyTicketDetailsScreen = () => {
    const { ticket_id } = useLocalSearchParams<{ ticket_id: string }>();
    const [ticket, setTicket] = useState<TicketDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchTicket = async () => {
            if (!ticket_id) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            try {
                const data = await getMyTicketDetails(ticket_id);
                if (data) {
                    setTicket(data);
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                console.error("Failed to fetch ticket details:", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [ticket_id]);

    // Loading
    if (loading) {
        return (
            <Screen>
                <RequireAuth>
                    <Nav title="Ticket Details" />
                    <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.primary }}>
                        <ActivityIndicator size="large" color={colors.accent} />
                    </View>
                </RequireAuth>
            </Screen>
        );
    }

    // Not found
    if (notFound || !ticket) {
        return (
            <Screen>
                <RequireAuth>
                    <Nav title="Ticket Details" />
                    <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: colors.primary }}>
                        <View
                            className="w-20 h-20 rounded-2xl items-center justify-center mb-4"
                            style={{ backgroundColor: colors.primary200 }}
                        >
                            <Ionicons name="alert-circle-outline" size={40} color="#f87171" />
                        </View>
                        <AppText styles="text-lg text-white text-center font-nunbold">
                            Ticket Not Found
                        </AppText>
                        <AppText styles="text-xs text-white text-center mt-2 mb-6" style={{ opacity: 0.6, maxWidth: 280 }}>
                            This ticket doesn't exist or you don't have access to it.
                        </AppText>
                        <View
                            className="flex-row items-center gap-2 px-5 py-3 rounded-xl"
                            style={{ backgroundColor: colors.accent }}
                        >
                            <Ionicons name="arrow-back-outline" size={18} color="#fff" />
                            <AppText
                                styles="text-sm text-white font-nunbold"
                                onPress={() => router.push("/my-tickets" as Href)}
                            >
                                Back to My Tickets
                            </AppText>
                        </View>
                    </View>
                </RequireAuth>
            </Screen>
        );
    }

    // Success
    return (
        <Screen>
            <RequireAuth>
                <Nav title="Ticket Details" />

                <View className="flex-1" style={{ backgroundColor: colors.primary }}>
                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                        <View className="gap-4">
                            {/* Header: status, ticket ID, price */}
                            <TicketDetailsHeader ticket={ticket} />

                            {/* QR Code */}
                            <TicketQRSection ticket={ticket} />

                            {/* Actions: View Event, Share */}
                            <TicketActions ticket={ticket} />

                            {/* Event details: image, type, dates, venue, organizer */}
                            <TicketEventDetails event={ticket.event} ticketType={ticket.ticket_type} />

                            {/* Attendee: name, email, phone */}
                            <TicketAttendeeInfo attendeeInfo={ticket.attendee_info} />

                            {/* Purchase: date, method, reference, status, amount */}
                            <TicketPurchaseInfo purchaseInfo={ticket.purchase_info} />
                        </View>
                    </ScrollView>
                </View>
            </RequireAuth>
        </Screen>
    );
};

export default MyTicketDetailsScreen;