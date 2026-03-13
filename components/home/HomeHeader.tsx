import { View, Pressable, Image } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import colors from "@/config/colors";
import { getFullImageUrl } from "@/utils/imageUrl";
import AppText from "../ui/AppText";

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
      router.push("/dashboard/profile");
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
          <AppText styles="text-xl font-bold text-black">CafaTickets</AppText>
          <AppText styles="text-xs text-black/60">Discover Events</AppText>
        </View>
      </View>

      {/* Right side - Profile or Login */}
      <View className="flex-row items-center gap-3">
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
                source={{ uri: getFullImageUrl(user?.profile_image) || undefined }}
                className="h-10 w-10 rounded-full bg-cover"
              />
            ) : (
              <View
                className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
                style={{ backgroundColor: colors.accent }}
              >
                <AppText styles="text-sm font-bold text-white">
                  {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                </AppText>
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
