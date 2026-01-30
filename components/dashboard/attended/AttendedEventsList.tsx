import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View } from "react-native";

import { AppButton, AppText } from "@/components";
import colors from "@/config/colors";
import type { AttendedEvent } from "@/types/dash-events.types";
import AttendedEventCard from "./AttendedEventCard";

interface AttendedEventsListProps {
    attendedEvents: AttendedEvent[];
}

const AttendedEventsList = ({ attendedEvents }: AttendedEventsListProps) => {
    // Empty state
    if (!attendedEvents || attendedEvents.length === 0) {
        return (
            <View className="bg-primary rounded-2xl p-8 border-2 border-accent/30 items-center">
                <View
                    className="w-20 h-20 rounded-2xl items-center justify-center mb-6"
                    style={{ backgroundColor: colors.accent + "33" }}
                >
                    <Ionicons name="calendar-outline" size={40} color={colors.accent50} />
                </View>
                <AppText styles="text-xl text-white text-center mb-3" font="font-ibold">
                    No Events Attended Yet
                </AppText>
                <AppText styles="text-sm text-slate-300 text-center mb-6" font="font-iregular">
                    You haven't attended any events yet. Browse events and purchase tickets to start building your event history.
                </AppText>
                <AppButton
                    title="Browse Events"
                    variant="primary"
                    onClick={() => router.push("/events")}
                    icon={<Ionicons name="search" size={16} color={colors.white} />}
                />
            </View>
        );
    }

    return (
        <View style={{ gap: 16 }}>
            {attendedEvents.map((attendedEvent, index) => (
                <AttendedEventCard
                    key={`${attendedEvent.ticket_id}-${index}`}
                    attendedEvent={attendedEvent}
                />
            ))}
        </View>
    );
};

export default AttendedEventsList;
