import { View, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { memo } from "react";

import { MyEventCard, AppText } from "@/components";
import type { MyEvent } from "@/types/dash-events.types";
import colors from "@/config/colors";

interface MyEventsGridProps {
    events: MyEvent[];
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    onDelete: (eventId: number, eventSlug: string, eventTitle: string) => void;
}

const ListFooter = memo(({ isLoading, hasMore }: { isLoading: boolean; hasMore: boolean }) => {
    if (isLoading) {
        return (
            <View className="py-8 items-center">
                <ActivityIndicator size="small" color={colors.accent} />
                <AppText styles="text-xs text-slate-400 mt-2" font="font-iregular">
                    Loading more...
                </AppText>
            </View>
        );
    }

    if (!hasMore) {
        return (
            <View className="py-8 items-center">
                <AppText styles="text-xs text-slate-400" font="font-iregular">
                    No more events
                </AppText>
            </View>
        );
    }

    return null;
});

ListFooter.displayName = "ListFooter";

const MyEventsGrid = ({ events, isLoading, hasMore, onLoadMore, onDelete }: MyEventsGridProps) => {
    const renderItem = ({ item }: { item: MyEvent }) => (
        <View className="px-4">
            <MyEventCard event={item} onDelete={onDelete} />
        </View>
    );

    const keyExtractor = (item: MyEvent) => item.id.toString();

    const handleEndReached = () => {
        if (hasMore && !isLoading) {
            onLoadMore();
        }
    };

    return (
        <FlashList
            data={events}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            ListFooterComponent={<ListFooter isLoading={isLoading} hasMore={hasMore} />}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{ paddingTop: 4, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
        />
    );
};

export default memo(MyEventsGrid);