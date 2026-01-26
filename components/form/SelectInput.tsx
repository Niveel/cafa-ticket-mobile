import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import {AppText} from "@/components"

type Option = {
    value: string;
    label: string;
};

type Props = {
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    options: Option[];
    required?: boolean;
    placeholder?: string;
};

const SelectInput = ({ 
    label, 
    value, 
    onChange, 
    onBlur, 
    options, 
    required = false,
    placeholder 
}: Props) => {
    return (
        <View className="w-full">
            <AppText className="mb-2 text-sm font-isemibold text-white">
                {label}
                {required && <AppText className="text-red-400 ml-1"> *</AppText>}
            </AppText>
            <View className="border-2 border-secondary rounded-xl overflow-hidden bg-primary">
                <Picker
                    selectedValue={value}
                    onValueChange={(itemValue) => {
                        onChange(itemValue);
                        onBlur();
                    }}
                    style={{
                        height: 48,
                        color: '#ffffff',
                    }}
                    dropdownIconColor="#cbd5e1"
                >
                    <Picker.Item 
                        label={placeholder || `Select ${label}`} 
                        value="" 
                        enabled={false}
                        color="#94a3b8"
                    />
                    {options.map((opt) => (
                        <Picker.Item 
                            key={opt.value} 
                            label={opt.label} 
                            value={opt.value}
                            color="#ffffff"
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );
};

export default SelectInput;