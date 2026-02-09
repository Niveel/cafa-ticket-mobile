import { View, TextInput as RNTextInput, TouchableOpacity, TextInputProps as RNTextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../ui/AppText";

interface AppInputProps extends Omit<RNTextInputProps, 'onChange'> {
    icon?: string;
    name: string;
    label?: string;
    value?: string;
    onChange?: (text: string) => void;
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
    iconAria?: string;
    iconClick?: () => void;
    required?: boolean;
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
}

const AppInput = ({
    icon,
    name,
    label,
    value,
    onChange,
    placeholder,
    multiline = false,
    rows = 4,
    iconAria,
    iconClick,
    required = false,
    type = 'text',
    ...otherProps
}: AppInputProps) => {
    // Map icon names to Ionicons
    const getIconName = (): keyof typeof Ionicons.glyphMap => {
        if (!icon) return "eye-outline";

        switch (icon) {
            case 'eye':
                return "eye-outline";
            case 'eye-slash':
            case 'eye-off':
                return "eye-off-outline";
            default:
                return icon as keyof typeof Ionicons.glyphMap;
        }
    };

    // Determine keyboard type
    const getKeyboardType = (): RNTextInputProps['keyboardType'] => {
        switch (type) {
            case 'email':
                return 'email-address';
            case 'number':
                return 'numeric';
            case 'tel':
                return 'phone-pad';
            case 'url':
                return 'url';
            default:
                return 'default';
        }
    };

    // Determine secureTextEntry based on type
    const secureTextEntry = type === 'password';

    return (
        <View className="w-full">
            {label && (
                <AppText styles="mb-2 text-sm text-white">
                    {label}
                    {required && <AppText color="text-red-400" styles="ml-1"> *</AppText>}
                </AppText>
            )}

            {!multiline ? (
                <View className="relative w-full">
                    <RNTextInput
                        className={`w-full h-12 ${icon ? 'pr-12' : 'pr-2'} pl-2 bg-primary border-2 border-accent text-black text-sm rounded-xl font-iregular`}
                        placeholder={placeholder}
                        placeholderTextColor="#fff"
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry={secureTextEntry}
                        keyboardType={getKeyboardType()}
                        multiline={false}
                        {...otherProps}
                    />
                    {icon && (
                        <TouchableOpacity
                            className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center"
                            onPress={iconClick}
                            accessibilityLabel={iconAria || 'Icon button'}
                        >
                            <Ionicons
                                name={getIconName()}
                                size={20}
                                color="#cbd5e1"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <RNTextInput
                    className="w-full px-2 py-2 bg-primary border-2 border-accent text-black text-sm rounded-xl font-iregular"
                    placeholder={placeholder}
                    placeholderTextColor="#ccc"
                    value={value}
                    onChangeText={onChange}
                    multiline={true}
                    numberOfLines={rows}
                    textAlignVertical="top"
                    style={{ minHeight: rows * 24 }}
                    {...otherProps}
                />
            )}
        </View>
    );
}

export default AppInput;