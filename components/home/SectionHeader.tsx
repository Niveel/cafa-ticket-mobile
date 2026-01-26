import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/config/colors";

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
        <Text className="text-lg font-bold text-white">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-white/60">{subtitle}</Text>
        )}
      </View>

      {showSeeAll && onSeeAll && (
        <Pressable
          onPress={onSeeAll}
          className="flex-row items-center gap-1"
        >
          <Text style={{ color: colors.accent }} className="text-sm font-medium">
            See All
          </Text>
          <Ionicons name="arrow-forward" size={14} color={colors.accent} />
        </Pressable>
      )}
    </View>
  );
}
