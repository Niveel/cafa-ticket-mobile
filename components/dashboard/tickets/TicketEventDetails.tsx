import { View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Href } from "expo-router";

import AppText from "../../ui/AppText";
import colors from "@/config/colors";
import type { TicketEventDetails as EventDetailsType, TicketTypeDetails } from "@/types/tickets.types";
import { useFormatMoney } from "@/hooks/useFormatMoney";

type Props = {
    event: EventDetailsType;
    ticketType: TicketTypeDetails;
};

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GH", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

const formatTime = (time: string) =>
    new Date(`2000-01-01T${time}`).toLocaleTimeString("en-GH", {
        hour: "2-digit",
        minute: "2-digit",
    });

const TicketEventDetails = ({ event, ticketType }: Props) => {
    const formatMoney = useFormatMoney();
    return (
        <View>
            {/* Event Image with category badge */}
            <View className="rounded-xl overflow-hidden border-2" style={{ borderColor: "transparent" }}>
                <View className="relative" style={{ height: 160 }}>
                    {event.featured_image ? (
                        <Image
                            source={{ uri: event.featured_image }}
                            style={{ width: "100%", height: "100%", position: "absolute" }}
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="absolute inset-0 items-center justify-center" style={{ backgroundColor: colors.primary200 }}>
                            <Ionicons name="image-outline" size={40} color={colors.accent50} style={{ opacity: 0.4 }} />
                        </View>
                    )}

                    {/* Bottom overlay with category badge */}
                    <View
                        className="absolute bottom-0 left-0 right-0 p-4"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)", paddingTop: 40 }}
                    >
                        <View
                            className="self-start px-3 py-1 rounded-lg border"
                            style={{ backgroundColor: "rgba(0,0,0,0.4)", borderColor: "rgba(255,255,255,0.2)" }}
                        >
                            <AppText styles="text-xs text-white">
                                {event.category.name}
                            </AppText>
                        </View>
                    </View>
                </View>

                {/* Event info below image */}
                <View className="p-2 gap-4" style={{ backgroundColor: colors.primary100 }}>
                    {/* Title + description */}
                    <TouchableOpacity
                        onPress={() => router.push(`/events/${event.slug}` as Href)}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel={`View event: ${event.title}`}
                    >
                        <View className="flex-row items-center gap-1">
                            <AppText styles="text-base text-white font-nunbold">
                                {event.title}
                            </AppText>
                            <Ionicons name="arrow-forward-outline" size={14} color={colors.accent50} />
                        </View>
                    </TouchableOpacity>
                    <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                        {event.description}
                    </AppText>

                    {/* Ticket type card */}
                    <View
                        className="items-center justify-between p-3 rounded-lg border"
                        style={{ backgroundColor: colors.primary200, borderColor: "#a855f733" }}
                    >
                        <View className="flex-row items-center gap-3">
                            <View className="w-9 h-9 rounded-lg items-center justify-center" style={{ backgroundColor: "#a855f733" }}>
                                <Ionicons name="pricetag-outline" size={18} color="#c084fc" />
                            </View>
                            <View>
                                <AppText styles="text-xs text-white font-nunbold">
                                    {ticketType.name}
                                </AppText>
                                <AppText styles="text-xs text-white" style={{ opacity: 0.5 }}>
                                    {ticketType.description}
                                </AppText>
                            </View>
                        </View>
                    </View>
                    <AppText styles="text-sm font-nunbold" style={{ color: "#34d399" }}>
                        {formatMoney(ticketType.price)}
                    </AppText>

                    {/* Date/Time grid — 2 columns */}
                    <View className="flex-row gap-3">
                        <View
                            className="flex-1 p-3 rounded-lg"
                            style={{ backgroundColor: colors.primary200 }}

                            accessibilityLabel={`Start: ${formatDate(event.start_date)} at ${formatTime(event.start_time)}`}
                        >
                            <View className="flex-row items-center gap-1.5 mb-2">
                                <Ionicons name="calendar-outline" size={14} color={colors.accent50} />
                                <AppText styles="text-xs text-white" style={{ opacity: 0.5 }}>
                                    Start
                                </AppText>
                            </View>
                            <AppText styles="text-xs text-white">
                                {formatDate(event.start_date)}
                            </AppText>
                            <View className="flex-row items-center gap-1 mt-1">
                                <Ionicons name="time-outline" size={12} color={colors.accent50} />
                                <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                                    {formatTime(event.start_time)}
                                </AppText>
                            </View>
                        </View>

                        <View
                            className="flex-1 p-3 rounded-lg"
                            style={{ backgroundColor: colors.primary200 }}

                            accessibilityLabel={`End: ${formatDate(event.end_date)} at ${formatTime(event.end_time)}`}
                        >
                            <View className="flex-row items-center gap-1.5 mb-2">
                                <Ionicons name="calendar-outline" size={14} color={colors.accent50} />
                                <AppText styles="text-xs text-white" style={{ opacity: 0.5 }}>
                                    End
                                </AppText>
                            </View>
                            <AppText styles="text-xs text-white">
                                {formatDate(event.end_date)}
                            </AppText>
                            <View className="flex-row items-center gap-1 mt-1">
                                <Ionicons name="time-outline" size={12} color={colors.accent50} />
                                <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                                    {formatTime(event.end_time)}
                                </AppText>
                            </View>
                        </View>
                    </View>

                    {/* Venue */}
                    <View
                        className="flex-row items-start gap-3 p-3 rounded-lg"
                        style={{ backgroundColor: colors.primary200 }}

                        accessibilityLabel={`Venue: ${event.venue_name}, ${event.venue_address}, ${event.venue_city}, ${event.venue_country}`}
                    >
                        <Ionicons name="location-outline" size={18} color={colors.accent50} style={{ marginTop: 2 }} />
                        <View className="flex-1">
                            <AppText styles="text-xs text-white font-nunbold">
                                {event.venue_name}
                            </AppText>
                            <AppText styles="text-xs text-white mt-0.5" style={{ opacity: 0.6 }}>
                                {event.venue_address}
                            </AppText>
                            <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                                {event.venue_city}, {event.venue_country}
                            </AppText>
                        </View>
                    </View>

                    {/* Organizer */}
                    <View
                        className="flex-row items-center gap-3 p-3 rounded-lg"
                        style={{ backgroundColor: colors.primary200 }}
                    >
                        <View className="w-10 h-10 rounded-full overflow-hidden border-2" style={{ borderColor: colors.accent + "4D" }}>
                            {event.organizer.profile_image ? (
                                <Image
                                    source={{ uri: event.organizer.profile_image }}
                                    style={{ width: 40, height: 40 }}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.primary200 }}>
                                    <Ionicons name="person-outline" size={20} color={colors.accent50} />
                                </View>
                            )}
                        </View>
                        <View>
                            <AppText styles="text-xs text-white" style={{ opacity: 0.5 }}>
                                Organized by
                            </AppText>
                            <AppText styles="text-xs text-white font-nunbold">
                                {event.organizer.full_name}
                            </AppText>
                            <AppText styles="text-xs text-white" style={{ opacity: 0.5 }}>
                                @{event.organizer.username}
                            </AppText>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default TicketEventDetails;