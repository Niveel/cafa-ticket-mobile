import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";

import {
    Screen,
    AppText,
    FormLoader,
    RequireAuth,
    ImageUpload,
    AppFormField,
    AppForm,
    SubmitButton,
    AppErrorMessage,
} from "@/components";
import { useAuth } from "@/context";
import { ProfileEditValidationSchema, ProfileEditFormValues } from "@/data/validationSchema";
import colors from "@/config/colors";
import client from "@/lib/client";
import { getFullImageUrl } from "@/utils/imageUrl";
import { useCountries } from "@/hooks/useCountries";

const isLocalFileUri = (uri: string) => uri.startsWith("file://") || uri.startsWith("content://");

const getMimeType = (uri: string) => {
    const lower = uri.toLowerCase();
    if (lower.endsWith(".png")) return "image/png";
    if (lower.endsWith(".webp")) return "image/webp";
    if (lower.endsWith(".heic")) return "image/heic";
    return "image/jpeg";
};

const EditProfileScreen = () => {
    const { user, refreshUser } = useAuth();
    const { countries, isLoading: isCountriesLoading } = useCountries();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const countryOptions = useMemo(
        () => countries.map((country) => ({ label: country.name, value: country.name })),
        [countries]
    );

    const handleSubmit = async (values: ProfileEditFormValues) => {
        try {
            setIsLoading(true);
            setError(null);
            setSubmitSuccess(false);

            if (!user) return;

            const originalImage = getFullImageUrl(user.profile_image);
            const hasNewImage = !!values.profile_image && values.profile_image !== originalImage;

            // Prepare payload
            const updateData: any = {};

            if (values.full_name?.trim()) updateData.full_name = values.full_name.trim();

            // Format phone number
            if (values.phone_number?.trim()) {
                let phoneNumber = values.phone_number.trim();
                if (/^0\d{9}$/.test(phoneNumber)) {
                    phoneNumber = '+233' + phoneNumber.substring(1);
                }
                updateData.phone_number = phoneNumber;
            }

            if (values.bio?.trim()) updateData.bio = values.bio.trim();
            if (values.city?.trim()) updateData.city = values.city.trim();
            if (values.country?.trim()) updateData.country = values.country.trim();

            if (hasNewImage && isLocalFileUri(values.profile_image!)) {
                const imageUri = values.profile_image!;
                const formData = new FormData();

                Object.entries(updateData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, String(value));
                    }
                });

                formData.append("profile_image", {
                    uri: imageUri,
                    name: imageUri.split("/").pop() || `profile-${Date.now()}.jpg`,
                    type: getMimeType(imageUri),
                } as any);

                await client.patch("/auth/profile/", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await client.patch("/auth/profile/", updateData);
            }

            await refreshUser();
            setSubmitSuccess(true);
            setTimeout(() => router.back(), 900);

        } catch (err: any) {
            console.error("Error updating profile:", err);

            if (err?.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err?.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError(err?.message || "Failed to update profile. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Screen statusBarStyle="dark-content" statusBarBg={colors.white}>
            <RequireAuth>
                <FormLoader visible={isLoading} />

                {/* Header */}
                <View className="flex-row items-center gap-3 px-3 py-2 border-b border-accent/20">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-9 h-9 rounded-lg items-center justify-center"
                        style={{ backgroundColor: colors.primary200, borderWidth: 1, borderColor: colors.accent + "4D" }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="chevron-back" size={20} color="#fff" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <AppText styles="text-lg font-nunbold" style={{ color: colors.primary }}>
                            Edit Profile
                        </AppText>
                        <AppText styles="text-xs text-black">
                            Update your details and profile image
                        </AppText>
                    </View>
                </View>

                {user && (
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior="padding"
                        keyboardVerticalOffset={0}
                    >
                        <ScrollView
                            className="flex-1"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 28 }}
                        >
                            <View className="px-3 pt-3">
                                <AppForm
                                    initialValues={{
                                        full_name: user.full_name || "",
                                        phone_number: user.phone_number || "",
                                        bio: user.bio || "",
                                        city: user.city || "",
                                        country: user.country || "Ghana",
                                        profile_image: getFullImageUrl(user.profile_image) || null,
                                    }}
                                    onSubmit={handleSubmit}
                                    validationSchema={ProfileEditValidationSchema}
                                >
                                    {({ values, setFieldValue, errors, touched }) => (
                                        <>
                                        {/* Error Message */}
                                        {error && (
                                            <View className="mb-3">
                                                <AppErrorMessage error={error} visible={!!error} />
                                            </View>
                                        )}

                                        {/* Profile Image Section */}
                                        <View className="bg-white rounded-xl p-4 mb-4 border border-slate-200">
                                            <View className="flex-row items-center gap-3 mb-3">
                                                <View
                                                    className="w-9 h-9 rounded-lg items-center justify-center"
                                                    style={{ backgroundColor: colors.accent + "33" }}
                                                >
                                                    <Ionicons name="person-outline" size={18} color={colors.accent50} />
                                                </View>
                                                <View>
                                                    <AppText styles="text-base font-nunbold" style={{ color: colors.primary }}>
                                                        Profile Picture
                                                    </AppText>
                                                    <AppText styles="text-xs text-black">
                                                        Upload a clear square photo
                                                    </AppText>
                                                </View>
                                            </View>

                                            <ImageUpload
                                                label="Profile Image"
                                                name="profile_image"
                                                onImageChange={(imageUri) => setFieldValue("profile_image", imageUri)}
                                                currentImage={values.profile_image}
                                                error={touched.profile_image && errors.profile_image ? String(errors.profile_image) : undefined}
                                                helperText="Max 5MB, JPG/PNG/WEBP. Recommended: 1:1 image"
                                            />
                                        </View>

                                        {/* Personal Information Section */}
                                        <View className="bg-white rounded-xl p-4 mb-4 border border-slate-200">
                                            <View className="flex-row items-center gap-3 mb-3">
                                                <View
                                                    className="w-9 h-9 rounded-lg items-center justify-center"
                                                    style={{ backgroundColor: "#3b82f6" + "33" }}
                                                >
                                                    <Ionicons name="person-circle-outline" size={18} color="#60a5fa" />
                                                </View>
                                                <View>
                                                    <AppText styles="text-base font-nunbold" style={{ color: colors.primary }}>
                                                        Personal Information
                                                    </AppText>
                                                    <AppText styles="text-xs text-black">
                                                        Keep your profile details updated
                                                    </AppText>
                                                </View>
                                            </View>

                                            <View className="gap-3">
                                                <AppFormField
                                                    name="full_name"
                                                    label="Full Name"
                                                    placeholder="Enter your full name"
                                                    icon="person-outline"
                                                    labelColor="text-primary"
                                                />

                                                <View>
                                                    <AppFormField
                                                        name="phone_number"
                                                        label="Phone Number"
                                                        placeholder="0241234567 or +233241234567"
                                                        icon="call-outline"
                                                        keyboardType="phone-pad"
                                                        labelColor="text-primary"
                                                    />
                                                    <AppText styles="text-xs text-black mt-1">
                                                        Ghana format (0241234567) or international (+233241234567)
                                                    </AppText>
                                                </View>

                                                <AppFormField
                                                    name="bio"
                                                    label="Bio"
                                                    placeholder="Tell us about yourself..."
                                                    multiline
                                                    icon="chatbubble-outline"
                                                    labelColor="text-primary"
                                                />
                                                <AppText styles="text-xs text-black -mt-1">
                                                    {(values.bio || "").length}/500 characters
                                                </AppText>
                                            </View>
                                        </View>

                                        {/* Location Section */}
                                        <View className="bg-white rounded-xl p-4 mb-4 border border-slate-200">
                                            <View className="flex-row items-center gap-3 mb-3">
                                                <View
                                                    className="w-9 h-9 rounded-lg items-center justify-center"
                                                    style={{ backgroundColor: "#10b981" + "33" }}
                                                >
                                                    <Ionicons name="location-outline" size={18} color="#34d399" />
                                                </View>
                                                <View>
                                                    <AppText styles="text-base font-nunbold" style={{ color: colors.primary }}>
                                                        Location
                                                    </AppText>
                                                    <AppText styles="text-xs text-black">
                                                        Where are you based?
                                                    </AppText>
                                                </View>
                                            </View>

                                            <View className="gap-3">
                                                <AppFormField
                                                    name="city"
                                                    label="City"
                                                    placeholder="e.g., Accra"
                                                    icon="business-outline"
                                                    labelColor="text-primary"
                                                />

                                                <AppFormField
                                                    name="country"
                                                    label="Country"
                                                    placeholder="Start typing country..."
                                                    type="searchable-select"
                                                    options={countryOptions}
                                                    isLoading={isCountriesLoading}
                                                    labelColor="text-primary"
                                                />
                                            </View>
                                        </View>

                                        {/* Success Message */}
                                        {submitSuccess && (
                                            <View
                                                className="p-3 rounded-lg mb-3"
                                                style={{
                                                    backgroundColor: "#10b981" + "1A",
                                                    borderWidth: 1,
                                                    borderColor: "#10b981" + "33",
                                                }}
                                            >
                                                <View className="flex-row items-start gap-2">
                                                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                                                    <View className="flex-1">
                                                        <AppText styles="text-sm text-emerald-300 mb-1 font-nunbold">
                                                            Profile updated successfully
                                                        </AppText>
                                                        <AppText styles="text-xs text-emerald-200">
                                                            Redirecting to your profile...
                                                        </AppText>
                                                    </View>
                                                </View>
                                            </View>
                                        )}

                                        {/* Actions */}
                                        <View className="flex-row gap-3 items-center mt-1">
                                            <View className="flex-1">
                                                <SubmitButton title="Save Changes" />
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => router.back()}
                                                className="py-3 px-4 rounded-xl items-center justify-center min-w-[108px]"
                                                style={{
                                                    backgroundColor: colors.primary200,
                                                    borderWidth: 1,
                                                    borderColor: colors.accent + "66",
                                                }}
                                                activeOpacity={0.8}
                                            >
                                                <AppText styles="text-sm text-white font-nunbold">
                                                    Cancel
                                                </AppText>
                                            </TouchableOpacity>
                                        </View>

                                        {/* Helper Text */}
                                        <AppText styles="text-xs text-black text-center mt-2">
                                            Changes are saved immediately when successful
                                        </AppText>
                                        </>
                                    )}
                                </AppForm>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                )}
            </RequireAuth>
        </Screen>
    );
};

export default EditProfileScreen;
