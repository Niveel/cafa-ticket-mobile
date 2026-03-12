import { View, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
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

const VerifyProfileScreen = () => {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState<VerificationStep>('id-upload');
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('not_started');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState<string | null>(null);

    useEffect(() => {
        checkVerificationStatus();
    }, []);

    useEffect(() => {
        if (user?.is_organizer) {
            router.replace('/dashboard/events/create');
        }
    }, [user]);

    const checkVerificationStatus = async () => {
        try {
            const result = await getVerificationStatus();

            if (result && result.success) {
                const status = result.data.verification_status;
                setVerificationStatus(status);

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
            }
        } catch (error) {
            console.error('Error checking verification status:', error);
        }
    };

    const handleIDUpload = async (uri: string) => {
        setIsLoading(true);
        setUploadError(null);

        try {
            const data = await uploadIDDocument(uri);

            if (data && data.success) {
                setVerificationStatus('id_uploaded');
                setCurrentStep('selfie');
            } else {
                const errorMessage = data?.message || data?.error || 'Failed to upload ID. Please try again.';
                setUploadError(errorMessage);
            }
        } catch (error: any) {
            console.error('ID upload error:', error);
            const errorMessage = error?.response?.data?.message || 'Network error. Please check your connection and try again.';
            setUploadError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelfieUpload = async (uri: string) => {
        setIsLoading(true);
        setUploadError(null);
        setCurrentStep('result');
        setVerificationStatus('pending');

        try {
            const data = await uploadSelfieImage(uri);

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
                    setVerificationStatus('pending');
                }
            } else {
                const errorMessage = data?.message || data?.error || 'Failed to upload selfie. Please try again.';
                setUploadError(errorMessage);
                setCurrentStep('selfie');
                setVerificationStatus('id_uploaded');
            }
        } catch (error: any) {
            console.error('Selfie upload error:', error);
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
            } else {
                setUploadError(data?.message || 'Failed to reset verification. Please try again.');
            }
        } catch (error: any) {
            console.error('Retry verification error:', error);
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
                                    <ActivityIndicator size="large" color={colors.accent} />
                                    <AppText styles="text-lg text-white mt-4 text-center font-nunbold">
                                        Verifying Your Identity...
                                    </AppText>
                                    <AppText styles="text-sm text-slate-200 mt-2 text-center">
                                        This usually takes a few seconds
                                    </AppText>
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
