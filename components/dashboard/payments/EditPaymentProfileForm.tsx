import { View, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";

import AppForm from "../../form/AppForm";
import AppFormField from "../../form/AppFormField";
import SubmitButton from "../../form/SubmitButton";
import FormLoader from "../../form/FormLoader";
import AppText from "../../ui/AppText";
import { updatePaymentProfile } from "@/lib/dashboard";
import type { BankTransferPaymentProfile } from "@/types/payments.types";
import colors from "@/config/colors";

type Props = {
    profile: BankTransferPaymentProfile;
};

const editValidationSchema = Yup.object({
    name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name must not exceed 100 characters")
        .required("Profile name is required"),
    description: Yup.string().max(500, "Description must not exceed 500 characters"),
});

const EditPaymentProfileForm = ({ profile }: Props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: { name: string; description: string }) => {
        setIsSubmitting(true);

        try {
            await updatePaymentProfile(profile.id, {
                name: values.name,
                description: values.description || "",
            });

            Alert.alert(
                "Success",
                "Payment profile updated successfully",
                [
                    {
                        text: "OK",
                        onPress: () => router.back(),
                    },
                ],
                { cancelable: false }
            );
        } catch (err: any) {
            console.error("Error updating payment profile:", err);
            Alert.alert(
                "Error",
                err.response?.data?.message || err.message || "Failed to update payment profile"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <FormLoader visible={isSubmitting} />

            <View className="gap-6">
                {/* Account Details Display (Read-only) */}
                <View
                    className="p-4 rounded-xl border"
                    style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                >
                    <View className="mb-3">
                        <AppText styles="text-xs text-white mb-1" font="font-iregular" style={{ opacity: 0.6 }}>
                            Payment Method
                        </AppText>
                        <AppText styles="text-base text-white capitalize" font="font-ibold">
                            {profile.method.replace("_", " ")}
                        </AppText>
                    </View>

                    {/* Bank Details */}
                    <View className="gap-2 mb-3">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="person-outline" size={14} color={colors.white} style={{ opacity: 0.6 }} />
                            <AppText styles="text-sm text-white" font="font-iregular" style={{ opacity: 0.8 }}>
                                {profile.account_details.account_name}
                            </AppText>
                        </View>

                        <View className="flex-row items-center gap-2">
                            <Ionicons name="business-outline" size={14} color={colors.white} style={{ opacity: 0.6 }} />
                            <AppText styles="text-sm text-white" font="font-iregular" style={{ opacity: 0.8 }}>
                                {profile.account_details.bank_name}
                            </AppText>
                        </View>

                        <View className="flex-row items-center gap-2">
                            <Ionicons name="card-outline" size={14} color={colors.white} style={{ opacity: 0.6 }} />
                            <AppText styles="text-sm text-white" font="font-iregular" style={{ opacity: 0.8 }}>
                                {profile.account_details.account_number}
                            </AppText>
                        </View>
                    </View>

                    <View className="pt-3 border-t" style={{ borderColor: colors.accent + "1A" }}>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                            Account details cannot be changed. To use a different account, create a new payment profile.
                        </AppText>
                    </View>
                </View>

                {/* Info Message */}
                <View
                    className="p-4 rounded-xl border"
                    style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent + "4D" }}
                >
                    <View className="flex-row items-start gap-3">
                        <Ionicons name="information-circle" size={20} color={colors.accent50} style={{ marginTop: 2 }} />
                        <View className="flex-1">
                            <AppText styles="text-sm text-black mb-1" font="font-ibold">
                                Editing Profile Information
                            </AppText>
                            <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                                You can update the profile name and description to help you identify this payment method.
                            </AppText>
                        </View>
                    </View>
                </View>

                {/* Form */}
                <View
                    className="p-4 rounded-xl border"
                    style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                >
                    <AppForm
                        initialValues={{
                            name: profile.name,
                            description: profile.description || "",
                        }}
                        validationSchema={editValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        <AppFormField
                            type="text"
                            name="name"
                            label="Profile Name"
                            placeholder="e.g., My Primary Account"
                        />

                        <AppFormField
                            type="text"
                            name="description"
                            label="Description (Optional)"
                            placeholder="e.g., Main account for receiving event payments"
                            multiline
                        />

                        <SubmitButton title="Update Payment Profile" />
                    </AppForm>
                </View>
            </View>
        </>
    );
};

export default EditPaymentProfileForm;