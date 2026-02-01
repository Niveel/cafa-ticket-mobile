import { View, TouchableOpacity, Share, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Href } from "expo-router";

import { AppText } from "@/components";
import colors from "@/config/colors";
import type { TicketDetails } from "@/types/tickets.types";

type Props = {
    ticket: TicketDetails;
};

const TicketActions = ({ ticket }: Props) => {
    const [isSharing, setIsSharing] = useState(false);

    const handleShare = async () => {
        try {
            setIsSharing(true);
            await Share.share({
                title: ticket.event.title,
                message: `Check out my ticket for ${ticket.event.title}!\n\nTicket ID: ${ticket.ticket_id}`,
            });
        } catch (error) {
            console.error("Share failed:", error);
        } finally {
            setIsSharing(false);
        }
    };

    const buttons = [
        {
            icon: "eye-outline",
            label: "View Event",
            backgroundColor: "#3b82f6",
            onPress: () => router.push(`/events/${ticket.event.slug}` as Href),
            accessibilityLabel: `View event details for ${ticket.event.title}`,
        },
        {
            icon: isSharing ? "hourglass-outline" : "share-outline",
            label: isSharing ? "Sharing..." : "Share Ticket",
            backgroundColor: colors.primary200,
            borderColor: colors.accent + "4D",
            onPress: handleShare,
            accessibilityLabel: `Share ticket ${ticket.ticket_id}`,
        },
    ];

    return (
        <View className="gap-3">
            {buttons.map((btn) => (
                <TouchableOpacity
                    key={btn.label}
                    onPress={btn.onPress}
                    disabled={isSharing && btn.label.includes("Share")}
                    className="flex-row items-center justify-center gap-2 py-4 rounded-xl border-2"
                    style={{
                        backgroundColor: btn.backgroundColor,
                        borderColor: btn.borderColor || btn.backgroundColor,
                        opacity: isSharing && btn.label.includes("Share") ? 0.5 : 1,
                    }}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={btn.accessibilityLabel}
                >
                    {isSharing && btn.label.includes("Share") ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Ionicons name={btn.icon as any} size={18} color="#fff" />
                    )}
                    <AppText styles="text-sm text-white" font="font-ibold">
                        {btn.label}
                    </AppText>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default TicketActions;