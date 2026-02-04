import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

import AppText from "../../ui/AppText";
import TicketCard from "./TicketCard";
import { EventDetails, RecurringEventDetails, TicketType } from "@/types";
import { CurrentUser } from "@/types/general.types";
import colors from "@/config/colors";

interface TicketsSectionProps {
    event: EventDetails | RecurringEventDetails;
    currentUser: CurrentUser | null;
    onTicketSelect?: (ticket: TicketType, quantity: number) => void; // ⬅️ Add this
}

const TicketsSection = ({ event, currentUser, onTicketSelect }: TicketsSectionProps) => {
    const isUpcoming = event.status === "upcoming";
    const isOngoing = event.status === "ongoing";
    const isPast = event.status === "past";
    const hasNoTickets = !event.ticket_types || event.ticket_types.length === 0;

    // Non-upcoming events
    if (!isUpcoming) {
        return (
            <Animated.View entering={FadeInDown.delay(600)} className="bg-primary py-4">
                <View className="px-2">
                    {/* Header */}
                    <View className="flex-row items-center gap-3 mb-6">
                        <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: "#64748b33", borderWidth: 1, borderColor: "#64748b" }}>
                            <Ionicons name="ticket-outline" size={24} color="#94a3b8" />
                        </View>
                        <AppText styles="text-xl text-white font-nunbold">Tickets</AppText>
                    </View>

                    {/* Status Message */}
                    <View className="p-6 rounded-2xl" style={{ backgroundColor: isOngoing ? colors.accent + "20" : "#64748b20", borderWidth: 2, borderColor: isOngoing ? colors.accent : "#64748b" }}>
                        <View className="w-16 h-16 mx-auto mb-4 rounded-full items-center justify-center" style={{ backgroundColor: isOngoing ? colors.accent + "33" : "#64748b33" }}>
                            <Ionicons name={isOngoing ? "time-outline" : "ban-outline"} size={32} color={isOngoing ? colors.accent50 : "#94a3b8"} />
                        </View>

                        <AppText styles="text-lg text-white text-center mb-3 font-nunbold">
                            {isOngoing && "Event In Progress"}
                            {isPast && "Ticket Sales Closed"}
                        </AppText>

                        <AppText styles="text-sm text-slate-300 text-center leading-relaxed mb-4">
                            {isOngoing && "This event is currently ongoing! Ticket sales have ended."}
                            {isPast && "This event has already taken place. Ticket sales are no longer available."}
                        </AppText>

                        <View className="items-center py-2 px-4 bg-primary-100 rounded-lg self-center" style={{ borderWidth: 1, borderColor: colors.accent + "50" }}>
                            <AppText styles="text-xs text-slate-300">
                                {isOngoing && `Started ${new Date(event.start_date).toLocaleDateString()}`}
                                {isPast && `Took place ${new Date(event.start_date).toLocaleDateString()}`}
                            </AppText>
                        </View>

                        <TouchableOpacity onPress={() => router.push("/events")} className="mt-6 py-3 px-6 bg-accent rounded-xl self-center" activeOpacity={0.8}>
                            <AppText styles="text-sm text-white font-nunbold">Explore Other Events</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        );
    }

    // No tickets available
    if (hasNoTickets) {
        return (
            <Animated.View entering={FadeInDown.delay(600)} className="bg-primary py-4">
                <View className="px-2">
                    <View className="flex-row items-center gap-3 mb-6">
                        <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: "#f59e0b33", borderWidth: 1, borderColor: "#f59e0b" }}>
                            <Ionicons name="alert-circle-outline" size={24} color="#fbbf24" />
                        </View>
                        <AppText styles="text-xl text-white font-nunbold">Tickets</AppText>
                    </View>

                    <View className="p-6 rounded-2xl" style={{ backgroundColor: "#f59e0b20", borderWidth: 2, borderColor: "#f59e0b" }}>
                        <View className="w-16 h-16 mx-auto mb-4 rounded-full items-center justify-center" style={{ backgroundColor: "#f59e0b33" }}>
                            <Ionicons name="alert-circle-outline" size={32} color="#fbbf24" />
                        </View>

                        <AppText styles="text-lg text-white text-center mb-3 font-nunbold">No Tickets Available Yet</AppText>
                        <AppText styles="text-sm text-slate-300 text-center leading-relaxed mb-4">
                            The organizer hasn't added tickets yet. Check back later!
                        </AppText>

                        <TouchableOpacity onPress={() => router.push("/events")} className="mt-4 py-3 px-6 bg-accent rounded-xl self-center" activeOpacity={0.8}>
                            <AppText styles="text-sm text-white font-nunbold">Browse Other Events</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        );
    }

    // Show tickets
    return (
        <Animated.View entering={FadeInDown.delay(600)} className="bg-primary py-4">
            <View className="px-2">
                {/* Header */}
                <View className="mb-6">
                    <View className="flex-row items-center gap-3 mb-3">
                        <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: colors.accent + "33", borderWidth: 1, borderColor: colors.accent }}>
                            <Ionicons name="ticket-outline" size={24} color={colors.accent50} />
                        </View>
                        <AppText styles="text-xl text-white font-nunbold">Get Your Tickets</AppText>
                    </View>
                    <AppText styles="text-sm text-slate-300 leading-relaxed">
                        Choose your ticket type and secure your spot.
                        {event.tickets_available <= 50 && event.tickets_available > 0 && (
                            <AppText styles="text-sm text-accent-50 font-nunbold"> Hurry, only {event.tickets_available} left!</AppText>
                        )}
                    </AppText>
                </View>

                {/* Tickets Grid */}
                <View style={{ gap: 16, marginBottom: 16 }}>
                    {event.ticket_types.map((ticket) => (
                        <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            event={event}
                            currentUser={currentUser}
                            onPurchase={onTicketSelect} // ⬅️ Pass it to TicketCard
                        />
                    ))}
                </View>

                {/* Important Notes */}
                <View className="p-4 bg-primary-100 rounded-xl" style={{ borderWidth: 1, borderColor: colors.accent }}>
                    <View className="flex-row items-start gap-3">
                        <View className="w-10 h-10 rounded-lg items-center justify-center" style={{ backgroundColor: colors.accent + "33" }}>
                            <Ionicons name="information-circle-outline" size={20} color={colors.accent50} />
                        </View>
                        <View className="flex-1">
                            <AppText styles="text-base text-white mb-3 font-nunbold">Important Info</AppText>
                            <View style={{ gap: 8 }}>
                                <View className="flex-row items-start gap-2">
                                    <AppText styles="text-xs text-accent-50 font-nunbold">•</AppText>
                                    <AppText styles="text-xs text-slate-300">Tickets are non-refundable</AppText>
                                </View>
                                <View className="flex-row items-start gap-2">
                                    <AppText styles="text-xs text-accent-50 font-nunbold">•</AppText>
                                    <AppText styles="text-xs text-slate-300">Bring your QR code to the event</AppText>
                                </View>
                                <View className="flex-row items-start gap-2">
                                    <AppText styles="text-xs text-accent-50 font-nunbold">•</AppText>
                                    <AppText styles="text-xs text-slate-300">Check-in: {event.check_in_policy === "single_entry" ? "Single entry" : "Daily entry"}</AppText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

export default TicketsSection;