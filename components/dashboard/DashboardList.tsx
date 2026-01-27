import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import type { Href } from "expo-router";
import { useRef, memo } from "react";

import { dashboardListItems } from "@/data/item_constants";
import type { DashboardListItem } from "@/data/item_constants";
import { ListItem, AppBottomSheet, ConfirmAction } from "@/components";
import type { AppBottomSheetRef } from "@/components";
import { useAuth } from "@/context";

const DashboardList = () => {
    const bottomSheetRef = useRef<AppBottomSheetRef>(null);
    const { logout } = useAuth();

    const openBottomSheet = () => {
        bottomSheetRef.current?.open();
    };

    const handleConfirmLogout = () => {
        logout();
        bottomSheetRef.current?.close();
        router.push("/(tabs)" as Href);
    };

    const handleItemPress = (item: DashboardListItem) => {
        if (item.icon === "log-out-outline") {
            openBottomSheet();
        } else if (item.route) {
            router.push(item.route as Href);
        }
    };

    return (
        <>
            <FlashList
                data={dashboardListItems}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 10 }}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                renderItem={({ item }) => (
                    <ListItem
                        icon={item.icon}
                        title={item.title}
                        onPress={() => handleItemPress(item)}
                    />
                )}
            />
            <AppBottomSheet ref={bottomSheetRef} customSnapPoints={["35%"]}>
                <ConfirmAction
                    title="Logout"
                    desc="Are you sure you want to logout from your account?"
                    onCancel={() => bottomSheetRef.current?.close()}
                    onConfirm={handleConfirmLogout}
                    confirmBtnTitle="Logout"
                    isDestructive={false}
                />
            </AppBottomSheet>
        </>
    );
};

export default memo(DashboardList);