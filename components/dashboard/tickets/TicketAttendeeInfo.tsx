import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../ui/AppText";
import colors from "@/config/colors";
import type { TicketAttendeeInfo as AttendeeInfoType } from "@/types/tickets.types";

type Props = {
    attendeeInfo: AttendeeInfoType;
};

const fields = [
    { key: "name" as const, label: "Full Name", icon: "person-outline" },
    { key: "email" as const, label: "Email Address", icon: "mail-outline" },
    { key: "phone" as const, label: "Phone Number", icon: "call-outline" },
];

const TicketAttendeeInfo = ({ attendeeInfo }: Props) => {
    return (
        <View
            className="rounded-xl p-4 border-2"
            style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
        >
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-4">
                <View className="w-9 h-9 rounded-lg items-center justify-center" style={{ backgroundColor: "#3b82f633" }}>
                    <Ionicons name="person-outline" size={18} color="#60a5fa" />
                </View>
                <View>
                    <AppText styles="text-sm text-white font-nunbold">
                        Attendee Information
                    </AppText>
                    <AppText styles="text-xs text-white" style={{ opacity: 0.5 }}>
                        Ticket holder details
                    </AppText>
                </View>
            </View>

            {/* Fields */}
            <View className="gap-2">
                {fields.map((field) => (
                    <View
                        key={field.key}
                        className="flex-row items-center gap-3 p-3 rounded-lg"
                        style={{ backgroundColor: colors.primary200 }}
                        accessibilityLabel={`${field.label}: ${attendeeInfo[field.key]}`}
                    >
                        <Ionicons name={field.icon as any} size={18} color={colors.accent50} />
                        <View className="flex-1">
                            <AppText styles="text-xs text-white" style={{ opacity: 0.5 }}>
                                {field.label}
                            </AppText>
                            <AppText styles="text-xs text-white">
                                {attendeeInfo[field.key]}
                            </AppText>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default TicketAttendeeInfo;