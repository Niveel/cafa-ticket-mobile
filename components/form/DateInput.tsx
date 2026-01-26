import React, { useState } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

import {AppText} from "@/components"

type Props = {
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    required?: boolean;
    min?: string;
    max?: string;
};

const DateInput = ({ label, value, onChange, onBlur, required = false, min, max }: Props) => {
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(value ? new Date(value) : new Date());

    const handleChange = (event: any, selectedDate?: Date) => {
        setShow(Platform.OS === 'ios'); // Keep open on iOS, close on Android
        
        if (selectedDate) {
            setDate(selectedDate);
            // Format to YYYY-MM-DD
            const formattedDate = selectedDate.toISOString().split('T')[0];
            onChange(formattedDate);
            onBlur();
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

    return (
        <View className="w-full">
            <AppText className="mb-2 text-sm font-isemibold text-white">
                {label}
                {required && <AppText className="text-red-400 ml-1"> *</AppText>}
            </AppText>
            
            <TouchableOpacity
                onPress={() => setShow(true)}
                className="relative w-full h-12 px-2 bg-primary border-2 border-secondary rounded-xl flex-row items-center"
            >
                <Ionicons 
                    name="calendar" 
                    size={20} 
                    color="#425d85" 
                    style={{ marginRight: 8 }}
                />
                <AppText className={`text-sm flex-1 ${value ? 'text-white' : 'text-slate-500'}`}>
                    {value ? formatDisplayDate(value) : 'Select date'}
                </AppText>
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleChange}
                    minimumDate={min ? new Date(min) : undefined}
                    maximumDate={max ? new Date(max) : undefined}
                    textColor="#ffffff"
                />
            )}
        </View>
    );
};

export default DateInput;