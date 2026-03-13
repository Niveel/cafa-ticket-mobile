import { useCallback, useRef } from "react";
import { View, Pressable, FlatList, ViewToken } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  FadeIn,
  FadeInUp,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { onboardingSlides } from "@/data/onboarding";
import colors from "@/config/colors";
import AppText from "../ui/AppText";
import Slide from "./Slide";
import Pagination from "./Pagination";
import NavigationButtons from "./NavigationButtons";

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({
  onComplete,
}: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        currentIndex.value = viewableItems[0].index;
      }
    },
    []
  );

  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex.value < onboardingSlides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex.value + 1,
        animated: true,
      });
    } else {
      onComplete();
    }
  }, [onComplete]);

  const handlePrev = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex.value > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex.value - 1,
        animated: true,
      });
    }
  }, []);

  const handleSkip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onComplete();
  }, [onComplete]);

  const handlePressIn = useCallback(() => {
    buttonScale.value = withSpring(0.95);
  }, []);

  const handlePressOut = useCallback(() => {
    buttonScale.value = withSpring(1);
  }, []);

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.primary,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Skip Button */}
      <Animated.View
        entering={FadeIn.delay(500).duration(500)}
        className="absolute right-6 z-10"
        style={{ top: insets.top + 16 }}
      >
        <Pressable
          onPress={handleSkip}
          className="rounded-full px-4 py-2"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <AppText style={{ color: colors.white }} styles="font-semibold">
            Skip
          </AppText>
        </Pressable>
      </Animated.View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingSlides}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={(event) => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => (
          <Slide item={item} index={index} scrollX={scrollX} />
        )}
      />

      {/* Bottom Controls */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(500)}
        className="px-8 pb-8"
      >
        <View className="mb-8">
          <Pagination scrollX={scrollX} data={onboardingSlides} />
        </View>

        <NavigationButtons
          currentIndex={currentIndex}
          buttonScale={buttonScale}
          onNext={handleNext}
          onPrev={handlePrev}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
      </Animated.View>
    </View>
  );
}
