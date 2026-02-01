import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import colors from "@/config/colors";

type AnalyticsMetricCardProps = {
    title: string;
    value: string | number;
    icon: string;
    subtitle?: string;
    iconBgColor: string;
    iconColor: string;
};

const AnalyticsMetricCard = ({
    title,
    value,
    icon,
    subtitle,
    iconBgColor,
    iconColor,
}: AnalyticsMetricCardProps) => {
    return (
        <View
            className="rounded-xl p-4 border flex-1"
            style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
            accessibilityLabel={`${title}: ${value}${subtitle ? `. ${subtitle}` : ""}`}
        >
            <View
                className="w-10 h-10 rounded-lg items-center justify-center mb-3"
                style={{ backgroundColor: iconBgColor }}
            >
                <Ionicons name={icon as any} size={20} color={iconColor} />
            </View>

            <AppText styles="text-xl text-white" font="font-ibold">
                {value}
            </AppText>
            <AppText styles="text-xs text-white mt-1" font="font-isemibold">
                {title}
            </AppText>
            {subtitle && (
                <AppText styles="text-xs text-white mt-0.5" font="font-iregular" style={{ opacity: 0.5 }}>
                    {subtitle}
                </AppText>
            )}
        </View>
    );
};

export default AnalyticsMetricCard;