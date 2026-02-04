import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../ui/AppText";
import colors from "@/config/colors";

interface EventsResultsHeaderProps {
    totalCount: number;
    currentCount: number;
    isFiltered: boolean;
}

const EventsResultsHeader = ({
    totalCount,
    currentCount,
    isFiltered,
}: EventsResultsHeaderProps) => {
    return (
        <View className="flex-row items-center gap-3 mb-6">
            <View
                className="w-10 h-10 rounded-lg items-center justify-center border border-accent"
                style={{ backgroundColor: "rgba(220, 0, 0, 0.2)" }}
            >
                <Ionicons name="calendar" size={20} color={colors.accent50} />
            </View>
            <View>
                <AppText styles="text-base text-white font-nunbold">
                    {currentCount.toLocaleString()}{" "}
                    {currentCount === 1 ? "Event" : "Events"}
                </AppText>
                {isFiltered && totalCount !== currentCount && (
                    <AppText styles="text-xs text-slate-300">
                        Filtered from {totalCount.toLocaleString()} total events
                    </AppText>
                )}
            </View>
        </View>
    );
};

export default EventsResultsHeader;