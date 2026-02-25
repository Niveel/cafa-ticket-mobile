import { ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
    Screen,
    ProfileHeader,
    ProfileQuickActions,
    ProfileAccountDetails,
    ProfileNotificationSettings,
    RequireAuth,
    Nav,
    AppButton
} from "@/components";
import { useAuth } from "@/context";
import colors from "@/config/colors";

const ProfileScreen = () => {
    const { user } = useAuth();

    return (
        <Screen statusBarStyle="light-content" statusBarBg={colors.primary}>
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
            </RequireAuth>
        </Screen>
    );
};

export default ProfileScreen;
