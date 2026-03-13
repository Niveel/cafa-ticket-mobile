import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../ui/AppText';

type Option = {
    label: string;
    value: string;
    metadata?: Record<string, any>;
};

type SearchableSelectProps = {
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    options: Option[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
    error?: string;
    labelColor?: string;
};

const SearchableSelect = ({
    label,
    value,
    onChange,
    onBlur,
    options,
    placeholder = 'Search...',
    required = false,
    disabled = false,
    isLoading = false,
    error,
    labelColor = "text-black",
}: SearchableSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter options based on search query
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get selected option label
    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption?.label || value || '';

    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue);
        setIsOpen(false);
        setSearchQuery('');
        onBlur();
    };

    const handleClear = () => {
        onChange('');
        setSearchQuery('');
    };

    const handleOpen = () => {
        if (disabled || isLoading) return;
        setIsOpen(true);
        setSearchQuery('');
    };

    const handleClose = () => {
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <View className="w-full">
            {/* Label */}
            <AppText
                styles={`text-sm font-isemibold mb-2 ${labelColor}`}
                accessibilityRole="text"
            >
                {label}
                {required && <AppText styles="text-red-400 ml-1"> *</AppText>}
            </AppText>

            {/* Selected Value Display / Trigger */}
            <TouchableOpacity
                onPress={handleOpen}
                disabled={disabled || isLoading}
                className={`
                    w-full px-2 py-3 bg-primary rounded-lg border-2 flex-row items-center justify-between
                    ${isOpen ? 'border-secondary' : 'border-secondary/30'}
                    ${error ? 'border-red-500' : ''}
                    ${disabled || isLoading ? 'opacity-50' : ''}
                `}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`${label}. ${displayValue ? `Current value: ${displayValue}` : "No selection"}`}
                accessibilityHint="Double tap to search and choose an option"
                accessibilityState={{ disabled: disabled || isLoading }}
            >
                <AppText styles={`text-sm flex-1 ${displayValue ? 'text-white' : 'text-slate-500'}`}>
                    {isLoading ? 'Loading...' : displayValue || placeholder}
                </AppText>
                
                <View className="flex-row items-center gap-2">
                    {value && !disabled && !isLoading && (
                        <TouchableOpacity
                            onPress={handleClear}
                            className="p-1"
                            accessible
                            accessibilityRole="button"
                            accessibilityLabel={`Clear ${label}`}
                        >
                            <Ionicons name="close-circle" size={18} color="#94a3b8" />
                        </TouchableOpacity>
                    )}
                    <Ionicons 
                        name={isOpen ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="#94a3b8" 
                    />
                </View>
            </TouchableOpacity>

            {/* Modal Dropdown */}
            <Modal
                visible={isOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={handleClose}
            >
                <TouchableOpacity 
                    className="flex-1 bg-black/50 justify-center items-center p-4"
                    activeOpacity={1}
                    onPress={handleClose}
                >
                    <TouchableOpacity 
                        activeOpacity={1}
                        className="w-full max-w-lg bg-primary border-2 border-secondary rounded-xl overflow-hidden"
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <View className="flex-row items-center justify-between p-4 border-b border-secondary/30">
                            <AppText styles="text-base font-isemibold text-white">{label}</AppText>
                            <TouchableOpacity onPress={handleClose}>
                                <Ionicons name="close" size={24} color="#cbd5e1" />
                            </TouchableOpacity>
                        </View>

                        {/* Search Input */}
                        <View className="p-4 border-b border-secondary/30">
                            <View className="relative">
                                <Ionicons 
                                    name="search" 
                                    size={18} 
                                    color="#94a3b8" 
                                    style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }}
                                />
                                <TextInput
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    placeholder="Type to search..."
                                    placeholderTextColor="#94a3b8"
                                    className="w-full pl-10 pr-2 py-2 bg-primary/50 border-2 border-secondary/30 text-white text-sm rounded-lg font-iregular"
                                    accessible
                                    accessibilityLabel={`Search ${label}`}
                                    accessibilityHint="Type to filter options, then tap a result"
                                />
                            </View>
                        </View>

                        {/* Options List */}
                        <FlatList
                            data={filteredOptions}
                            keyExtractor={(item) => item.value}
                            className="max-h-96"
                            ListEmptyComponent={
                                <View className="px-4 py-6">
                                    <AppText styles="text-center text-sm text-slate-400">
                                        No options found
                                    </AppText>
                                </View>
                            }
                            renderItem={({ item }) => {
                                const isSelected = item.value === value;
                                
                                return (
                                    <TouchableOpacity
                                        onPress={() => handleSelect(item.value)}
                                        className={`
                                            px-4 py-3 flex-row items-center justify-between
                                            ${isSelected ? 'bg-secondary/20' : ''}
                                        `}
                                        activeOpacity={0.7}
                                        accessible
                                        accessibilityRole="button"
                                        accessibilityLabel={item.label}
                                        accessibilityHint="Double tap to select this option"
                                        accessibilityState={{ selected: isSelected }}
                                    >
                                        <AppText styles={`text-sm flex-1 ${isSelected ? 'text-secondary font-isemibold' : 'text-slate-200 font-iregular'}`}>
                                            {item.label}
                                        </AppText>
                                        {isSelected && (
                                            <Ionicons name="checkmark" size={20} color="#425d85" />
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                        />

                        {/* Results Count */}
                        {searchQuery && (
                            <View className="px-4 py-2 border-t border-secondary/30 bg-primary">
                                <AppText styles="text-xs text-slate-400">
                                    {filteredOptions.length} result{filteredOptions.length !== 1 ? 's' : ''} found
                                </AppText>
                            </View>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default SearchableSelect;
