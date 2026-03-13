import { ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { router } from "expo-router";

import {
    Screen,
    ProfileHeader,
    ProfileQuickActions,
    ProfileAccountDetails,
    ProfileNotificationSettings,
    RequireAuth,
    Nav,
    AppButton,
    AppBottomSheet,
    ConfirmAction,
} from "@/components";
import type { AppBottomSheetRef } from "@/components";
import { useAuth } from "@/context";
import colors from "@/config/colors";

const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const bottomSheetRef = useRef<AppBottomSheetRef>(null);

    const handleLogoutPress = () => {
        bottomSheetRef.current?.open();
    };

    const handleCancelLogout = () => {
        bottomSheetRef.current?.close();
    };

    const handleConfirmLogout = async () => {
        await logout();
        bottomSheetRef.current?.close();
        router.replace("/(tabs)");
    };

    return (
        <Screen statusBarStyle="dark-content" statusBarBg={colors.primary}>
            <RequireAuth>
                <Nav title="Profile" />
                {user && (
                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 5, paddingBottom: 50, gap: 16 }}
                    >
                        {/* Profile Header */}
                        <ProfileHeader user={user} />

                        {/* Quick Actions */}
                        <ProfileQuickActions />

                        {/* Account Details */}
                        <ProfileAccountDetails user={user} />

                        {/* Notification Settings */}
                        <ProfileNotificationSettings settings={user.settings} />

                        {/* Logout */}
                        <View className="px-1">
                            <AppButton
                                title="Logout"
                                variant="primarySolid"
                                fullWidth
                                onClick={handleLogoutPress}
                                icon={<Ionicons name="log-out-outline" size={18} color="#fff" />}
                            />
                        </View>

                        {/* Delete Account */}
                        <View className="px-1">
                            <AppButton
                                href="/dashboard/settings/privacy"
                                title="Delete Account"
                                variant="danger"
                                fullWidth
                                icon={<Ionicons name="trash-outline" size={18} color="#fff" />}
                            />
                        </View>
                    </ScrollView>
                )}

                <AppBottomSheet ref={bottomSheetRef} customSnapPoints={["55%"]}>
                    <ConfirmAction
                        title="Logout"
                        desc="Are you sure you want to logout from your account?"
                        onCancel={handleCancelLogout}
                        onConfirm={handleConfirmLogout}
                        confirmBtnTitle="Logout"
                        isDestructive={true}
                    />
                </AppBottomSheet>
            </RequireAuth>
        </Screen>
    );
};

export default ProfileScreen;
