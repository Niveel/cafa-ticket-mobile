import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import colors from "@/config/colors";

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Search events, venues, cities...",
}: SearchBarProps) {
  const handlePress = () => {
    router.push("/(tabs)/events?search=true");
  };

  return (
    <Pressable onPress={handlePress}>
      <View
        className="flex-row items-center gap-3 rounded-2xl px-4 py-3"
        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      >
        <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.5)"
          className="flex-1 text-base text-white"
          editable={!!onChangeText}
          pointerEvents={onChangeText ? "auto" : "none"}
        />
        <View
          className="h-8 w-8 items-center justify-center rounded-xl"
          style={{ backgroundColor: colors.accent }}
        >
          <Ionicons name="options" size={16} color={colors.white} />
        </View>
      </View>
    </Pressable>
  );
}
