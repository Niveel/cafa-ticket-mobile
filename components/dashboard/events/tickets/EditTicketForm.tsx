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
import type { EventTicketType } from "@/types/dash-events.types";
import colors from "@/config/colors";

interface EditTicketFormProps {
    ticket: EventTicketType;
    eventSlug: string;
}

const EditTicketForm = ({ ticket, eventSlug }: EditTicketFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasSales = ticket.tickets_sold > 0;

    const initialValues: TicketTypeFormValues = {
        name: ticket.name,
        description: ticket.description,
        price: ticket.price,
        quantity: ticket.quantity.toString(),
        min_purchase: ticket.min_purchase.toString(),
        max_purchase: ticket.max_purchase.toString(),
        available_from: ticket.available_from || "",
        available_until: ticket.available_until || "",
    };

    const handleSubmit = async (values: TicketTypeFormValues) => {
        try {
            setIsSubmitting(true);

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
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/events/${eventSlug}/tickets/${ticket.id}/edit/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(ticketData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                let errorMessage = "Failed to update ticket type. Please try again.";

                if (data.detail) {
                    errorMessage = data.detail;
                } else if (data.error) {
                    errorMessage = data.error;
                } else if (data.message) {
                    errorMessage = data.message;
                }

                if (data.name) {
                    errorMessage = `Name: ${Array.isArray(data.name) ? data.name[0] : data.name}`;
                } else if (data.price) {
                    errorMessage = `Price: ${Array.isArray(data.price) ? data.price[0] : data.price}`;
                } else if (data.quantity) {
                    errorMessage = `Quantity: ${Array.isArray(data.quantity) ? data.quantity[0] : data.quantity}`;
                }

                throw new Error(errorMessage);
            }

            Alert.alert("Success!", "Ticket type updated successfully", [
                {
                    text: "OK",
                    onPress: () => router.replace(`/dashboard/events/${eventSlug}`),
                },
            ]);
        } catch (error: any) {
            console.error("Error updating ticket type:", error);
            Alert.alert("Error", error.message || "Failed to update ticket type. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.replace(`/dashboard/events/${eventSlug}`);
    };

    return (
        <View className="flex-1">
            {/* Warning Banner */}
            {hasSales && (
                <View
                    className="p-4 rounded-xl border-2 mb-4"
                    style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                >
                    <View className="flex-row items-start gap-3">
                        <Ionicons name="information-circle" size={24} color={colors.accent} style={{ marginTop: 2 }} />
                        <View className="flex-1">
                            <AppText styles="text-sm text-white mb-1" font="font-ibold">
                                Ticket Has Sales
                            </AppText>
                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.8 }}>
                                {ticket.tickets_sold} ticket{ticket.tickets_sold > 1 ? "s" : ""} sold. Be careful when
                                editing as changes may affect existing ticket holders.
                            </AppText>
                        </View>
                    </View>
                </View>
            )}

            {/* Stats Grid */}
            <View className="flex-row flex-wrap gap-2 mb-4">
                <View
                    className="flex-1 p-3 rounded-lg"
                    style={{ backgroundColor: colors.primary100, minWidth: "48%" }}
                >
                    <AppText styles="text-xs text-white mb-1" font="font-iregular" style={{ opacity: 0.6 }}>
                        Price
                    </AppText>
                    <AppText styles="text-base text-white" font="font-ibold" style={{ color: colors.accent50 }}>
                        GH₵ {parseFloat(ticket.price).toLocaleString("en-GH")}
                    </AppText>
                </View>

                <View
                    className="flex-1 p-3 rounded-lg"
                    style={{ backgroundColor: colors.primary100, minWidth: "48%" }}
                >
                    <AppText styles="text-xs text-white mb-1" font="font-iregular" style={{ opacity: 0.6 }}>
                        Sold
                    </AppText>
                    <AppText styles="text-base text-white" font="font-ibold">
                        {ticket.tickets_sold}
                    </AppText>
                </View>

                <View
                    className="flex-1 p-3 rounded-lg"
                    style={{ backgroundColor: colors.primary100, minWidth: "48%" }}
                >
                    <AppText styles="text-xs text-white mb-1" font="font-iregular" style={{ opacity: 0.6 }}>
                        Remaining
                    </AppText>
                    <AppText styles="text-base text-white" font="font-ibold">
                        {ticket.tickets_remaining}
                    </AppText>
                </View>

                <View
                    className="flex-1 p-3 rounded-lg"
                    style={{ backgroundColor: colors.primary100, minWidth: "48%" }}
                >
                    <AppText styles="text-xs text-white mb-1" font="font-iregular" style={{ opacity: 0.6 }}>
                        Revenue
                    </AppText>
                    <AppText styles="text-base text-white" font="font-ibold" style={{ color: colors.accent50 }}>
                        GH₵ {parseFloat(ticket.revenue).toLocaleString("en-GH")}
                    </AppText>
                </View>
            </View>

            <AppForm
                initialValues={initialValues}
                validationSchema={ticketTypeSchema}
                onSubmit={handleSubmit}
                enableReinitialize
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
                                            Update ticket information
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
                                            label="Total Quantity"
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
                                        {hasSales
                                            ? `Minimum quantity: ${ticket.tickets_sold} (already sold) • Maximum: 1,000,000`
                                            : "Minimum price: GH₵ 10.00 • Maximum quantity: 1,000,000"}
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
                                        onPress={handleCancel}
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
                                            Cancel
                                        </AppText>
                                    </TouchableOpacity>

                                    <SubmitButton title="Update Ticket Type" />
                                </View>

                                {/* Helper Text */}
                                <AppText
                                    styles="text-xs text-white text-center"
                                    font="font-iregular"
                                    style={{ opacity: 0.6 }}
                                >
                                    Changes will be applied immediately after saving
                                </AppText>
                            </View>
                        </ScrollView>
                    </>
                )}
            </AppForm>
        </View>
    );
};

export default EditTicketForm;