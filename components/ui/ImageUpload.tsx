import { View, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from "react";
import * as Sentry from '@sentry/react-native';

import AppText from "./AppText";
import colors from "@/config/colors";
import { getFullImageUrl } from "@/utils/imageUrl";

interface ImageUploadProps {
    label: string;
    name: string;
    onImageChange: (imageUri: string | null) => void;
    onMultipleImagesChange?: (imageUris: string[]) => void;
    currentImage?: string | null;
    currentImages?: string[];
    helperText?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    compact?: boolean;
    maxImages?: number;
}

const ImageUpload = ({
    label,
    onImageChange,
    onMultipleImagesChange,
    currentImage = null,
    currentImages = [],
    helperText,
    error,
    required = false,
    disabled = false,
    multiple = false,
    compact = false,
    maxImages = 5,
}: ImageUploadProps) => {
    const [isLoading, setIsLoading] = useState(false);

    // Request permission on mount
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission not granted');
            }
        })();
    }, []);

    // Simple image picker - no camera, just library
    const pickImage = async () => {
        if (disabled || isLoading) return;

        try {
            setIsLoading(true);

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: !multiple,
                aspect: multiple ? undefined : [1, 1],
                quality: 0.6,
                allowsMultipleSelection: multiple,
                selectionLimit: multiple ? maxImages : 1,
            });

            if (result.canceled) {
                setIsLoading(false);
                return;
            }

            if (multiple) {
                // ✅ Use currentImages (from props) to append new images
                const newUris = result.assets.map(asset => asset.uri);
                const existingImages = currentImages || [];
                const updatedImages = [...existingImages, ...newUris].slice(0, maxImages);
                onMultipleImagesChange?.(updatedImages);
            } else {
                const uri = result.assets[0].uri;
                onImageChange(uri);
            }

        } catch (error) {
            console.error('Image picker error:', error);
            Sentry.captureException(error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeImage = (index?: number) => {
        if (disabled) return;

        if (multiple && index !== undefined) {
            // ✅ Use currentImages (from props) to remove
            const existingImages = currentImages || [];
            const updated = existingImages.filter((_, i) => i !== index);
            onMultipleImagesChange?.(updated);
        } else {
            onImageChange(null);
        }
    };

    // ✅ Use props as source of truth (no internal state duplication)
    const displayImage = currentImage;
    const displayImages = currentImages || [];

    // ========== SINGLE IMAGE MODE ==========
    if (!multiple) {
        return (
            <View className="w-full">
                {/* Label */}
                {!compact && (
                    <View className="mb-2">
                        <AppText styles="text-sm text-slate-300">
                            {label}
                            {required && (
                                <AppText styles="text-sm text-red-400">
                                    {" *"}
                                </AppText>
                            )}
                        </AppText>
                    </View>
                )}

                {/* Upload Button or Image Preview */}
                {!displayImage ? (
                    <TouchableOpacity
                        onPress={pickImage}
                        disabled={disabled || isLoading}
                        accessible
                        accessibilityRole="button"
                        accessibilityLabel="Upload image"
                        accessibilityHint="Tap to select an image from your library"
                        className="border-2 border-dashed rounded-xl p-6 items-center"
                        style={{
                            borderColor: error ? '#ef4444' : colors.white + '4D',
                            backgroundColor: error ? 'rgba(239, 68, 68, 0.05)' : colors.primary200,
                            opacity: disabled ? 0.6 : 1,
                        }}
                        activeOpacity={0.7}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="large" color={colors.accent} />
                        ) : (
                            <>
                                <View
                                    className="w-16 h-16 rounded-xl items-center justify-center mb-4"
                                    style={{ backgroundColor: colors.accent + '33' }}
                                >
                                    <Ionicons name="cloud-upload-outline" size={32} color={colors.accent50} />
                                </View>
                                <AppText styles="text-base text-white mb-1 font-nunbold">
                                    {compact ? 'Upload Image' : 'Tap to upload image'}
                                </AppText>
                                {!compact && (
                                    <AppText styles="text-xs text-slate-400 text-center">
                                        JPG, PNG, WEBP
                                    </AppText>
                                )}
                            </>
                        )}
                    </TouchableOpacity>
                ) : (
                    <View className="relative rounded-xl overflow-hidden">
                        <Image
                            source={{ uri: getFullImageUrl(displayImage) || undefined }}
                            className={compact ? "w-full aspect-square" : "w-full h-64"}
                            resizeMode="cover"
                        />

                        {/* Remove Button */}
                        <TouchableOpacity
                            onPress={() => removeImage()}
                            disabled={disabled}
                            accessible
                            accessibilityRole="button"
                            accessibilityLabel="Remove image"
                            className="absolute top-2 right-2 w-10 h-10 rounded-full items-center justify-center"
                            style={{ backgroundColor: '#ef4444', opacity: disabled ? 0.6 : 1 }}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="close" size={20} color="#fff" />
                        </TouchableOpacity>

                        {/* Change Button */}
                        <TouchableOpacity
                            onPress={pickImage}
                            disabled={disabled}
                            accessible
                            accessibilityRole="button"
                            accessibilityLabel="Change image"
                            className="absolute top-2 left-2 w-10 h-10 rounded-full items-center justify-center"
                            style={{ backgroundColor: colors.accent, opacity: disabled ? 0.6 : 1 }}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="images-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Error Message */}
                {error && (
                    <View className="flex-row items-start gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20 mt-2">
                        <Ionicons name="alert-circle" size={16} color="#ef4444" />
                        <AppText styles="text-xs text-red-400 flex-1">
                            {error}
                        </AppText>
                    </View>
                )}

                {/* Helper Text */}
                {helperText && !error && !compact && (
                    <AppText styles="text-xs text-slate-400 mt-2">
                        {helperText}
                    </AppText>
                )}
            </View>
        );
    }

    // ========== MULTIPLE IMAGES MODE ==========
    return (
        <View className="w-full">
            {/* Label */}
            {!compact && (
                <View className="flex-row items-center justify-between mb-2">
                    <AppText styles="text-sm text-slate-300">
                        {label}
                        {required && (
                            <AppText styles="text-sm text-red-400">
                                {" *"}
                            </AppText>
                        )}
                    </AppText>
                    <AppText styles="text-xs text-slate-400">
                        {displayImages.length}/{maxImages}
                    </AppText>
                </View>
            )}

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {/* Add Button */}
                {displayImages.length < maxImages && (
                    <TouchableOpacity
                        onPress={pickImage}
                        disabled={disabled || isLoading}
                        accessible
                        accessibilityRole="button"
                        accessibilityLabel={`Add image, ${displayImages.length} of ${maxImages} selected`}
                        className="w-32 h-32 border-2 border-dashed rounded-xl items-center justify-center mr-3"
                        style={{
                            borderColor: colors.accent + '4D',
                            backgroundColor: colors.primary200,
                            opacity: disabled ? 0.6 : 1,
                        }}
                        activeOpacity={0.7}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color={colors.accent} />
                        ) : (
                            <>
                                <Ionicons name="add-circle-outline" size={32} color={colors.accent50} />
                                <AppText styles="text-xs text-slate-300 mt-2">
                                    Add Image
                                </AppText>
                            </>
                        )}
                    </TouchableOpacity>
                )}

                {/* Image Previews */}
                {displayImages.map((img, index) => (
                    <View key={`${img}-${index}`} className="relative mr-3">
                        <Image
                            source={{ uri: getFullImageUrl(img) || undefined }}
                            className="w-32 h-32 rounded-xl"
                            resizeMode="cover"
                        />

                        {/* Remove Button */}
                        <TouchableOpacity
                            onPress={() => removeImage(index)}
                            disabled={disabled}
                            accessible
                            accessibilityRole="button"
                            accessibilityLabel={`Remove image ${index + 1}`}
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full items-center justify-center"
                            style={{ backgroundColor: '#ef4444', opacity: disabled ? 0.6 : 1 }}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="close" size={16} color="#fff" />
                        </TouchableOpacity>

                        {/* Image Number */}
                        <View
                            className="absolute bottom-2 left-2 px-2 py-0.5 rounded"
                            style={{ backgroundColor: colors.primary + 'CC' }}
                        >
                            <AppText styles="text-xs text-white font-nunbold">
                                {index + 1}
                            </AppText>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Helper Text */}
            {helperText && !compact && (
                <AppText styles="text-xs text-slate-400 mt-2">
                    {helperText}
                </AppText>
            )}
        </View>
    );
};

export default ImageUpload;
