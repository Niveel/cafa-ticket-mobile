import {
    View,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Image,
    StyleSheet,
} from "react-native";
import { useState, useRef, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";

import * as SecureStore from "expo-secure-store";

import AppText from "../../ui/AppText";
import { API_BASE_URL } from "@/config/settings";
import colors from "@/config/colors";

const AUTH_TOKEN_KEY = "cafa_auth_token";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type VerificationState = "capture" | "verifying" | "success" | "rejected";

interface FaceVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    title?: string;
    description?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const FaceVerificationModal = ({
    isOpen,
    onClose,
    onSuccess,
    title = "Verify Your Identity",
    description = "For your security, please verify your identity with a selfie before proceeding.",
}: FaceVerificationModalProps) => {
    // ---- camera permission (expo-camera hook) ----
    const [permission, requestPermission] = useCameraPermissions();

    // ---- local state ----
    const [capturedUri, setCapturedUri] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<"front" | "back">("front");
    const [verificationState, setVerificationState] =
        useState<VerificationState>("capture");
    const [error, setError] = useState<string | null>(null);

    // ---- refs ----
    const cameraRef = useRef<CameraView>(null);

    // ---- reset when modal opens / closes ----
    const handleModalClose = useCallback(() => {
        setCapturedUri(null);
        setVerificationState("capture");
        setError(null);
        onClose();
    }, [onClose]);

    // ---- capture ----
    const handleCapture = useCallback(async () => {
        if (!cameraRef.current) return;
        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.85,
                base64: false, // we only need the URI for FormData
            });
            if (photo?.uri) {
                setCapturedUri(photo.uri);
            }
        } catch (err) {
            console.error("Capture error:", err);
            setError("Failed to take photo. Please try again.");
        }
    }, []);

    // ---- retake ----
    const handleRetake = () => {
        setCapturedUri(null);
        setError(null);
        setVerificationState("capture");
    };

    // ---- flip camera ----
    const handleFlipCamera = () => {
        setFacingMode((prev) => (prev === "front" ? "back" : "front"));
        setCapturedUri(null);
    };

    // ---- upload & verify ----
    const handleVerify = async () => {
        if (!capturedUri) return;

        setVerificationState("verifying");
        setError(null);

        try {
            const formData = new FormData();
            // React Native FormData accepts { uri, type, name } objects
            formData.append("selfie_image", {
                uri: capturedUri,
                type: "image/jpeg",
                name: "withdrawal-selfie.jpg",
            } as any);

            // Raw fetch bypasses the axios client interceptor, so we
            // pull the token ourselves and attach it here.
            const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

            const response = await fetch(
                `${API_BASE_URL}/auth/verification/upload-selfie/`,
                {
                    method: "POST",
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : {},
                    body: formData,
                    // NOTE: do NOT set Content-Type manually — fetch sets
                    // multipart/form-data with the correct boundary automatically.
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                if (data.data?.verification_status === "verified") {
                    setVerificationState("success");
                    // short UX pause then hand off
                    setTimeout(() => {
                        onSuccess();
                        handleModalClose();
                    }, 1500);
                } else if (data.data?.verification_status === "rejected") {
                    setVerificationState("rejected");
                    setError(
                        data.data?.rejection_reason ||
                        "Face verification failed. Please try again."
                    );
                } else {
                    // unexpected status
                    setVerificationState("rejected");
                    setError("Verification failed. Please try again.");
                }
            } else {
                setVerificationState("rejected");
                setError(
                    data.message || "Verification failed. Please try again."
                );
            }
        } catch (err) {
            console.error("Face verification error:", err);
            setVerificationState("rejected");
            setError("Failed to verify identity. Please try again.");
        }
    };

    // ==================================================================
    // Render helpers
    // ==================================================================

    // --- permission not yet determined (first render) ---
    const renderPermissionPending = () => (
        <View className="items-center justify-center py-16">
            <Ionicons
                name="camera-outline"
                size={48}
                color={colors.accent50}
                style={{ opacity: 0.4 }}
            />
        </View>
    );

    // --- permission denied ---
    const renderPermissionDenied = () => (
        <View
            className="rounded-xl p-6 border-2 items-center"
            style={{
                backgroundColor: colors.primary100,
                borderColor: colors.accent,
            }}
        >
            <View
                className="w-16 h-16 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: "#ef444422" }}
            >
                <Ionicons name="videocam-off" size={32} color="#f87171" />
            </View>
            <AppText styles="text-sm text-white text-center font-nunbold">
                Camera Permission Required
            </AppText>
            <AppText
                styles="text-xs text-white text-center mt-1 mb-4"
                style={{ opacity: 0.5, maxWidth: 260 }}
            >
                Allow camera access so we can verify your identity before
                processing your payout.
            </AppText>
            <TouchableOpacity
                onPress={requestPermission}
                className="px-5 py-2.5 rounded-xl"
                style={{ backgroundColor: colors.accent }}
                activeOpacity={0.7}
            >
                <AppText styles="text-sm text-white font-nunbold">
                    Grant Permission
                </AppText>
            </TouchableOpacity>
        </View>
    );

    // --- live camera view ---
    const renderCamera = () => (
        <>
            <View
                className="rounded-xl overflow-hidden border-2"
                style={{
                    borderColor: colors.accent,
                    height: 320,
                }}
            >
                <CameraView
                    ref={cameraRef}
                    style={StyleSheet.absoluteFillObject}
                    facing={facingMode}
                />

                {/* oval face guide overlay */}
                <View
                    className="absolute inset-0 items-center justify-center"
                    pointerEvents="none"
                >
                    <View
                        style={{
                            width: 160,
                            height: 220,
                            borderWidth: 3,
                            borderColor: "rgba(255,255,255,0.5)",
                            borderRadius: 100,
                        }}
                    />
                </View>
            </View>

            {/* tips */}
            <View
                className="p-4 rounded-xl border"
                style={{
                    backgroundColor: "#3b82f610",
                    borderColor: "#3b82f630",
                }}
            >
                <AppText styles="text-xs font-nunbold" style={{ color: "#60a5fa" }}>
                    Tips for best results:
                </AppText>
                <AppText
                    styles="text-xs mt-1"
                    style={{ color: "#93c5fd" }}
                >
                    • Ensure your face is well-lit{"\n"}• Look directly at the
                    camera{"\n"}• Remove glasses if possible{"\n"}• Keep your
                    face within the oval guide
                </AppText>
            </View>

            {/* action buttons */}
            <TouchableOpacity
                onPress={handleCapture}
                className="w-full py-4 rounded-xl items-center"
                style={{ backgroundColor: colors.accent }}
                activeOpacity={0.8}
            >
                <View className="flex-row items-center gap-2">
                    <Ionicons name="camera-outline" size={20} color="#fff" />
                    <AppText styles="text-base text-white font-nunbold">
                        Capture Selfie
                    </AppText>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleFlipCamera}
                className="w-full py-3 rounded-xl items-center"
                style={{ backgroundColor: colors.primary200 }}
                activeOpacity={0.7}
            >
                <View className="flex-row items-center gap-2">
                    <Ionicons name="refresh-outline" size={18} color={colors.accent50} />
                    <AppText styles="text-sm" style={{ color: colors.accent50 }}>
                        Flip Camera
                    </AppText>
                </View>
            </TouchableOpacity>
        </>
    );

    // --- captured image preview + verify/retake ---
    const renderPreview = () => (
        <>
            <View
                className="rounded-xl overflow-hidden border-2"
                style={{ borderColor: colors.accent, height: 320 }}
            >
                <Image
                    source={{ uri: capturedUri! }}
                    style={StyleSheet.absoluteFillObject}
                    resizeMode="cover"
                />

                {/* verifying overlay */}
                {verificationState === "verifying" && (
                    <View
                        className="absolute inset-0 items-center justify-center"
                        style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                    >
                        <ActivityIndicator size="large" color={colors.accent} />
                        <AppText
                            styles="text-sm text-white mt-3 font-nunbold"
                        >
                            Verifying Your Identity…
                        </AppText>
                    </View>
                )}
            </View>

            {/* error banner */}
            {error && verificationState === "rejected" && (
                <View
                    className="flex-row items-start gap-3 p-4 rounded-xl border"
                    style={{
                        backgroundColor: "#ef444410",
                        borderColor: "#ef444430",
                    }}
                >
                    <Ionicons
                        name="alert-circle-outline"
                        size={20}
                        color="#f87171"
                        style={{ marginTop: 2 }}
                    />
                    <AppText
                        styles="text-xs flex-1"
                        style={{ color: "#f87171" }}
                    >
                        {error}
                    </AppText>
                </View>
            )}

            {/* Retake / Verify row */}
            {verificationState !== "verifying" && (
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={handleRetake}
                        className="flex-1 py-4 rounded-xl items-center"
                        style={{ backgroundColor: colors.primary200 }}
                        activeOpacity={0.7}
                    >
                        <AppText styles="text-base text-white font-nunbold">
                            Retake
                        </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleVerify}
                        className="flex-1 py-4 rounded-xl items-center"
                        style={{ backgroundColor: colors.accent }}
                        activeOpacity={0.8}
                    >
                        <View className="flex-row items-center gap-2">
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={20}
                                color="#fff"
                            />
                            <AppText styles="text-base text-white font-nunbold">
                                Verify
                            </AppText>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </>
    );

    // --- success state ---
    const renderSuccess = () => (
        <View className="items-center py-10">
            <View
                className="w-16 h-16 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: "#22c55e20" }}
            >
                <Ionicons
                    name="checkmark-circle-outline"
                    size={36}
                    color="#4ade80"
                />
            </View>
            <AppText styles="text-lg text-white text-center font-nunbold">
                Identity Verified!
            </AppText>
            <AppText
                styles="text-sm text-white text-center mt-2"
                style={{ opacity: 0.6 }}
            >
                Proceeding to withdrawal…
            </AppText>
        </View>
    );

    // --- pick which body to show ---
    const renderBody = () => {
        if (verificationState === "success") return renderSuccess();
        if (!permission) return renderPermissionPending();
        if (!permission.granted) return renderPermissionDenied();
        if (capturedUri) return renderPreview();
        return renderCamera();
    };

    // ==================================================================
    // Main render
    // ==================================================================
    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="slide"
            onRequestClose={handleModalClose}
        >
            <View
                className="flex-1 justify-end"
                style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            >
                {/* sheet */}
                <View
                    className="rounded-t-2xl border-t-2 p-6 gap-5"
                    style={{
                        backgroundColor: colors.primary100,
                        borderColor: colors.accent,
                        maxHeight: "90%",
                    }}
                >
                    {/* header row */}
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <View
                                className="w-10 h-10 rounded-lg items-center justify-center"
                                style={{ backgroundColor: "#3b82f620" }}
                            >
                                <Ionicons
                                    name="camera-outline"
                                    size={20}
                                    color="#60a5fa"
                                />
                            </View>
                            <AppText styles="text-base text-white font-nunbold">
                                {title}
                            </AppText>
                        </View>

                        <TouchableOpacity
                            onPress={handleModalClose}
                            disabled={verificationState === "verifying"}
                            className="w-8 h-8 rounded-lg items-center justify-center"
                            style={{ backgroundColor: colors.primary200 }}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* description (only when not in success) */}
                    {verificationState !== "success" && (
                        <AppText
                            styles="text-xs text-white text-center"
                            style={{ opacity: 0.6 }}
                        >
                            {description}
                        </AppText>
                    )}

                    {/* dynamic body */}
                    {renderBody()}
                </View>
            </View>
        </Modal>
    );
};

export default FaceVerificationModal;