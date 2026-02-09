import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFormikContext } from "formik";

import AppText from "../../../ui/AppText";
import AppSwitch from "../../../ui/AppSwitch";
import type { EventFormValues } from "@/data/eventCreationSchema";
import colors from "@/config/colors";

const EventPublishSection = () => {
    const { values, setFieldValue } = useFormikContext<EventFormValues>();

    return (
        <View className="gap-4">
            {/* Section Header */}
            <View className="flex-row items-center gap-3">
                <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: values.is_published ? colors.success + "33" : colors.primary200 + "80" }}
                >
                    <Ionicons
                        name={values.is_published ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={values.is_published ? colors.success : colors.white}
                    />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-black" font="font-ibold">
                        Publishing Settings
                    </AppText>
                    <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.6 }}>
                        Control event visibility
                    </AppText>
                </View>
            </View>

            {/* Publish Toggle Card */}
            <View
                className="p-4 rounded-xl border-2"
                style={{
                    backgroundColor: values.is_published ? colors.success + "1A" : colors.primary100,
                    borderColor: values.is_published ? colors.success : colors.accent + "4D",
                }}
            >
                <View className="flex-row items-start gap-3">
                    <AppSwitch
                        value={values.is_published || false}
                        onValueChange={(value) => {
                            setFieldValue("is_published", value);
                        }}
                        trackColor={{ false: colors.primary200, true: colors.success }}
                        thumbColor={colors.white}
                        accessibilityLabel="Publish event"
                        accessibilityHint="Turn on to make your event visible to the public"
                    />
                    <View className="flex-1">
                        <View className="flex-row items-center gap-2 mb-2">
                            <AppText styles="text-sm text-black" font="font-ibold">
                                {values.is_published ? "Event is Published" : "Event is Unpublished"}
                            </AppText>
                            <View
                                className="px-2 py-0.5 rounded"
                                style={{
                                    backgroundColor: values.is_published ? colors.success + "33" : colors.primary200,
                                }}
                            >
                                <AppText
                                    styles="text-xs"
                                    font="font-isemibold"
                                    style={{ color: values.is_published ? colors.success : colors.white }}
                                >
                                    {values.is_published ? "Public" : "Private"}
                                </AppText>
                            </View>
                        </View>
                        <AppText styles="text-xs text-black mb-3" font="font-iregular" style={{ opacity: 0.7 }}>
                            {values.is_published
                                ? "Visible to everyone and appears in search results"
                                : "Hidden from search, accessible via direct link only"}
                        </AppText>

                        {/* Features List */}
                        <View className="gap-2">
                            <View className="flex-row items-center gap-2">
                                <View
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        backgroundColor: values.is_published ? colors.success : colors.white + "80",
                                    }}
                                />
                                <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                                    {values.is_published ? "Appears in search results" : "Hidden from search"}
                                </AppText>
                            </View>
                            <View className="flex-row items-center gap-2">
                                <View
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        backgroundColor: values.is_published ? colors.success : colors.white + "80",
                                    }}
                                />
                                <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                                    {values.is_published ? "Shown on category pages" : "Not on category pages"}
                                </AppText>
                            </View>
                            <View className="flex-row items-center gap-2">
                                <View
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        backgroundColor: values.is_published ? colors.success : colors.white + "80",
                                    }}
                                />
                                <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                                    {values.is_published ? "Tickets publicly available" : "Tickets via link only"}
                                </AppText>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Feature Comparison Cards */}
            <View className="flex-row gap-3">
                {/* Published Benefits */}
                <View
                    className="flex-1 p-3 rounded-lg border"
                    style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent + "4D" }}
                >
                    <View className="flex-row items-center gap-2 mb-2">
                        <Ionicons name="eye-outline" size={14} color={colors.accent50} />
                        <AppText styles="text-xs text-black" font="font-isemibold" style={{ opacity: 0.9 }}>
                            When Published
                        </AppText>
                    </View>
                    <View className="gap-1">
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Discoverable by all
                        </AppText>
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Search indexed
                        </AppText>
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Social shareable
                        </AppText>
                    </View>
                </View>

                {/* Unpublished Benefits */}
                <View
                    className="flex-1 p-3 rounded-lg border"
                    style={{ backgroundColor: colors.primary200 + "80", borderColor: colors.accent + "4D" }}
                >
                    <View className="flex-row items-center gap-2 mb-2">
                        <Ionicons name="eye-off-outline" size={14} color={colors.white} style={{ opacity: 0.6 }} />
                        <AppText styles="text-xs text-black" font="font-isemibold" style={{ opacity: 0.9 }}>
                            When Unpublished
                        </AppText>
                    </View>
                    <View className="gap-1">
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Hidden from public
                        </AppText>
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Direct link access
                        </AppText>
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Good for testing
                        </AppText>
                    </View>
                </View>
            </View>

            {/* Important Note */}
            <View
                className="p-3 rounded-lg border flex-row items-start gap-2"
                style={{ backgroundColor: colors.primary200 + "80", borderColor: colors.accent + "4D" }}
            >
                <Ionicons name="information-circle-outline" size={16} color={colors.accent50} style={{ marginTop: 2 }} />
                <View className="flex-1">
                    <AppText styles="text-xs text-black mb-1" font="font-isemibold" style={{ opacity: 0.9 }}>
                        Important Notes
                    </AppText>
                    <View className="gap-1">
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                            • You can change this anytime from dashboard
                        </AppText>
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Unpublishing will not affect purchased tickets
                        </AppText>
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Unpublish if not ready to sell yet
                        </AppText>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default EventPublishSection;

