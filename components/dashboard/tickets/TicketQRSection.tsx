import { View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import colors from "@/config/colors";
import type { TicketDetails } from "@/types/tickets.types";

type Props = {
    ticket: TicketDetails;
};

const TicketQRSection = ({ ticket }: Props) => {
    return (
        <View
            className="rounded-xl p-4 border-2"
            style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
        >
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-4">
                <View className="w-9 h-9 rounded-lg items-center justify-center" style={{ backgroundColor: "#a855f733" }}>
                    <Ionicons name="qr-code-outline" size={18} color="#c084fc" />
                </View>
                <View>
                    <AppText styles="text-sm text-white" font="font-ibold">
                        QR Code
                    </AppText>
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                        Show this at the venue
                    </AppText>
                </View>
            </View>

            {/* QR Code */}
            <View className="items-center">
                <View
                    className="w-56 h-56 rounded-xl p-3 items-center justify-center"
                    style={{ backgroundColor: "#ffffff" }}
                    accessibilityRole="image"
                    accessibilityLabel={`QR code for ticket ${ticket.ticket_id}`}
                >
                    {ticket.qr_code ? (
                        <Image
                            source={{ uri: ticket.qr_code }}
                            style={{ width: 200, height: 200 }}
                            resizeMode="contain"
                        />
                    ) : (
                        <Ionicons name="qr-code-outline" size={80} color="#cbd5e1" />
                    )}
                </View>
            </View>

            {/* Info banner */}
            <View
                className="flex-row items-start gap-2 mt-4 p-3 rounded-lg border"
                style={{ backgroundColor: "#3b82f60D", borderColor: "#3b82f633" }}
            >
                <Ionicons name="information-circle-outline" size={16} color="#60a5fa" style={{ marginTop: 1 }} />
                <AppText styles="text-xs flex-1" font="font-iregular" style={{ color: "#93c5fd" }}>
                    Present this QR code at the event entrance for check-in. Make sure your screen brightness is high enough.
                </AppText>
            </View>
        </View>
    );
};

export default TicketQRSection;