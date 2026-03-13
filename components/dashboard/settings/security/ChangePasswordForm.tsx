import { View } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";

import AppText from "../../../ui/AppText";
import AppForm from "../../../form/AppForm";
import AppFormField from "../../../form/AppFormField";
import SubmitButton from "../../../form/SubmitButton";
import FormLoader from "../../../form/FormLoader";
import { changePassword } from "@/lib/settings";
import colors from "@/config/colors";

const ChangePasswordValidationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required").min(8, "Password must be at least 8 characters"),
    newPassword: Yup.string()
        .required("New password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: Yup.string()
        .required("Please confirm your new password")
        .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

type ChangePasswordFormValues = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const ChangePasswordForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleSubmit = async (values: ChangePasswordFormValues, { resetForm }: any) => {
        try {
            setIsSubmitting(true);
            setFeedback(null);

            await changePassword({
                current_password: values.currentPassword,
                new_password: values.newPassword,
                confirm_password: values.confirmPassword,
            });

            setFeedback({ type: "success", message: "Password changed successfully!" });
            resetForm();
        } catch (error: any) {
            console.error("Error changing password:", error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to change password";
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
                    <Ionicons name="lock-closed-outline" size={20} color={colors.accent50} />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-white font-nunbold">
                        Change Password
                    </AppText>
                    <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                        Update your account password
                    </AppText>
                </View>
            </View>

            {feedback && (
                <View
                    className="p-3 rounded-lg border mb-4"
                    style={{
                        backgroundColor: (feedback.type === "success" ? "#10b981" : colors.accent) + "1A",
                        borderColor: (feedback.type === "success" ? "#10b981" : colors.accent) + "33",
                    }}
                    accessible={true}
                    accessibilityRole="alert"
                    accessibilityLiveRegion="assertive"
                    accessibilityLabel={feedback.message}
                >
                    <View className="flex-row items-center gap-2">
                        <Ionicons
                            name={feedback.type === "success" ? "checkmark-circle" : "alert-circle"}
                            size={16}
                            color={feedback.type === "success" ? "#34d399" : colors.accent50}
                        />
                        <AppText
                            styles="text-xs"
                            style={{ color: feedback.type === "success" ? "#34d399" : colors.accent50 }}
                        >
                            {feedback.message}
                        </AppText>
                    </View>
                </View>
            )}

            <AppForm
                initialValues={{
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                }}
                onSubmit={handleSubmit}
                validationSchema={ChangePasswordValidationSchema}
            >
                <View className="gap-4">
                    {/* Current Password */}
                    <AppFormField
                        name="currentPassword"
                        label="Current Password"
                        type={currentPasswordVisible ? "text" : "password"}
                        icon={currentPasswordVisible ? "eye-off" : "eye"}
                        iconClick={() => setCurrentPasswordVisible((prev) => !prev)}
                        iconAria={currentPasswordVisible ? "Hide password" : "Show password"}
                        placeholder="Enter current password"
                        required
                    />

                    {/* New Password */}
                    <AppFormField
                        name="newPassword"
                        label="New Password"
                        type={newPasswordVisible ? "text" : "password"}
                        icon={newPasswordVisible ? "eye-off" : "eye"}
                        iconClick={() => setNewPasswordVisible((prev) => !prev)}
                        iconAria={newPasswordVisible ? "Hide password" : "Show password"}
                        placeholder="Enter new password"
                        required
                    />

                    {/* Confirm New Password */}
                    <AppFormField
                        name="confirmPassword"
                        label="Confirm New Password"
                        type={confirmPasswordVisible ? "text" : "password"}
                        icon={confirmPasswordVisible ? "eye-off" : "eye"}
                        iconClick={() => setConfirmPasswordVisible((prev) => !prev)}
                        iconAria={confirmPasswordVisible ? "Hide password" : "Show password"}
                        placeholder="Confirm new password"
                        required
                    />

                    <SubmitButton title="Change Password" />
                </View>
            </AppForm>
        </View>
    );
};

export default ChangePasswordForm;
