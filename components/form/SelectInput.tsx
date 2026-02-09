import { View, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import AppText from "../ui/AppText";
import colors from "@/config/colors";

type Option = {
    value: string;
    label: string;
};

type Props = {
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    options: Option[];
    required?: boolean;
    placeholder?: string;
    error?: string;
    labelColor?: string;
};

const SelectInput = ({
    label,
    value,
    onChange,
    onBlur,
    options,
    required = false,
    placeholder,
    error,
    labelColor="text-white",
}: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(opt => opt.value === value);
    const displayText = selectedOption?.label || placeholder || `Select ${label}`;

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        onBlur?.();
        setIsOpen(false);
    };

    return (
        <View className="w-full">
            {/* Label */}
            <View className="mb-2">
                <AppText styles={`text-sm ${labelColor}`}>
                    {label}
                    {required && (
                        <AppText styles="text-sm text-red-400">
                            {" *"}
                        </AppText>
                    )}
                </AppText>
            </View>

            {/* Select Button */}
            <TouchableOpacity
                onPress={() => setIsOpen(true)}
                className="border-2 rounded-xl px-4 py-3 flex-row items-center justify-between"
                style={{
                    borderColor: error ? '#ef4444' : colors.accent,
                    backgroundColor: colors.primary100
                }}
                activeOpacity={0.7}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`${label}. Current selection: ${displayText}`}
                accessibilityHint="Tap to open selection menu"
            >
                <AppText
                    styles={`text-base ${value ? 'text-white' : 'text-slate-400'}`}
                >
                    {displayText}
                </AppText>
                <Ionicons
                    name="chevron-down"
                    size={20}
                    color={colors.white}
                    style={{ opacity: 0.6 }}
                />
            </TouchableOpacity>

            {/* Error Message */}
            {error && (
                <View className="flex-row items-start gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20 mt-2">
                    <Ionicons name="alert-circle" size={16} color="#ef4444" />
                    <AppText styles="text-xs text-red-400 flex-1">
                        {error}
                    </AppText>
                </View>
            )}

            {/* Options Modal */}
            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <Pressable
                    className="flex-1"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onPress={() => setIsOpen(false)}
                >
                    <View className="flex-1 justify-center px-4">
                        <Pressable onPress={(e) => e.stopPropagation()}>
                            <View
                                className="rounded-xl overflow-hidden border-2"
                                style={{
                                    backgroundColor: colors.primary,
                                    borderColor: colors.accent,
                                    maxHeight: 400
                                }}
                            >
                                {/* Header */}
                                <View
                                    className="p-4 border-b flex-row items-center justify-between"
                                    style={{ borderColor: colors.accent + "33" }}
                                >
                                    <AppText styles="text-base text-white font-nunbold">
                                        {label}
                                    </AppText>
                                    <TouchableOpacity
                                        onPress={() => setIsOpen(false)}
                                        className="w-8 h-8 items-center justify-center rounded-full"
                                        style={{ backgroundColor: colors.primary200 }}
                                        accessible
                                        accessibilityRole="button"
                                        accessibilityLabel="Close selection menu"
                                    >
                                        <Ionicons name="close" size={20} color={colors.white} />
                                    </TouchableOpacity>
                                </View>

                                {/* Options List */}
                                <FlatList
                                    data={options}
                                    keyExtractor={(item) => item.value}
                                    renderItem={({ item }) => {
                                        const isSelected = item.value === value;
                                        return (
                                            <TouchableOpacity
                                                onPress={() => handleSelect(item.value)}
                                                className="px-4 py-4 border-b flex-row items-center justify-between"
                                                style={{
                                                    borderColor: colors.accent + "1A",
                                                    backgroundColor: isSelected ? colors.accent + "1A" : 'transparent'
                                                }}
                                                activeOpacity={0.7}
                                                accessible
                                                accessibilityRole="button"
                                                accessibilityLabel={item.label}
                                                accessibilityState={{ selected: isSelected }}
                                            >
                                                <AppText
                                                    styles={`text-base ${isSelected ? 'text-white font-nunbold' : 'text-white'}`}
                                                >
                                                    {item.label}
                                                </AppText>
                                                {isSelected && (
                                                    <Ionicons
                                                        name="checkmark-circle"
                                                        size={24}
                                                        color={colors.accent50}
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    }}
                                    initialNumToRender={10}
                                    maxToRenderPerBatch={10}
                                    windowSize={5}
                                />
                            </View>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

export default SelectInput;