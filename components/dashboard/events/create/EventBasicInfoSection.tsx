import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFormikContext } from "formik";

import AppText from "../../../ui/AppText";
import AppFormField from "../../../form/AppFormField";
import CategorySelect from "../../../ui/CategorySelect";
import type { EventFormValues } from "@/data/eventCreationSchema";
import colors from "@/config/colors";

const EventBasicInfoSection = () => {
    const { values, setFieldValue, errors, touched } = useFormikContext<EventFormValues>();

    return (
        <View className="gap-4">
            {/* Section Header */}
            <View className="flex-row items-center gap-3">
                <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.primary200 + "80" }}
                >
                    <Ionicons name="document-text-outline" size={20} color={colors.accent50} />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-black" font="font-ibold">
                        Basic Information
                    </AppText>
                    <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.6 }}>
                        Tell people about your event
                    </AppText>
                </View>
            </View>

            {/* Event Title */}
            <AppFormField
                name="title"
                label="Event Title"
                placeholder="e.g., Afrobeats Night 2025"
                required
                labelColor="text-black"
            />

            {/* Category - ✅ SAFE VERSION */}
            <CategorySelect
                value={values.category_slug || ""}
                onChange={(value) => setFieldValue("category_slug", value)}
                onBlur={() => {}}
                label="Event Category"
                required
                error={touched.category_slug && errors.category_slug ? errors.category_slug : undefined}
                labelColor="text-black"
            />

            {/* Short Description */}
            <AppFormField
                name="short_description"
                label="Short Description"
                placeholder="A brief, catchy summary (20-300 characters)"
                labelColor="text-black"
                multiline
                rows={2}
                required
            />

            {/* Full Description */}
            <View>
                <AppFormField
                    name="description"
                    label="Full Description"
                    placeholder="Detailed information about your event..."
                    labelColor="text-black"
                    multiline
                    rows={6}
                    required
                />

                {/* Markdown Info */}
                <View
                    className="mt-2 p-3 rounded-lg border"
                    style={{ backgroundColor: colors.primary200 + "80", borderColor: colors.accent + "4D" }}
                >
                    <View className="flex-row items-start gap-2">
                        <Ionicons name="information-circle-outline" size={16} color={colors.accent50} style={{ marginTop: 2 }} />
                        <View className="flex-1">
                            <AppText styles="text-xs text-black mb-1" font="font-isemibold" style={{ opacity: 0.9 }}>
                                Markdown Formatting Supported
                            </AppText>
                            <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                                Use # for headers, **bold**, *italic*, - for lists
                            </AppText>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default EventBasicInfoSection;