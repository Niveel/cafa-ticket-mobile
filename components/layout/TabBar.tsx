import { StyleSheet, LayoutChangeEvent } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useState, useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TabBarButton from './TabBarButton';
import colors from '@/config/colors';
import { useTabBarVisibility } from '@/context/TabBarContext';

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { buildHref } = useLinkBuilder();
    const insets = useSafeAreaInsets();
    const bottomOffset = insets.bottom + 8;
    const [dimensions, setDimensions] = useState({ width: 100, height: 20 });
    const buttonWidth = dimensions.width / state.routes.length;
    const { isVisible } = useTabBarVisibility();

    const onTabBarLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setDimensions({ width, height });
    }

    const tabPositionX = useSharedValue(0);

    // Sync tab position when state.index changes
    useEffect(() => {
        tabPositionX.value = withSpring(state.index * buttonWidth, { duration: 1500 });
    }, [state.index, buttonWidth, tabPositionX]);

    const animatedTabStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: tabPositionX.value }],
        };
    });

    const animatedBarStyle = useAnimatedStyle(() => {
        const totalHeight = dimensions.height + bottomOffset + 20;
        return {
            transform: [
                { 
                    translateY: withTiming(
                        isVisible.value ? 0 : totalHeight,
                        { duration: 250 }
                    )
                }
            ],
        };
    });

    return (
        <Animated.View 
            style={[styles.tabBar, { bottom: bottomOffset }, animatedBarStyle]} 
            onLayout={onTabBarLayout}
            accessible={true}
            accessibilityRole="tablist"
            accessibilityLabel="Main navigation tabs"
        >
            {/* Active Tab Indicator - Hidden from screen readers */}
            <Animated.View 
                style={[animatedTabStyle, {
                    position: "absolute",
                    width: buttonWidth - 20,
                    height: dimensions.height - 20,
                    borderRadius: 60,
                    backgroundColor: colors.accent,
                    marginHorizontal: 10,
                }]}
                importantForAccessibility="no-hide-descendants"
                accessible={false}
            />
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        // Animation is now handled by useEffect
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    // Generate accessible label with position info
                    const accessibilityLabel = options.tabBarAccessibilityLabel ?? 
                        `${typeof label === 'string' ? label : route.name} tab, ${index + 1} of ${state.routes.length}`;

                    return (
                        <TabBarButton
                            key={route.key}
                            href={buildHref(route.name, route.params)}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            isFocused={isFocused}
                            routeName={route.name}
                            label={label}
                            accessibilityLabel={accessibilityLabel}
                        />
                    );
                })}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: "absolute",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 55,
        backgroundColor: colors.primary100,
        paddingVertical: 2,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 3,
    },
})

export default TabBar;
