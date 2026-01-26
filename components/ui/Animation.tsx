import React, { useRef, useEffect } from "react";
import LottieView, { AnimationObject } from "lottie-react-native";
import { StyleProp, ViewStyle } from "react-native";

type PlayState = "play" | "pause" | "reset";

interface AnimationProps {
    isVisible: boolean;
    path: AnimationObject | { uri: string } | string;
    playState?: PlayState;
    style?: StyleProp<ViewStyle>;
}

const Animation: React.FC<AnimationProps> = ({
    isVisible,
    path,
    playState = "play",
    style,
}) => {
    const animationRef = useRef<LottieView>(null);

    useEffect(() => {
        if (!animationRef.current) return;

        if (playState === "play") {
            animationRef.current.play();
        } else if (playState === "pause") {
            animationRef.current.pause();
        } else if (playState === "reset") {
            animationRef.current.reset();
        }
    }, [playState]);

    if (!isVisible) return null;

    return (
        <LottieView
            ref={animationRef}
            source={path}
            loop
            style={[{ flex: 1 }, style]}
        />
    );
};

export default Animation;
