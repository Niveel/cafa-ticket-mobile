import { View, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";

import AppText from "../../../ui/AppText";
import PaymentHistoryCard from "./PaymentHistoryCard";
import { PaymentTransaction } from "@/types/payments.types";
import colors from "@/config/colors";

type Props = {
    payments: PaymentTransaction[];
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
};

const PaymentHistoryList = ({ payments, isLoading, hasMore, onLoadMore }: Props) => {
    if (payments.length === 0 && !isLoading) {
        return (
            <View className="px-4 py-12 bg-white rounded-xl border border-slate-200">
                <View className="items-center">
                    <AppText styles="text-lg text-primary mb-2 font-nunbold">
                        No payments found
                    </AppText>
                    <AppText styles="text-sm text-slate-700 text-center">
                        Try adjusting your filters or browse events to purchase tickets
                    </AppText>
                </View>
            </View>
        );
    }

    const renderFooter = () => {
        if (!isLoading || payments.length === 0) return null;

        return (
            <View className="py-4 items-center">
                <ActivityIndicator size="small" color={colors.accent} />
                <AppText styles="text-xs text-slate-700 mt-2">
                    Loading more...
                </AppText>
            </View>
        );
    };

    return (
        <View className="flex-1 px-4">
            <FlashList
                data={payments}
                renderItem={({ item }) => <PaymentHistoryCard payment={item} />}
                keyExtractor={(item) => item.payment_id}
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                    if (hasMore && !isLoading) {
                        onLoadMore();
                    }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

export default PaymentHistoryList;
