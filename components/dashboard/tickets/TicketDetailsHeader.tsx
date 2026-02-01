import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import colors from "@/config/colors";
import type { TicketDetails } from "@/types/tickets.types";

type Props = {
    ticket: TicketDetails;
};

const statusConfigs: Record<string, { icon: string; color: string; label: string }> = {
    active: { icon: "time-outline", color: "#60a5fa", label: "Active" },
    used: { icon: "checkmark-circle-outline", color: "#94a3b8", label: "Used" },
    cancelled: { icon: "close-circle-outline", color: "#f87171", label: "Cancelled" },
};

const getStatusConfig = (status: string, isCheckedIn: boolean) => {
    if (isCheckedIn) return { icon: "checkmark-circle-outline", color: "#34d399", label: "Checked In" };
    return statusConfigs[status] || statusConfigs.active;
};

const TicketDetailsHeader = ({ ticket }: Props) => {
    const config = getStatusConfig(ticket.status, ticket.is_checked_in);

    return (
        <View
            className="rounded-xl p-4 border-2"
            style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
        >
            {/* Top row: icon + status + price */}
            <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-center gap-3">
                    <View className="w-11 h-11 rounded-lg items-center justify-center" style={{ backgroundColor: "#a855f733" }}>
                        <Ionicons name="ticket-outline" size={22} color="#c084fc" />
                    </View>
                    <View>
                        <AppText styles="text-base text-white" font="font-ibold">
                            Ticket Details
                        </AppText>
                        <View className="flex-row items-center gap-2 mt-1">
                            <Ionicons name={config.icon as any} size={14} color={config.color} />
                            <AppText styles="text-xs" font="font-isemibold" style={{ color: config.color }}>
                                {config.label}
                            </AppText>
                        </View>
                    </View>
                </View>

                <View className="items-end">
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                        Paid
                    </AppText>
                    <AppText styles="text-lg" font="font-ibold" style={{ color: "#34d399" }}>
                        GH₵ {parseFloat(ticket.purchase_info.amount_paid).toLocaleString("en-GH")}
                    </AppText>
                </View>
            </View>

            {/* Event title */}
            <AppText styles="text-sm text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                {ticket.event.title}
            </AppText>

            {/* Ticket ID pill */}
            <View
                className="mt-3 self-start px-3 py-1.5 rounded-lg border"
                style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "4D" }}
            >
                <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6, fontFamily: "monospace" }}>
                    {ticket.ticket_id}
                </AppText>
            </View>
        </View>
    );
};

export default TicketDetailsHeader;