import { useFormikContext } from 'formik';
import { View } from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';
import AppInput from "./AppInput";
import AppErrorMessage from "./AppErrorMessage";
import SelectInput from "./SelectInput";
import DateInput from "./DateInput";
import SearchableSelect from "./SearchableSelect";
import TimeInput from "../ui/TimeInput";

type StringFieldFormValues = Record<string, string>;
type Option = { value: string; label: string };

type Props<Values extends StringFieldFormValues = StringFieldFormValues> = {
    name: keyof Values & string;
    label: string;
    multiline?: boolean;
    rows?: number;
    styles?: string;
    options?: Option[];
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'select' | 'searchable-select' | 'date' | 'time';
    required?: boolean;
    placeholder?: string;
    min?: string;
    max?: string;
    isLoading?: boolean;
    icon?: string;
    iconClick?: () => void;
    iconAria?: string;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    spellCheck?: boolean;
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
    labelColor?: string;
};

const AppFormField = <Values extends StringFieldFormValues = StringFieldFormValues>({
    name,
    label,
    multiline = false,
    rows = 4,
    styles,
    options = [],
    type = 'text',
    required = false,
    placeholder,
    min,
    max,
    isLoading = false,
    icon,
    iconClick,
    iconAria,
    autoCapitalize,
    autoCorrect,
    spellCheck,
    keyboardType,
    secureTextEntry,
    labelColor,
}: Props<Values>) => {
    const { errors, setFieldTouched, setFieldValue, touched, values } = useFormikContext<Values>();

    const error = errors[name] as string;
    const isTouched = touched[name] as boolean;
    const value = values[name] as string;

    const handleChange = (text: string) => {
        setFieldValue(name, text);
    };

    const handleBlur = () => {
        setFieldTouched(name, true);
    };

    return (
        <View className={`flex flex-col gap-2 ${styles}`}>
            {type === 'searchable-select' ? (
                <SearchableSelect
                    name={name}
                    label={label}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={options}
                    required={required}
                    placeholder={placeholder}
                    isLoading={isLoading}
                />
            ) : type === 'select' ? (
                <SelectInput
                    name={name}
                    label={label}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={options}
                    required={required}
                    placeholder={placeholder}
                />
            ) : type === 'date' ? (
                <DateInput
                    name={name}
                    label={label}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={required}
                    min={min}
                    max={max}
                />
            ) : type === 'time' ? (
                <TimeInput
                    name={name}
                    label={label}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={required}
                    placeholder={placeholder}
                />
            ) : (
                <AppInput
                    type={type}
                    name={name}
                    label={label}
                    multiline={multiline}
                    rows={rows}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={required}
                    placeholder={placeholder}
                    icon={icon}
                    iconClick={iconClick}
                    iconAria={iconAria}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={autoCorrect}
                    spellCheck={spellCheck}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    labelColor={labelColor}
                />
            )}
            <AppErrorMessage error={error} visible={isTouched} />
        </View>
    );
}

export default AppFormField;