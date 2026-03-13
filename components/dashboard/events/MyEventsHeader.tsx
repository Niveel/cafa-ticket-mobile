import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Href } from "expo-router";

import AppText from "../../ui/AppText";
import type { CurrentUser } from "@/types";
import colors from "@/config/colors";

interface MyEventsHeaderProps {
    currentUser: CurrentUser | null;
    onOpenFilters: () => void;
    onCreateEventPress?: () => void;
}

const MyEventsHeader = ({ currentUser, onOpenFilters, onCreateEventPress }: MyEventsHeaderProps) => {
    const isOrganizer = currentUser?.is_organizer;

    return (
        <View className=" pt-2 pb-2">
            {/* Title & Filter Button */}
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-1">
                    <AppText styles="text-2xl text-black mb-1" font="font-ibold">
                        My Events
                    </AppText>
                    <AppText styles="text-xs text-slate-500" font="font-iregular">
                        Manage your created events
                    </AppText>
                </View>

                {/* Filter Button */}
                <TouchableOpacity
                    onPress={onOpenFilters}
                    className="w-12 h-12 rounded-xl items-center justify-center border-2 border-accent"
                    style={{ backgroundColor: colors.accent + "20" }}
                    activeOpacity={0.8}
                >
                    <Ionicons name="filter" size={20} color={colors.accent50} />
                </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 mb-2">
                <TouchableOpacity
                    onPress={() => router.push("/dashboard/events/attended" as Href)}
                    className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 bg-primary-200 rounded-xl border-2 border-accent/30"
                    activeOpacity={0.8}
                >
                    <Ionicons name="calendar-outline" size={18} color={colors.white} />
                    <AppText styles="text-xs text-black" font="font-isemibold">
                        Attended
                    </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        if (onCreateEventPress) {
                            onCreateEventPress();
                            return;
                        }
                        router.push(
                            (isOrganizer
                                ? "/dashboard/events/create"
                                : "/dashboard/profile/verify") as Href
                        );
                    }}
                    className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl"
                    style={{ backgroundColor: colors.accent }}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name={isOrganizer ? "add-circle-outline" : "shield-checkmark-outline"}
                        size={18}
                        color={colors.white}
                    />
                    <AppText styles="text-xs text-white" font="font-isemibold">
                        {isOrganizer ? "Create" : "Verify"}
                    </AppText>
                </TouchableOpacity>
            </View>

            {/* Verification Notice */}
            {!isOrganizer && (
                <View
                    className="p-4 rounded-xl"
                    style={{
                        backgroundColor: "#f59e0b20",
                        borderWidth: 2,
                        borderColor: "#f59e0b",
                    }}
                >
                    <View className="flex-row items-start gap-3">
                        <View
                            className="w-10 h-10 rounded-full items-center justify-center"
                            style={{ backgroundColor: "#f59e0b33" }}
                        >
                            <Ionicons name="shield-checkmark" size={20} color="#fbbf24" />
                        </View>
                        <View className="flex-1">
                            <AppText styles="text-sm text-black mb-2" font="font-ibold">
                                Verification Required
                            </AppText>
                            <AppText styles="text-xs text-black mb-3 leading-relaxed" font="font-iregular">
                                Verify your identity to create events.
                            </AppText>
                            <TouchableOpacity
                                onPress={() => {
                                    if (onCreateEventPress) {
                                        onCreateEventPress();
                                        return;
                                    }
                                    router.push("/dashboard/profile/verify" as Href);
                                }}
                                className="self-start px-4 py-2 rounded-lg"
                                style={{ backgroundColor: colors.accent }}
                                activeOpacity={0.8}
                            >
                                <AppText styles="text-xs text-white" font="font-isemibold">
                                    Start Verification
                                </AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

export default MyEventsHeader;
