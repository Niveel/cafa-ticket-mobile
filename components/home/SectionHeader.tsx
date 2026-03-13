import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/config/colors";
import AppText from "../ui/AppText";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
  showSeeAll?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  onSeeAll,
  showSeeAll = true,
}: SectionHeaderProps) {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <View>
        <AppText styles="text-lg font-bold text-black">{title}</AppText>
        {subtitle && (
          <AppText styles="text-sm text-black/60">{subtitle}</AppText>
        )}
      </View>

      {showSeeAll && onSeeAll && (
        <Pressable
          onPress={onSeeAll}
          className="flex-row items-center gap-1"
        >
          <AppText style={{ color: colors.accent }} styles="text-sm font-medium">
            See All
          </AppText>
          <Ionicons name="arrow-forward" size={14} color={colors.accent} />
        </Pressable>
      )}
    </View>
  );
}
