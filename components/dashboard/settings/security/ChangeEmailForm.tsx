import { View } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";

import AppText from "../../../ui/AppText";
import AppForm from "../../../form/AppForm";
import AppFormField from "../../../form/AppFormField";
import SubmitButton from "../../../form/SubmitButton";
import FormLoader from "../../../form/FormLoader";
import { changeEmail } from "@/lib/settings";
import colors from "@/config/colors";

const ChangeEmailValidationSchema = Yup.object().shape({
    newEmail: Yup.string()
        .required("Email is required")
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Please enter a valid email address"),
    password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
});

type ChangeEmailFormValues = {
    newEmail: string;
    password: string;
};

const ChangeEmailForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [maskedEmail, setMaskedEmail] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "error"; message: string } | null>(null);

    const handleSubmit = async (values: ChangeEmailFormValues, { resetForm }: any) => {
        try {
            setIsSubmitting(true);
            setFeedback(null);

            await changeEmail({
                new_email: values.newEmail,
                password: values.password,
            });

            // Mask email
            const masked = values.newEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3");
            setMaskedEmail(masked);
            setVerificationSent(true);
            resetForm();
        } catch (error: any) {
            console.error("Error changing email:", error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to send verification link";
            setFeedback({ type: "error", message: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="rounded-xl p-4 border-2" style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}>
            <FormLoader visible={isSubmitting} />

            {/* Header */}
            <View className="flex-row items-center gap-3 mb-6">
                <View className="w-10 h-10 rounded-lg items-center justify-center" style={{ backgroundColor: colors.primary200 + "80" }}>
                    <Ionicons name="mail-outline" size={20} color={colors.accent50} />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-white font-nunbold">
                        Change Email Address
                    </AppText>
                    <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                        Update your account email
                    </AppText>
                </View>
            </View>

            {feedback && (
                <View
                    className="p-3 rounded-lg border mb-4"
                    style={{
                        backgroundColor: colors.accent + "1A",
                        borderColor: colors.accent + "33",
                    }}
                    accessible={true}
                    accessibilityRole="alert"
                    accessibilityLiveRegion="assertive"
                    accessibilityLabel={feedback.message}
                >
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="alert-circle" size={16} color={colors.accent50} />
                        <AppText styles="text-xs" style={{ color: colors.accent50 }}>
                            {feedback.message}
                        </AppText>
                    </View>
                </View>
            )}

            {!verificationSent ? (
                <AppForm
                    initialValues={{
                        newEmail: "",
                        password: "",
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={ChangeEmailValidationSchema}
                >
                    <View className="gap-4">
                        {/* New Email */}
                        <AppFormField
                            name="newEmail"
                            label="New Email Address"
                            type="email"
                            placeholder="Enter new email address"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            required
                        />

                        {/* Password Confirmation */}
                        <AppFormField
                            name="password"
                            label="Current Password"
                            type={passwordVisible ? "text" : "password"}
                            icon={passwordVisible ? "eye-off" : "eye"}
                            iconClick={() => setPasswordVisible((prev) => !prev)}
                            iconAria={passwordVisible ? "Hide password" : "Show password"}
                            placeholder="Confirm your password"
                            required
                        />

                        {/* Info */}
                        <View className="p-3 rounded-lg border" style={{ backgroundColor: colors.primary200 + "80", borderColor: colors.accent + "4D" }}>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="information-circle-outline" size={16} color={colors.accent50} style={{ marginTop: 2 }} />
                                <AppText styles="text-xs text-white" style={{ opacity: 0.7, flex: 1 }}>
                                    You'll receive a verification link at your new email address. Your old email will remain
                                    active until you verify the new one.
                                </AppText>
                            </View>
                        </View>

                        <SubmitButton title="Change Email" />
                    </View>
                </AppForm>
            ) : (
                /* Success State */
                <View className="gap-4">
                    <View
                        className="p-4 rounded-lg border"
                        style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                        accessible={true}
                        accessibilityRole="alert"
                        accessibilityLiveRegion="assertive"
                        accessibilityLabel={`Verification link sent to ${maskedEmail}. Please check your inbox to complete email change.`}
                    >
                        <View className="flex-row items-start gap-3">
                            <Ionicons name="checkmark-circle" size={20} color={colors.accent50} style={{ marginTop: 2 }} />
                            <View className="flex-1">
                                <AppText styles="text-sm text-white mb-2 font-nunbold" style={{ color: colors.accent50 }}>
                                    Verification Link Sent!
                                </AppText>
                                <AppText styles="text-xs text-white" style={{ opacity: 0.8 }}>
                                    We've sent a verification link to <AppText styles="font-nunbold">{maskedEmail}</AppText>. Please
                                    check your inbox and click the link to complete the email change.
                                </AppText>
                            </View>
                        </View>
                    </View>

                    <View className="p-3 rounded-lg border" style={{ backgroundColor: colors.primary200 + "80", borderColor: colors.accent + "4D" }}>
                        <AppText styles="text-xs text-white" style={{ opacity: 0.7 }}>
                            Didn't receive the email? Check your spam folder or{" "}
                            <AppText
                                styles="text-xs font-nunbold"
                                style={{ color: colors.accent50 }}
                                onPress={() => setVerificationSent(false)}
                            >
                                try again
                            </AppText>
                        </AppText>
                    </View>
                </View>
            )}
        </View>
    );
};

export default ChangeEmailForm;
