import { View, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";

import { OnboardingSlide } from "@/data/onboarding";
import colors from "@/config/colors";
import AppText from "../ui/AppText";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface SlideProps {
  item: OnboardingSlide;
  index: number;
  scrollX: SharedValue<number>;
}

export default function Slide({ item, index, scrollX }: SlideProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [50, 0, 50],
      Extrapolation.CLAMP
    );

    const rotate = interpolate(
      scrollX.value,
      inputRange,
      [-15, 0, 15],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }, { rotate: `${rotate}deg` }],
    };
  });

  return (
    <View
      style={{ width: SCREEN_WIDTH }}
      className="flex-1 items-center justify-center px-8"
    >
      <Animated.View style={animatedStyle} className="items-center">
        {/* Icon Container */}
        <Animated.View
          style={iconAnimatedStyle}
          className="mb-10 h-40 w-40 items-center justify-center rounded-full"
        >
          <View
            className="h-36 w-36 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.accent }}
          >
            <Ionicons
              name={item.icon as keyof typeof Ionicons.glyphMap}
              size={64}
              color={colors.white}
            />
          </View>
        </Animated.View>

        {/* Title */}
        <AppText
          styles="mb-4 text-center text-3xl font-bold"
          style={{ color: colors.white }}
        >
          {item.title}
        </AppText>

        {/* Description */}
        <AppText
          styles="text-center text-lg leading-7"
          style={{ color: "rgba(255, 255, 255, 0.7)" }}
        >
          {item.description}
        </AppText>
      </Animated.View>
    </View>
  );
}
