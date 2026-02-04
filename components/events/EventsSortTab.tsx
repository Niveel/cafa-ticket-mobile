import { View, Modal, TouchableOpacity } from "react-native";
import { useState } from "react";
import type { FC } from "react";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../ui/AppText";
import colors from "@/config/colors";

interface EventsSortTabProps {
    selectedSort: string;
    onSortChange: (sort: string) => void;
}

const sortOptions = [
    { value: "-start_date", label: "Latest First" },
    { value: "start_date", label: "Earliest First" },
    { value: "-created_at", label: "Recently Added" },
    { value: "price", label: "Price: Low to High" },
    { value: "-price", label: "Price: High to Low" },
];

const EventsSortTab: FC<EventsSortTabProps> = ({ selectedSort, onSortChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption =
        sortOptions.find((opt) => opt.value === selectedSort) || sortOptions[0];

    const handleSelect = (value: string) => {
        onSortChange(value);
        setIsOpen(false);
    };

    return (
        <>
            {/* Sort Button */}
            <TouchableOpacity
                onPress={() => setIsOpen(true)}
                className="flex-row items-center gap-3 px-6 py-3 bg-primary-100 rounded-xl border-2 border-accent"
                activeOpacity={0.7}
            >
                <Ionicons name="swap-vertical" size={20} color={colors.accent50} />
                <AppText styles="text-sm text-white font-nunbold">
                    {selectedOption.label}
                </AppText>
                <Ionicons name="chevron-down" size={16} color={colors.white} />
            </TouchableOpacity>

            {/* Sort Modal */}
            <Modal
                visible={isOpen}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity
                    className="flex-1 bg-primary/80 justify-end"
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >
                    <TouchableOpacity activeOpacity={1}>
                        <View className="bg-primary rounded-t-3xl border-2 border-accent p-2">
                            {sortOptions.map((option) => {
                                const isSelected = selectedSort === option.value;

                                return (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() => handleSelect(option.value)}
                                        className={`flex-row items-center gap-3 p-4 rounded-xl ${isSelected ? "bg-accent" : ""
                                            }`}
                                        activeOpacity={0.7}
                                    >
                                        <View className="w-5 h-5">
                                            {isSelected && (
                                                <Ionicons name="checkmark" size={20} color={colors.white} />
                                            )}
                                        </View>
                                        <AppText
                                            styles={`text-sm font-nunbold ${isSelected ? "text-white" : "text-slate-200"}`}
                                        >
                                            {option.label}
                                        </AppText>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

export default EventsSortTab;