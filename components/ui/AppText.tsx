import React, { ReactNode } from "react";
import { Text, TextProps, StyleProp, TextStyle } from "react-native";

interface AppTextProps extends TextProps {
    children: ReactNode;
    styles?: string;
    font?: string;
    color?: string;
    style?: StyleProp<TextStyle>;
}

const AppText: React.FC<AppTextProps> = ({
    children,
    styles = "",
    style,
    font = "font-pregular",
    color = "text-white",
    ...otherProps
}) => {
    return (
        <Text
            className={`${color} ${styles} ${font}`}
            style={style}
            {...otherProps}
        >
            {children}
        </Text>
    );
};

export default AppText;
