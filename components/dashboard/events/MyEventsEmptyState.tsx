import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Href } from "expo-router";

import AppText from "../../ui/AppText";
import colors from "@/config/colors";

const MyEventsEmptyState = () => {
    return (
        <View className="flex-1 items-center justify-center px-6 py-12">
            <View className="w-20 h-20 rounded-2xl items-center justify-center mb-6" style={{ backgroundColor: colors.accent + "33", borderWidth: 2, borderColor: colors.accent }}>
                <Ionicons name="calendar-outline" size={40} color={colors.accent50} />
            </View>
            <AppText styles="text-xl text-black text-center mb-3" font="font-ibold">No Events Found</AppText>
            <AppText styles="text-sm text-slate-300 text-center mb-6 leading-relaxed max-w-sm" font="font-iregular">
                You haven&apos;t created any events yet. Create your first event and reach thousands of attendees.
            </AppText>
            <TouchableOpacity onPress={() => router.push("/dashboard/events/create" as Href)} className="flex-row items-center gap-2 px-6 py-3 rounded-xl" style={{ backgroundColor: colors.accent }} activeOpacity={0.8}>
                <Ionicons name="add-circle-outline" size={20} color={colors.white} />
                <AppText styles="text-sm text-white" font="font-isemibold">Create Your First Event</AppText>
            </TouchableOpacity>
        </View>
    );
};

export default MyEventsEmptyState;
