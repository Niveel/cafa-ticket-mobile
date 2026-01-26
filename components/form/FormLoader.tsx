import { View, Text } from "react-native";

import {Animation} from "@/components";
import { movingCar } from "@/assets";

const FormLoader = ({ visible }: { visible: boolean }) => {
    if (!visible) return null;

    return (
        <View
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 200, 200, 0.2)",
                zIndex: 999,
            }}
            accessible={true}
            accessibilityLabel="Loading, please wait..."
            accessibilityLiveRegion="polite" // Announces updates dynamically
        >
            <View style={{ height: 300, width: 300 }}>
                <Animation isVisible={true} path={movingCar} />
            </View>

            {/* Hidden text for screen readers */}
            <Text
                style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
                accessibilityLiveRegion="assertive"
            >
                Loading, please wait...
            </Text>
        </View>
    );
};

export default FormLoader;
