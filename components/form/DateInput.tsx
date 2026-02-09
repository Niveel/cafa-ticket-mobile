import React, { useState } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

import AppText from '../ui/AppText';

type Props = {
    name?: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    required?: boolean;
    min?: string;
    max?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
};

const DateInput = ({ 
    name,
    label, 
    value, 
    onChange, 
    onBlur, 
    required = false, 
    min, 
    max, 
    placeholder = 'Select date',
    disabled = false,
    error
}: Props) => {
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(value ? new Date(value) : new Date());

    const handleChange = (event: any, selectedDate?: Date) => {
        setShow(Platform.OS === 'ios'); // Keep open on iOS, close on Android
        
        if (selectedDate) {
            setDate(selectedDate);
            // Format to YYYY-MM-DD
            const formattedDate = selectedDate.toISOString().split('T')[0];
            onChange(formattedDate);
            if (onBlur) onBlur();
        }
    };

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const formatMinMaxDates = () => {
        let hint = '';
        if (min) {
            const minDate = new Date(min);
            hint += `Minimum date: ${minDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}. `;
        }
        if (max) {
            const maxDate = new Date(max);
            hint += `Maximum date: ${maxDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}.`;
        }
        return hint.trim();
    };

    // Build accessibility label
    const buildAccessibilityLabel = () => {
        let accessibilityLabel = label;
        if (required) accessibilityLabel += ', required';
        if (value) accessibilityLabel += `, selected date: ${formatDisplayDate(value)}`;
        else accessibilityLabel += `, ${placeholder}`;
        return accessibilityLabel;
    };

    // Build accessibility hint
    const buildAccessibilityHint = () => {
        let hint = 'Double tap to open date picker. ';
        const minMaxHint = formatMinMaxDates();
        if (minMaxHint) hint += minMaxHint;
        if (error) hint += ` Error: ${error}`;
        return hint.trim();
    };

    return (
        <View className="w-full">
            {/* Label */}
            <AppText 
                className="mb-2 text-sm font-isemibold text-black"
                {...(name && { nativeID: `${name}-label` })}
                accessibilityRole="text"
            >
                {label}
                {required && (
                    <AppText 
                        className="text-red-400 ml-1"
                        accessibilityLabel="required"
                    >
                        {' *'}
                    </AppText>
                )}
            </AppText>
            
            {/* Date Input Button */}
            <TouchableOpacity
                onPress={() => !disabled && setShow(true)}
                className={`relative w-full h-12 px-2 border-2 rounded-xl flex-row items-center  ${
                    disabled 
                        ? 'bg-gray-700 border-gray-600 opacity-50' 
                        : error 
                            ? 'bg-primary border-red-500' 
                            : 'bg-primary border-accent'
                }`}
                disabled={disabled}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={buildAccessibilityLabel()}
                accessibilityHint={buildAccessibilityHint()}
                accessibilityState={{
                    disabled: disabled,
                    selected: !!value
                }}
                {...(name && { 'aria-labelledby': `${name}-label` })}
                aria-required={required}
                aria-disabled={disabled}
                aria-invalid={!!error}
            >
                <Ionicons 
                    name="calendar" 
                    size={20} 
                    color={disabled ? '#6B7280' : '#425d85'} 
                    style={{ marginRight: 8 }}
                    importantForAccessibility="no"
                    accessibilityElementsHidden={true}
                />
                <AppText 
                    className={`text-sm flex-1 ${
                        disabled 
                            ? 'text-gray-500' 
                            : value 
                                ? 'text-white' 
                                : 'text-slate-500'
                    }`}
                    importantForAccessibility="no"
                    accessibilityElementsHidden={true}
                >
                    {value ? formatDisplayDate(value) : placeholder}
                </AppText>
            </TouchableOpacity>

            {/* Error Message */}
            {error && (
                <View 
                    className="mt-1"
                    accessible={true}
                    accessibilityRole="alert"
                    accessibilityLiveRegion="polite"
                >
                    <AppText 
                        className="text-xs text-red-400"
                        {...(name && { nativeID: `${name}-error` })}
                    >
                        {error}
                    </AppText>
                </View>
            )}

            {/* Min/Max Date Hints */}
            {(min || max) && !error && (
                <View className="mt-1">
                    <AppText 
                        className="text-xs text-slate-400"
                        accessibilityRole="text"
                    >
                        {formatMinMaxDates()}
                    </AppText>
                </View>
            )}

            {/* Date Picker Modal */}
            {show && !disabled && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleChange}
                    minimumDate={min ? new Date(min) : undefined}
                    maximumDate={max ? new Date(max) : undefined}
                    textColor="#ffffff"
                    accessibilityLabel={`Date picker for ${label}`}
                />
            )}
        </View>
    );
};

export default DateInput;