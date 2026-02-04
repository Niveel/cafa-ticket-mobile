import { View, TouchableOpacity, Platform } from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

import AppText from "./AppText";
import colors from "@/config/colors";

interface TimeInputProps {
    name: string;
    label: string;
    value: string;
    onChange: (time: string) => void;
    onBlur: () => void;
    required?: boolean;
    placeholder?: string;
}

const TimeInput = ({
    label,
    value,
    onChange,
    onBlur,
    required = false,
    placeholder = "Select time",
}: TimeInputProps) => {
    const [showPicker, setShowPicker] = useState(false);

    // Convert HH:MM:SS or HH:MM to Date object
    const getDateFromTime = (timeString: string): Date => {
        const now = new Date();
        if (!timeString) return now;

        const [hours, minutes] = timeString.split(":").map(Number);
        now.setHours(hours || 0);
        now.setMinutes(minutes || 0);
        now.setSeconds(0);
        return now;
    };

    // Convert Date to HH:MM:SS format
    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}:00`;
    };

    // Format for display (HH:MM AM/PM)
    const formatTimeDisplay = (timeString: string): string => {
        if (!timeString) return "";

        const [hours, minutes] = timeString.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 || 12;
        return `${displayHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    const handleTimeChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === "android") {
            setShowPicker(false);
        }

        if (event.type === "set" && selectedDate) {
            const formattedTime = formatTime(selectedDate);
            onChange(formattedTime);
        }

        if (event.type === "dismissed") {
            setShowPicker(false);
        }
    };

    const handlePress = () => {
        setShowPicker(true);
        onBlur();
    };

    return (
        <View>
            {/* Label */}
            <View className="flex-row items-center mb-2">
                <AppText styles="text-sm text-white">
                    {label}
                </AppText>
                {required && (
                    <AppText styles="text-sm ml-1" style={{ color: colors.accent50 }}>
                        *
                    </AppText>
                )}
            </View>

            {/* Time Input */}
            <TouchableOpacity
                onPress={handlePress}
                className="flex-row items-center justify-between px-4 py-3 rounded-xl border-2"
                style={{
                    backgroundColor: colors.primary100,
                    borderColor: colors.accent,
                    minHeight: 50,
                }}
                activeOpacity={0.7}
            >
                <View className="flex-row items-center gap-3 flex-1">
                    <Ionicons name="time-outline" size={20} color={colors.white} style={{ opacity: 0.6 }} />
                    <AppText
                        styles="text-sm text-white flex-1"
                        style={{ opacity: value ? 1 : 0.6 }}
                    >
                        {value ? formatTimeDisplay(value) : placeholder}
                    </AppText>
                </View>
                <Ionicons name="chevron-down" size={20} color={colors.white} style={{ opacity: 0.6 }} />
            </TouchableOpacity>

            {/* Time Picker */}
            {showPicker && (
                <>
                    {Platform.OS === "ios" ? (
                        <View
                            className="mt-2 rounded-xl overflow-hidden border-2"
                            style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
                        >
                            <DateTimePicker
                                value={getDateFromTime(value)}
                                mode="time"
                                display="spinner"
                                onChange={handleTimeChange}
                                textColor={colors.white}
                                themeVariant="dark"
                            />
                            <View className="flex-row justify-end p-3 gap-3">
                                <TouchableOpacity
                                    onPress={() => setShowPicker(false)}
                                    className="px-4 py-2 rounded-lg"
                                    style={{ backgroundColor: colors.primary200 }}
                                    activeOpacity={0.7}
                                >
                                    <AppText styles="text-sm text-white">
                                        Cancel
                                    </AppText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setShowPicker(false)}
                                    className="px-4 py-2 rounded-lg"
                                    style={{ backgroundColor: colors.accent }}
                                    activeOpacity={0.7}
                                >
                                    <AppText styles="text-sm text-white">
                                        Done
                                    </AppText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <DateTimePicker
                            value={getDateFromTime(value)}
                            mode="time"
                            display="default"
                            onChange={handleTimeChange}
                        />
                    )}
                </>
            )}
        </View>
    );
};

export default TimeInput;