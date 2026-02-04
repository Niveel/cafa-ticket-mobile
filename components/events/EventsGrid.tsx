import { View, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { memo, ReactElement } from "react";
import Animated from 'react-native-reanimated';

import AppText from "../ui/AppText";
import { Event } from "@/types";
import EventCard from "./EventCard";
import colors from "@/config/colors";
import { useScrollTabBar } from "@/hooks";

interface EventsGridProps {
    events: Event[];
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    headerComponent?: ReactElement | null;
}

// Memoized footer component for performance
const ListFooter = memo(({ isLoading, hasMore, eventsLength }: {
    isLoading: boolean;
    hasMore: boolean;
    eventsLength: number;
}) => {
    if (isLoading) {
        return (
            <View className="flex-row justify-center items-center py-12">
                <ActivityIndicator size="large" color={colors.accent50} />
                <AppText styles="text-sm text-slate-300 ml-3">
                    Loading more events...
                </AppText>
            </View>
        );
    }

    if (!hasMore && eventsLength > 0) {
        return (
            <View className="items-center py-12">
                <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-4 border-2 border-accent"
                    style={{ backgroundColor: "rgba(220, 0, 0, 0.2)" }}
                >
                    <AppText styles="text-2xl">🎉</AppText>
                </View>
                <AppText styles="text-base text-white mb-2 font-nunbold">
                    You've reached the end!
                </AppText>
                <AppText styles="text-sm text-slate-300 text-center px-8">
                    That's all the events we have for now. Check back later!
                </AppText>
            </View>
        );
    }

    return null;
});

ListFooter.displayName = "ListFooter";

// Create AnimatedFlashList
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<Event>);

const EventsGrid = ({
    events,
    isLoading,
    hasMore,
    onLoadMore,
    headerComponent,
}: EventsGridProps) => {
    const scrollHandler = useScrollTabBar();

    const renderItem = ({ item }: { item: Event }) => (
        <View>
            <EventCard event={item} />
        </View>
    );

    const keyExtractor = (item: Event) => item.id.toString();

    const handleEndReached = () => {
        if (hasMore && !isLoading) {
            onLoadMore();
        }
    };

    return (
        <AnimatedFlashList
            data={events}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListHeaderComponent={headerComponent || undefined}
            ListFooterComponent={
                <ListFooter
                    isLoading={isLoading}
                    hasMore={hasMore}
                    eventsLength={events.length}
                />
            }
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-4" />}
            removeClippedSubviews={true}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
        />
    );
};

export default memo(EventsGrid);