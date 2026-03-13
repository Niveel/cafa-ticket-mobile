import { View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../../ui/AppText";
import { PaymentDetails } from "@/types/payments.types";
import colors from "@/config/colors";
import { useFormatMoney } from "@/hooks/useFormatMoney";
import { getFullImageUrl } from "@/utils/imageUrl";

type Props = {
    tickets: PaymentDetails["tickets"];
};

const PaymentTicketsList = ({ tickets }: Props) => {
    const formatMoney = useFormatMoney();
    const handleDownloadAll = () => {
        // TODO: Implement download all tickets functionality
        console.log("Download all tickets");
    };

    return (
        <View className="bg-primary-100 rounded-xl p-4 border-2 border-accent/30 mb-4">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
                <AppText styles="text-lg text-black" font="font-ibold">
                    Tickets ({tickets.length})
                </AppText>
                <TouchableOpacity
                    onPress={handleDownloadAll}
                    className="flex-row items-center gap-2 px-3 py-2 bg-accent rounded-lg"
                    activeOpacity={0.7}
                >
                    <Ionicons name="download" size={16} color={colors.white} />
                    <AppText styles="text-xs text-black" font="font-isemibold">
                        Download All
                    </AppText>
                </TouchableOpacity>
            </View>

            {/* Tickets List */}
            <View className="gap-3">
                {tickets.map((ticket, index) => (
                    <View
                        key={index}
                        className="flex-row items-center gap-3 p-3 bg-primary-200 rounded-xl border border-accent/20"
                    >
                        {/* QR Code */}
                        <View className="w-16 h-16 rounded-lg overflow-hidden border-2 border-accent/30 shrink-0">
                            <Image
                                source={{ uri: getFullImageUrl(ticket.qr_code) || undefined }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>

                        {/* Ticket Info */}
                        <View className="flex-1">
                            <AppText styles="text-sm text-black mb-1" font="font-ibold">
                                {ticket.ticket_type.name}
                            </AppText>
                            <AppText styles="text-xs text-slate-300 mb-1" font="font-iregular">
                                {ticket.attendee_name}
                            </AppText>
                            <AppText styles="text-xs text-slate-400 font-mono" font="font-iregular">
                                {ticket.ticket_id}
                            </AppText>
                        </View>

                        {/* Price and Status */}
                        <View className="items-end">
                            <AppText styles="text-base text-accent-50 mb-2" font="font-ibold">
                                {formatMoney(ticket.ticket_type.price)}
                            </AppText>
                            <View
                                className={`px-2 py-1 rounded-md ${ticket.status === "active"
                                    ? "bg-emerald-500/20 border border-emerald-500/30"
                                    : ticket.status === "used"
                                        ? "bg-blue-500/20 border border-blue-500/30"
                                        : "bg-slate-500/20 border border-slate-500/30"
                                    }`}
                            >
                                <AppText
                                    styles={`text-xs ${ticket.status === "active"
                                        ? "text-emerald-400"
                                        : ticket.status === "used"
                                            ? "text-blue-400"
                                            : "text-slate-400"
                                        } capitalize`}
                                    font="font-isemibold"
                                >
                                    {ticket.status}
                                </AppText>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default PaymentTicketsList;
