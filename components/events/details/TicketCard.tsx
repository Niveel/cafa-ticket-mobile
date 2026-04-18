import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, memo, useRef, useCallback, useEffect } from "react";
import Animated, { FadeIn } from "react-native-reanimated";
import Svg, { Polygon } from "react-native-svg";

import AppText from "../../ui/AppText";
import { TicketType, EventDetails } from "@/types";
import { CurrentUser } from "@/types/general.types";
import colors from "@/config/colors";
import { useFormatMoney } from "@/hooks/useFormatMoney";

interface TicketCardProps {
    ticket: TicketType;
    event: EventDetails;
    currentUser: CurrentUser | null;
    onPurchase?: (ticket: TicketType, quantity: number) => void;
}

// Ticket theme colors - UPDATE to return actual color values
const getTicketTheme = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("vip") || lowerName.includes("premium")) {
        return {
            badge: "bg-amber-500/20 border-amber-500",
            icon: "#fbbf24",
            buttonColor: "#f59e0b" // ⬅️ Add button color
        };
    }
    if (lowerName.includes("early") || lowerName.includes("bird")) {
        return {
            badge: "bg-green-500/20 border-green-500",
            icon: "#22c55e",
            buttonColor: "#16a34a" // ⬅️ Add button color
        };
    }
    if (lowerName.includes("student") || lowerName.includes("discount")) {
        return {
            badge: "bg-blue-500/20 border-blue-500",
            icon: "#3b82f6",
            buttonColor: "#2563eb" // ⬅️ Add button color
        };
    }
    return {
        badge: "bg-accent/20 border-accent",
        icon: colors.accent50,
        buttonColor: colors.accent // ⬅️ Add button color (default)
    };
};

