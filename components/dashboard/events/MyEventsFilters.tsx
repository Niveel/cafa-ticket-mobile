import { Ionicons } from "@expo/vector-icons";
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

import { AppText } from "@/components";
import colors from "@/config/colors";

interface Filters {
    status: string;
    is_published: string;
    category: string;
    search: string;
    sort_by: string;
}

interface MyEventsFiltersProps {
    onFilterChange: (filters: Filters) => void;
    currentFilters: Filters;
}

const MyEventsFilters = ({ onFilterChange, currentFilters }: MyEventsFiltersProps) => {
    const [status, setStatus] = useState(currentFilters.status);
    const [isPublished, setIsPublished] = useState(currentFilters.is_published);
    const [category, setCategory] = useState(currentFilters.category);
    const [search, setSearch] = useState(currentFilters.search);
    const [sortBy, setSortBy] = useState(currentFilters.sort_by);

    useEffect(() => {
        setStatus(currentFilters.status);
        setIsPublished(currentFilters.is_published);
        setCategory(currentFilters.category);
        setSearch(currentFilters.search);
        setSortBy(currentFilters.sort_by);
    }, [currentFilters]);

    const applyFilters = () => {
        onFilterChange({
            status,
            is_published: isPublished,
            category,
            search,
            sort_by: sortBy,
        });
    };

    const clearFilters = () => {
        setStatus("all");
        setIsPublished("true");
        setCategory("");
        setSearch("");
        setSortBy("-start_date");
    };

    const hasActiveFilters =
        status !== "all" ||
        isPublished !== "true" ||
        category ||
        search ||
        sortBy !== "-start_date";

    const statusOptions = [
        { value: "all", label: "All Events" },
        { value: "upcoming", label: "Upcoming" },
        { value: "ongoing", label: "Ongoing" },
        { value: "past", label: "Past" },
    ];

    const publishedOptions = [
        { value: "true", label: "Published" },
        { value: "false", label: "Unpublished" },
        { value: "all", label: "All" },
    ];

    const sortOptions = [
        { value: "-start_date", label: "Newest First" },
        { value: "start_date", label: "Oldest First" },
        { value: "-created_at", label: "Recently Created" },
        { value: "-tickets_sold", label: "Most Sold" },
    ];

    return (
        <>
            {/* Header */}
            <BottomSheetView>
                <View className="px-6 pt-6 pb-4 border-b" style={{ borderColor: colors.accent + "90", zIndex: 5 }}>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <View
                                className="w-12 h-12 rounded-xl items-center justify-center"
                                style={{ backgroundColor: colors.accent + "33" }}
                            >
                                <Ionicons name="filter" size={24} color={colors.accent50} />
                            </View>
                            <AppText styles="text-xl text-white" font="font-ibold">
                                Filters
                            </AppText>
                        </View>

                        {hasActiveFilters && (
                            <TouchableOpacity onPress={clearFilters} activeOpacity={0.8}>
                                <AppText styles="text-sm text-accent-50" font="font-isemibold">
                                    Clear All
                                </AppText>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </BottomSheetView>

            {/* Scrollable Filters Content */}
            <BottomSheetScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 74,
                    paddingBottom: 24,
                }}
            >
                {/* Search */}
                <View className="my-6">
                    <AppText styles="text-sm text-slate-300 mb-3" font="font-isemibold">
                        Search
                    </AppText>
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search by title..."
                        placeholderTextColor="#64748b"
                        className="h-12 px-4 bg-primary-100 border-2 border-accent text-white rounded-xl"
                        style={{ fontFamily: "iregular", fontSize: 14 }}
                    />
                </View>

                {/* Status */}
                <View className="mb-6">
                    <AppText styles="text-sm text-slate-300 mb-3" font="font-isemibold">
                        Status
                    </AppText>
                    <View className="gap-2">
                        {statusOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => setStatus(option.value)}
                                className={`px-4 py-3 rounded-xl border-2 ${status === option.value
                                    ? "bg-accent border-accent"
                                    : "bg-primary-100 border-accent/30"
                                    }`}
                                activeOpacity={0.7}
                            >
                                <AppText
                                    styles={`text-sm ${status === option.value ? "text-white" : "text-slate-300"
                                        }`}
                                    font="font-isemibold"
                                >
                                    {option.label}
                                </AppText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Published Status */}
                <View className="mb-6">
                    <AppText styles="text-sm text-slate-300 mb-3" font="font-isemibold">
                        Published Status
                    </AppText>
                    <View className="gap-2">
                        {publishedOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => setIsPublished(option.value)}
                                className={`px-4 py-3 rounded-xl border-2 ${isPublished === option.value
                                    ? "bg-accent border-accent"
                                    : "bg-primary-100 border-accent/30"
                                    }`}
                                activeOpacity={0.7}
                            >
                                <AppText
                                    styles={`text-sm ${isPublished === option.value ? "text-white" : "text-slate-300"
                                        }`}
                                    font="font-isemibold"
                                >
                                    {option.label}
                                </AppText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Sort By */}
                <View className="mb-6">
                    <AppText styles="text-sm text-slate-300 mb-3" font="font-isemibold">
                        Sort By
                    </AppText>
                    <View className="gap-2">
                        {sortOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => setSortBy(option.value)}
                                className={`px-4 py-3 rounded-xl border-2 ${sortBy === option.value
                                    ? "bg-accent border-accent"
                                    : "bg-primary-100 border-accent/30"
                                    }`}
                                activeOpacity={0.7}
                            >
                                <AppText
                                    styles={`text-sm ${sortBy === option.value ? "text-white" : "text-slate-300"
                                        }`}
                                    font="font-isemibold"
                                >
                                    {option.label}
                                </AppText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Apply Button - INSIDE ScrollView */}
                <View
                    className="py-4 mt-2"
                    style={{
                        borderTopWidth: 1,
                        borderColor: colors.accent + "30",
                    }}
                >
                    <TouchableOpacity
                        onPress={applyFilters}
                        className="w-full py-4 rounded-xl items-center"
                        style={{ backgroundColor: colors.accent }}
                        activeOpacity={0.8}
                    >
                        <AppText styles="text-sm text-white" font="font-ibold">
                            Apply Filters
                        </AppText>
                    </TouchableOpacity>
                </View>
            </BottomSheetScrollView>
        </>
    );
};

export default MyEventsFilters;