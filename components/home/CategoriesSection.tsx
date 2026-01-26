import { View, ScrollView, ActivityIndicator } from "react-native";

import { EventCategory } from "@/types";
import { CategoryCard } from "@/components/cards";
import SectionHeader from "./SectionHeader";
import colors from "@/config/colors";

interface CategoriesSectionProps {
  categories: EventCategory[];
  isLoading?: boolean;
}

export default function CategoriesSection({
  categories,
  isLoading,
}: CategoriesSectionProps) {
  if (isLoading) {
    return (
      <View className="py-8">
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  if (categories.length === 0) return null;

  return (
    <View className="mb-6">
      <SectionHeader title="Browse Categories" showSeeAll={false} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </ScrollView>
    </View>
  );
}
