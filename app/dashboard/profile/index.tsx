import { ScrollView } from "react-native";

import { Screen } from "@/components";
import {
    ProfileHeader,
    ProfileQuickActions,
    ProfileAccountDetails,
    ProfileNotificationSettings,
    RequireAuth,
    Nav
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
                    </ScrollView>
                )}
            </RequireAuth>
        </Screen>
    );
};

export default ProfileScreen;