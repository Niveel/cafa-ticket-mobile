import { View, FlatList, Alert, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import type { MutableRefObject } from "react";
import { router } from "expo-router";

import {
    AppText,
    AppForm,
    SubmitButton,
    FormLoader,
    EventBasicInfoSection,
    EventVenueSection,
    EventDateTimeSection,
    EventTypeSection,
    EventCapacitySection,
    EventPaymentProfileSection,
    EventImagesSection,
    EventTicketTypesSection,
    EventPublishSection,
} from "@/components";
import { eventCreationSchema, type EventFormValues, type TicketTypeFormValues } from "@/data/eventCreationSchema";
import { buildEventFormData } from "@/utils/buildEventFormData";
import { createEvent } from "@/lib/events";
import colors from "@/config/colors";

interface CreateEventFormProps {
    /** Called when the user taps Add (null) or Edit (index) ticket type. */
    onOpenModal: (index: number | null) => void;
    /** Screen writes here so the lifted AddTicketTypeModal can call setFieldValue. */
    formContextRef: MutableRefObject<{
        setFieldValue: (field: string, value: any) => void;
        ticketTypes: TicketTypeFormValues[];
    } | null>;
}

const CreateEventForm = ({ onOpenModal, formContextRef }: CreateEventFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const initialValues: EventFormValues = {
        // Basic Info
        title: "",
        category_slug: "",
        short_description: "",
        description: "",

        // Venue
        venue_name: "",
        venue_address: "",
        venue_city: "",
        venue_country: "Ghana",
        venue_latitude: null,
        venue_longitude: null,

        // Date & Time
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",

        // Event Type
        is_recurring: false,
        recurrence_pattern: null,
        check_in_policy: "single_entry",

        // Capacity
        max_attendees: "",

        // Payment Profile
        payment_profile_id: "",

        // Images
        featured_image: "",
        additional_images: [],

        // Publishing
        is_published: true,

        // Ticket Types
        ticket_types: [],
    };

    // Helper to format time HH:MM to HH:MM:SS
    const formatTime = (time: string): string => {
        if (!time) return "";
        if (time.includes(":") && time.split(":").length === 3) return time;
        return `${time}:00`;
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const getMissingFields = (values: EventFormValues): string[] => {
        const missing: string[] = [];

        if (!values.title) missing.push("Event title");
        if (!values.category_slug) missing.push("Category");
        if (!values.short_description) missing.push("Short description");
        if (!values.description) missing.push("Full description");
        if (!values.venue_name) missing.push("Venue name");
        if (!values.venue_address) missing.push("Venue address");
        if (!values.venue_city) missing.push("City");
        if (!values.start_date) missing.push("Start date");
        if (!values.end_date) missing.push("End date");
        if (!values.start_time) missing.push("Start time");
        if (!values.end_time) missing.push("End time");
        if (!values.max_attendees) missing.push("Maximum attendees");
        if (!values.payment_profile_id) missing.push("Payment profile");
        if (!values.featured_image) missing.push("Featured image");
        if (!values.ticket_types || values.ticket_types.length === 0) missing.push("At least one ticket type");

        if (values.is_recurring && values.recurrence_pattern) {
            const pattern = values.recurrence_pattern as any;
            if (!pattern.frequency) {
                missing.push("Recurrence frequency");
            }
        }

        return missing;
    };

    const handleSubmit = async (values: EventFormValues) => {
        try {
            setIsSubmitting(true);

            const formattedValues = {
                ...values,
                start_time: formatTime(values.start_time),
                end_time: formatTime(values.end_time),
            };

            const payload = buildEventFormData({
                ...formattedValues,
                max_attendees: parseInt(formattedValues.max_attendees),
                venue_latitude: formattedValues.venue_latitude || undefined,
                venue_longitude: formattedValues.venue_longitude || undefined,
                additional_images: (formattedValues.additional_images || []).filter((img): img is string => !!img),
                ticket_types: formattedValues.ticket_types.map((t) => ({
                    ...t,
                    quantity: parseInt(t.quantity),
                    min_purchase: parseInt(t.min_purchase),
                    max_purchase: t.max_purchase ? parseInt(t.max_purchase) : undefined,
                    available_from: t.available_from || undefined,
                    available_until: t.available_until || undefined,
                })),
            });

            const result = await createEvent(payload);

            Alert.alert("Success!", "Event created successfully", [
                {
                    text: "OK",
                    onPress: () => router.replace(`/dashboard/events/${result.slug}`),
                },
            ]);
        } catch (error: any) {
            console.error("Error creating event:", error);
            Alert.alert("Error", error.message || "Failed to create event. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppForm
            initialValues={initialValues}
            validationSchema={eventCreationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, isValid, setFieldValue }) => {
                // Keep the screen's ref in sync so the lifted modal can reach
                // setFieldValue without prop-drilling through the FlatList.
                formContextRef.current = {
                    setFieldValue,
                    ticketTypes: values.ticket_types,
                };

                const missingFields = getMissingFields(values);
                const canSubmit = isValid && missingFields.length === 0;

                return (
                    <>
                        <FormLoader visible={isSubmitting} />

                        <FlatList
                            data={[{ key: 'form-content' }]}
                            keyExtractor={(item) => item.key}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    tintColor={colors.accent}
                                />
                            }
                            keyboardShouldPersistTaps="handled"
                            renderItem={() => (
                                <View className="gap-6 pb-10">
                                    {/* Basic Info */}
                                    <EventBasicInfoSection />

                                    <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                    {/* Venue */}
                                    <EventVenueSection />

                                    <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                    {/* Date & Time */}
                                    <EventDateTimeSection />

                                    <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                    {/* Event Type */}
                                    <EventTypeSection />

                                    <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                    {/* Images */}
                                    <EventImagesSection />

                                    <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                    {/* Tickets — button calls up to screen via prop */}
                                    <EventTicketTypesSection
                                        onOpenModal={onOpenModal}
                                        ticketTypes={values.ticket_types}
                                        setFieldValue={setFieldValue}
                                    />

                                    <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                    {/* Capacity */}
                                    <EventCapacitySection />

                                    <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                    {/* Payment Profile */}
                                    <EventPaymentProfileSection />

                                    <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                    {/* Publishing */}
                                    <EventPublishSection />

                                    {/* Form Status */}
                                    {!canSubmit && !isSubmitting && (
                                        <View
                                            className="p-4 rounded-lg border-2"
                                            style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                                        >
                                            <View className="flex-row items-start gap-3">
                                                <Ionicons name="alert-circle" size={18} color={colors.accent} style={{ marginTop: 2 }} />
                                                <View className="flex-1">
                                                    <AppText styles="text-sm text-white mb-2" font="font-ibold">
                                                        Complete Required Fields
                                                    </AppText>
                                                    <AppText styles="text-xs text-white mb-2" font="font-iregular" style={{ opacity: 0.8 }}>
                                                        Please fill in the following:
                                                    </AppText>
                                                    <View className="gap-1">
                                                        {missingFields.slice(0, 5).map((field, index) => (
                                                            <AppText key={index} styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.8 }}>
                                                                • {field}
                                                            </AppText>
                                                        ))}
                                                        {missingFields.length > 5 && (
                                                            <AppText styles="text-xs text-white" font="font-isemibold" style={{ opacity: 0.9 }}>
                                                                ...and {missingFields.length - 5} more
                                                            </AppText>
                                                        )}
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )}

                                    {/* All Set Message */}
                                    {canSubmit && !isSubmitting && (
                                        <View
                                            className="p-4 rounded-lg border-2"
                                            style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                                        >
                                            <View className="flex-row items-center gap-3">
                                                <Ionicons name="checkmark-circle" size={18} color={colors.accent50} />
                                                <AppText styles="text-sm text-white" font="font-ibold">
                                                    All set! Ready to create your event.
                                                </AppText>
                                            </View>
                                        </View>
                                    )}

                                    {/* Submit Button */}
                                    <View className="pt-4 border-t" style={{ borderColor: colors.accent + "4D" }}>
                                        <SubmitButton
                                            title={values.is_published ? "Create & Publish Event" : "Create Draft Event"}
                                        />
                                    </View>

                                    {/* Helper Text */}
                                    <AppText styles="text-xs text-white text-center" font="font-iregular" style={{ opacity: 0.6 }}>
                                        By creating this event, you agree to our Terms of Service
                                    </AppText>
                                </View>
                            )}
                        />
                    </>
                );
            }}
        </AppForm>
    );
};

export default CreateEventForm;