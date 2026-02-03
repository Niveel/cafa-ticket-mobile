import React from 'react';
import { View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/config/colors';

import { AppText } from '@/components';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('🔴 ErrorBoundary caught:', error);
        console.error('🔴 Component stack:', errorInfo.componentStack);
        
        this.setState({
            error,
            errorInfo,
        });

        this.props.onError?.(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <ScrollView 
                    className="flex-1 px-4 pt-6" 
                    style={{ backgroundColor: colors.primary }}
                >
                    <View className="gap-4">
                        {/* Error Icon */}
                        <View className="items-center py-8">
                            <View 
                                className="w-20 h-20 rounded-full items-center justify-center mb-4"
                                style={{ backgroundColor: colors.accent + "33" }}
                            >
                                <Ionicons name="alert-circle" size={40} color={colors.accent} />
                            </View>
                            <AppText styles="text-xl text-white text-center mb-2" font="font-ibold">
                                Component Crashed
                            </AppText>
                            <AppText 
                                styles="text-sm text-white text-center" 
                                font="font-iregular"
                                style={{ opacity: 0.6 }}
                            >
                                The error boundary caught this crash
                            </AppText>
                        </View>

                        {/* Error Details */}
                        <View 
                            className="p-4 rounded-xl border-2"
                            style={{ 
                                backgroundColor: colors.accent + "1A", 
                                borderColor: colors.accent 
                            }}
                        >
                            <AppText styles="text-sm text-white mb-2" font="font-ibold">
                                Error Message:
                            </AppText>
                            <AppText 
                                styles="text-xs text-white" 
                                font="font-iregular"
                                style={{ opacity: 0.8 }}
                            >
                                {this.state.error?.message || 'Unknown error'}
                            </AppText>
                        </View>

                        {/* Component Stack */}
                        {this.state.errorInfo && (
                            <View 
                                className="p-4 rounded-xl border-2"
                                style={{ 
                                    backgroundColor: colors.primary100, 
                                    borderColor: colors.accent + "4D" 
                                }}
                            >
                                <AppText styles="text-sm text-white mb-2" font="font-ibold">
                                    Component Stack:
                                </AppText>
                                <ScrollView 
                                    horizontal 
                                    showsHorizontalScrollIndicator={false}
                                    style={{ maxHeight: 200 }}
                                >
                                    <AppText 
                                        styles="text-xs text-white" 
                                        font="font-iregular"
                                        style={{ opacity: 0.7 }}
                                    >
                                        {this.state.errorInfo.componentStack}
                                    </AppText>
                                </ScrollView>
                            </View>
                        )}

                        {/* Full Error */}
                        <View 
                            className="p-4 rounded-xl border-2"
                            style={{ 
                                backgroundColor: colors.primary100, 
                                borderColor: colors.accent + "4D" 
                            }}
                        >
                            <AppText styles="text-sm text-white mb-2" font="font-ibold">
                                Full Error:
                            </AppText>
                            <ScrollView style={{ maxHeight: 200 }}>
                                <AppText 
                                    styles="text-xs text-white" 
                                    font="font-iregular"
                                    style={{ opacity: 0.7 }}
                                >
                                    {this.state.error?.stack || 'No stack trace'}
                                </AppText>
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;