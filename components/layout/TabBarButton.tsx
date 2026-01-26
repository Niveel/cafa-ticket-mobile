import { PlatformPressable } from '@react-navigation/elements';
import { StyleSheet } from 'react-native';
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated"
import { useEffect } from 'react';

import colors from '@/config/colors';
import { icon } from '@/constants/icon';

type Props = {
    onPress: () => void;
    onLongPress: () => void;
    isFocused: boolean;
    routeName: string;
    label: string | ((props: { focused: boolean; color: string; position: 'beside-icon' | 'below-icon'; children: string }) => React.ReactNode);
    color?: string;
    href?: string;
    accessibilityLabel?: string;
}

const TabBarButton = ({ onPress, onLongPress, isFocused, routeName, label, href, accessibilityLabel }: Props) => {
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0): isFocused, {duration: 350});
    }, [scale, isFocused]);

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0]);

        return { opacity };
    });

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
        const top = interpolate(scale.value, [0, 1], [0, 9]);

        return { 
            transform: [{ scale: scaleValue }],
            top 
        };
    });

    return (
        <PlatformPressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={accessibilityLabel}
            href={href}
        >
            {typeof label === 'function' ? (
                label({
                    focused: isFocused,
                    color: isFocused ? colors.primary : colors.white,
                    position: 'beside-icon',
                    children: routeName,
                })
            ) : (
                <>
                <Animated.View style={animatedIconStyle}>
                    {icon[routeName as keyof typeof icon]({ color: isFocused ? colors.white : colors.accent })}
                </Animated.View>
                    <Animated.Text style={[
                        { color: isFocused ? colors.primary : colors.white, fontSize: 10}, 
                        animatedStyle]}>
                        {label}
                    </Animated.Text>
                </>
            )}
        </PlatformPressable>
    )
}

const styles = StyleSheet.create({
    tabBarItem: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        gap: 3,
    },
})

export default TabBarButton