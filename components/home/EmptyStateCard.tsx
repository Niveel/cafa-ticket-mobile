import { View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../ui/AppText";
import colors from "@/config/colors";

interface EmptyStateCardProps {
    type: "soon" | "upcoming";
}

const EmptyStateCard = ({ type }: EmptyStateCardProps) => {
    const config = {
        soon: {
            icon: "calendar-outline" as keyof typeof Ionicons.glyphMap,
            title: "No Events This Week",
            description: "Check back soon or explore all upcoming events",
            buttonText: "Browse All Events",
        },
        upcoming: {
            icon: "calendar-clear-outline" as keyof typeof Ionicons.glyphMap,
            title: "No Upcoming Events",
            description: "Be the first to create an exciting event",
            buttonText: "Create Event",
        },
    };

    const { icon, title, description, buttonText } = config[type];

    const handlePress = () => {
        if (type === "soon") {
            router.push("/(tabs)/events");
        } else {
            router.push("/dashboard/events/create");
        }
    };

    return (
        <View
            className="rounded-2xl p-6 items-center border"
            style={{
                backgroundColor: colors.primary100,
                borderColor: colors.accent + "33",
            }}
        >
            <View
                className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
                style={{ backgroundColor: colors.accent + "33" }}
            >
                <Ionicons name={icon} size={32} color={colors.accent50} />
            </View>

            <AppText styles="text-base text-white mb-2 text-center font-nunbold">
                {title}
            </AppText>
            <AppText
                styles="text-sm text-white mb-6 text-center"
                style={{ opacity: 0.7, maxWidth: 250 }}
            >
                {description}
            </AppText>

            <TouchableOpacity
                onPress={handlePress}
                className="px-6 py-3 rounded-xl"
                style={{ backgroundColor: colors.accent }}
                activeOpacity={0.8}
            >
                <AppText styles="text-sm text-white font-nunbold">
                    {buttonText}
                </AppText>
            </TouchableOpacity>
        </View>
    );
};

export default EmptyStateCard;