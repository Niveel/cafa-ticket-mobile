import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../ui/AppText";
import colors from "@/config/colors";

type Props = {
    ticketsSold: number;
    ticketsCheckedIn: number;
};

const stats = (ticketsSold: number, ticketsCheckedIn: number) => {
    const checkedIn = ticketsCheckedIn;
    const totalSold = ticketsSold;
    const pending = totalSold - checkedIn;
    const pct = totalSold > 0 ? ((checkedIn / totalSold) * 100).toFixed(1) : "0";

    return [
        { label: "Total Sold", value: String(totalSold), icon: "people-outline", iconBg: "#3b82f633", iconColor: "#60a5fa", borderColor: colors.accent },
        { label: "Checked In", value: String(checkedIn), icon: "checkmark-circle-outline", iconBg: "#10b98133", iconColor: "#34d399", borderColor: "#10b98166" },
        { label: "Pending", value: String(pending), icon: "time-outline", iconBg: "#f59e0b33", iconColor: "#fbbf24", borderColor: colors.accent },
        { label: "Progress", value: `${pct}%`, icon: "trending-up-outline", iconBg: "#a855f733", iconColor: "#c084fc", borderColor: colors.accent },
    ];
};

const CheckInStats = ({ ticketsSold, ticketsCheckedIn }: Props) => {
    const items = stats(ticketsSold, ticketsCheckedIn);

    return (
        <View className="flex-row flex-wrap gap-3">
            {items.map((item) => (
                <View
                    key={item.label}
                    className="rounded-xl p-4 border-2 flex-1"
                    style={{
                        backgroundColor: colors.primary100,
                        borderColor: item.borderColor,
                        minWidth: "45%",
                    }}
                    accessibilityLabel={`${item.label}: ${item.value}`}
                >
                    <View className="flex-row items-center gap-2 mb-2">
                        <View className="w-8 h-8 rounded-lg items-center justify-center" style={{ backgroundColor: item.iconBg }}>
                            <Ionicons name={item.icon as any} size={16} color={item.iconColor} />
                        </View>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                            {item.label}
                        </AppText>
                    </View>
                    <AppText styles="text-xl text-white" font="font-ibold" style={item.label === "Checked In" ? { color: "#34d399" } : undefined}>
                        {item.value}
                    </AppText>
                </View>
            ))}
        </View>
    );
};

export default CheckInStats;
