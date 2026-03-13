import { View, Pressable, Dimensions, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { Event } from "@/types";
import colors from "@/config/colors";
import { formatEventDate } from "@/utils/format";
import { useFormatMoney } from "@/hooks/useFormatMoney";
import { getFullImageUrl } from "@/utils/imageUrl";
import AppText from "@/components/ui/AppText";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 50;

interface FeaturedEventCardProps {
  event: Event;
}

export default function FeaturedEventCard({ event }: FeaturedEventCardProps) {
  const formatMoney = useFormatMoney();
  const handlePress = () => {
    router.push(`/events/${event.slug}`);
  };

  const isLive = event.status === "ongoing";

  return (
    <Pressable onPress={handlePress} className="mx-auto">
      <View
        className="overflow-hidden rounded-3xl"
        style={{ width: CARD_WIDTH, height: 220 }}
      >
        <Image
          source={{ uri: getFullImageUrl(event.featured_image) || undefined }}
          className="absolute h-full w-full object-cover"
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          className="absolute bottom-0 left-0 right-0 h-3/4"
        />

        {/* Live Badge */}
        {isLive && (
          <View
            className="absolute left-4 top-4 flex-row items-center gap-1 rounded-full px-3 py-1"
            style={{ backgroundColor: colors.accent }}
          >
            <View className="h-2 w-2 rounded-full bg-white" />
            <AppText styles="text-xs font-bold text-white">LIVE</AppText>
          </View>
        )}

        {/* Category Badge */}
        <View
          className="absolute right-4 top-4 rounded-full px-3 py-1"
          style={{ backgroundColor: colors.accent + "CC", borderRadius: 9999 }}
        >
          <AppText styles="text-xs font-medium text-white">
            {event.category.name}
          </AppText>
        </View>

        {/* Content */}
        <View className="absolute bottom-0 left-0 right-0 p-4">
          <AppText styles="mb-1 text-xl font-bold text-white" numberOfLines={2}>
            {event.title}
          </AppText>

          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.8)" />
              <AppText styles="text-sm text-white/80">
                {formatEventDate(event.start_date)}
              </AppText>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.8)" />
              <AppText styles="text-sm text-white/80" numberOfLines={1}>
                {event.venue_city}
              </AppText>
            </View>
          </View>

          <View className="mt-3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <AppText styles="text-lg font-bold text-white">
                {formatMoney(event.lowest_price)}
              </AppText>
              {event.lowest_price !== event.highest_price && (
                <AppText styles="text-sm text-white/60">+</AppText>
              )}
            </View>

            <View
              className="flex-row items-center gap-1 rounded-full px-3 py-1"
              style={{ backgroundColor: colors.accent }}
            >
              <AppText styles="text-sm font-semibold text-white">Get Tickets</AppText>
              <Ionicons name="arrow-forward" size={14} color={colors.white} />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
