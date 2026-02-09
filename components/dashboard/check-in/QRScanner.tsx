import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useCallback, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";

import AppText from "../../ui/AppText";
import colors from "@/config/colors";

type Props = {
    onScan: (ticketId: string) => void;
    isProcessing: boolean;
};

const QRScanner = ({ onScan, isProcessing }: Props) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [isActive, setIsActive] = useState(false);
    const lastScanRef = useRef<string>("");
    const scanCooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Permission not yet determined
    if (permission === null) {
        return (
            <View className="items-center justify-center py-16">
                <Ionicons name="camera-outline" size={48} color={colors.accent50} style={{ opacity: 0.4 }} />
            </View>
        );
    }

    // Permission denied
    if (!permission.granted) {
        return (
            <View
                className="rounded-xl p-6 border-2 items-center"
                style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
            >
                <View className="w-16 h-16 rounded-full items-center justify-center mb-4" style={{ backgroundColor: "#ef444422" }}>
                    <Ionicons name="ban-outline" size={32} color="#f87171" />
                </View>
                <AppText styles="text-sm text-white text-center" font="font-ibold">
                    Camera Permission Required
                </AppText>
                <AppText styles="text-xs text-white text-center mt-1 mb-4" font="font-iregular" style={{ opacity: 0.5, maxWidth: 260 }}>
                    Allow camera access so you can scan ticket QR codes at the event.
                </AppText>
                <TouchableOpacity
                    onPress={requestPermission}
                    className="px-5 py-2.5 rounded-xl"
                    style={{ backgroundColor: colors.accent }}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Grant camera permission"
                >
                    <AppText styles="text-sm text-white" font="font-ibold">
                        Allow Camera
                    </AppText>
                </TouchableOpacity>

                {/* Info: can still use manual entry */}
                <View
                    className="flex-row items-start gap-2 mt-5 p-3 rounded-lg border w-full"
                    style={{ backgroundColor: "#3b82f60D", borderColor: "#3b82f633" }}
                >
                    <Ionicons name="information-circle-outline" size={16} color="#60a5fa" style={{ marginTop: 1 }} />
                    <AppText styles="text-xs flex-1" font="font-iregular" style={{ color: "#93c5fd" }}>
                        You can still check in attendees using Manual Entry above while camera is unavailable.
                    </AppText>
                </View>
            </View>
        );
    }

    const handleBarCodeScanned = useCallback(
        ({ data }: { data: string }) => {
            if (isProcessing) return;
            // Dedupe: ignore if same ticket scanned within cooldown
            if (data === lastScanRef.current) return;

            lastScanRef.current = data;

            // Try to parse JSON QR payload (e.g. { ticket_id: "..." })
            let ticketId = data;
            try {
                const parsed = JSON.parse(data);
                if (parsed.ticket_id) {
                    ticketId = parsed.ticket_id;
                }
            } catch {
                // plain text ticket ID — use as-is
            }

            onScan(ticketId);

            // Reset after 2.5s so same ticket can be scanned again if needed
            if (scanCooldownRef.current) clearTimeout(scanCooldownRef.current);
            scanCooldownRef.current = setTimeout(() => {
                lastScanRef.current = "";
            }, 2500);
        },
        [isProcessing, onScan]
    );

    return (
        <View
            className="rounded-xl overflow-hidden border-2"
            style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
        >
            {/* Header row */}
            <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center gap-3">
                    <View className="w-9 h-9 rounded-lg items-center justify-center" style={{ backgroundColor: "#10b98133" }}>
                        <Ionicons name="scan-outline" size={18} color="#34d399" />
                    </View>
                    <View>
                        <AppText styles="text-sm text-white" font="font-ibold">
                            QR Code Scanner
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                            {isActive ? "Scanning…" : "Camera ready"}
                        </AppText>
                    </View>
                </View>

                {/* Start / Stop toggle */}
                <TouchableOpacity
                    onPress={() => setIsActive((v) => !v)}
                    className="flex-row items-center gap-1.5 px-3 py-2 rounded-lg"
                    style={{
                        backgroundColor: isActive ? "#ef4444" : "#10b981",
                    }}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={isActive ? "Stop camera" : "Start camera"}
                >
                    <Ionicons name={isActive ? "square-outline" : "camera-outline"} size={16} color="#fff" />
                    <AppText styles="text-xs text-white" font="font-ibold">
                        {isActive ? "Stop" : "Start"}
                    </AppText>
                </TouchableOpacity>
            </View>

            {/* Camera viewport */}
            <View style={styles.cameraWrapper}>
                {isActive ? (
                    <CameraView
                        style={styles.camera}
                        facing="back"
                        onBarcodeScanned={handleBarCodeScanned}
                        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                    >
                        {/* Scan-box overlay */}
                        <View style={styles.overlayOuter}>
                            <View style={styles.scanBox}>
                                {/* Corner accents */}
                                <View style={[styles.corner, styles.topLeft]} />
                                <View style={[styles.corner, styles.topRight]} />
                                <View style={[styles.corner, styles.bottomLeft]} />
                                <View style={[styles.corner, styles.bottomRight]} />
                            </View>
                        </View>

                        {/* Processing overlay */}
                        {isProcessing && (
                            <View style={styles.processingOverlay}>
                                <Ionicons name="hourglass-outline" size={36} color="#fff" />
                                <AppText styles="text-sm text-white mt-2" font="font-ibold">
                                    Processing…
                                </AppText>
                            </View>
                        )}
                    </CameraView>
                ) : (
                    /* Inactive placeholder */
                    <View style={[styles.camera, styles.placeholder]}>
                        <Ionicons name="camera-outline" size={56} color="rgba(255,255,255,0.15)" />
                        <AppText styles="text-xs text-white mt-3 text-center" font="font-iregular" style={{ opacity: 0.4 }}>
                            Press "Start" to begin scanning
                        </AppText>
                    </View>
                )}
            </View>

            {/* Tips */}
            <View
                className="flex-row items-start gap-2 m-4 p-3 rounded-lg border"
                style={{ backgroundColor: "#3b82f60D", borderColor: "#3b82f633" }}
            >
                <Ionicons name="information-circle-outline" size={16} color="#60a5fa" style={{ marginTop: 1 }} />
                <View>
                    <AppText styles="text-xs" font="font-ibold" style={{ color: "#93c5fd" }}>
                        Scanning Tips
                    </AppText>
                    <AppText styles="text-xs mt-1" font="font-iregular" style={{ color: "#93c5fd" }}>
                        • Hold steady with good lighting{"\n"}
                        • Center the QR code in the box{"\n"}
                        • Keep the code flat, avoid glare{"\n"}
                        • Scanner detects and processes automatically
                    </AppText>
                </View>
            </View>
        </View>
    );
};

const CAMERA_HEIGHT = 320;
const SCAN_BOX = 200;
const CORNER = 24;

const styles = StyleSheet.create({
    cameraWrapper: {
        width: "100%",
        height: CAMERA_HEIGHT,
    },
    camera: {
        width: "100%",
        height: CAMERA_HEIGHT,
    },
    placeholder: {
        backgroundColor: "#111",
        alignItems: "center",
        justifyContent: "center",
    },

    // Scan-box overlay
    overlayOuter: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    scanBox: {
        width: SCAN_BOX,
        height: SCAN_BOX,
        position: "relative",
    },

    // Corner accents — each is an L-shape via two nested absolute borders
    corner: {
        position: "absolute",
        width: CORNER,
        height: CORNER,
        borderColor: "#34d399",
        borderWidth: 3,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },

    // Processing dim
    processingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.75)",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default QRScanner;