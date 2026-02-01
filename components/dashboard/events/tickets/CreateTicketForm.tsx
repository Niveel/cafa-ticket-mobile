import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";

import {
    AppText,
    AppForm,
    AppFormField,
    SubmitButton,
    FormLoader,
} from "@/components";
import { ticketTypeSchema, type TicketTypeFormValues } from "@/data/eventCreationSchema";
import colors from "@/config/colors";

interface CreateTicketFormProps {
    eventSlug: string;
}

const CreateTicketForm = ({ eventSlug }: CreateTicketFormProps) => {
    const [createdTicketsCount, setCreatedTicketsCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialValues: TicketTypeFormValues = {
        name: "",
        description: "",
        price: "",
        quantity: "",
        min_purchase: "1",
        max_purchase: "",
        available_from: "",
        available_until: "",
    };

    const handleSubmit = async (values: TicketTypeFormValues, { resetForm }: any) => {
        try {
            setIsSubmitting(true);

            // Transform data for API
            const ticketData = {
                name: values.name,
                description: values.description,
                price: values.price,
                quantity: parseInt(values.quantity),
                min_purchase: parseInt(values.min_purchase),
                max_purchase: values.max_purchase ? parseInt(values.max_purchase) : undefined,
                available_from: values.available_from || undefined,
                available_until: values.available_until || undefined,
            };

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/events/${eventSlug}/tickets/create/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(ticketData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                let errorMessage = "Failed to create ticket type. Please try again.";

                // Priority: Show backend message first
                if (data.message) {
                    errorMessage = data.message;
                } else if (data.error) {
                    errorMessage = data.error;
                } else if (data.detail) {
                    errorMessage = data.detail;
                }

                // Field-specific errors
                if (!data.message && !data.error && !data.detail) {
                    if (data.name) {
                        errorMessage = `Name: ${Array.isArray(data.name) ? data.name[0] : data.name}`;
                    } else if (data.price) {
                        errorMessage = `Price: ${Array.isArray(data.price) ? data.price[0] : data.price}`;
                    } else if (data.quantity) {
                        errorMessage = `Quantity: ${Array.isArray(data.quantity) ? data.quantity[0] : data.quantity}`;
                    }
                }

                throw new Error(errorMessage);
            }

            // Success
            setCreatedTicketsCount((prev) => prev + 1);

            Alert.alert(
                "Success!",
                "Ticket type created successfully. Add another or tap Done to return.",
                [
                    { text: "Add Another", onPress: () => resetForm() },
                    {
                        text: "Done",
                        onPress: () => router.replace(`/dashboard/events/${eventSlug}`),
                    },
                ]
            );

            resetForm();
        } catch (error: any) {
            console.error("Error creating ticket type:", error);
            Alert.alert("Error", error.message || "Failed to create ticket type. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDone = () => {
        router.replace(`/dashboard/events/${eventSlug}`);
    };

    return (
        <View className="flex-1">
            {/* Success Counter */}
            {createdTicketsCount > 0 && (
                <View
                    className="p-4 rounded-xl border-2 mb-4"
                    style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                >
                    <View className="flex-row items-center gap-3">
                        <Ionicons name="checkmark-circle" size={24} color={colors.accent50} />
                        <View className="flex-1">
                            <AppText styles="text-sm text-white mb-1" font="font-ibold">
                                {createdTicketsCount} Ticket Type{createdTicketsCount > 1 ? "s" : ""} Created
                            </AppText>
                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.8 }}>
                                Add another or tap Done to return
                            </AppText>
                        </View>
                        <TouchableOpacity
                            onPress={handleDone}
                            className="px-4 py-2 rounded-lg"
                            style={{ backgroundColor: colors.accent }}
                            activeOpacity={0.8}
                        >
                            <AppText styles="text-sm text-white" font="font-ibold">
                                Done
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <AppForm
                initialValues={initialValues}
                validationSchema={ticketTypeSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <>
                        <FormLoader visible={isSubmitting} />

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="gap-6 pb-6">
                                {/* Section Header */}
                                <View className="flex-row items-center gap-3">
                                    <View
                                        className="w-10 h-10 rounded-lg items-center justify-center"
                                        style={{ backgroundColor: colors.primary200 + "80" }}
                                    >
                                        <Ionicons name="ticket-outline" size={20} color={colors.accent50} />
                                    </View>
                                    <View className="flex-1">
                                        <AppText styles="text-base text-white" font="font-ibold">
                                            Ticket Type Details
                                        </AppText>
                                        <AppText
                                            styles="text-xs text-white"
                                            font="font-iregular"
                                            style={{ opacity: 0.6 }}
                                        >
                                            Fill in the details for your ticket type
                                        </AppText>
                                    </View>
                                </View>

                                {/* Basic Info */}
                                <View className="gap-4">
                                    <AppText styles="text-sm text-white" font="font-ibold">
                                        Basic Information
                                    </AppText>

                                    <AppFormField
                                        name="name"
                                        label="Ticket Name"
                                        placeholder="e.g., Early Bird, VIP, Regular"
                                        required
                                    />

                                    <AppFormField
                                        name="description"
                                        label="Description"
                                        placeholder="Describe what this ticket includes..."
                                        multiline
                                        rows={3}
                                        required
                                    />
                                </View>

                                {/* Pricing & Quantity */}
                                <View className="gap-4">
                                    <AppText styles="text-sm text-white" font="font-ibold">
                                        Pricing & Quantity
                                    </AppText>

                                    <View className="gap-3">
                                        <AppFormField
                                            name="price"
                                            label="Price (GH₵)"
                                            type="number"
                                            placeholder="50.00"
                                            keyboardType="decimal-pad"
                                            required
                                        />

                                        <AppFormField
                                            name="quantity"
                                            label="Available Quantity"
                                            type="number"
                                            placeholder="100"
                                            keyboardType="numeric"
                                            required
                                        />
                                    </View>

                                    <AppText
                                        styles="text-xs text-white"
                                        font="font-iregular"
                                        style={{ opacity: 0.6 }}
                                    >
                                        Minimum price: GH₵ 10.00 • Maximum quantity: 1,000,000
                                    </AppText>
                                </View>

                                {/* Purchase Limits */}
                                <View className="gap-4">
                                    <AppText styles="text-sm text-white" font="font-ibold">
                                        Purchase Limits
                                    </AppText>

                                    <View className="gap-3">
                                        <AppFormField
                                            name="min_purchase"
                                            label="Minimum Purchase"
                                            type="number"
                                            placeholder="1"
                                            keyboardType="numeric"
                                            required
                                        />

                                        <AppFormField
                                            name="max_purchase"
                                            label="Maximum Purchase"
                                            type="number"
                                            placeholder="10"
                                            keyboardType="numeric"
                                            required
                                        />
                                    </View>

                                    <AppText
                                        styles="text-xs text-white"
                                        font="font-iregular"
                                        style={{ opacity: 0.6 }}
                                    >
                                        Per transaction limits
                                    </AppText>
                                </View>

                                {/* Availability Period */}
                                <View className="gap-4">
                                    <View>
                                        <AppText styles="text-sm text-white mb-2" font="font-ibold">
                                            Availability Period (Optional)
                                        </AppText>
                                        <AppText
                                            styles="text-xs text-white"
                                            font="font-iregular"
                                            style={{ opacity: 0.6 }}
                                        >
                                            Set a limited time window for this ticket type. Leave empty for no
                                            restrictions.
                                        </AppText>
                                    </View>

                                    <View className="gap-3">
                                        <AppFormField
                                            name="available_from"
                                            label="Available From"
                                            type="date"
                                        />

                                        <AppFormField
                                            name="available_until"
                                            label="Available Until"
                                            type="date"
                                        />
                                    </View>
                                </View>

                                {/* Action Buttons */}
                                <View className="gap-3 pt-4 border-t" style={{ borderColor: colors.accent + "4D" }}>
                                    <TouchableOpacity
                                        onPress={handleDone}
                                        disabled={isSubmitting}
                                        className="px-6 py-4 rounded-xl border-2"
                                        style={{
                                            backgroundColor: colors.primary100,
                                            borderColor: colors.accent + "4D",
                                            opacity: isSubmitting ? 0.5 : 1,
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <AppText styles="text-sm text-white text-center" font="font-ibold">
                                            {createdTicketsCount > 0 ? "Done" : "Cancel"}
                                        </AppText>
                                    </TouchableOpacity>

                                    <SubmitButton
                                        title={
                                            createdTicketsCount > 0
                                                ? "Add Another Ticket"
                                                : "Create Ticket Type"
                                        }
                                    />
                                </View>
                            </View>
                        </ScrollView>
                    </>
                )}
            </AppForm>
        </View>
    );
};

export default CreateTicketForm;