import { View, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";
import { router } from "expo-router";

import { AppText, AppForm, AppFormField, SubmitButton, FormLoader } from "@/components";
import { deleteAccount } from "@/lib/settings";
import colors from "@/config/colors";

const DeleteAccountValidationSchema = Yup.object().shape({
    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
    confirmation: Yup.string()
        .required("Confirmation text is required")
        .oneOf(["DELETE MY ACCOUNT"], 'You must type "DELETE MY ACCOUNT" exactly'),
});

type DeleteAccountFormValues = {
    password: string;
    confirmation: string;
};

const warningItems = [
    "All your personal data will be deleted within 30 days",
    "You will lose access to all purchased tickets",
    "Your events will be removed (if no tickets sold)",
    "This action cannot be reversed",
    "Transaction records may be anonymized and retained for legal purposes (7 years)",
];

const DeleteAccountSection = () => {
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleDelete = async (values: DeleteAccountFormValues, { resetForm }: any) => {
        try {
            setIsSubmitting(true);

            await deleteAccount({
                password: values.password,
                confirmation: values.confirmation,
            });

            Alert.alert(
                "Account Deleted",
                "Your account has been successfully deleted. All personal data will be removed within 30 days.",
                [
                    {
                        text: "OK",
                        onPress: () => router.replace("/"),
                    },
                ]
            );
        } catch (error: any) {
            console.error("Error deleting account:", error);
            const errorMessage =
                error.response?.data?.message || error.response?.data?.error || error.message || "Failed to delete account";
            Alert.alert("Error", errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="rounded-xl p-4 border-2" style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}>
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-4">
                <View className="w-10 h-10 rounded-lg items-center justify-center" style={{ backgroundColor: "#ef4444" + "33" }}>
                    <Ionicons name="trash-outline" size={20} color="#f87171" />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-white" font="font-ibold">
                        Delete Account
                    </AppText>
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </AppText>
                </View>
            </View>

            {/* Warning Banner */}
            <View
                className="p-4 rounded-lg border mb-4"
                style={{ backgroundColor: "#ef4444" + "1A", borderColor: "#ef4444" + "33" }}
            >
                <View className="flex-row items-start gap-3">
                    <Ionicons name="warning-outline" size={20} color="#f87171" style={{ marginTop: 2 }} />
                    <View className="flex-1">
                        <AppText styles="text-sm mb-2" font="font-ibold" style={{ color: "#f87171" }}>
                            Warning: This Action is Permanent
                        </AppText>
                        <View className="gap-1">
                            {warningItems.map((item, index) => (
                                <AppText key={index} styles="text-xs" font="font-iregular" style={{ color: "#fca5a5" }}>
                                    • {item}
                                </AppText>
                            ))}
                        </View>
                    </View>
                </View>
            </View>

            {!showForm ? (
                /* Reveal Button */
                <TouchableOpacity
                    onPress={() => setShowForm(true)}
                    className="flex-row items-center gap-2 px-4 py-3 rounded-lg border self-start"
                    style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="trash-outline" size={16} color="#f87171" />
                    <AppText styles="text-sm" font="font-ibold" style={{ color: "#f87171" }}>
                        Delete My Account
                    </AppText>
                </TouchableOpacity>
            ) : (
                /* Confirmation Form */
                <View className="gap-4">
                    {/* Instruction */}
                    <View
                        className="p-3 rounded-lg border"
                        style={{ backgroundColor: "#ef4444" + "1A", borderColor: colors.accent }}
                    >
                        <AppText styles="text-xs" font="font-iregular" style={{ color: "#fca5a5" }}>
                            To confirm account deletion, please enter your password and type "DELETE MY ACCOUNT" exactly as shown.
                        </AppText>
                    </View>

                    <AppForm
                        initialValues={{
                            password: "",
                            confirmation: "",
                        }}
                        onSubmit={handleDelete}
                        validationSchema={DeleteAccountValidationSchema}
                    >
                        <FormLoader visible={isSubmitting} />

                        <View className="gap-4">
                            {/* Password */}
                            <AppFormField
                                name="password"
                                label="Your Password"
                                type={passwordVisible ? "text" : "password"}
                                icon={passwordVisible ? "eye-off" : "eye"}
                                iconClick={() => setPasswordVisible((prev) => !prev)}
                                iconAria={passwordVisible ? "Hide password" : "Show password"}
                                placeholder="Enter your password"
                                required
                            />

                            {/* Confirmation Text */}
                            <View>
                                <AppFormField
                                    name="confirmation"
                                    label="Type DELETE MY ACCOUNT to confirm"
                                    type="text"
                                    placeholder="DELETE MY ACCOUNT"
                                    autoCapitalize="characters"
                                    required
                                />
                                <AppText styles="text-xs text-white mt-1" font="font-iregular" style={{ opacity: 0.5 }}>
                                    Must be typed exactly as shown (case sensitive)
                                </AppText>
                            </View>

                            {/* Buttons */}
                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    onPress={() => setShowForm(false)}
                                    disabled={isSubmitting}
                                    className="flex-1 py-4 rounded-xl items-center"
                                    style={{
                                        backgroundColor: colors.primary200,
                                        borderWidth: 2,
                                        borderColor: colors.accent + "4D",
                                        opacity: isSubmitting ? 0.5 : 1,
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <AppText styles="text-sm text-white" font="font-ibold">
                                        Cancel
                                    </AppText>
                                </TouchableOpacity>

                                <View className="flex-1">
                                    <SubmitButton title={isSubmitting ? "Deleting..." : "Delete Account"} />
                                </View>
                            </View>
                        </View>
                    </AppForm>
                </View>
            )}
        </View>
    );
};

export default DeleteAccountSection;