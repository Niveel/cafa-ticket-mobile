import { View, ActivityIndicator } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";

import AppText from "./AppText";
import SelectInput from "../form/SelectInput";
import type { EventCategory } from "@/types/dash-events.types";
import { getEventCategories } from "@/lib/events";
import colors from "@/config/colors";

interface CategorySelectProps {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    label?: string;
    required?: boolean;
    error?: string;
}

const CategorySelect = ({
    value,
    onChange,
    onBlur,
    label = "Event Category",
    required = false,
    error,
}: CategorySelectProps) => {
    const [categories, setCategories] = useState<EventCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            setFetchError(null);
            const data = await getEventCategories();

            // ✅ Validate data before setting state
            if (Array.isArray(data) && data.length > 0) {
                setCategories(data);
            } else {
                setFetchError("No categories available");
            }
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            setFetchError("Failed to load categories");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Loading State
    if (isLoading) {
        return (
            <View>
                <View className="mb-2">
                    <AppText styles="text-sm text-slate-300">
                        {label}
                        {required && (
                            <AppText styles="text-sm text-red-400">
                                {" *"}
                            </AppText>
                        )}
                    </AppText>
                </View>
                <View
                    className="flex-row items-center gap-3 px-4 py-3 rounded-xl border-2"
                    style={{
                        backgroundColor: colors.primary100,
                        borderColor: colors.accent
                    }}
                >
                    <ActivityIndicator size="small" color={colors.accent} />
                    <AppText styles="text-sm text-white" style={{ opacity: 0.6 }}>
                        Loading categories...
                    </AppText>
                </View>
            </View>
        );
    }

    // Error State
    if (fetchError) {
        return (
            <View>
                <View className="mb-2">
                    <AppText styles="text-sm text-slate-300">
                        {label}
                        {required && (
                            <AppText styles="text-sm text-red-400">
                                {" *"}
                            </AppText>
                        )}
                    </AppText>
                </View>
                <View
                    className="p-4 rounded-xl border-2"
                    style={{
                        backgroundColor: colors.accent + "1A",
                        borderColor: colors.accent
                    }}
                >
                    <View className="flex-row items-start gap-3 mb-3">
                        <Ionicons name="alert-circle" size={20} color={colors.accent} />
                        <View className="flex-1">
                            <AppText styles="text-sm text-white mb-1 font-nunbold">
                                {fetchError}
                            </AppText>
                            <AppText styles="text-xs text-white" style={{ opacity: 0.7 }}>
                                Please try again
                            </AppText>
                        </View>
                    </View>
                    <View
                        onTouchEnd={fetchCategories}
                        className="p-3 rounded-lg items-center"
                        style={{ backgroundColor: colors.accent }}
                        accessible
                        accessibilityRole="button"
                        accessibilityLabel="Retry loading categories"
                    >
                        <AppText styles="text-sm text-white">
                            Retry
                        </AppText>
                    </View>
                </View>
            </View>
        );
    }

    // ✅ Map categories to options safely
    const options = categories.map((cat) => ({
        value: cat.slug,
        label: cat.name,
    }));

    return (
        <SelectInput
            name="category_slug"
            label={label}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            options={options}
            required={required}
            placeholder="Select a category"
            error={error}
        />
    );
};

export default CategorySelect;