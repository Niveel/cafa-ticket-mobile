import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFormikContext } from "formik";

import AppText from "../../../ui/AppText";
import AppSwitch from "../../../ui/AppSwitch";
import AppFormField from "../../../form/AppFormField";
import SelectInput from "../../../form/SelectInput";
import type { EventFormValues } from "@/data/eventCreationSchema";
import colors from "@/config/colors";

const EventTypeSection = () => {
    const { values, setFieldValue } = useFormikContext<EventFormValues>();

    const frequencyOptions = [
        { value: "", label: "Select frequency" },
        { value: "daily", label: "Daily" },
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" },
        { value: "yearly", label: "Yearly" },
    ];

    const checkInPolicyOptions = [
        {
            value: "single_entry",
            label: "Single Entry",
            description: "Ticket checked in once only",
        },
        {
            value: "multiple_entry",
            label: "Multiple Entry",
            description: "Multiple check-ins allowed",
        },
        {
            value: "daily_entry",
            label: "Daily Entry",
            description: "One check-in per day",
        },
    ];

    const daysOfWeekOptions = [
        { value: 0, label: "Sun" },
        { value: 1, label: "Mon" },
        { value: 2, label: "Tue" },
        { value: 3, label: "Wed" },
        { value: 4, label: "Thu" },
        { value: 5, label: "Fri" },
        { value: 6, label: "Sat" },
    ];

    const handleRecurringToggle = (value: boolean) => {
        setFieldValue("is_recurring", value);

        if (!value) {
            setFieldValue("recurrence_pattern", null);
            setFieldValue("check_in_policy", "single_entry");
        } else {
            setFieldValue("recurrence_pattern", {
                frequency: "",
                interval: 1,
                end_date: null,
                occurrences: null,
                days_of_week: [],
                day_of_month: null,
            });
        }
    };

    const handleDayOfWeekToggle = (day: number) => {
        const currentDays = values.recurrence_pattern?.days_of_week || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter((d) => d !== day)
            : [...currentDays, day].sort();
        setFieldValue("recurrence_pattern.days_of_week", newDays);
    };

    const selectedFrequency = values.recurrence_pattern?.frequency;
    const showDaysOfWeek = selectedFrequency === "weekly";
    const showDayOfMonth = selectedFrequency === "monthly";

    return (
        <View className="gap-4">
            {/* Section Header */}
            <View className="flex-row items-center gap-3">
                <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.primary200 + "80" }}
                >
                    <Ionicons name="repeat-outline" size={20} color={colors.accent50} />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-black" font="font-ibold">
                        Event Type & Policies
                    </AppText>
                    <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.6 }}>
                        Configure event recurrence
                    </AppText>
                </View>
            </View>

            {/* Is Recurring Toggle */}
            <View className="p-4 rounded-xl border-2" style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}>
                <View className="flex-row items-start gap-3">
                    <AppSwitch
                        value={values.is_recurring || false}
                        onValueChange={handleRecurringToggle}
                        trackColor={{ false: colors.primary200, true: colors.accent }}
                        thumbColor={colors.white}
                        accessibilityLabel="Recurring event"
                        accessibilityHint="Turn on to make this event repeat on multiple days"
                    />
                    <View className="flex-1">
                        <AppText styles="text-sm text-white mb-1" font="font-ibold">
                            Recurring Event
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                            Event repeats on multiple days 
                        </AppText>
                    </View>
                </View>
            </View>

            {/* Recurrence Pattern - Only shown if recurring */}
            {values.is_recurring && (
                <>
                    {/* Recurrence Pattern Card */}
                    <View className="p-4 rounded-xl border" style={{ backgroundColor: colors.primary200 + "4d", borderColor: colors.accent + "4D" }}>
                        <View className="flex-row items-center gap-2 mb-4">
                            <Ionicons name="repeat-outline" size={18} color={colors.accent50} />
                            <AppText styles="text-sm text-black" font="font-ibold">
                                Recurrence Pattern
                            </AppText>
                        </View>

                        {/* Frequency */}
                        <View className="mb-4">
                            <SelectInput
                                name="recurrence_pattern.frequency"
                                label="How often does it repeat?"
                                value={values.recurrence_pattern?.frequency || ""}
                                onChange={(value) => setFieldValue("recurrence_pattern.frequency", value)}
                                options={frequencyOptions}
                                required
                            />
                            <AppText styles="text-xs text-black mt-2" font="font-iregular" style={{ opacity: 0.6 }}>
                                Choose repetition frequency
                            </AppText>
                        </View>

                        {/* Interval */}
                        <View className="mb-4">
                            <AppFormField
                                name="recurrence_pattern.interval"
                                label={`Repeat every how many ${selectedFrequency || "period"}(s)?`}
                                placeholder="1"
                                keyboardType="number-pad"
                                required
                            />
                            <AppText styles="text-xs text-black mt-2" font="font-iregular" style={{ opacity: 0.6 }}>
                                1 = every {selectedFrequency || "period"}, 2 = every other
                            </AppText>
                        </View>

                        {/* Days of Week (weekly only) */}
                        {showDaysOfWeek && (
                            <View className="mb-4">
                                <AppText styles="text-sm text-black mb-3" font="font-imedium">
                                    Which days of the week? *
                                </AppText>
                                <View className="flex-row flex-wrap gap-2">
                                    {daysOfWeekOptions.map((day) => {
                                        const isSelected = values.recurrence_pattern?.days_of_week?.includes(day.value);
                                        return (
                                            <TouchableOpacity
                                                key={day.value}
                                                onPress={() => handleDayOfWeekToggle(day.value)}
                                                className="px-4 py-2 rounded-lg"
                                                style={{
                                                    backgroundColor: isSelected ? colors.accent : colors.primary,
                                                    borderWidth: 2,
                                                    borderColor: isSelected ? colors.accent : colors.accent + "4D",
                                                }}
                                                activeOpacity={0.7}
                                            >
                                                <AppText styles="text-xs text-black" font="font-isemibold">
                                                    {day.label}
                                                </AppText>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        )}

                        {/* Day of Month (monthly only) */}
                        {showDayOfMonth && (
                            <View className="mb-4">
                                <AppFormField
                                    name="recurrence_pattern.day_of_month"
                                    label="Which day of the month?"
                                    placeholder="1-31"
                                    keyboardType="number-pad"
                                    required
                                />
                                <AppText styles="text-xs text-black mt-2" font="font-iregular" style={{ opacity: 0.6 }}>
                                    Enter 1-31 (e.g., 15 for 15th of each month)
                                </AppText>
                            </View>
                        )}

                        {/* End Date or Occurrences */}
                        <View>
                            <AppText styles="text-sm text-black mb-3" font="font-isemibold">
                                When should it end?
                            </AppText>

                            <View className="gap-3">
                                <AppFormField
                                    name="recurrence_pattern.end_date"
                                    label="End by date (Optional)"
                                    type="date"
                                    min={values.start_date || new Date().toISOString().split("T")[0]}
                                />

                                <AppFormField
                                    name="recurrence_pattern.occurrences"
                                    label="Or after X occurrences (Optional)"
                                    placeholder="10"
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Check-in Policy */}
                    <View>
                        <AppText styles="text-sm text-black mb-3" font="font-ibold">
                            Check-in Policy
                        </AppText>
                        <View className="gap-2">
                            {checkInPolicyOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    onPress={() => setFieldValue("check_in_policy", option.value)}
                                    className="p-4 rounded-xl border-2"
                                    style={{
                                        backgroundColor: values.check_in_policy === option.value ? colors.accent + "33" : colors.primary100,
                                        borderColor: values.check_in_policy === option.value ? colors.accent : colors.accent + "4D",
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <View className="flex-row items-start gap-3">
                                        <View
                                            className="w-5 h-5 rounded-full border-2 items-center justify-center mt-0.5"
                                            style={{ borderColor: values.check_in_policy === option.value ? colors.accent : colors.white + "80" }}
                                        >
                                            {values.check_in_policy === option.value && (
                                                <View className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.accent }} />
                                            )}
                                        </View>
                                        <View className="flex-1">
                                            <AppText styles="text-sm text-white mb-1" font="font-ibold">
                                                {option.label}
                                            </AppText>
                                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                                                {option.description}
                                            </AppText>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </>
            )}

            {/* Non-recurring Check-in Policy */}
            {!values.is_recurring && (
                <View>
                    <AppText styles="text-sm text-black mb-3" font="font-ibold">
                        Check-in Policy
                    </AppText>
                    <View className="gap-2">
                        {checkInPolicyOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => setFieldValue("check_in_policy", option.value)}
                                className="p-2 rounded-xl border-2"
                                style={{
                                    backgroundColor: values.check_in_policy === option.value ? colors.accent : colors.primary100,
                                    borderColor: values.check_in_policy === option.value ? colors.primary : colors.accent,
                                }}
                                activeOpacity={0.7}
                            >
                                <View className="flex-row items-start gap-3">
                                    <View
                                        className="w-5 h-5 rounded-full border-2 items-center justify-center mt-0.5"
                                        style={{ borderColor: values.check_in_policy === option.value ? colors.white : colors.white + "80" }}
                                    >
                                        {values.check_in_policy === option.value && (
                                            <View className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.accent }} />
                                        )}
                                    </View>
                                    <View className="flex-1">
                                        <AppText styles="text-sm text-white font-nunbold mb-1" font="font-ibold">
                                            {option.label}
                                        </AppText>
                                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.8 }}>
                                            {option.description}
                                        </AppText>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};

export default EventTypeSection;