const TicketCard = ({ ticket, event, currentUser, onPurchase }: TicketCardProps) => {
    const formatMoney = useFormatMoney();
    const [quantity, setQuantity] = useState(ticket.min_purchase);
    const longPressConsumedRef = useRef(false);
    const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const repeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const theme = getTicketTheme(ticket.name);
    const isSoldOut = !ticket.is_available || ticket.tickets_remaining === 0;
    const isLowStock = ticket.tickets_remaining > 0 && ticket.tickets_remaining <= 10;
    const isOrganizerViewingOwnEvent =
        !!currentUser && currentUser.id === event.organizer.id;
    const hasUnlimitedPerUserCap = !ticket.max_purchase || ticket.max_purchase <= 0;
    const effectiveMaxPurchase = Math.max(
        ticket.min_purchase,
        Math.min(
            hasUnlimitedPerUserCap ? ticket.tickets_remaining : ticket.max_purchase,
            ticket.tickets_remaining
        )
    );

    const handleQuantityChange = useCallback((newQuantity: number) => {
        if (newQuantity >= ticket.min_purchase && newQuantity <= effectiveMaxPurchase) {
            setQuantity(newQuantity);
        }
    }, [ticket.min_purchase, effectiveMaxPurchase]);

    const clearAutoChange = useCallback(() => {
        if (longPressTimeoutRef.current) {
            clearTimeout(longPressTimeoutRef.current);
            longPressTimeoutRef.current = null;
        }
        if (repeatIntervalRef.current) {
            clearInterval(repeatIntervalRef.current);
            repeatIntervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => clearAutoChange();
    }, [clearAutoChange]);

    const applyDelta = useCallback(
        (delta: 1 | -1) => {
            setQuantity((prev) => {
                const next = prev + delta;
                if (next < ticket.min_purchase || next > effectiveMaxPurchase) {
                    clearAutoChange();
                    return prev;
                }
                return next;
            });
        },
        [ticket.min_purchase, effectiveMaxPurchase, clearAutoChange]
    );

    const startAutoChange = useCallback(
        (delta: 1 | -1) => {
            clearAutoChange();
            longPressConsumedRef.current = true;

            // Start quickly, then repeat fast while holding.
            applyDelta(delta);
            repeatIntervalRef.current = setInterval(() => {
                applyDelta(delta);
            }, 55);
        },
        [applyDelta, clearAutoChange]
    );

    const handleMinusPress = useCallback(() => {
        if (longPressConsumedRef.current) {
            return;
        }
        handleQuantityChange(quantity - 1);
    }, [quantity, handleQuantityChange]);

    const handlePlusPress = useCallback(() => {
        if (longPressConsumedRef.current) {
            return;
        }
        handleQuantityChange(quantity + 1);
    }, [quantity, handleQuantityChange]);

    const handleQuantityPressOut = useCallback(() => {
        clearAutoChange();
        longPressConsumedRef.current = false;
    }, [clearAutoChange]);

    const subtotal = parseFloat(ticket.price) * quantity;

    return (
        <Animated.View entering={FadeIn}>
            <View className={`bg-primary-100 rounded-2xl overflow-hidden ${isSoldOut ? "opacity-60" : ""}`} style={{ borderWidth: 2, borderColor: isSoldOut ? "#64748b" : colors.accent }}>
                {/* Perforation Top */}
                <View className="h-2 w-full">
                    <Svg height="8" width="100%" viewBox="0 0 100 8">
                        {Array.from({ length: 20 }).map((_, i) => {
                            const x = (i / 20) * 100;
                            const nextX = ((i + 1) / 20) * 100;
                            return (
                                <Polygon
                                    key={i}
                                    points={`${x},0 ${nextX},0 ${(x + nextX) / 2},8`}
                                    fill={isSoldOut ? "#64748b" : theme.buttonColor}
                                />
                            );
                        })}
                    </Svg>
                </View>

                <View className="p-2 pt-4">
                    {/* Header */}
                    <View className="flex-row justify-between items-start mb-1">
                        <View className={`px-2 py-1 rounded-lg flex-row items-center gap-2 ${theme.badge}`} style={{ borderWidth: 1 }}>
                            <Ionicons name="ticket-outline" size={16} color="#94a3b8" />
                            <AppText styles="text-xs uppercase font-nunbold" style={{ color: "white" }}>
                                {ticket.name}
                            </AppText>
                        </View>

                        {isSoldOut ? (
                            <View className="px-2 py-1 bg-slate-600/20 rounded-lg" style={{ borderWidth: 1, borderColor: "#64748b" }}>
                                <AppText styles="text-xs text-slate-300 font-nunbold">SOLD OUT</AppText>
                            </View>
                        ) : isLowStock && (
                            <View className="px-2 py-1 bg-accent/20 rounded-lg animate-pulse" style={{ borderWidth: 1, borderColor: colors.accent }}>
                                <AppText styles="text-xs text-accent-50 font-nunbold">ALMOST GONE</AppText>
                            </View>
                        )}
                    </View>

                    {/* Description */}
                    <AppText styles="text-sm text-slate-300 mb-1 leading-relaxed">
                        {ticket.description}
                    </AppText>

                    {/* Price */}
                    <View className="flex-row items-baseline gap-2 mb-1">
                        <AppText styles="text-2xl text-white font-nunbold">
                            {formatMoney(ticket.price)}
                        </AppText>
                        <AppText styles="text-sm text-slate-300">
                            per ticket
                        </AppText>
                    </View>

                    {/* Availability */}
                    {!isSoldOut && (
                        <View>
                            <View className="flex-row justify-between mb-1">
                                <AppText styles="text-xs text-slate-300">Available</AppText>
                                <AppText styles="text-xs text-white font-nunbold" style={{ color: colors.white }}>
                                    {ticket.tickets_remaining} left
                                </AppText>
                            </View>
                            <View className="h-2 bg-primary-200 rounded-full overflow-hidden">
                                <View className="h-full bg-accent-50 rounded-full" style={{ width: `${(ticket.tickets_sold / ticket.quantity) * 100}%` }} />
                            </View>
                        </View>
                    )}

                    {/* Sold Out Date */}
                    {isSoldOut && ticket.sold_out_at && (
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="time-outline" size={14} color="#94a3b8" />
                            <AppText styles="text-xs text-slate-300">
                                Sold out on {new Date(ticket.sold_out_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </AppText>
                        </View>
                    )}

                    {/* Perforation Line */}
                    <View style={{ height: 2, backgroundColor: colors.accent + "80", marginVertical: 5 }} className="border-dashed" />

                    {!isSoldOut && !isOrganizerViewingOwnEvent && (
                        <>
                            {/* Quantity Selector */}
                            <View className="mb-2">
                                <AppText styles="text-xs text-slate-300 mb-2">Quantity</AppText>
                                <View className="flex-row items-center gap-3">
                                    <TouchableOpacity
                                        onPress={handleMinusPress}
                                        onLongPress={() => startAutoChange(-1)}
                                        onPressOut={handleQuantityPressOut}
                                        delayLongPress={250}
                                        disabled={quantity <= ticket.min_purchase}
                                        className="w-12 h-12 rounded-xl items-center justify-center"
                                        style={{ backgroundColor: colors.primary200, borderWidth: 2, borderColor: colors.accent, opacity: quantity <= ticket.min_purchase ? 0.3 : 1 }}
                                        activeOpacity={0.7}
                                        accessibilityRole="button"
                                        accessibilityLabel={`Decrease ${ticket.name} quantity`}
                                        accessibilityHint={`Lowers ticket quantity, minimum is ${ticket.min_purchase}`}
                                        accessibilityState={{ disabled: quantity <= ticket.min_purchase }}
                                    >
                                        <AppText styles="text-lg text-white font-nunbold">-</AppText>
                                    </TouchableOpacity>

                                    <View
                                        className="flex-1 h-12 px-4 bg-primary-200 rounded-xl items-center justify-center"
                                        style={{ borderWidth: 2, borderColor: colors.accent }}
                                        accessible
                                        accessibilityRole="adjustable"
                                        accessibilityLabel={`${ticket.name} ticket quantity`}
                                        accessibilityHint={`Adjust between ${ticket.min_purchase} and ${effectiveMaxPurchase}`}
                                        accessibilityValue={{
                                            min: ticket.min_purchase,
                                            max: effectiveMaxPurchase,
                                            now: quantity,
                                        }}
                                        accessibilityActions={[
                                            { name: "decrement", label: "Decrease quantity" },
                                            { name: "increment", label: "Increase quantity" },
                                        ]}
                                        onAccessibilityAction={(event) => {
                                            if (event.nativeEvent.actionName === "increment") {
                                                handleQuantityChange(quantity + 1);
                                            } else if (event.nativeEvent.actionName === "decrement") {
                                                handleQuantityChange(quantity - 1);
                                            }
                                        }}
                                    >
                                        <AppText styles="text-lg text-white font-nunbold">{quantity}</AppText>
                                    </View>

                                    <TouchableOpacity
                                        onPress={handlePlusPress}
                                        onLongPress={() => startAutoChange(1)}
                                        onPressOut={handleQuantityPressOut}
                                        delayLongPress={250}
                                        disabled={quantity >= effectiveMaxPurchase}
                                        className="w-12 h-12 rounded-xl items-center justify-center"
                                        style={{ backgroundColor: colors.primary200, borderWidth: 2, borderColor: colors.accent, opacity: quantity >= effectiveMaxPurchase ? 0.3 : 1 }}
                                        activeOpacity={0.7}
                                        accessibilityRole="button"
                                        accessibilityLabel={`Increase ${ticket.name} quantity`}
                                        accessibilityHint={`Increases ticket quantity, maximum is ${effectiveMaxPurchase}`}
                                        accessibilityState={{ disabled: quantity >= effectiveMaxPurchase }}
                                    >
                                        <AppText styles="text-lg text-white font-nunbold">+</AppText>
                                    </TouchableOpacity>
                                </View>
                                <AppText styles="text-xs text-slate-300 mt-2">
                                    Min: {ticket.min_purchase} • Max: {effectiveMaxPurchase}
                                </AppText>
                            </View>

                            {/* Total Price */}
                            <View className="flex-row justify-between items-center p-2 bg-primary-200 rounded-xl mb-4" style={{ borderWidth: 1, borderColor: colors.accent }}>
                                <AppText styles="text-sm text-slate-300">Total Price</AppText>
                                <AppText styles="text-xl text-white font-nunbold">{formatMoney(subtotal)}</AppText>
                            </View>

                            {/* Select Button */}
                            <TouchableOpacity
                                onPress={() => onPurchase?.(ticket, quantity)}
                                className="w-full py-4 px-6 rounded-xl items-center"
                                style={{ backgroundColor: theme.buttonColor }}
                                activeOpacity={0.8}
                                accessibilityRole="button"
                                accessibilityLabel={`Select ${ticket.name} ticket`}
                                accessibilityHint={`Opens purchase confirmation for ${quantity} ${ticket.name} ticket${quantity > 1 ? "s" : ""}`}
                            >
                                <AppText styles="text-sm text-white font-nunbold">Select {ticket.name}</AppText>
                            </TouchableOpacity>
                        </>
                    )}

                    {!isSoldOut && isOrganizerViewingOwnEvent && (
                        <View
                            className="p-3 rounded-xl border"
                            style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "66" }}
                            accessible
                            accessibilityRole="alert"
                            accessibilityLabel="Purchase disabled for organizer-owned event."
                        >
                            <AppText styles="text-xs text-white" font="font-ibold">
                                Purchase Disabled
                            </AppText>
                            <AppText styles="text-xs text-slate-300 mt-1" font="font-iregular">
                                Organizers cannot buy tickets for their own events.
                            </AppText>
                        </View>
                    )}

                    {isSoldOut && (
                        <View className="items-center py-4">
                            <Ionicons name="close-circle-outline" size={48} color="#64748b" />
                            <AppText styles="text-sm text-slate-300 mt-2">This ticket type is no longer available</AppText>
                        </View>
                    )}
                </View>

                {/* Barcode Pattern Bottom */}
                <View className="flex-row items-end gap-0.5 px-6 pb-2 h-12 opacity-20">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <View key={i} className="flex-1 rounded-t" style={{ backgroundColor: isSoldOut ? "#64748b" : colors.white, height: `${Math.random() * 60 + 40}%`, minHeight: "40%" }} />
                    ))}
                </View>
            </View>
        </Animated.View>
    );
};

export default memo(TicketCard);


