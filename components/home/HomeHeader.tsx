import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import colors from "@/config/colors";

interface HomeHeaderProps {
  onProfilePress?: () => void;
}

export default function HomeHeader({ onProfilePress }: HomeHeaderProps) {
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuth();

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else if (isAuthenticated) {
      router.push("/dashboard/profile/index");
    } else {
      router.push("/(auth)/login");
    }
  };

  return (
    <View
      className="flex-row items-center justify-between pb-4"
      style={{ paddingTop: insets.top + 8 }}
    >
      {/* Logo / Brand */}
      <View className="flex-row items-center gap-2">
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.accent }}
        >
          <Ionicons name="ticket" size={20} color={colors.white} />
        </View>
        <View>
          <Text className="text-xl font-bold text-white">CafaTickets</Text>
          <Text className="text-xs text-white/60">Discover Events</Text>
        </View>
      </View>

      {/* Right side - Profile or Login */}
      <View className="flex-row items-center gap-3">
        {/* Notification bell */}
        {/* {isAuthenticated && (
          <Pressable
            onPress={() => router.push("/dashboard/notifications")}
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.white} />
          </Pressable>
        )} */}

        {/* Profile / Login Button */}
        <Pressable
          onPress={handleProfilePress}
          className="h-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: isAuthenticated
              ? "rgba(255,255,255,0.1)"
              : colors.accent,
            paddingHorizontal: isAuthenticated ? 0 : 16,
            width: isAuthenticated ? 40 : "auto",
          }}
        >
          {isAuthenticated ? (
            user?.profile_image ? (
              <Image
                source={{ uri: user.profile_image }}
                className="h-10 w-10 rounded-full"
                contentFit="cover"
              />
            ) : (
              <View
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.accent }}
              >
                <Text className="text-sm font-bold text-white">
                  {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              </View>
            )
          ) : (
            <Link href="/login" className="font-semibold text-white">Login</Link>
          )}
        </Pressable>
      </View>
    </View>
  );
}
