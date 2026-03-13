import { View, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState, useEffect, useCallback, useRef } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Screen, AppText, RequireAuth, Nav, PhotoCapture, VerificationHeader } from "@/components";
import { useAuth } from "@/context";
import {
    getVerificationStatus,
    uploadIDDocument,
    uploadSelfieImage,
    retryVerification
} from "@/lib/dashboard";
import colors from "@/config/colors";

type VerificationStep = 'id-upload' | 'selfie' | 'result';
type VerificationStatus = 'not_started' | 'id_uploaded' | 'pending' | 'verified' | 'rejected';
const VERIFICATION_POLL_INTERVAL_MS = 5000;
const VERIFICATION_PENDING_TIMEOUT_MS = 10000;

const logVerificationError = (context: string, error: any) => {
    const statusCode = error?.response?.status;
    const responseData = error?.response?.data;
    const networkCode = error?.code;
    const message = error?.message || "Unknown verification error";
    const source = statusCode ? "backend" : "network_or_client";

    console.error(`[VerifyIdentity] ${context}`, {
        source,
        statusCode: statusCode ?? null,
        networkCode: networkCode ?? null,
        message,
        responseData: responseData ?? null,
    });
};

const logVerificationInfo = (context: string, payload?: Record<string, unknown>) => {
    console.log(`[VerifyIdentity] ${context}`, payload ?? {});
};

