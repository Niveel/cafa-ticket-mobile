import { View, Text, Pressable, Dimensions, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Event } from "@/types";
import colors from "@/config/colors";
import { getRelativeTime, formatEventTime } from "@/utils/format";
import { useFormatMoney } from "@/hooks/useFormatMoney";

const CARD_WIDTH = Dimensions.get("window").width * 0.86;

interface SoonEventCardProps {
  event: Event;
}

export default function SoonEventCard({ event }: SoonEventCardProps) {
  const formatMoney = useFormatMoney();
  const handlePress = () => {
    router.push(`/events/${event.slug}`);
  };

  return (
    <Pressable onPress={handlePress} style={{ width: CARD_WIDTH }}>
      <View className="flex-row overflow-hidden rounded-2xl bg-white/5">
        {/* Image */}
        <View className="w-28">
          <Image
            source={{ uri: event.featured_image }}
            className="h-36 w-full object-cover"
            style={{ objectFit: "cover" }}
          />
        </View>

        {/* Content */}
        <View className="flex-1 justify-center p-3">
          {/* Time Badge */}
          <View
            className="mb-2 self-start rounded-full px-2 py-0.5"
            style={{ backgroundColor: colors.accent }}
          >
            <Text className="text-xs font-semibold text-white">
              {getRelativeTime(event.start_date)}
            </Text>
          </View>

          <Text className="mb-1 text-base font-bold text-white" numberOfLines={2}>
            {event.title}
          </Text>

          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.6)" />
              <Text className="text-xs text-white/60">
                {formatEventTime(event.start_time)}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.6)" />
              <Text className="text-xs text-white/60" numberOfLines={1}>
                {event.venue_city}
              </Text>
            </View>
          </View>

          <Text className="mt-2 text-sm font-bold text-white">
            {formatMoney(event.lowest_price)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
