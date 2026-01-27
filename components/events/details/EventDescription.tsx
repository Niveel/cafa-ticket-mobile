import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";
import Animated, { FadeInDown } from "react-native-reanimated";

import { AppText } from "@/components";
import { EventDetails } from "@/types";
import colors from "@/config/colors";
import { markdownStyles } from "@/config/styles";

interface EventDescriptionProps {
    event: EventDetails;
}

const EventDescription = ({ event }: EventDescriptionProps) => {
    const isRecurring = event.is_recurring && event.recurrence_info !== null;

    return (
        <Animated.View entering={FadeInDown.delay(400)} className="bg-primary-100 py-4">
            <View className="px-2">
                {/* Header */}
                <View className="flex-row items-center gap-3 mb-6">
                    <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: colors.accent + "33", borderWidth: 1, borderColor: colors.accent }}>
                        <Ionicons name="document-text-outline" size={24} color={colors.accent50} />
                    </View>
                    <AppText styles="text-xl text-white" font="font-ibold">About This Event</AppText>
                </View>

                {/* Markdown */}
                <View className="mb-6">
                    <Markdown style={markdownStyles}>{event.description}</Markdown>
                </View>

                {/* Recurring Info */}
                {isRecurring && event.recurrence_info && (
                    <View className="p-4 rounded-xl mb-6" style={{ backgroundColor: colors.primary, borderWidth: 1, borderColor: colors.accent }}>
                        <View className="flex-row items-center gap-2 mb-4">
                            <Ionicons name="repeat-outline" size={20} color={colors.accent50} />
                            <AppText styles="text-base text-white" font="font-ibold">Recurring Schedule</AppText>
                        </View>
                        <View style={{ gap: 12 }}>
                            <View className="flex-row justify-between">
                                <AppText styles="text-sm text-slate-400" font="font-iregular">Frequency:</AppText>
                                <AppText styles="text-sm text-white capitalize" font="font-ibold">{event.recurrence_info.frequency}</AppText>
                            </View>
                            <View className="flex-row justify-between">
                                <AppText styles="text-sm text-slate-400" font="font-iregular">Occurrences:</AppText>
                                <AppText styles="text-sm text-white" font="font-ibold">{event.recurrence_info.total_occurrences} events</AppText>
                            </View>
                        </View>
                    </View>
                )}

                {/* Capacity Card */}
                <View className="p-4 rounded-xl" style={{ backgroundColor: colors.primary, borderWidth: 1, borderColor: colors.accent }}>
                    <AppText styles="text-base text-white mb-4" font="font-ibold">Capacity</AppText>
                    <View style={{ gap: 12 }}>
                        <View className="flex-row justify-between">
                            <AppText styles="text-xs text-slate-400" font="font-iregular">Total Capacity</AppText>
                            <AppText styles="text-sm text-white" font="font-ibold">{event.max_attendees.toLocaleString()}</AppText>
                        </View>
                        <View className="flex-row justify-between">
                            <AppText styles="text-xs text-slate-400" font="font-iregular">Tickets Sold</AppText>
                            <AppText styles="text-sm text-accent-50" font="font-ibold">{event.tickets_sold.toLocaleString()}</AppText>
                        </View>
                        <View className="flex-row justify-between">
                            <AppText styles="text-xs text-slate-400" font="font-iregular">Available</AppText>
                            <AppText styles="text-sm text-white" font="font-ibold">{event.tickets_available.toLocaleString()}</AppText>
                        </View>
                        <View className="h-2 bg-primary-100 rounded-full overflow-hidden mt-2">
                            <View className="h-full bg-accent-50 rounded-full" style={{ width: `${(event.tickets_sold / event.max_attendees) * 100}%` }} />
                        </View>
                        <AppText styles="text-xs text-slate-400 text-center" font="font-iregular">{Math.round((event.tickets_sold / event.max_attendees) * 100)}% Full</AppText>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

export default EventDescription;