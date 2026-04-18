import { ReactNode, useEffect } from "react";
import { router, usePathname } from "expo-router";
import { View, ActivityIndicator } from "react-native";

import { useAuth } from "@/context";
import colors from "@/config/colors";

interface RequireAuthProps {
    children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
    const { user, isLoading } = useAuth();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace({
                pathname: "/login",
                params: { from: pathname },
            });
        }
    }, [isLoading, user, pathname]);

    if (isLoading || !user) {
        return (
            <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.primary }}>
                <ActivityIndicator size="small" color={colors.accent} />
            </View>
        );
    }

    return <>{children}</>;
};

export default RequireAuth;
