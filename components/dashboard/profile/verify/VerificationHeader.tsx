import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import colors from "@/config/colors";

type VerificationStep = 'id-upload' | 'selfie' | 'result';

interface VerificationHeaderProps {
    currentStep: VerificationStep;
    userName: string;
}

const VerificationHeader = ({ currentStep, userName }: VerificationHeaderProps) => {
    const steps = [
        { id: 'id-upload' as const, label: 'ID Upload', icon: 'card-outline' as const },
        { id: 'selfie' as const, label: 'Selfie', icon: 'camera-outline' as const },
        { id: 'result' as const, label: 'Result', icon: 'checkmark-circle-outline' as const },
    ];

    const currentStepIndex = steps.findIndex(step => step.id === currentStep);

    return (
        <View className="mb-8 px-4">
            {/* Title */}
            <View className="items-center mb-6">
                <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-3"
                    style={{ backgroundColor: colors.accent + "33" }}
                >
                    <Ionicons name="shield-checkmark" size={32} color={colors.accent50} />
                </View>
                <AppText styles="text-xl text-white mb-2 text-center font-nunbold">
                    Identity Verification
                </AppText>
                <AppText styles="text-sm text-white text-center" style={{ opacity: 0.7 }}>
                    Hi {userName}! Let's verify your identity
                </AppText>
            </View>

            {/* Progress Steps */}
            <View className="flex-row items-center justify-between">
                {steps.map((step, index) => {
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;

                    return (
                        <View key={step.id} className="flex-row items-center flex-1">
                            {/* Step Circle */}
                            <View className="items-center">
                                <View
                                    className="w-12 h-12 rounded-full items-center justify-center"
                                    style={{
                                        backgroundColor: isCompleted
                                            ? colors.accent50
                                            : isActive
                                                ? colors.accent
                                                : colors.primary200,
                                    }}
                                >
                                    <Ionicons
                                        name={step.icon}
                                        size={24}
                                        color={colors.white}
                                    />
                                </View>
                                <AppText
                                    styles="text-xs mt-2 text-center"
                                    style={{
                                        color: isActive || isCompleted ? colors.accent50 : colors.white,
                                        opacity: isActive || isCompleted ? 1 : 0.5
                                    }}
                                >
                                    {step.label}
                                </AppText>
                            </View>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <View
                                    className="flex-1 h-1 mx-2"
                                    style={{
                                        backgroundColor: isCompleted ? colors.accent50 : colors.primary200
                                    }}
                                />
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default VerificationHeader;