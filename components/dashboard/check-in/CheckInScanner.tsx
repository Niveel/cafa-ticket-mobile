import { View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import {
    AppText,
    CheckInStats,
    QRScanner,
    ManualEntry,
    CheckInResult,
} from "@/components";
import colors from "@/config/colors";
import type { MyEvent } from "@/types/dash-events.types";
import type { CheckInSuccessResponse, CheckInResponse } from "@/types/dashboard.types";

type Props = {
    event: MyEvent;
    onSuccess: (data: CheckInSuccessResponse) => void;
    onChangeEvent: () => void;
};

type ScanMode = "qr" | "manual";

const CheckInScanner = ({ event, onSuccess, onChangeEvent }: Props) => {
    const [scanMode, setScanMode] = useState<ScanMode>("qr");
    const [checkInResult, setCheckInResult] = useState<CheckInResponse | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckIn = async (ticketId: string) => {
        setIsProcessing(true);
        setCheckInResult(null);

        try {
            const response = await fetch(`/api/dashboard/events/${event.slug}/check-in`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticket_id: ticketId }),
            });

            const data: CheckInResponse = await response.json();
            setCheckInResult(data);

            if (data.success) {
                onSuccess(data);
            }
        } catch (error) {
            console.error("Check-in error:", error);
            setCheckInResult({
                success: false,
                error: "Check-in failed",
                message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <View className="gap-4">
            {/* Event bar: back arrow + title + venue */}
            <View
                className="flex-row items-center gap-3 rounded-xl p-4 border-2"
                style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
            >
                <TouchableOpacity
                    onPress={onChangeEvent}
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.primary200 }}
                    activeOpacity={0.6}
                    accessibilityRole="button"
                    accessibilityLabel="Change event"
                >
                    <Ionicons name="arrow-back-outline" size={20} color="#fff" />
                </TouchableOpacity>
                <View className="flex-1">
                    <AppText styles="text-sm text-white" font="font-ibold" numberOfLines={1}>
                        {event.title}
                    </AppText>
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                        {event.venue_name}, {event.venue_city}
                    </AppText>
                </View>
            </View>

            {/* Stats grid */}
            <CheckInStats event={event} />

            {/* Mode toggle: QR Scanner | Manual Entry */}
            <View
                className="flex-row p-1 rounded-xl"
                style={{ backgroundColor: colors.primary200 }}
            >
                {(["qr", "manual"] as ScanMode[]).map((mode) => {
                    const active = scanMode === mode;
                    return (
                        <TouchableOpacity
                            key={mode}
                            onPress={() => setScanMode(mode)}
                            className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-lg"
                            style={active ? { backgroundColor: colors.accent } : undefined}
                            activeOpacity={0.6}
                            accessibilityRole="button"
                            accessibilityLabel={mode === "qr" ? "QR Scanner mode" : "Manual entry mode"}
                        >
                            <Ionicons
                                name={mode === "qr" ? "scan-outline" : "create-outline"}
                                size={18}
                                color={active ? "#fff" : "rgba(255,255,255,0.4)"}
                            />
                            <AppText
                                styles="text-xs"
                                font={active ? "font-ibold" : "font-iregular"}
                                style={{ color: active ? "#fff" : "rgba(255,255,255,0.4)" }}
                            >
                                {mode === "qr" ? "QR Scanner" : "Manual Entry"}
                            </AppText>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Check-in result banner (above scanner/input) */}
            {checkInResult && (
                <CheckInResult result={checkInResult} onDismiss={() => setCheckInResult(null)} />
            )}

            {/* Scanner or Manual */}
            {scanMode === "qr" ? (
                <QRScanner onScan={handleCheckIn} isProcessing={isProcessing} />
            ) : (
                <ManualEntry onSubmit={handleCheckIn} isProcessing={isProcessing} />
            )}
        </View>
    );
};

export default CheckInScanner;