import { View, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";

import AppText from "../../../ui/AppText";
import AppForm from "../../../form/AppForm";
import AppFormField from "../../../form/AppFormField";
import SubmitButton from "../../../form/SubmitButton";
import FormLoader from "../../../form/FormLoader";
import { getCurrentUser } from "@/lib/auth";
import { changeUsername } from "@/lib/settings";
import type { CurrentUser } from "@/types/general.types";
import colors from "@/config/colors";

const ChangeUsernameValidationSchema = Yup.object().shape({
    newUsername: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must not exceed 30 characters")
        .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
});

type ChangeUsernameFormValues = {
    newUsername: string;
    password: string;
};

const ChangeUsernameForm = () => {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getCurrentUser();
            setCurrentUser(user);
        };
        fetchUser();
    }, []);

    const handleSubmit = async (values: ChangeUsernameFormValues, { resetForm }: any) => {
        try {
            setIsSubmitting(true);

            await changeUsername({
                username: values.newUsername,
                password: values.password,
            });

            Alert.alert("Success!", "Username changed successfully", [{ text: "OK" }]);
            resetForm();

            // Refresh user data
            const updatedUser = await getCurrentUser();
            setCurrentUser(updatedUser);
        } catch (error: any) {
            console.error("Error changing username:", error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to change username";
            Alert.alert("Error", errorMessage);
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
                    <Ionicons name="person-outline" size={20} color={colors.accent50} />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-white font-nunbold">
                        Change Username
                    </AppText>
                    <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                        Current username:{" "}
                        <AppText styles="font-nunbold" style={{ opacity: 1 }}>
                            @{currentUser?.username || "..."}
                        </AppText>
                    </AppText>
                </View>
            </View>

            <AppForm
                initialValues={{
                    newUsername: "",
                    password: "",
                }}
                onSubmit={handleSubmit}
                validationSchema={ChangeUsernameValidationSchema}
            >
                <View className="gap-4">
                    {/* New Username */}
                    <View>
                        <AppFormField
                            name="newUsername"
                            label="New Username"
                            type="text"
                            placeholder="Enter new username"
                            autoCapitalize="none"
                            required
                        />
                        <AppText styles="text-xs text-white mt-1" style={{ opacity: 0.5 }}>
                            Only letters, numbers, and underscores (3-30 characters)
                        </AppText>
                    </View>

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

                    <SubmitButton title="Change Username" />
                </View>
            </AppForm>
        </View>
    );
};

export default ChangeUsernameForm;