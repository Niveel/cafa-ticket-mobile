import { View, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from "react";
import * as Sentry from '@sentry/react-native';

import { AppText } from "@/components";
import colors from "@/config/colors";

interface PhotoCaptureProps {
    onPhotoCapture: (uri: string) => void;
    title: string;
    instructions: string;
    requirements: string[];
    captureButtonText?: string;
    isLoading?: boolean;
    error?: string | null;
    cameraFacing?: 'front' | 'back';
}

const PhotoCapture = ({
    onPhotoCapture,
    title,
    instructions,
    requirements,
    captureButtonText = "Continue",
    isLoading = false,
    error = null,
    cameraFacing = 'front',
}: PhotoCaptureProps) => {
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [isTakingPhoto, setIsTakingPhoto] = useState(false);
    const cameraRef = useRef<CameraView>(null);
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [libraryPermission, requestLibraryPermission] = ImagePicker.useMediaLibraryPermissions();

    // Request permissions on mount
    useEffect(() => {
        (async () => {
            if (!cameraPermission?.granted) {
                await requestCameraPermission();
            }
            if (!libraryPermission?.granted) {
                await requestLibraryPermission();
            }
        })();
    }, []);

    const hasPermission = cameraPermission?.granted && libraryPermission?.granted;

    const handleTakePhoto = async () => {
        if (!cameraRef.current || isTakingPhoto) return;

        try {
            setIsTakingPhoto(true);
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.7,
                base64: false,
            });

            setCapturedPhoto(photo.uri);
            setShowCamera(false);
        } catch (error) {
            console.error('Take photo error:', error);
            Sentry.captureException(error);
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        } finally {
            setIsTakingPhoto(false);
        }
    };

    const handlePickFromLibrary = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            });

            if (!result.canceled) {
                setCapturedPhoto(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Pick image error:', error);
            Sentry.captureException(error);
            Alert.alert('Error', 'Failed to select image. Please try again.');
        }
    };

    const handleRetake = () => {
        setCapturedPhoto(null);
    };

    const handleConfirm = () => {
        if (capturedPhoto) {
            onPhotoCapture(capturedPhoto);
        }
    };

    const showOptions = () => {
        Alert.alert(
            'Select Photo',
            'Choose how you want to add your photo',
            [
                { text: 'Take Photo', onPress: () => setShowCamera(true) },
                { text: 'Choose from Library', onPress: handlePickFromLibrary },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    if (hasPermission === null) {
        return (
            <View className="flex-1 items-center justify-center p-6">
                <ActivityIndicator size="large" color={colors.accent} />
                <AppText styles="text-sm text-white mt-4" style={{ opacity: 0.6 }}>
                    Requesting permissions...
                </AppText>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View
                className="p-6 rounded-xl border-2"
                style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
            >
                <View className="flex-row items-start gap-3">
                    <Ionicons name="alert-circle" size={20} color={colors.accent} />
                    <View className="flex-1">
                        <AppText styles="text-sm text-white mb-2 font-nunbold">
                            Camera Permission Required
                        </AppText>
                        <AppText styles="text-xs text-white" style={{ opacity: 0.8 }}>
                            Please enable camera and photo library access in your device settings to continue.
                        </AppText>
                    </View>
                </View>
            </View>
        );
    }

    // Camera View
    if (showCamera && !capturedPhoto) {
        return (
            <View className="flex-1">
                <CameraView
                    ref={cameraRef}
                    style={{ flex: 1 }}
                    facing={cameraFacing}
                >
                    {/* Overlay Guide */}
                    <View className="flex-1 items-center justify-center">
                        <View
                            className="w-64 h-80 border-4 rounded-3xl"
                            style={{ borderColor: colors.accent + "80" }}
                        />
                    </View>

                    {/* Controls */}
                    <View className="absolute bottom-0 left-0 right-0 p-6">
                        <View className="flex-row items-center justify-between">
                            {/* Cancel */}
                            <TouchableOpacity
                                onPress={() => setShowCamera(false)}
                                className="px-4 py-2 rounded-lg"
                                style={{ backgroundColor: colors.primary200 }}
                                activeOpacity={0.8}
                                accessible
                                accessibilityRole="button"
                                accessibilityLabel="Cancel"
                            >
                                <AppText styles="text-sm text-white">
                                    Cancel
                                </AppText>
                            </TouchableOpacity>

                            {/* Capture Button */}
                            <TouchableOpacity
                                onPress={handleTakePhoto}
                                disabled={isTakingPhoto}
                                className="w-20 h-20 rounded-full border-4 items-center justify-center"
                                style={{
                                    backgroundColor: colors.white,
                                    borderColor: colors.accent,
                                    opacity: isTakingPhoto ? 0.5 : 1
                                }}
                                activeOpacity={0.8}
                                accessible
                                accessibilityRole="button"
                                accessibilityLabel="Take photo"
                            >
                                {isTakingPhoto ? (
                                    <ActivityIndicator size="small" color={colors.accent} />
                                ) : (
                                    <View className="w-16 h-16 rounded-full" style={{ backgroundColor: colors.accent }} />
                                )}
                            </TouchableOpacity>

                            {/* Library */}
                            <TouchableOpacity
                                onPress={handlePickFromLibrary}
                                className="w-12 h-12 rounded-lg items-center justify-center"
                                style={{ backgroundColor: colors.primary200 }}
                                activeOpacity={0.8}
                                accessible
                                accessibilityRole="button"
                                accessibilityLabel="Choose from library"
                            >
                                <Ionicons name="images-outline" size={24} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </CameraView>
            </View>
        );
    }

    return (
        <View className="gap-6 px-4">
            {/* Title & Instructions */}
            <View>
                <AppText styles="text-lg text-white mb-2 font-nunbold">
                    {title}
                </AppText>
                <AppText styles="text-sm text-white mb-4" style={{ opacity: 0.7 }}>
                    {instructions}
                </AppText>

                {/* Requirements */}
                <View
                    className="p-4 rounded-xl gap-2"
                    style={{ backgroundColor: colors.primary200 + "80" }}
                >
                    {requirements.map((req, index) => (
                        <View key={index} className="flex-row items-center gap-2">
                            <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.accent50 }} />
                            <AppText styles="text-xs text-white" style={{ opacity: 0.7 }}>
                                {req}
                            </AppText>
                        </View>
                    ))}
                </View>
            </View>

            {/* Error Message */}
            {error && (
                <View
                    className="p-4 rounded-xl border-2"
                    style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                >
                    <View className="flex-row items-start gap-3">
                        <Ionicons name="alert-circle" size={18} color={colors.accent} style={{ marginTop: 2 }} />
                        <View className="flex-1">
                            <AppText styles="text-sm text-white mb-1 font-nunbold">
                                Upload Failed
                            </AppText>
                            <AppText styles="text-xs text-white" style={{ opacity: 0.8 }}>
                                {error}
                            </AppText>
                        </View>
                    </View>
                </View>
            )}

            {/* Photo Area */}
            {!capturedPhoto ? (
                <TouchableOpacity
                    onPress={showOptions}
                    className="border-2 border-dashed rounded-xl p-12 items-center"
                    style={{ borderColor: colors.accent + "4D", backgroundColor: colors.primary200 }}
                    activeOpacity={0.7}
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel="Add photo"
                    accessibilityHint="Tap to choose between camera or photo library"
                >
                    <View
                        className="w-20 h-20 rounded-full items-center justify-center mb-4"
                        style={{ backgroundColor: colors.accent + "33" }}
                    >
                        <Ionicons name="camera-outline" size={40} color={colors.accent50} />
                    </View>
                    <AppText styles="text-base text-white mb-2 font-nunbold">
                        Take Photo or Upload
                    </AppText>
                    <AppText styles="text-xs text-white text-center" style={{ opacity: 0.6 }}>
                        Tap to choose camera or library
                    </AppText>
                </TouchableOpacity>
            ) : (
                <View className="gap-4">
                    {/* Preview */}
                    <View className="relative rounded-xl overflow-hidden border-2" style={{ borderColor: colors.accent }}>
                        <Image
                            source={{ uri: capturedPhoto }}
                            className="w-full h-80"
                            resizeMode="cover"
                        />

                        {/* Retake Button */}
                        <TouchableOpacity
                            onPress={handleRetake}
                            disabled={isLoading}
                            className="absolute top-3 right-3 px-4 py-2 rounded-lg flex-row items-center gap-2"
                            style={{ backgroundColor: colors.primary + "CC", opacity: isLoading ? 0.5 : 1 }}
                            activeOpacity={0.8}
                            accessible
                            accessibilityRole="button"
                            accessibilityLabel="Retake photo"
                        >
                            <Ionicons name="camera-outline" size={16} color={colors.white} />
                            <AppText styles="text-xs text-white">
                                Retake
                            </AppText>
                        </TouchableOpacity>

                        {/* Loading Overlay */}
                        {isLoading && (
                            <View
                                className="absolute inset-0 items-center justify-center"
                                style={{ backgroundColor: colors.primary + "CC" }}
                            >
                                <ActivityIndicator size="large" color={colors.accent} />
                                <AppText styles="text-sm text-white mt-3">
                                    Uploading...
                                </AppText>
                            </View>
                        )}
                    </View>

                    {/* Confirm Button */}
                    <TouchableOpacity
                        onPress={handleConfirm}
                        disabled={isLoading}
                        className="p-4 rounded-xl items-center"
                        style={{ backgroundColor: colors.accent, opacity: isLoading ? 0.5 : 1 }}
                        activeOpacity={0.8}
                        accessible
                        accessibilityRole="button"
                        accessibilityLabel={captureButtonText}
                    >
                        <AppText styles="text-base text-white font-nunbold">
                            {isLoading ? 'Processing...' : captureButtonText}
                        </AppText>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default PhotoCapture;