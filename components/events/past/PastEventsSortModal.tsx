import { View, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../ui/AppText";
import colors from "@/config/colors";

const sortOptions = [
    { value: "-start_date", label: "Latest First", description: "Newest events first" },
    { value: "start_date", label: "Earliest First", description: "Oldest events first" },
    { value: "-created_at", label: "Recently Added", description: "Newly created events" },
    { value: "created_at", label: "Oldest Added", description: "Earliest created events" },
    { value: "price", label: "Price: Low to High", description: "Cheapest tickets first" },
    { value: "-price", label: "Price: High to Low", description: "Most expensive first" },
    { value: "popularity", label: "Most Popular", description: "Highest ticket sales" },
];

interface PastEventsSortModalProps {
    visible: boolean;
    selectedSort: string;
    onSelect: (value: string) => void;
    onClose: () => void;
}

const PastEventsSortModal = ({ visible, selectedSort, onSelect, onClose }: PastEventsSortModalProps) => {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <View
                    className="rounded-t-3xl p-6"
                    style={{ backgroundColor: colors.primary, maxHeight: "80%" }}
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-6">
                        <View className="flex-row items-center gap-3">
                            <View
                                className="w-10 h-10 rounded-lg items-center justify-center"
                                style={{ backgroundColor: colors.accent + "33" }}
                            >
                                <Ionicons name="swap-vertical" size={20} color={colors.accent50} />
                            </View>
                            <AppText styles="text-lg text-white font-nunbold">
                                Sort Events
                            </AppText>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-10 h-10 items-center justify-center"
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="close" size={24} color={colors.white} />
                        </TouchableOpacity>
                    </View>

                    {/* Sort Options */}
                    <View className="gap-2">
                        {sortOptions.map((option) => {
                            const isSelected = selectedSort === option.value;

                            return (
                                <TouchableOpacity
                                    key={option.value}
                                    onPress={() => onSelect(option.value)}
                                    className="flex-row items-start gap-3 p-4 rounded-xl"
                                    style={{
                                        backgroundColor: isSelected ? colors.accent : colors.primary100,
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <View className="w-5 h-5 mt-0.5">
                                        {isSelected && (
                                            <Ionicons name="checkmark" size={20} color={colors.white} />
                                        )}
                                    </View>
                                    <View className="flex-1">
                                        <AppText styles="text-sm text-white mb-1 font-nunbold">
                                            {option.label}
                                        </AppText>
                                        <AppText
                                            styles="text-xs text-white"
                                            style={{ opacity: 0.7 }}
                                        >
                                            {option.description}
                                        </AppText>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default PastEventsSortModal;