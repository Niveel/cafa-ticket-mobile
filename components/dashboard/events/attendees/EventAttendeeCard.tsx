import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import type { EventAttendee } from "@/types/dash-events.types";
import colors from "@/config/colors";

interface EventAttendeeCardProps {
    attendee: EventAttendee;
}

const EventAttendeeCard = ({ attendee }: EventAttendeeCardProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GH", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getPaymentStatusStyle = (status: string) => {
        switch (status) {
            case "paid":
                return { bg: colors.accent + "33", color: colors.accent50 };
            case "pending":
                return { bg: colors.primary200 + "80", color: colors.white };
            default:
                return { bg: colors.primary200 + "80", color: colors.white };
        }
    };

    const paymentStyle = getPaymentStatusStyle(attendee.payment_status);

    return (
        <View
            className="rounded-xl p-4 border-2"
            style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
        >
            {/* Attendee Info */}
            <View className="mb-4">
                <AppText styles="text-base text-white mb-2" font="font-ibold">
                    {attendee.attendee_name}
                </AppText>
                
                {/* Contact Info */}
                <View className="gap-2 mb-2">
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="mail-outline" size={14} color={colors.white} style={{ opacity: 0.6 }} />
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            {attendee.attendee_email}
                        </AppText>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="call-outline" size={14} color={colors.white} style={{ opacity: 0.6 }} />
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            {attendee.attendee_phone}
                        </AppText>
                    </View>
                </View>

                {/* Ticket ID */}
                <AppText styles="text-xs text-white" font="font-imedium" style={{ opacity: 0.5 }}>
                    {attendee.ticket_id}
                </AppText>
            </View>

            {/* Ticket Details */}
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: colors.accent + "1A" }}>
                <View>
                    <AppText styles="text-xs text-white mb-1" font="font-iregular" style={{ opacity: 0.6 }}>
                        Ticket Type
                    </AppText>
                    <AppText styles="text-sm text-white" font="font-isemibold">
                        {attendee.ticket_type.name}
                    </AppText>
                    <AppText styles="text-xs text-white" font="font-imedium" style={{ opacity: 0.8 }}>
                        GH₵ {parseFloat(attendee.ticket_type.price).toLocaleString("en-GH")}
                    </AppText>
                </View>

                <View className="items-end">
                    <AppText styles="text-xs text-white mb-1" font="font-iregular" style={{ opacity: 0.6 }}>
                        Amount Paid
                    </AppText>
                    <AppText styles="text-base text-white" font="font-ibold" style={{ color: colors.accent50 }}>
                        GH₵ {parseFloat(attendee.amount_paid).toLocaleString("en-GH")}
                    </AppText>
                    <View
                        className="px-2 py-1 rounded-lg mt-1"
                        style={{ backgroundColor: paymentStyle.bg }}
                    >
                        <AppText
                            styles="text-xs capitalize"
                            font="font-isemibold"
                            style={{ color: paymentStyle.color }}
                        >
                            {attendee.payment_status}
                        </AppText>
                    </View>
                </View>
            </View>

            {/* Check-in Status */}
            <View className="flex-row items-center justify-between">
                {attendee.is_checked_in ? (
                    <>
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="checkmark-circle" size={24} color={colors.accent50} />
                            <View>
                                <AppText styles="text-sm text-white" font="font-isemibold" style={{ color: colors.accent50 }}>
                                    Checked In
                                </AppText>
                                {attendee.checked_in_at && (
                                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                                        {formatDate(attendee.checked_in_at)}
                                    </AppText>
                                )}
                            </View>
                        </View>
                        {attendee.checked_in_by && (
                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                by {attendee.checked_in_by.full_name}
                            </AppText>
                        )}
                    </>
                ) : (
                    <>
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="close-circle" size={24} color={colors.white} style={{ opacity: 0.5 }} />
                            <View>
                                <AppText styles="text-sm text-white" font="font-imedium" style={{ opacity: 0.7 }}>
                                    Not checked in
                                </AppText>
                                <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                    Purchased {formatDate(attendee.purchase_date)}
                                </AppText>
                            </View>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
};

export default EventAttendeeCard;