import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { Screen, AppText, FormLoader, RequireAuth } from "@/components";
import {
    ImageUpload,
    AppFormField,
    AppForm,
    SubmitButton,
    AppErrorMessage,
} from "@/components";
import { useAuth } from "@/context";
import { ProfileEditValidationSchema, ProfileEditFormValues } from "@/data/validationSchema";
import colors from "@/config/colors";
import { API_BASE_URL } from "@/config/settings";
import axios from "axios";

const EditProfileScreen = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleSubmit = async (
        values: ProfileEditFormValues,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            setIsLoading(true);
            setError(null);
            setSubmitSuccess(false);

            // Prepare data
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
            if (values.profile_image && values.profile_image !== user?.profile_image) {
                updateData.profile_image = values.profile_image;
            }

            // Make API call
            const response = await axios.patch(
                `${API_BASE_URL}/auth/edit-profile/`,
                updateData
            );

            setSubmitSuccess(true);

            Alert.alert(
                'Success!',
                'Profile updated successfully',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]
            );

        } catch (err: any) {
            console.error('Error updating profile:', err);

            if (err?.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err?.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError(err?.message || 'Failed to update profile. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Screen statusBarStyle="light-content" statusBarBg={colors.primary}>
            <RequireAuth>
                <FormLoader visible={isLoading} />

                {/* Header */}
                <View className="flex-row items-center gap-4 px-4 py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: colors.primary200, borderWidth: 1, borderColor: colors.accent + '4D' }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="chevron-back" size={20} color="#fff" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <AppText styles="text-xl text-white font-nunbold">
                            Edit Profile
                        </AppText>
                        <AppText styles="text-sm text-slate-400">
                            Update your personal information
                        </AppText>
                    </View>
                </View>

                {user && (
                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    >
                        <View className="px-4">
                            <AppForm
                                initialValues={{
                                    full_name: user.full_name || '',
                                    phone_number: user.phone_number || '',
                                    bio: user.bio || '',
                                    city: user.city || '',
                                    country: user.country || 'Ghana',
                                    profile_image: user.profile_image || null
                                }}
                                onSubmit={handleSubmit}
                                validationSchema={ProfileEditValidationSchema}
                            >
                                {/* Error Message */}
                                {error && (
                                    <View className="mb-4">
                                        <AppErrorMessage error={error} visible={!!error} />
                                    </View>
                                )}

                                {/* Profile Image Section */}
                                <View className="bg-primary-100 rounded-2xl p-6 mb-6">
                                    <View className="flex-row items-center gap-3 mb-4">
                                        <View
                                            className="w-10 h-10 rounded-lg items-center justify-center"
                                            style={{ backgroundColor: '#a855f7' + '33' }}
                                        >
                                            <Ionicons name="person-outline" size={20} color="#a855f7" />
                                        </View>
                                        <View>
                                            <AppText styles="text-lg text-white font-nunbold">
                                                Profile Picture
                                            </AppText>
                                            <AppText styles="text-xs text-slate-400">
                                                Update your profile image
                                            </AppText>
                                        </View>
                                    </View>

                                    <ImageUpload
                                        label="Profile Image"
                                        name="profile_image"
                                        onImageChange={(base64Image) => { }}
                                        currentImage={user.profile_image}
                                        helperText="Max 5MB, JPG/PNG/WEBP. Recommended: Square image"
                                    />
                                </View>

                                {/* Personal Information Section */}
                                <View className="bg-primary-100 rounded-2xl p-6 mb-6">
                                    <View className="flex-row items-center gap-3 mb-4">
                                        <View
                                            className="w-10 h-10 rounded-lg items-center justify-center"
                                            style={{ backgroundColor: '#3b82f6' + '33' }}
                                        >
                                            <Ionicons name="person-circle-outline" size={20} color="#3b82f6" />
                                        </View>
                                        <View>
                                            <AppText styles="text-lg text-white font-nunbold">
                                                Personal Information
                                            </AppText>
                                            <AppText styles="text-xs text-slate-400">
                                                Update your personal details
                                            </AppText>
                                        </View>
                                    </View>

                                    <View className="gap-4">
                                        <AppFormField
                                            name="full_name"
                                            label="Full Name"
                                            placeholder="Enter your full name"
                                            icon="person-outline"
                                        />

                                        <View>
                                            <AppFormField
                                                name="phone_number"
                                                label="Phone Number"
                                                placeholder="0241234567 or +233241234567"
                                                icon="call-outline"
                                                keyboardType="phone-pad"
                                            />
                                            <AppText styles="text-xs text-slate-400 mt-1">
                                                Ghana format (0241234567) or international (+233241234567)
                                            </AppText>
                                        </View>

                                        <AppFormField
                                            name="bio"
                                            label="Bio"
                                            placeholder="Tell us about yourself..."
                                            multiline
                                            icon="chatbubble-outline"
                                        />
                                    </View>
                                </View>

                                {/* Location Section */}
                                <View className="bg-primary-100 rounded-2xl p-6 mb-6">
                                    <View className="flex-row items-center gap-3 mb-4">
                                        <View
                                            className="w-10 h-10 rounded-lg items-center justify-center"
                                            style={{ backgroundColor: '#10b981' + '33' }}
                                        >
                                            <Ionicons name="location-outline" size={20} color="#10b981" />
                                        </View>
                                        <View>
                                            <AppText styles="text-lg text-white font-nunbold">
                                                Location
                                            </AppText>
                                            <AppText styles="text-xs text-slate-400">
                                                Where are you based?
                                            </AppText>
                                        </View>
                                    </View>

                                    <View className="gap-4">
                                        <AppFormField
                                            name="city"
                                            label="City"
                                            placeholder="e.g., Accra"
                                            icon="business-outline"
                                        />

                                        <AppFormField
                                            name="country"
                                            label="Country"
                                            placeholder="e.g., Ghana"
                                            icon="flag-outline"
                                        />
                                    </View>
                                </View>

                                {/* Success Message */}
                                {submitSuccess && (
                                    <View
                                        className="p-4 rounded-lg mb-4"
                                        style={{
                                            backgroundColor: '#10b981' + '1A',
                                            borderWidth: 1,
                                            borderColor: '#10b981' + '33'
                                        }}
                                    >
                                        <View className="flex-row items-start gap-3">
                                            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                                            <View className="flex-1">
                                                <AppText styles="text-sm text-emerald-400 mb-1 font-nunbold">
                                                    Profile Updated Successfully!
                                                </AppText>
                                                <AppText styles="text-xs" color="text-emerald-300">
                                                    Redirecting to your profile...
                                                </AppText>
                                            </View>
                                        </View>
                                    </View>
                                )}

                                {/* Submit Button */}
                                <View className="mb-4">
                                    <SubmitButton title="Save Changes" />
                                </View>

                                {/* Cancel Button */}
                                <TouchableOpacity
                                    onPress={() => router.back()}
                                    className="py-4 px-6 rounded-xl items-center mb-4"
                                    style={{
                                        backgroundColor: colors.primary200,
                                        borderWidth: 2,
                                        borderColor: colors.accent + '4D'
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <AppText styles="text-sm text-white font-nunbold">
                                        Cancel
                                    </AppText>
                                </TouchableOpacity>

                                {/* Helper Text */}
                                <AppText styles="text-xs text-slate-400 text-center">
                                    All changes will be saved immediately
                                </AppText>
                            </AppForm>
                        </View>
                    </ScrollView>
                )}
            </RequireAuth>
        </Screen>
    );
};

export default EditProfileScreen;