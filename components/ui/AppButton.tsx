import React from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Link, Href } from 'expo-router';
import AppText from "./AppText";

// Base props common to both button and link variants
interface BaseProps {
    title?: string;
    onClick?: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'primarySolid';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

// Props when rendering as a Link
interface LinkProps extends BaseProps {
    href: Href;
    type?: never;
}

// Props when rendering as a button
interface ButtonProps extends BaseProps {
    href?: never;
    type?: 'button' | 'submit';
}

type AppButtonProps = LinkProps | ButtonProps;

const AppButton = ({
    href,
    title = "Button",
    onClick,
    className = "",
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    icon,
    iconPosition = 'left',
}: AppButtonProps) => {
    // Variant styles
    const variantClasses = {
        primary: 'bg-primary active:bg-primary/90',
        secondary: 'bg-secondary active:bg-secondary/90',
        outline: 'bg-transparent border-2 border-secondary active:bg-primary/20',
        ghost: 'bg-transparent active:bg-slate-100',
        danger: 'bg-red-600 active:bg-red-700',
        primarySolid: 'bg-primary border border-primary-200 active:bg-primary-100',
    };

    // Text color based on variant
    const textColorClasses = {
        primary: 'text-black',
        secondary: 'text-slate-200',
        outline: 'text-white',
        ghost: 'text-slate-700',
        danger: 'text-white',
        primarySolid: 'text-white',
    };

    // Size styles
    const sizeClasses = {
        sm: 'px-2 py-2 min-h-[36px]',
        md: 'px-4 py-2 min-h-[44px]',
        lg: 'px-6 py-3 min-h-[52px]',
    };

    // Text size based on size
    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    // Base classes
    const baseClasses = `
        flex-row
        justify-center
        items-center
        gap-2
        ${fullWidth ? 'w-full' : ''}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-xl
        ${(loading || disabled) ? 'opacity-50' : ''}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const textClasses = `
        ${textColorClasses[variant]}
        ${textSizeClasses[size]}
        font-isemibold
    `.trim().replace(/\s+/g, ' ');

    // Content with loading state and icon
    const content = (
        <>
            {loading && (
                <ActivityIndicator 
                    size="small" 
                    color={variant === 'secondary' || variant === 'ghost' ? '#334155' : '#ffffff'} 
                />
            )}
            {!loading && icon && iconPosition === 'left' && (
                <View className="shrink-0">{icon}</View>
            )}
            <AppText className={textClasses}>{title}</AppText>
            {!loading && icon && iconPosition === 'right' && (
                <View className="shrink-0">{icon}</View>
            )}
        </>
    );

    // Render as Link when href is provided
    if (href) {
        return (
            <Link
                href={href}
                asChild
            >
                <TouchableOpacity
                    className={baseClasses}
                    onPress={onClick}
                    disabled={loading || disabled}
                    accessibilityLabel={title}
                    accessibilityRole="button"
                    activeOpacity={0.7}
                >
                    {content}
                </TouchableOpacity>
            </Link>
        );
    }

    // Render as button when no href is provided
    return (
        <TouchableOpacity
            className={baseClasses}
            onPress={onClick}
            disabled={loading || disabled}
            accessibilityLabel={title}
            accessibilityRole="button"
            activeOpacity={0.7}
        >
            {content}
        </TouchableOpacity>
    );
};

export default AppButton;
