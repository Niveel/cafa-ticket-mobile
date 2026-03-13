import { View, TouchableOpacity } from "react-native";
import { useState, useCallback, forwardRef, useImperativeHandle, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../../ui/AppText";
import AppBottomSheet from "../../../ui/AppBottomSheet";
import AppButton from "../../../ui/AppButton";
import DateInput from "../../../form/DateInput";
import type { AppBottomSheetRef } from "../../../ui/AppBottomSheet";
import colors from "@/config/colors";

type FilterValues = {
    status: "all" | "completed" | "pending" | "failed";
    date_from: string;
    date_to: string;
};

type Props = {
    onApplyFilters: (filters: FilterValues) => void;
    initialFilters: FilterValues;
};

export type PaymentHistoryFiltersRef = {
    open: () => void;
    close: () => void;
};

const PaymentHistoryFilters = forwardRef<PaymentHistoryFiltersRef, Props>(
    ({ onApplyFilters, initialFilters }, ref) => {
        const bottomSheetRef = useRef<AppBottomSheetRef>(null);

        const [status, setStatus] = useState(initialFilters.status);
        const [dateFrom, setDateFrom] = useState(initialFilters.date_from);
        const [dateTo, setDateTo] = useState(initialFilters.date_to);

        useImperativeHandle(ref, () => ({
            open: () => bottomSheetRef.current?.open(),
            close: () => bottomSheetRef.current?.close(),
        }));

        const statusOptions = [
            { value: "all" as const, label: "All Payments", icon: "swap-horizontal" },
            { value: "completed" as const, label: "Completed", icon: "checkmark-circle" },
            { value: "pending" as const, label: "Pending", icon: "time" },
            { value: "failed" as const, label: "Failed", icon: "close-circle" },
        ];

        const handleApply = useCallback(() => {
            onApplyFilters({
                status,
                date_from: dateFrom,
                date_to: dateTo,
            });
            bottomSheetRef.current?.close();
        }, [status, dateFrom, dateTo, onApplyFilters]);

        const handleClear = useCallback(() => {
            setStatus("all");
            setDateFrom("");
            setDateTo("");
            onApplyFilters({
                status: "all",
                date_from: "",
                date_to: "",
            });
            bottomSheetRef.current?.close();
        }, [onApplyFilters]);

        const hasActiveFilters = status !== "all" || dateFrom || dateTo;

        return (
            <AppBottomSheet ref={bottomSheetRef} snapPoints={["70%"]}>
                <View className="flex-1 px-4">
                    {/* Header */}
                    <View className="flex-row items-center gap-3 mb-6">
                        <View className="w-10 h-10 rounded-lg bg-accent/20 items-center justify-center">
                            <Ionicons name="filter" size={20} color={colors.accent50} />
                        </View>
                        <AppText styles="text-xl text-white" font="font-ibold">
                            Filter Payments
                        </AppText>
                    </View>

                    {/* Status Filter */}
                    <View className="mb-6">
                        <AppText styles="text-sm text-slate-200 mb-3" font="font-imedium">
                            Payment Status
                        </AppText>
                        <View className="gap-2">
                            {statusOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    onPress={() => setStatus(option.value)}
                                    className={`flex-row items-center p-4 rounded-xl border-2 ${status === option.value
                                            ? "bg-accent/20 border-accent"
                                            : "bg-primary-100 border-accent/30"
                                        }`}
                                    activeOpacity={0.7}
                                >
                                    <View
                                        className={`w-10 h-10 rounded-lg items-center justify-center mr-3 ${status === option.value ? "bg-accent/30" : "bg-accent/10"
                                            }`}
                                    >
                                        <Ionicons
                                            name={option.icon as keyof typeof Ionicons.glyphMap}
                                            size={20}
                                            color={status === option.value ? colors.accent50 : colors.white}
                                        />
                                    </View>
                                    <AppText
                                        styles="text-sm flex-1 text-white"
                                        font="font-isemibold"
                                    >
                                        {option.label}
                                    </AppText>
                                    {status === option.value && (
                                        <Ionicons name="checkmark-circle" size={24} color={colors.accent50} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Date Filters */}
                    <View className="mb-6">
                        <AppText styles="text-sm text-slate-200 mb-3" font="font-imedium">
                            Date Range
                        </AppText>
                        <View className="gap-3">
                            <DateInput
                                label="From Date"
                                value={dateFrom}
                                onChange={setDateFrom}
                                max={dateTo || undefined}
                                placeholder="Select start date"
                                labelColor="text-white"
                                valueColor="text-white"
                                placeholderColor="text-white/80"
                                hintColor="text-white/70"
                            />
                            <DateInput
                                label="To Date"
                                value={dateTo}
                                onChange={setDateTo}
                                min={dateFrom || undefined}
                                placeholder="Select end date"
                                labelColor="text-white"
                                valueColor="text-white"
                                placeholderColor="text-white/80"
                                hintColor="text-white/70"
                            />
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="gap-3 mt-auto pb-4">
                        {hasActiveFilters && (
                            <TouchableOpacity
                                onPress={handleClear}
                                className="flex-row items-center justify-center gap-2 p-4 bg-accent/20 rounded-xl border border-accent/30"
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close-circle" size={20} color={colors.accent50} />
                                <AppText styles="text-sm text-accent-50" font="font-isemibold">
                                    Clear All Filters
                                </AppText>
                            </TouchableOpacity>
                        )}
                        <AppButton
                            onClick={handleApply}
                            variant="danger"
                            className="bg-accent active:bg-accent-100"
                            title="Apply Filters"
                        />
                    </View>
                </View>
            </AppBottomSheet>
        );
    }
);

PaymentHistoryFilters.displayName = "PaymentHistoryFilters";

export default PaymentHistoryFilters;
