import { View, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";

import { AppText } from "@/components";
import colors from "@/config/colors";

interface ImageUploadProps {
    label: string;
    name: string;
    onImageChange: (base64Image: string | null) => void;
    onMultipleImagesChange?: (base64Images: string[]) => void;
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
    const [images, setImages] = useState<string[]>(currentImages);
    const [selectedImage, setSelectedImage] = useState<string | null>(currentImage);

    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Please allow access to your photo library to upload images.',
                [{ text: 'OK' }]
            );
            return false;
        }
        return true;
    };

    const handlePickImage = async () => {
        if (disabled) return;

        const hasPermission = await requestPermission();
        if (!hasPermission) return;

        setIsLoading(true);

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: !multiple,
                aspect: multiple ? undefined : [1, 1],
                quality: 0.8,
                allowsMultipleSelection: multiple,
                selectionLimit: multiple ? maxImages : 1,
                base64: true,
            });

            if (!result.canceled) {
                if (multiple) {
                    const newImages = result.assets.map(asset => 
                        asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri
                    );
                    const updatedImages = [...images, ...newImages].slice(0, maxImages);
                    setImages(updatedImages);
                    onMultipleImagesChange?.(updatedImages);
                } else {
                    const base64 = result.assets[0].base64 
                        ? `data:image/jpeg;base64,${result.assets[0].base64}`
                        : result.assets[0].uri;
                    setSelectedImage(base64);
                    onImageChange(base64);
                }
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTakePhoto = async () => {
        if (disabled) return;

        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Please allow access to your camera to take photos.',
                [{ text: 'OK' }]
            );
            return;
        }

        setIsLoading(true);

        try {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled) {
                const base64 = result.assets[0].base64 
                    ? `data:image/jpeg;base64,${result.assets[0].base64}`
                    : result.assets[0].uri;
                
                if (multiple) {
                    const updatedImages = [...images, base64].slice(0, maxImages);
                    setImages(updatedImages);
                    onMultipleImagesChange?.(updatedImages);
                } else {
                    setSelectedImage(base64);
                    onImageChange(base64);
                }
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveImage = (index?: number) => {
        if (disabled) return;

        if (multiple && index !== undefined) {
            const updatedImages = images.filter((_, i) => i !== index);
            setImages(updatedImages);
            onMultipleImagesChange?.(updatedImages);
        } else {
            setSelectedImage(null);
            onImageChange(null);
        }
    };

    const showImageOptions = () => {
        Alert.alert(
            'Select Image',
            'Choose an option',
            [
                { text: 'Take Photo', onPress: handleTakePhoto },
                { text: 'Choose from Library', onPress: handlePickImage },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    const displayImage = selectedImage || currentImage;
    const displayImages = images.length > 0 ? images : currentImages;

    // Single Image Mode
    if (!multiple) {
        return (
            <View className="w-full">
                {!compact && (
                    <View className="mb-2">
                        <AppText styles="text-sm text-slate-300" font="font-imedium">
                            {label}
                            {required && <AppText styles="text-sm" font="font-imedium" color="text-red-400"> *</AppText>}
                        </AppText>
                    </View>
                )}

                {/* Upload Area or Preview */}
                {!displayImage ? (
                    <TouchableOpacity
                        onPress={showImageOptions}
                        disabled={disabled || isLoading}
                        className="border-2 border-dashed rounded-xl p-8 items-center"
                        style={{ 
                            borderColor: error ? '#ef4444' : colors.accent + '4D',
                            backgroundColor: error ? 'rgba(239, 68, 68, 0.05)' : colors.primary200,
                            opacity: disabled ? 0.6 : 1
                        }}
                        activeOpacity={0.7}
                    >
                        {isLoading ? (
                            <View className="items-center">
                                <View className="w-12 h-12 rounded-full border-4 border-accent/20 border-t-accent mb-4" />
                                <AppText styles="text-sm text-white" font="font-isemibold">
                                    Processing...
                                </AppText>
                            </View>
                        ) : (
                            <>
                                <View 
                                    className="w-16 h-16 rounded-xl items-center justify-center mb-4"
                                    style={{ backgroundColor: colors.accent + '33' }}
                                >
                                    <Ionicons name="cloud-upload-outline" size={32} color={colors.accent50} />
                                </View>
                                <AppText styles="text-base text-white mb-1" font="font-ibold">
                                    {compact ? 'Upload Image' : 'Tap to upload image'}
                                </AppText>
                                {!compact && (
                                    <AppText styles="text-xs text-slate-400 text-center" font="font-iregular">
                                        JPG, PNG, WEBP up to 5MB
                                    </AppText>
                                )}
                            </>
                        )}
                    </TouchableOpacity>
                ) : (
                    <View className="relative rounded-xl overflow-hidden">
                        <Image
                            source={{ uri: displayImage }}
                            className={compact ? "w-full aspect-square" : "w-full h-64"}
                            resizeMode="cover"
                        />
                        
                        {/* Remove Button */}
                        <TouchableOpacity
                            onPress={() => handleRemoveImage()}
                            disabled={disabled}
                            className="absolute top-2 right-2 w-10 h-10 rounded-full items-center justify-center"
                            style={{ backgroundColor: '#ef4444', opacity: disabled ? 0.6 : 1 }}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="close" size={20} color="#fff" />
                        </TouchableOpacity>

                        {/* Change Button */}
                        <TouchableOpacity
                            onPress={showImageOptions}
                            disabled={disabled}
                            className="absolute top-2 left-2 w-10 h-10 rounded-full items-center justify-center"
                            style={{ backgroundColor: '#3b82f6', opacity: disabled ? 0.6 : 1 }}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="camera-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Error Message */}
                {error && (
                    <View className="flex-row items-start gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20 mt-2">
                        <Ionicons name="alert-circle" size={16} color="#ef4444" />
                        <AppText styles="text-xs text-red-400 flex-1" font="font-iregular">
                            {error}
                        </AppText>
                    </View>
                )}

                {/* Helper Text */}
                {helperText && !error && !compact && (
                    <AppText styles="text-xs text-slate-400 mt-2" font="font-iregular">
                        {helperText}
                    </AppText>
                )}
            </View>
        );
    }

    // Multiple Images Mode
    return (
        <View className="w-full">
            <View className="flex-row items-center justify-between mb-2">
                <AppText styles="text-sm text-slate-300" font="font-imedium">
                    {label}
                    {required && <AppText styles="text-sm" font="font-imedium" color="text-red-400"> *</AppText>}
                </AppText>
                <AppText styles="text-xs text-slate-400" font="font-iregular">
                    {displayImages.length}/{maxImages}
                </AppText>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
                {/* Add New Image Button */}
                {displayImages.length < maxImages && (
                    <TouchableOpacity
                        onPress={showImageOptions}
                        disabled={disabled || isLoading}
                        className="w-32 h-32 border-2 border-dashed rounded-xl items-center justify-center mr-3"
                        style={{ 
                            borderColor: colors.accent + '4D',
                            backgroundColor: colors.primary200,
                            opacity: disabled ? 0.6 : 1
                        }}
                        activeOpacity={0.7}
                    >
                        {isLoading ? (
                            <View className="w-8 h-8 rounded-full border-4 border-accent/20 border-t-accent" />
                        ) : (
                            <>
                                <Ionicons name="add-circle-outline" size={32} color={colors.accent50} />
                                <AppText styles="text-xs text-slate-300 mt-2" font="font-isemibold">
                                    Add Image
                                </AppText>
                            </>
                        )}
                    </TouchableOpacity>
                )}

                {/* Image Previews */}
                {displayImages.map((img, index) => (
                    <View key={index} className="relative mr-3">
                        <Image
                            source={{ uri: img }}
                            className="w-32 h-32 rounded-xl"
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            onPress={() => handleRemoveImage(index)}
                            disabled={disabled}
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full items-center justify-center"
                            style={{ backgroundColor: '#ef4444', opacity: disabled ? 0.6 : 1 }}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="close" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Helper Text */}
            {helperText && (
                <AppText styles="text-xs text-slate-400 mt-2" font="font-iregular">
                    {helperText}
                </AppText>
            )}
        </View>
    );
};

export default ImageUpload;