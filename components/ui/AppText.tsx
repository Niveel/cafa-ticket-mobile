import React, { ReactNode } from "react";
import { Text, TextProps, StyleProp, TextStyle } from "react-native";

interface AppTextProps extends TextProps {
    children: ReactNode;
    styles?: string;
    className?: string; // Add explicit support if not already there, mostly for VSCode
    color?: string;
    style?: StyleProp<TextStyle>;
    font?: string;
}

const AppText: React.FC<AppTextProps> = ({
    children,
    styles = "",
    style,
    color = "text-white",
    ...otherProps
}) => {
    return (
        <Text
            className={`${color} ${styles}`}
            style={style}
            {...otherProps}
        >
            {children}
        </Text>
    );
};

export default AppText;
