import { View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../ui/AppText";
import colors from "@/config/colors";

type Props = {
    onSubmit: (ticketId: string) => void;
    isProcessing: boolean;
};

const examples = ["TKT-UUID-001", "TKT-UUID-002", "TKT-UUID-003"];

const ManualEntry = ({ onSubmit, isProcessing }: Props) => {
    const [ticketId, setTicketId] = useState("");
    const inputRef = useRef<TextInput>(null);

    const handleSubmit = () => {
        if (!ticketId.trim()) return;
        onSubmit(ticketId.trim());
        setTicketId("");
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    return (
        <View
            className="rounded-xl p-4 border-2"
            style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
        >
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-4">
                <View className="w-9 h-9 rounded-lg items-center justify-center" style={{ backgroundColor: "#3b82f633" }}>
                    <Ionicons name="search-outline" size={18} color="#60a5fa" />
                </View>
                <View>
                    <AppText styles="text-sm text-white" font="font-ibold">
                        Manual Entry
                    </AppText>
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                        Enter ticket ID manually
                    </AppText>
                </View>
            </View>

            {/* Input + submit button */}
            <View className="flex-row items-center gap-2">
                <View
                    className="flex-1 flex-row items-center rounded-xl border-2 px-4"
                    style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "4D", height: 52 }}
                >
                    <TextInput
                        ref={inputRef}
                        value={ticketId}
                        onChangeText={setTicketId}
                        onSubmitEditing={handleSubmit}
                        placeholder="Ticket ID…"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        style={{ flex: 1, color: "#fff", fontSize: 14, fontFamily: "monospace" }}
                        autoCorrect={false}
                        autoCapitalize="none"
                        editable={!isProcessing}
                        returnKeyType="go"
                        autoFocus={true}
                    />
                </View>
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!ticketId.trim() || isProcessing}
                    className="px-4 rounded-xl items-center justify-center"
                    style={{
                        backgroundColor: colors.accent,
                        height: 52,
                        opacity: !ticketId.trim() || isProcessing ? 0.4 : 1,
                    }}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Check in"
                >
                    {isProcessing ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <AppText styles="text-sm text-white" font="font-ibold">
                            Check In
                        </AppText>
                    )}
                </TouchableOpacity>
            </View>

            {/* Example IDs */}
            <View className="mt-4">
                <AppText styles="text-xs text-white mb-2" font="font-iregular" style={{ opacity: 0.5 }}>
                    Example Ticket IDs (for testing):
                </AppText>
                <View className="flex-row flex-wrap gap-2">
                    {examples.map((id) => (
                        <TouchableOpacity
                            key={id}
                            onPress={() => setTicketId(id)}
                            disabled={isProcessing}
                            className="px-3 py-1.5 rounded-lg border"
                            style={{
                                backgroundColor: colors.primary200,
                                borderColor: colors.accent + "33",
                                opacity: isProcessing ? 0.4 : 1,
                            }}
                            activeOpacity={0.6}
                        >
                            <AppText styles="text-xs text-white" font="font-iregular" style={{ fontFamily: "monospace" }}>
                                {id}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Info banner */}
            <View
                className="flex-row items-start gap-2 mt-4 p-3 rounded-lg border"
                style={{ backgroundColor: "#3b82f60D", borderColor: "#3b82f633" }}
            >
                <Ionicons name="information-circle-outline" size={16} color="#60a5fa" style={{ marginTop: 1 }} />
                <View>
                    <AppText styles="text-xs" font="font-ibold" style={{ color: "#93c5fd" }}>
                        When to Use Manual Entry
                    </AppText>
                    <AppText styles="text-xs mt-1" font="font-iregular" style={{ color: "#93c5fd" }}>
                        • QR code is damaged or unreadable{"\n"}
                        • Camera is not available{"\n"}
                        • Attendee has ticket ID but no QR code
                    </AppText>
                </View>
            </View>
        </View>
    );
};

export default ManualEntry;