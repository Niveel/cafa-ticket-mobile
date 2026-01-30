import { View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { AppText } from "@/components";
import { useAuth } from "@/context";
import colors from "@/config/colors";

interface NavProps {
  title?: string;
  onPress?: () => void;
}

const Nav = ({ title = "", onPress }: NavProps) => {
  const { user } = useAuth();

  return (
    <View className="w-full bg-secondary flex-row items-center justify-between py-2 px-4 mb-2 rounded-full">
      <TouchableOpacity
        className="bg-primary w-10 h-10 rounded-full items-center border border-accent justify-center"
        activeOpacity={0.8}
        accessible={true}
        accessibilityLabel="back"
        accessibilityHint="press to go back"
        onPress={() => {
          if (onPress) {
            onPress();
          } else {
            router.back();
          }
        }}
      >
        <Ionicons name="arrow-back" size={22} color={colors.accent} />
      </TouchableOpacity>
      
      <AppText styles="flex-1 text-center">{title}</AppText>
      
      {user && user.profile_image && (
        <View className="border border-secondary w-10 h-10 rounded-full">
          <Image
            source={{ uri: user.profile_image }}
            className="w-full h-full rounded-full"
            accessibilityLabel="User profile picture"
          />
        </View>
      )}
      
      {!user?.profile_image && <View className="w-10" />}
    </View>
  );
};

export default Nav;