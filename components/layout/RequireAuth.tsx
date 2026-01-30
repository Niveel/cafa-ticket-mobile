import { View, TouchableOpacity } from "react-native";
import { router, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";

import { Screen, AppText, Nav } from "@/components";
import { useAuth } from "@/context";
import colors from "@/config/colors";

interface RequireAuthProps {
    children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
    const { user } = useAuth();
    const pathname = usePathname();

    if (!user) {
        return (
            <Screen statusBarStyle="light-content" statusBarBg={colors.primary}>
                <Nav />
                <View className="flex-1 items-center justify-center px-4">
                    {/* Icon */}
                    <View className="mb-6">
                        <View 
                            className="w-32 h-32 rounded-full items-center justify-center"
                            style={{ 
                                backgroundColor: colors.accent + '20',
                                borderWidth: 3,
                                borderColor: colors.accent + '40'
                            }}
                        >
                            <Ionicons name="lock-closed" size={64} color={colors.accent50} />
                        </View>
                    </View>

                    {/* Message */}
                    <View className="items-center mb-4">
                        <AppText 
                            styles="text-2xl text-white text-center mb-3" 
                            font="font-ibold"
                        >
                            Authentication Required
                        </AppText>
                        <AppText 
                            styles="text-base text-slate-300 text-center leading-relaxed px-4" 
                            font="font-iregular"
                        >
                            Please sign in to access this section and enjoy all features
                        </AppText>
                    </View>

                    {/* Login Button */}
                    <View className="">
                        <TouchableOpacity
                            onPress={() => router.push({
                                pathname: "/login",
                                params: { from: pathname },
                            })}
                            className="w-full py-4 px-6 rounded-xl items-center mb-4"
                            style={{ backgroundColor: colors.accent }}
                            activeOpacity={0.8}
                        >
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="log-in-outline" size={20} color="#fff" />
                                <AppText styles="text-base text-white" font="font-ibold">
                                    Sign In
                                </AppText>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View className="flex-row items-center w-full my-4">
                        <View className="flex-1 h-px bg-slate-600" />
                        <AppText styles="text-sm text-slate-400 mx-4" font="font-iregular">
                            OR
                        </AppText>
                        <View className="flex-1 h-px bg-slate-600" />
                    </View>

                    {/* Sign Up Section */}
                    <View className="items-center">
                        <AppText styles="text-sm text-slate-300 mb-3" font="font-iregular">
                            Don't have an account yet?
                        </AppText>
                        <TouchableOpacity
                            onPress={() => router.push('/signup')}
                            className="px-8 py-3 rounded-xl"
                            style={{ 
                                backgroundColor: 'transparent',
                                borderWidth: 2,
                                borderColor: colors.accent
                            }}
                            activeOpacity={0.8}
                        >
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="person-add-outline" size={18} color={colors.accent50} />
                                <AppText styles="text-sm" font="font-ibold">
                                    Create Account
                                </AppText>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Features Info */}
                    <View className="mt-12 w-full">
                        <AppText styles="text-xs text-slate-400 text-center mb-4" font="font-isemibold">
                            WITH AN ACCOUNT YOU CAN:
                        </AppText>
                        <View className="gap-3">
                            {[
                                { icon: 'ticket-outline', text: 'Purchase event tickets' },
                                { icon: 'calendar-outline', text: 'Track your bookings' },
                                { icon: 'notifications-outline', text: 'Get event reminders' },
                            ].map((feature, index) => (
                                <View key={index} className="flex-row items-center gap-3">
                                    <View 
                                        className="w-8 h-8 rounded-lg items-center justify-center"
                                        style={{ backgroundColor: colors.accent + '20' }}
                                    >
                                        <Ionicons name={feature.icon as any} size={16} color={colors.accent50} />
                                    </View>
                                    <AppText styles="text-sm text-slate-300" font="font-iregular">
                                        {feature.text}
                                    </AppText>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </Screen>
        );
    }

    return <>{children}</>;
};

export default RequireAuth;