const VerifyProfileScreen = () => {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState<VerificationStep>('id-upload');
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('not_started');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState<string | null>(null);
    const [pendingTimeoutMessage, setPendingTimeoutMessage] = useState<string | null>(null);
    const [pendingTimeoutDiagnosis, setPendingTimeoutDiagnosis] = useState<string | null>(null);
    const [hasPendingTimedOut, setHasPendingTimedOut] = useState(false);
    const [statusCheckError, setStatusCheckError] = useState<string | null>(null);
    const pendingPollStatsRef = useRef({
        successfulPolls: 0,
        failedPolls: 0,
        lastFailureMessage: "",
    });

    useEffect(() => {
        checkVerificationStatus();
    }, [checkVerificationStatus]);

    useEffect(() => {
        if (user?.is_organizer) {
            router.replace('/dashboard/events/create');
        }
    }, [user]);

    const checkVerificationStatus = useCallback(async () => {
        const startedAt = Date.now();
        try {
            setStatusCheckError(null);
            const result = await getVerificationStatus();

            if (!(result && result.success)) {
                pendingPollStatsRef.current.failedPolls += 1;
                pendingPollStatsRef.current.lastFailureMessage =
                    "Empty or unsuccessful status response";
                const message =
                    "Could not check verification status. Please check your connection and try again.";
                setStatusCheckError(message);
                if (currentStep === "result" && verificationStatus === "pending") {
                    setPendingTimeoutMessage(message);
                }
                logVerificationInfo("status poll failed (no-success payload)", {
                    durationMs: Date.now() - startedAt,
                    result,
                    failedPolls: pendingPollStatsRef.current.failedPolls,
                });
                return;
            }

            const status = result.data.verification_status;
            pendingPollStatsRef.current.successfulPolls += 1;
            logVerificationInfo("status poll success", {
                durationMs: Date.now() - startedAt,
                status,
                successfulPolls: pendingPollStatsRef.current.successfulPolls,
            });
            setVerificationStatus(status);
            if (status !== 'pending') {
                setPendingTimeoutMessage(null);
                setPendingTimeoutDiagnosis(null);
                setHasPendingTimedOut(false);
            }

            if (status === 'not_started') {
                setCurrentStep('id-upload');
            } else if (status === 'id_uploaded') {
                setCurrentStep('selfie');
            } else if (status === 'verified' || status === 'rejected' || status === 'pending') {
                setCurrentStep('result');
                if (status === 'rejected') {
                    setRejectionReason(result.data.verification_notes);
                }
            }
        } catch (error) {
            pendingPollStatsRef.current.failedPolls += 1;
            pendingPollStatsRef.current.lastFailureMessage = error?.message || "Unknown network error";
            logVerificationError("checkVerificationStatus failed", error);
            logVerificationInfo("status poll failed (exception)", {
                durationMs: Date.now() - startedAt,
                failedPolls: pendingPollStatsRef.current.failedPolls,
            });
            const message =
                "Network issue while checking verification status. Please try again.";
            setStatusCheckError(message);
            if (currentStep === "result" && verificationStatus === "pending") {
                setPendingTimeoutMessage(message);
            }
        }
    }, [currentStep, verificationStatus]);

    useEffect(() => {
        if (!(currentStep === 'result' && verificationStatus === 'pending')) {
            return;
        }

        setPendingTimeoutMessage(null);
        setPendingTimeoutDiagnosis(null);
        setHasPendingTimedOut(false);
        pendingPollStatsRef.current = {
            successfulPolls: 0,
            failedPolls: 0,
            lastFailureMessage: "",
        };

        const pollId = setInterval(() => {
            checkVerificationStatus();
        }, VERIFICATION_POLL_INTERVAL_MS);

        const timeoutId = setTimeout(() => {
            const { successfulPolls, failedPolls, lastFailureMessage } = pendingPollStatsRef.current;
            let diagnosis = "Could not determine exact source of delay.";
            if (successfulPolls > 0 && failedPolls === 0) {
                diagnosis = "Likely backend delay: status checks are succeeding but verification remains pending.";
            } else if (successfulPolls === 0 && failedPolls > 0) {
                diagnosis = "Likely frontend/network path issue: app could not reach verification status endpoint.";
            } else if (successfulPolls > 0 && failedPolls > 0) {
                diagnosis = "Mixed signal: intermittent network errors while backend also remains pending.";
            }
            setHasPendingTimedOut(true);
            setPendingTimeoutMessage(
                "Verification timed out. Please check your connection and try again."
            );
            setPendingTimeoutDiagnosis(diagnosis);
            logVerificationInfo("pending verification timeout", {
                timeoutMs: VERIFICATION_PENDING_TIMEOUT_MS,
                successfulPolls,
                failedPolls,
                lastFailureMessage: lastFailureMessage || null,
                diagnosis,
            });
        }, VERIFICATION_PENDING_TIMEOUT_MS);

        return () => {
            clearInterval(pollId);
            clearTimeout(timeoutId);
        };
    }, [currentStep, verificationStatus, checkVerificationStatus]);

    const handleIDUpload = async (uri: string) => {
        logVerificationInfo("ID upload started", { uriPrefix: uri?.slice(0, 40) });
        setIsLoading(true);
        setUploadError(null);

        try {
            const data = await uploadIDDocument(uri);
            logVerificationInfo("ID upload response", { data });

            if (data && data.success) {
                setVerificationStatus('id_uploaded');
                setCurrentStep('selfie');
            } else {
                const errorMessage = data?.message || data?.error || 'Failed to upload ID. Please try again.';
                logVerificationInfo("ID upload failed (non-exception)", { errorMessage, data });
                setUploadError(errorMessage);
            }
        } catch (error: any) {
            logVerificationError("uploadIDDocument failed", error);
            const errorMessage = error?.response?.data?.message || 'Network error. Please check your connection and try again.';
            setUploadError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelfieUpload = async (uri: string) => {
        logVerificationInfo("Selfie upload started", { uriPrefix: uri?.slice(0, 40) });
        setIsLoading(true);
        setUploadError(null);
        setPendingTimeoutMessage(null);
        setPendingTimeoutDiagnosis(null);
        setHasPendingTimedOut(false);
        setCurrentStep('result');
        setVerificationStatus('pending');

        try {
            const data = await uploadSelfieImage(uri);
            logVerificationInfo("Selfie upload response", { data });

            if (data && data.success) {
                if (data.data.verification_status === 'verified') {
                    setVerificationStatus('verified');
                } else if (data.data.verification_status === 'rejected') {
                    setVerificationStatus('rejected');

                    const reason = data.data.rejection_reason;
                    let reasonMessage: string;

                    if (typeof reason === 'string') {
                        reasonMessage = reason;
                    } else if (reason && typeof reason === 'object' && reason.message) {
                        reasonMessage = reason.message;
                    } else {
                        reasonMessage = 'Verification failed. Please try again.';
                    }

                    setRejectionReason(reasonMessage);
                } else {
                    logVerificationInfo("Selfie upload returned pending", {
                        verificationStatus: data?.data?.verification_status ?? "pending",
                    });
                    setVerificationStatus('pending');
                }
            } else {
                const errorMessage = data?.message || data?.error || 'Failed to upload selfie. Please try again.';
                logVerificationInfo("Selfie upload failed (non-exception)", { errorMessage, data });
                setUploadError(errorMessage);
                setCurrentStep('selfie');
                setVerificationStatus('id_uploaded');
            }
        } catch (error: any) {
            logVerificationError("uploadSelfieImage failed", error);
            const errorMessage = error?.response?.data?.message || 'Network error. Please check your connection and try again.';
            setUploadError(errorMessage);
            setCurrentStep('selfie');
            setVerificationStatus('id_uploaded');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = async () => {
        setIsLoading(true);
        setUploadError(null);

        try {
            const data = await retryVerification();

            if (data && data.success) {
                setRejectionReason(null);
                setVerificationStatus('not_started');
                setCurrentStep('id-upload');
                setHasPendingTimedOut(false);
                setPendingTimeoutMessage(null);
                setPendingTimeoutDiagnosis(null);
            } else {
                setUploadError(data?.message || 'Failed to reset verification. Please try again.');
            }
        } catch (error: any) {
            logVerificationError("retryVerification failed", error);
            const errorMessage = error?.response?.data?.message || 'Network error. Please try again.';
            setUploadError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Screen>
            <RequireAuth>
                <Nav title="Verify Identity" />

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <VerificationHeader
                        currentStep={currentStep}
                        userName={user?.full_name || 'there'}
                    />

                    {statusCheckError && (
                        <View className="mx-4 mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-4">
                            <AppText styles="text-sm text-red-200">
                                {statusCheckError}
                            </AppText>
                            <TouchableOpacity
                                onPress={checkVerificationStatus}
                                className="mt-3 self-start rounded-lg bg-accent px-4 py-2"
                                activeOpacity={0.8}
                                accessible
                                accessibilityRole="button"
                                accessibilityLabel="Retry verification status request"
                            >
                                <AppText styles="text-xs text-white font-nunbold">
                                    Retry
                                </AppText>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* ID Upload Step */}
                    {currentStep === 'id-upload' && (
                        <PhotoCapture
                            onPhotoCapture={handleIDUpload}
                            title="Upload Your National ID"
                            instructions="Please upload a clear photo of your national ID card, driver's license, or passport."
                            requirements={[
                                'Photo must be clear and readable',
                                'All corners of ID must be visible',
                                'No glare or shadows',
                                'Accepted formats: JPG, PNG',
                            ]}
                            captureButtonText="Continue to Selfie"
                            isLoading={isLoading}
                            error={uploadError}
                            cameraFacing="back"
                        />
                    )}

                    {/* Selfie Step */}
                    {currentStep === 'selfie' && (
                        <View className="gap-4">
                            {/* Success Badge */}
                            <View
                                className="mx-4 p-4 rounded-xl border flex-row items-center gap-3"
                                style={{ backgroundColor: colors.accent50 + "1A", borderColor: colors.accent50 }}
                            >
                                <Ionicons name="checkmark-circle" size={20} color={colors.accent50} />
                                <AppText styles="text-sm text-black">
                                    ID uploaded successfully!
                                </AppText>
                            </View>

                            <PhotoCapture
                                onPhotoCapture={handleSelfieUpload}
                                title="Take a Selfie"
                                instructions="Take a clear selfie to verify your identity matches your ID."
                                requirements={[
                                    'Face must be clearly visible',
                                    'Remove glasses and hats',
                                    'Good lighting, neutral expression',
                                    'Look directly at camera',
                                ]}
                                captureButtonText="Submit Verification"
                                isLoading={isLoading}
                                error={uploadError}
                                cameraFacing="front"
                                useLightText
                            />
                        </View>
                    )}

                    {/* Result Step */}
                    {currentStep === 'result' && (
                        <View className="px-4 pb-6">
                            {verificationStatus === 'pending' && (
                                <View
                                    className="p-8 rounded-xl border-2 items-center"
                                    style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
                                >
                                    {!hasPendingTimedOut && (
                                        <>
                                            <ActivityIndicator size="large" color={colors.accent} />
                                            <AppText styles="text-lg text-white mt-4 text-center font-nunbold">
                                                Verifying Your Identity...
                                            </AppText>
                                            <AppText styles="text-sm text-slate-200 mt-2 text-center">
                                                This usually takes a few seconds
                                            </AppText>
                                        </>
                                    )}
                                    {hasPendingTimedOut && pendingTimeoutMessage && (
                                        <View className="mt-4 w-full rounded-lg border border-red-500/40 bg-red-500/10 p-3">
                                            <AppText styles="text-sm text-red-200 text-center">
                                                {pendingTimeoutMessage}
                                            </AppText>
                                            {pendingTimeoutDiagnosis && (
                                                <AppText styles="text-xs text-red-100 mt-2 text-center">
                                                    {pendingTimeoutDiagnosis}
                                                </AppText>
                                            )}
                                            <View className="mt-3 flex-row gap-2 justify-center">
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setPendingTimeoutMessage(null);
                                                        setPendingTimeoutDiagnosis(null);
                                                        setHasPendingTimedOut(false);
                                                        checkVerificationStatus();
                                                    }}
                                                    className="rounded-lg bg-accent px-4 py-2"
                                                    activeOpacity={0.8}
                                                    accessible
                                                    accessibilityRole="button"
                                                    accessibilityLabel="Retry verification status check"
                                                >
                                                    <AppText styles="text-xs text-white font-nunbold">
                                                        Retry Status Check
                                                    </AppText>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setCurrentStep("selfie");
                                                        setVerificationStatus("id_uploaded");
                                                        setPendingTimeoutMessage(null);
                                                        setPendingTimeoutDiagnosis(null);
                                                        setHasPendingTimedOut(false);
                                                    }}
                                                    className="rounded-lg border border-accent px-4 py-2"
                                                    activeOpacity={0.8}
                                                    accessible
                                                    accessibilityRole="button"
                                                    accessibilityLabel="Go back to selfie upload"
                                                >
                                                    <AppText styles="text-xs text-white font-nunbold">
                                                        Re-upload Selfie
                                                    </AppText>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            )}

                            {verificationStatus === 'verified' && (
                                <View
                                    className="p-8 rounded-xl border-2 items-center"
                                    style={{ backgroundColor: colors.primary100, borderColor: colors.accent50 }}
                                >
                                    <View
                                        className="w-20 h-20 rounded-full items-center justify-center mb-4"
                                        style={{ backgroundColor: colors.accent50 + "33" }}
                                    >
                                        <Ionicons name="checkmark-circle" size={48} color={colors.accent50} />
                                    </View>
                                    <AppText styles="text-xl text-black mb-2 text-center font-nunbold">
                                        Verification Successful!
                                    </AppText>
                                    <AppText styles="text-sm text-black mb-6 text-center" style={{ opacity: 0.7 }}>
                                        Your identity has been verified. You can now create events.
                                    </AppText>

                                    <View
                                        onTouchEnd={() => router.push('/dashboard/events/create')}
                                        className="w-full p-4 rounded-xl items-center"
                                        style={{ backgroundColor: colors.accent }}
                                        accessible
                                        accessibilityRole="button"
                                        accessibilityLabel="Create first event"
                                    >
                                        <AppText styles="text-base text-white font-nunbold">
                                            Create Your First Event
                                        </AppText>
                                    </View>
                                </View>
                            )}

                            {verificationStatus === 'rejected' && (
                                <View
                                    className="p-8 rounded-xl border-2"
                                    style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
                                >
                                    <View
                                        className="w-20 h-20 rounded-full items-center justify-center mb-4 mx-auto"
                                        style={{ backgroundColor: colors.accent + "33" }}
                                    >
                                        <Ionicons name="close-circle" size={48} color={colors.accent} />
                                    </View>
                                    <AppText styles="text-xl text-black mb-2 text-center font-nunbold">
                                        Verification Failed
                                    </AppText>
                                    <AppText styles="text-sm text-black mb-6 text-center" style={{ opacity: 0.7 }}>
                                        {rejectionReason || 'We couldn\'t verify your identity. Please try again.'}
                                    </AppText>

                                    <View
                                        onTouchEnd={handleRetry}
                                        className="w-full p-4 rounded-xl items-center"
                                        style={{ backgroundColor: colors.accent }}
                                        accessible
                                        accessibilityRole="button"
                                        accessibilityLabel="Try verification again"
                                    >
                                        <AppText styles="text-base text-white font-nunbold">
                                            Try Again
                                        </AppText>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
            </RequireAuth>
        </Screen>
    );
};

export default VerifyProfileScreen;
