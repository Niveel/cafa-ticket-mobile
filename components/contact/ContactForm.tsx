import { View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import AppFormField from "../form/AppFormField";
import SubmitButton from "../form/SubmitButton";
import AppErrorMessage from "../form/AppErrorMessage";
import FormLoader from "../form/FormLoader";
import AppText from "@/components/ui/AppText";
import AppForm from "@/components/form/AppForm";
import { useAuth } from "@/context";
import {
    ContactFormLoggedInValidationSchema,
    ContactFormGuestValidationSchema,
} from "@/data/validationSchema";
import client from "@/lib/client";
import colors from "@/config/colors";

type ContactFormLoggedInValues = {
    subject: string;
    message: string;
    phone?: string;
};

type ContactFormGuestValues = {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
};

type ContactFormValues = ContactFormLoggedInValues | ContactFormGuestValues;

const formatPhoneNumber = (phone: string): string => {
    if (phone.startsWith("0")) {
        return "+233" + phone.substring(1);
    }
    return phone;
};

const ContactForm = () => {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const isLoggedIn = !!user;
    const hasPhone = !!user?.phone_number;

    const getInitialValues = () => {
        if (isLoggedIn) {
            return {
                subject: "",
                message: "",
                ...(hasPhone ? {} : { phone: "" }),
            };
        }
        return {
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        };
    };

    const validationSchema = isLoggedIn
        ? ContactFormLoggedInValidationSchema
        : ContactFormGuestValidationSchema;

    const handleSubmit = async (values: ContactFormValues, { resetForm }: any) => {
        try {
            setIsSubmitting(true);
            setError(null);

            const payload: {
                name?: string;
                email?: string;
                phone?: string;
                subject: string;
                message: string;
            } = {
                subject: values.subject,
                message: values.message,
            };

            if (isLoggedIn && user) {
                payload.name = user.full_name;
                payload.email = user.email;

                if ("phone" in values && values.phone) {
                    payload.phone = formatPhoneNumber(values.phone);
                } else if (hasPhone) {
                    payload.phone = user.phone_number!;
                }
            } else {
                const guestValues = values as ContactFormGuestValues;
                payload.name = guestValues.name;
                payload.email = guestValues.email;
                payload.phone = formatPhoneNumber(guestValues.phone);
            }

            await client.post("/contact/", payload);

            setSuccess(true);
            resetForm();
        } catch (err: any) {
            console.error("Contact form error:", err);

            // Priority 1: Backend validation errors in details
            if (err?.response?.data?.details) {
                const details = err.response.data.details;
                const firstError = Object.values(details)[0];
                setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
                return;
            }

            // Priority 2: message / error / detail
            if (err?.response?.data?.message) {
                setError(err.response.data.message);
                return;
            }
            if (err?.response?.data?.error) {
                setError(err.response.data.error);
                return;
            }
            if (err?.response?.data?.detail) {
                setError(err.response.data.detail);
                return;
            }

            // Fallback
            setError(err?.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Success State
    if (success) {
        return (
            <View
                className="p-6 rounded-xl border-2 items-center"
                style={{ backgroundColor: "#10b981" + "1A", borderColor: "#10b981" + "33" }}
            >
                <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-4"
                    style={{ backgroundColor: "#10b981" + "33" }}
                >
                    <Ionicons name="checkmark-circle" size={36} color="#34d399" />
                </View>
                <AppText styles="text-lg text-white mb-2 text-center" font="font-ibold">
                    Message Sent Successfully!
                </AppText>
                <AppText styles="text-xs text-white text-center mb-6" font="font-iregular" style={{ opacity: 0.7 }}>
                    Thank you for contacting us. We'll get back to you as soon as possible.
                </AppText>
                <TouchableOpacity
                    onPress={() => {
                        setSuccess(false);
                        setError(null);
                    }}
                    className="px-6 py-3 rounded-xl"
                    style={{ backgroundColor: colors.accent }}
                    activeOpacity={0.8}
                >
                    <AppText styles="text-sm text-white" font="font-ibold">
                        Send Another Message
                    </AppText>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="rounded-xl p-4 border-2" style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}>
            <FormLoader visible={isSubmitting} />

            {/* Header */}
            <View className="flex-row items-center gap-3 mb-6">
                <View className="w-10 h-10 rounded-lg items-center justify-center" style={{ backgroundColor: colors.primary200 + "80" }}>
                    <Ionicons name="send-outline" size={20} color={colors.accent50} />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-white" font="font-ibold">
                        Send us a Message
                    </AppText>
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                        {isLoggedIn ? "We'll respond within 24 hours" : "Fill out the form below and we'll get back to you"}
                    </AppText>
                </View>
            </View>

            <AppErrorMessage visible={!!error} error={error || ""} />

            <AppForm
                initialValues={getInitialValues()}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                <View className="gap-4">
                    {/* Guest-only fields */}
                    {!isLoggedIn && (
                        <>
                            <AppFormField
                                name="name"
                                label="Full Name"
                                type="text"
                                placeholder="John Doe"
                                required
                            />

                            <AppFormField
                                name="email"
                                label="Email Address"
                                type="email"
                                placeholder="john@example.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                required
                            />

                            <AppFormField
                                name="phone"
                                label="Phone Number"
                                type="tel"
                                placeholder="0244486509"
                                keyboardType="phone-pad"
                                required
                            />
                        </>
                    )}

                    {/* Logged-in user without phone on file */}
                    {isLoggedIn && !hasPhone && (
                        <AppFormField
                            name="phone"
                            label="Phone Number (Optional)"
                            type="tel"
                            placeholder="0244486509"
                            keyboardType="phone-pad"
                        />
                    )}

                    {/* Common fields */}
                    <AppFormField
                        name="subject"
                        label="Subject"
                        type="text"
                        placeholder="Event inquiry, ticket issue, etc."
                        required
                    />

                    <AppFormField
                        name="message"
                        label="Message"
                        type="text"
                        placeholder="Tell us how we can help you..."
                        multiline
                        required
                    />

                    <SubmitButton title="Send Message" />
                </View>
            </AppForm>
        </View>
    );
};

export default ContactForm;