import { View, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import colors from "@/config/colors";
import type { CheckInResponse } from "@/types/dashboard.types";

type Props = {
    result: CheckInResponse;
    onDismiss: () => void;
};

const getConfig = (result: CheckInResponse) => {
    if (result.success) {
        return {
            icon: "checkmark-circle-outline",
            iconColor: "#34d399",
            bgColor: "#10b98111",
            borderColor: "#10b98133",
            titleColor: "#34d399",
            textColor: "#6ee7b7",
            title: "Check-in Successful!",
        };
    }
    if (result.error === "Already checked in") {
        return {
            icon: "alert-circle-outline",
            iconColor: "#fbbf24",
            bgColor: "#f59e0b11",
            borderColor: "#f59e0b33",
            titleColor: "#fbbf24",
            textColor: "#fcd34d",
            title: result.error,
        };
    }
    return {
        icon: "close-circle-outline",
        iconColor: "#f87171",
        bgColor: "#ef444411",
        borderColor: "#ef444433",
        titleColor: "#f87171",
        textColor: "#fca5a5",
        title: result.error || "Check-in Failed",
    };
};

const CheckInResult = ({ result, onDismiss }: Props) => {
    const cfg = getConfig(result);

    // Auto-dismiss success after 5s
    useEffect(() => {
        if (result.success) {
            const t = setTimeout(onDismiss, 5000);
            return () => clearTimeout(t);
        }
    }, [result.success, onDismiss]);

    const formatDateTime = (dt: string) =>
        new Date(dt).toLocaleString("en-GH", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    // Extract field-level errors from details
    const fieldErrors: string[] = [];
    if (!result.success && "details" in result && result.details && typeof result.details === "object") {
        Object.values(result.details).forEach((msgs: any) => {
            if (Array.isArray(msgs)) fieldErrors.push(...msgs);
            else if (typeof msgs === "string") fieldErrors.push(msgs);
        });
    }

    return (
        <View
            className="rounded-xl p-4 border-2"
            style={{ backgroundColor: cfg.bgColor, borderColor: cfg.borderColor }}
        >
            {/* Dismiss button */}
            <TouchableOpacity
                onPress={onDismiss}
                className="self-end w-7 h-7 rounded-lg items-center justify-center mb-2"
                style={{ backgroundColor: colors.primary200 }}
                activeOpacity={0.6}
                accessibilityRole="button"
                accessibilityLabel="Dismiss"
            >
                <Ionicons name="close-outline" size={16} color="#fff" />
            </TouchableOpacity>

            {/* Icon + title + message */}
            <View className="flex-row items-start gap-3">
                <View className="w-9 h-9 rounded-xl items-center justify-center" style={{ backgroundColor: cfg.bgColor }}>
                    <Ionicons name={cfg.icon as any} size={22} color={cfg.iconColor} />
                </View>
                <View className="flex-1">
                    <AppText styles="text-sm" font="font-ibold" style={{ color: cfg.titleColor }}>
                        {cfg.title}
                    </AppText>
                    <AppText styles="text-xs mt-0.5" font="font-iregular" style={{ color: cfg.textColor }}>
                        {result.message}
                    </AppText>

                    {/* Field errors */}
                    {fieldErrors.map((err, i) => (
                        <AppText key={i} styles="text-xs mt-0.5" font="font-isemibold" style={{ color: cfg.textColor }}>
                            • {err}
                        </AppText>
                    ))}
                </View>
            </View>

            {/* Ticket detail cards */}
            {result.ticket && (
                <View className="gap-2 mt-4">
                    <View className="flex-row gap-2">
                        {/* Attendee */}
                        <View className="flex-1 p-3 rounded-lg" style={{ backgroundColor: colors.primary200 }}>
                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                Attendee
                            </AppText>
                            <AppText styles="text-xs text-white" font="font-ibold">
                                {result.ticket.attendee_name}
                            </AppText>
                        </View>

                        {/* Ticket type (success) or ticket ID (error) */}
                        <View className="flex-1 p-3 rounded-lg" style={{ backgroundColor: colors.primary200 }}>
                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                {result.success && "ticket_type" in result.ticket ? "Ticket Type" : "Ticket ID"}
                            </AppText>
                            <AppText
                                styles="text-xs text-white"
                                font="font-ibold"
                                style={!(result.success && "ticket_type" in result.ticket) ? { fontFamily: "monospace" } : undefined}
                            >
                                {result.success && "ticket_type" in result.ticket
                                    ? result.ticket.ticket_type.name
                                    : result.ticket.ticket_id}
                            </AppText>
                        </View>
                    </View>

                    {/* Email (success only) */}
                    {result.success && result.ticket.attendee_email && (
                        <View className="flex-row gap-2">
                            <View className="flex-1 p-3 rounded-lg" style={{ backgroundColor: colors.primary200 }}>
                                <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                    Email
                                </AppText>
                                <AppText styles="text-xs text-white" font="font-isemibold" numberOfLines={1}>
                                    {result.ticket.attendee_email}
                                </AppText>
                            </View>
                            <View className="flex-1 p-3 rounded-lg" style={{ backgroundColor: colors.primary200 }}>
                                <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                    Ticket ID
                                </AppText>
                                <AppText styles="text-xs text-white" font="font-isemibold" style={{ fontFamily: "monospace" }} numberOfLines={1}>
                                    {result.ticket.ticket_id}
                                </AppText>
                            </View>
                        </View>
                    )}

                    {/* Checked-in timestamp */}
                    {result.ticket.checked_in_at && (
                        <View className="flex-row items-center justify-between p-3 rounded-lg" style={{ backgroundColor: colors.primary200 }}>
                            <View>
                                <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                    Checked In
                                </AppText>
                                <AppText styles="text-xs text-white" font="font-isemibold">
                                    {formatDateTime(result.ticket.checked_in_at)}
                                </AppText>
                            </View>
                            {result.ticket.checked_in_by && (
                                <View className="items-end">
                                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                        By
                                    </AppText>
                                    <AppText styles="text-xs text-white" font="font-isemibold">
                                        {typeof result.ticket.checked_in_by === "string"
                                            ? result.ticket.checked_in_by
                                            : result.ticket.checked_in_by.full_name}
                                    </AppText>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Event stats progress (success only) */}
                    {result.success && result.event_stats && (
                        <View className="p-3 rounded-lg mt-1" style={{ backgroundColor: colors.primary200 }}>
                            <View className="flex-row items-center justify-between mb-2">
                                <View>
                                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                        Total Progress
                                    </AppText>
                                    <AppText styles="text-sm text-white" font="font-ibold">
                                        {result.event_stats.total_checked_in} / {result.event_stats.total_attendees}
                                    </AppText>
                                </View>
                                <AppText styles="text-sm" font="font-ibold" style={{ color: "#34d399" }}>
                                    {result.event_stats.check_in_percentage}%
                                </AppText>
                            </View>
                            <View className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.primary }}>
                                <View
                                    className="h-full rounded-full"
                                    style={{ width: `${result.event_stats.check_in_percentage}%` as `${number}%`, backgroundColor: "#34d399" }}
                                />
                            </View>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default CheckInResult;