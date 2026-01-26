import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { PublicStats } from "@/types";
import { formatNumber } from "@/utils/format";
import colors from "@/config/colors";

interface StatItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
}

function StatItem({ icon, value, label }: StatItemProps) {
  return (
    <View className="flex-1 items-center">
      <View
        className="mb-2 h-12 w-12 items-center justify-center rounded-2xl"
        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      >
        <Ionicons name={icon} size={22} color={colors.accent} />
      </View>
      <Text className="text-lg font-bold text-white">
        {formatNumber(value)}
      </Text>
      <Text className="text-xs text-white/60">{label}</Text>
    </View>
  );
}

interface StatsSectionProps {
  stats: PublicStats | null;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  if (!stats) return null;

  const { overview } = stats.data;

  return (
    <View className="mb-6 flex-row rounded-2xl bg-white/5 p-4">
      <StatItem
        icon="calendar"
        value={overview.total_upcoming_events}
        label="Events"
      />
      <StatItem
        icon="ticket"
        value={overview.total_tickets_sold}
        label="Tickets Sold"
      />
      <StatItem
        icon="people"
        value={overview.total_organizers}
        label="Organizers"
      />
      <StatItem
        icon="checkmark-circle"
        value={overview.total_attendees_checked_in}
        label="Attended"
      />
    </View>
  );
}
