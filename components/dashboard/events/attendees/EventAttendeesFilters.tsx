import { View, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { AppText, AppInput, SelectInput } from "@/components";
import colors from "@/config/colors";

interface EventAttendeesFiltersProps {
    eventSlug: string;
    ticketTypes: Array<{ id: number; name: string }>;
    search: string;
    ticketTypeId: string;
    paymentStatus: string;
    checkInStatus: string;
    sortBy: string;
    onFilterChange: (filters: {
        search: string;
        ticket_type_id: string;
        payment_status: string;
        check_in_status: string;
        sort_by: string;
    }) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
}

const EventAttendeesFilters = ({
    ticketTypes,
    search,
    ticketTypeId,
    paymentStatus,
    checkInStatus,
    sortBy,
    onFilterChange,
    onClearFilters,
    hasActiveFilters,
}: EventAttendeesFiltersProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSearchChange = (text: string) => {
        onFilterChange({
            search: text,
            ticket_type_id: ticketTypeId,
            payment_status: paymentStatus,
            check_in_status: checkInStatus,
            sort_by: sortBy,
        });
    };

    const handleTicketTypeChange = (value: string) => {
        onFilterChange({
            search,
            ticket_type_id: value,
            payment_status: paymentStatus,
            check_in_status: checkInStatus,
            sort_by: sortBy,
        });
    };

    const handlePaymentStatusChange = (value: string) => {
        onFilterChange({
            search,
            ticket_type_id: ticketTypeId,
            payment_status: value,
            check_in_status: checkInStatus,
            sort_by: sortBy,
        });
    };

    const handleCheckInStatusChange = (value: string) => {
        onFilterChange({
            search,
            ticket_type_id: ticketTypeId,
            payment_status: paymentStatus,
            check_in_status: value,
            sort_by: sortBy,
        });
    };

    const handleSortChange = (value: string) => {
        onFilterChange({
            search,
            ticket_type_id: ticketTypeId,
            payment_status: paymentStatus,
            check_in_status: checkInStatus,
            sort_by: value,
        });
    };

    const paymentStatusOptions = [
        { label: "Paid", value: "paid" },
        { label: "Pending", value: "pending" },
        { label: "All Statuses", value: "all" },
    ];

    const checkInStatusOptions = [
        { label: "All Attendees", value: "all" },
        { label: "Checked In", value: "checked_in" },
        { label: "Not Checked In", value: "not_checked_in" },
    ];

    const sortOptions = [
        { label: "Purchase Date (Newest)", value: "-purchase_date" },
        { label: "Purchase Date (Oldest)", value: "purchase_date" },
        { label: "Name (A-Z)", value: "attendee_name" },
        { label: "Name (Z-A)", value: "-attendee_name" },
        { label: "Ticket Type (A-Z)", value: "ticket_type" },
        { label: "Check-in Time (Recent)", value: "-check_in_time" },
        { label: "Check-in Time (Oldest)", value: "check_in_time" },
    ];

    return (
        <>
            {/* Search Bar & Filter Button */}
            <View className="flex-row gap-3 mb-4">
                {/* Search Input */}
                <View className="flex-1">
                    <AppInput
                        name="search"
                        value={search}
                        onChangeText={handleSearchChange}
                        placeholder="Search attendees..."
                        icon="search"
                    />
                </View>

                {/* Filter Button */}
                <TouchableOpacity
                    onPress={() => setIsModalVisible(true)}
                    className="w-12 h-12 rounded-xl items-center justify-center border-2"
                    style={{
                        backgroundColor: hasActiveFilters ? colors.accent + "33" : colors.primary100,
                        borderColor: hasActiveFilters ? colors.accent : colors.accent + "4D",
                    }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="filter" size={20} color={hasActiveFilters ? colors.accent : colors.white} />
                    {hasActiveFilters && (
                        <View
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
                            style={{ backgroundColor: colors.accent }}
                        >
                            <AppText styles="text-xs text-white" font="font-ibold">
                                !
                            </AppText>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Filters Modal */}
            <Modal visible={isModalVisible} animationType="slide" transparent>
                <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <View
                        className="rounded-t-3xl p-6"
                        style={{ backgroundColor: colors.primary, maxHeight: "90%" }}
                    >
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="flex-row items-center gap-3">
                                <View
                                    className="w-10 h-10 rounded-lg items-center justify-center"
                                    style={{ backgroundColor: colors.accent + "33" }}
                                >
                                    <Ionicons name="filter" size={20} color={colors.accent50} />
                                </View>
                                <AppText styles="text-lg text-white" font="font-ibold">
                                    Filter Attendees
                                </AppText>
                            </View>
                            <TouchableOpacity
                                onPress={() => setIsModalVisible(false)}
                                className="w-10 h-10 items-center justify-center"
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="close" size={24} color={colors.white} />
                            </TouchableOpacity>
                        </View>

                        {/* Filters */}
                        <View className="gap-4">
                            {/* Ticket Type */}
                            <SelectInput
                                name="ticket_type_id"
                                label="Ticket Type"
                                value={ticketTypeId}
                                onChange={handleTicketTypeChange}
                                options={[
                                    { label: "All Ticket Types", value: "" },
                                    ...ticketTypes.map((type) => ({
                                        label: type.name,
                                        value: type.id.toString(),
                                    })),
                                ]}
                            />

                            {/* Payment Status */}
                            <SelectInput
                                name="payment_status"
                                label="Payment Status"
                                value={paymentStatus}
                                onChange={handlePaymentStatusChange}
                                options={paymentStatusOptions}
                            />

                            {/* Check-in Status */}
                            <SelectInput
                                name="check_in_status"
                                label="Check-in Status"
                                value={checkInStatus}
                                onChange={handleCheckInStatusChange}
                                options={checkInStatusOptions}
                            />

                            {/* Sort By */}
                            <SelectInput
                                name="sort_by"
                                label="Sort By"
                                value={sortBy}
                                onChange={handleSortChange}
                                options={sortOptions}
                            />

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <TouchableOpacity
                                    onPress={() => {
                                        onClearFilters();
                                        setIsModalVisible(false);
                                    }}
                                    className="flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl border-2"
                                    style={{
                                        backgroundColor: colors.accent + "1A",
                                        borderColor: colors.accent,
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons name="close-circle" size={18} color={colors.accent} />
                                    <AppText styles="text-sm text-accent" font="font-ibold">
                                        Clear All Filters
                                    </AppText>
                                </TouchableOpacity>
                            )}

                            {/* Apply Button */}
                            <TouchableOpacity
                                onPress={() => setIsModalVisible(false)}
                                className="px-4 py-4 rounded-xl"
                                style={{ backgroundColor: colors.accent }}
                                activeOpacity={0.8}
                            >
                                <AppText styles="text-sm text-white text-center" font="font-ibold">
                                    Apply Filters
                                </AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default EventAttendeesFilters;