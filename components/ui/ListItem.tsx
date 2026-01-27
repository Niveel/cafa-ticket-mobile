import { View, TouchableOpacity } from "react-native";
import { memo } from "react";
import type { FC } from "react";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import colors from "@/config/colors";

interface ListItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress: () => void;
    borderColor?: string;
    iconColor?: string;
    textColor?: string;
    showChevron?: boolean;
    subtitle?: string;
    rightElement?: React.ReactNode;
}

const ListItem: FC<ListItemProps> = ({
    icon,
    title,
    onPress,
    borderColor = colors.accent,
    iconColor = colors.accent50,
    textColor,
    showChevron = true,
    subtitle,
    rightElement,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="min-h-[56px] w-full flex-row rounded-xl items-center px-4 py-3"
            style={{
                borderWidth: 1,
                borderColor: borderColor,
                backgroundColor: colors.primary + "80",
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={title}
            accessibilityHint={subtitle ? `${subtitle}. Double tap to open.` : "Double tap to open"}
        >
            {/* Icon */}
            <View className="mr-4">
                <Ionicons name={icon} size={24} color={iconColor} />
            </View>

            {/* Content */}
            <View className="flex-1">
                <AppText
                    styles={textColor ? `text-sm ${textColor}` : "text-sm text-white"}
                    font="font-isemibold"
                >
                    {title}
                </AppText>
                {subtitle && (
                    <AppText styles="text-xs text-slate-400 mt-0.5" font="font-iregular">
                        {subtitle}
                    </AppText>
                )}
            </View>

            {/* Right Element or Chevron */}
            <View className="ml-3">
                {rightElement || (
                    showChevron && (
                        <Ionicons name="chevron-forward" size={20} color={iconColor} />
                    )
                )}
            </View>
        </TouchableOpacity>
    );
};

export default memo(ListItem);