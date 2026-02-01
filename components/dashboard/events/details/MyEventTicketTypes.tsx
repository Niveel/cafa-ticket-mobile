import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { AppText } from "@/components";
import type { EventTicketType } from "@/types/dash-events.types";
import colors from "@/config/colors";

interface MyEventTicketTypesProps {
    ticketTypes: EventTicketType[];
    eventSlug: string;
    onOpenDeleteModal: (ticket: EventTicketType) => void;
}

const MyEventTicketTypes = ({ ticketTypes, eventSlug, onOpenDeleteModal }: MyEventTicketTypesProps) => {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getStatusColor = (status: string) => {
        const colors = {
            active: { bg: "#10b981" + "33", text: "text-emerald-400", border: "#10b981" + "4D" },
            expired: { bg: "#64748b" + "33", text: "text-slate-400", border: "#64748b" + "4D" },
            sold_out: { bg: "#ef4444" + "33", text: "text-red-400", border: "#ef4444" + "4D" },
        };
        return colors[status as keyof typeof colors] || colors.active;
    };

    const getStatusLabel = (status: string) => {
        const labels = {
            active: "Active",
            expired: "Expired",
            sold_out: "Sold Out",
        };
        return labels[status as keyof typeof labels] || status;
    };

    const totalRevenue = ticketTypes.reduce((sum, ticket) => sum + parseFloat(ticket.revenue), 0);
    const totalSold = ticketTypes.reduce((sum, ticket) => sum + ticket.tickets_sold, 0);
    const totalQuantity = ticketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0);

    return (
        <View className="gap-4">
            {/* Section Header */}
            <View className="flex-row items-center justify-between">
                <View className="flex-1">
                    <AppText styles="text-xl text-white mb-1" font="font-ibold">
                        Ticket Types
                    </AppText>
                    <AppText styles="text-xs text-slate-400" font="font-iregular">
                        Manage pricing and availability
                    </AppText>
                </View>
                <TouchableOpacity
                    onPress={() => router.push(`/dashboard/events/${eventSlug}/tickets/create` as any)}
                    className="flex-row items-center gap-2 px-4 py-2 rounded-xl" 
                    style={{ backgroundColor: colors.accent }}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={18} color="#fff" />
                    <AppText styles="text-xs text-white" font="font-ibold">
                        Add
                    </AppText>
                </TouchableOpacity>
            </View>

            {/* Summary Cards */}
            <View className="flex-row gap-3">
                <View className="flex-1 p-3 bg-primary-200 rounded-xl border border-accent">
                    <AppText styles="text-xs text-slate-400 mb-1" font="font-iregular">
                        Total Types
                    </AppText>
                    <AppText styles="text-xl text-white" font="font-ibold">
                        {ticketTypes.length}
                    </AppText>
                </View>

                <View className="flex-1 p-3 bg-primary-200 rounded-xl border border-accent">
                    <AppText styles="text-xs text-slate-400 mb-1" font="font-iregular">
                        Total Sold
                    </AppText>
                    <AppText styles="text-xl text-white" font="font-ibold">
                        {totalSold}/{totalQuantity}
                    </AppText>
                </View>

                <View className="flex-1 p-3 bg-primary-200 rounded-xl border border-accent">
                    <AppText styles="text-xs text-slate-400 mb-1" font="font-iregular">
                        Revenue
                    </AppText>
                    <AppText styles="text-xl text-emerald-400" font="font-ibold">
                        GH₵{totalRevenue.toLocaleString()}
                    </AppText>
                </View>
            </View>

            {/* Ticket Types List */}
            <View className="gap-3">
                {ticketTypes.map((ticket) => {
                    const statusColor = getStatusColor(ticket.status);

                    return (
                        <View
                            key={ticket.id}
                            className="p-4 bg-primary rounded-xl border border-accent"
                        >
                            {/* Header */}
                            <View className="flex-row items-start justify-between mb-3">
                                <View className="flex-1">
                                    <View className="flex-row items-center gap-2 mb-1">
                                        <AppText styles="text-base text-white" font="font-ibold">
                                            {ticket.name}
                                        </AppText>
                                        <View
                                            className="px-2 py-0.5 rounded-md border"
                                            style={{
                                                backgroundColor: statusColor.bg,
                                                borderColor: statusColor.border,
                                            }}
                                        >
                                            <AppText
                                                styles={`text-xs ${statusColor.text}`}
                                                font="font-ibold"
                                            >
                                                {getStatusLabel(ticket.status)}
                                            </AppText>
                                        </View>
                                    </View>
                                    <AppText styles="text-xs text-slate-400" font="font-iregular">
                                        {ticket.description}
                                    </AppText>
                                </View>

                                {/* Action Buttons */}
                                <View className="flex-row gap-2 ml-3">
                                    <TouchableOpacity
                                        onPress={() =>
                                            router.push(`/dashboard/events/${eventSlug}/tickets/${ticket.id}/edit` as any)
                                        }
                                        className="w-8 h-8 rounded-lg items-center justify-center"
                                        style={{ backgroundColor: "#3b82f6" }}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="create-outline" size={16} color="#fff" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => onOpenDeleteModal(ticket)}
                                        className="w-8 h-8 rounded-lg items-center justify-center"
                                        style={{ backgroundColor: "#ef4444" }}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="trash-outline" size={16} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Stats Grid */}
                            <View className="flex-row gap-2 mb-3">
                                <View className="flex-1 p-2 bg-primary-200 rounded-lg">
                                    <AppText styles="text-xs text-slate-400 mb-0.5" font="font-iregular">
                                        Price
                                    </AppText>
                                    <AppText styles="text-sm text-emerald-400" font="font-ibold">
                                        GH₵{parseFloat(ticket.price).toLocaleString()}
                                    </AppText>
                                </View>

                                <View className="flex-1 p-2 bg-primary-200 rounded-lg">
                                    <AppText styles="text-xs text-slate-400 mb-0.5" font="font-iregular">
                                        Sold
                                    </AppText>
                                    <AppText styles="text-sm text-white" font="font-ibold">
                                        {ticket.tickets_sold}/{ticket.quantity}
                                    </AppText>
                                </View>

                                <View className="flex-1 p-2 bg-primary-200 rounded-lg">
                                    <AppText styles="text-xs text-slate-400 mb-0.5" font="font-iregular">
                                        Remaining
                                    </AppText>
                                    <AppText styles="text-sm text-white" font="font-ibold">
                                        {ticket.tickets_remaining}
                                    </AppText>
                                </View>

                                <View className="flex-1 p-2 bg-primary-200 rounded-lg">
                                    <AppText styles="text-xs text-slate-400 mb-0.5" font="font-iregular">
                                        Revenue
                                    </AppText>
                                    <AppText styles="text-sm text-emerald-400" font="font-ibold">
                                        GH₵{parseFloat(ticket.revenue).toLocaleString()}
                                    </AppText>
                                </View>
                            </View>

                            {/* Progress Bar */}
                            <View className="mb-3">
                                <View className="flex-row items-center justify-between mb-2">
                                    <AppText styles="text-xs text-slate-400" font="font-iregular">
                                        Sales Progress
                                    </AppText>
                                    <AppText styles="text-xs text-white" font="font-isemibold">
                                        {ticket.sales_percentage.toFixed(1)}%
                                    </AppText>
                                </View>
                                <View className="w-full h-2 bg-primary-100 rounded-full overflow-hidden">
                                    <View
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${ticket.sales_percentage}%`,
                                            backgroundColor: "#3b82f6",
                                        }}
                                    />
                                </View>
                            </View>

                            {/* Additional Info */}
                            <View className="gap-1">
                                <AppText styles="text-xs text-slate-400" font="font-iregular">
                                    Purchase limits: {ticket.min_purchase} - {ticket.max_purchase}
                                </AppText>

                                {(ticket.available_from || ticket.available_until) && (
                                    <View className="flex-row items-center gap-1">
                                        <Ionicons name="calendar-outline" size={12} color={colors.white} />
                                        <AppText styles="text-xs text-slate-400" font="font-iregular">
                                            {ticket.available_from && `From ${formatDate(ticket.available_from)}`}
                                            {ticket.available_from && ticket.available_until && " • "}
                                            {ticket.available_until && `Until ${formatDate(ticket.available_until)}`}
                                        </AppText>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default MyEventTicketTypes;