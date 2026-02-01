import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import colors from "@/config/colors";

const steps = [
    "Select your event from the list below",
    "Scan QR codes or enter ticket IDs manually",
    "System validates and prevents duplicate check-ins",
    "View real-time check-in stats and history",
];

const CheckInHeader = () => {
    return (
        <View className="gap-4">
            {/* Title row */}
            <View className="flex-row items-center gap-3">
                <View
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: "#10b98133" }}
                >
                    <Ionicons name="scan-outline" size={24} color="#34d399" />
                </View>
                <View>
                    <AppText styles="text-xl text-white" font="font-ibold">
                        Event Check-in
                    </AppText>
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                        Scan QR codes to check in attendees
                    </AppText>
                </View>
            </View>

            {/* Info box */}
            <View
                className="p-4 rounded-xl border"
                style={{ backgroundColor: "#3b82f60D", borderColor: "#3b82f633" }}
            >
                <View className="flex-row items-start gap-2 mb-2">
                    <Ionicons name="information-circle-outline" size={18} color="#60a5fa" style={{ marginTop: 1 }} />
                    <AppText styles="text-xs" font="font-ibold" style={{ color: "#93c5fd" }}>
                        How Check-in Works
                    </AppText>
                </View>
                <View className="gap-1 ml-5">
                    {steps.map((step, i) => (
                        <AppText key={i} styles="text-xs" font="font-iregular" style={{ color: "#93c5fd" }}>
                            • {step}
                        </AppText>
                    ))}
                </View>
            </View>
        </View>
    );
};

export default CheckInHeader;