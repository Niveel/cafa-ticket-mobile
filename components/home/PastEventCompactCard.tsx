import { View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import type { Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../ui/AppText";
import colors from "@/config/colors";
import { Event } from "@/types";
import { getFullImageUrl } from "@/utils/imageUrl";

interface PastEventCompactCardProps {
    event: Event;
}

const PastEventCompactCard = ({ event }: PastEventCompactCardProps) => {
    const imageUri = getFullImageUrl(event.featured_image) || undefined;

    const handlePress = () => {
        router.push(`/events/${event.slug}` as Href);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString("en-US", { month: "short" });
        return `${month} ${day}`;
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.85}
            className="bg-primary rounded-xl overflow-hidden border"
            style={{ borderColor: colors.accent + "66" }}
        >
            <View className="relative">
                <Image
                    source={{ uri: imageUri }}
                    style={{ width: "100%", aspectRatio: 16 / 10 }}
                    contentFit="cover"
                    transition={150}
                />
                <View
                    className="absolute top-2 left-2 px-2 py-1 rounded-md"
                    style={{ backgroundColor: colors.accent + "E6" }}
                >
                    <AppText styles="text-[10px] text-white font-nunbold">
                        PAST
                    </AppText>
                </View>
            </View>

            <View className="p-2.5">
                <AppText styles="text-sm text-white" font="font-nunbold" numberOfLines={2}>
                    {event.title}
                </AppText>

                <View className="mt-2 gap-1">
                    <View className="flex-row items-center gap-1.5">
                        <Ionicons name="calendar-outline" size={12} color={colors.accent50} />
                        <AppText styles="text-[11px] text-slate-300">
                            {formatDate(event.start_date)}
                        </AppText>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                        <Ionicons name="location-outline" size={12} color={colors.accent50} />
                        <AppText styles="text-[11px] text-slate-300 flex-1" numberOfLines={1}>
                            {event.venue_city}
                        </AppText>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default PastEventCompactCard;
