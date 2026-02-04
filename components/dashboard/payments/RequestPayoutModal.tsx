import {
    View,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Modal,
    ScrollView,
} from "react-native";
import { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

import AppText from "../../ui/AppText";
import { API_BASE_URL } from "@/config/settings";
import colors from "@/config/colors";
import { useCurrency } from "@/context/CurrencyContext";

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------
type Step = "amount" | "confirm";

const MIN_PAYOUT = 30; // GHS
const AUTH_TOKEN_KEY = "cafa_auth_token";

interface RequestPayoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** called after a successful payout request so the screen can re-fetch */
    onPayoutSuccess: () => void;
    availableBalance: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const RequestPayoutModal = ({
    isOpen,
    onClose,
    onPayoutSuccess,
    availableBalance,
}: RequestPayoutModalProps) => {
    const { displayCurrency, getCurrencySymbol } = useCurrency();
    const symbol = getCurrencySymbol(displayCurrency);
    const balance = parseFloat(availableBalance) || 0;

    // ---- state ----
    const [step, setStep] = useState<Step>("amount");
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const parsedAmount = parseFloat(amount);

    // ---- close / reset ----
    const handleClose = useCallback(() => {
        if (isLoading) return;
        setStep("amount");
        setAmount("");
        setError(null);
        setSuccess(false);
        onClose();
    }, [isLoading, onClose]);

    // ---- amount step ----
    const validateAmount = (): boolean => {
        if (!amount || amount.trim() === "") {
            setError("Please enter an amount");
            return false;
        }
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("Please enter a valid amount");
            return false;
        }
        if (parsedAmount < MIN_PAYOUT) {
            setError(`Minimum payout amount is ${symbol} ${MIN_PAYOUT.toFixed(2)}`);
            return false;
        }
        if (parsedAmount > balance) {
            setError(
                `Amount cannot exceed available balance (${symbol} ${balance.toFixed(2)})`
            );
            return false;
        }
        return true;
    };

    const handleContinue = () => {
        setError(null);
        if (validateAmount()) setStep("confirm");
    };

    const handleMaxAmount = () => {
        setAmount(balance.toString());
        setError(null);
    };

    // ---- confirm step ----
    const handleConfirm = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

            const response = await fetch(
                `${API_BASE_URL}/auth/withdrawal/request/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ amount: parsedAmount }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to request payout"
                );
            }

            setSuccess(true);

            // close after 2 s and let parent re-fetch
            setTimeout(() => {
                handleClose();
                onPayoutSuccess();
            }, 2000);
        } catch (err) {
            console.error("Payout request error:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to request payout. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setStep("amount");
        setError(null);
    };

    // ==================================================================
    // Render helpers
    // ==================================================================

    // --- success screen ---
    const renderSuccess = () => (
        <View className="items-center py-10">
            <View
                className="w-16 h-16 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: "#22c55e20" }}
            >
                <Ionicons
                    name="checkmark-circle-outline"
                    size={36}
                    color="#4ade80"
                />
            </View>
            <AppText styles="text-lg text-white text-center font-nunbold">
                Payout Requested! 🎉
            </AppText>
            <AppText
                styles="text-sm text-white text-center mt-2"
                style={{ opacity: 0.6 }}
            >
                Your payout request has been submitted successfully. You'll
                receive your funds within 1–3 business days.
            </AppText>
        </View>
    );

    // --- step 1: amount entry ---
    const renderAmountStep = () => (
        <>
            {/* available balance card */}
            <View
                className="rounded-xl p-4"
                style={{ backgroundColor: colors.primary200 }}
            >
                <AppText
                    styles="text-xs"
                    style={{ color: "#94a3b8" }}
                >
                    Available Balance
                </AppText>
                <AppText styles="text-xl text-white mt-1 font-nunbold">
                    {symbol} {balance.toFixed(2)}
                </AppText>
            </View>

            {/* amount input */}
            <View>
                <AppText
                    styles="text-sm mb-2"
                    style={{ color: "#cbd5e1" }}
                >
                    Withdrawal Amount{" "}
                    <AppText styles="text-sm" style={{ color: "#f87171" }}>
                        *
                    </AppText>
                </AppText>

                <View
                    className="flex-row items-center rounded-xl border-2 overflow-hidden"
                    style={{
                        backgroundColor: colors.primary200,
                        borderColor: colors.accent,
                    }}
                >
                    {/* GHS prefix */}
                    <View className="px-4 py-4">
                        <AppText
                            styles="text-base"
                            style={{ color: "#94a3b8" }}
                        >
                            {symbol}
                        </AppText>
                    </View>

                    {/* input */}
                    <TextInput
                        value={amount}
                        onChangeText={(text) => {
                            setAmount(text);
                            setError(null);
                        }}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        className="font-nunbold"
                        style={{
                            flex: 1,
                            color: "#fff",
                            fontSize: 18,
                            paddingVertical: 14,
                        }}
                        placeholderTextColor="#64748b"
                        accessibilityLabel="Withdrawal amount"
                    />

                    {/* MAX button */}
                    <TouchableOpacity
                        onPress={handleMaxAmount}
                        className="px-3 py-1.5 rounded-lg mx-2"
                        style={{ backgroundColor: colors.accent + "33" }}
                        activeOpacity={0.7}
                    >
                        <AppText
                            styles="text-xs font-nunbold"
                            style={{ color: colors.accent50 }}
                        >
                            MAX
                        </AppText>
                    </TouchableOpacity>
                </View>

                <AppText
                    styles="text-xs mt-2"
                    style={{ color: "#94a3b8" }}
                >
                    Minimum: {symbol} {MIN_PAYOUT.toFixed(2)}
                </AppText>
            </View>

            {/* error */}
            {error && (
                <View
                    className="flex-row items-start gap-3 p-4 rounded-xl border"
                    style={{
                        backgroundColor: "#ef444410",
                        borderColor: "#ef444430",
                    }}
                >
                    <Ionicons
                        name="alert-circle-outline"
                        size={20}
                        color="#f87171"
                        style={{ marginTop: 2 }}
                    />
                    <AppText
                        styles="text-xs flex-1"
                        style={{ color: "#f87171" }}
                    >
                        {error}
                    </AppText>
                </View>
            )}

            {/* info box */}
            <View
                className="flex-row items-start gap-3 p-4 rounded-xl border"
                style={{
                    backgroundColor: "#3b82f610",
                    borderColor: "#3b82f630",
                }}
            >
                <Ionicons
                    name="wallet-outline"
                    size={20}
                    color="#60a5fa"
                    style={{ marginTop: 2 }}
                />
                <View>
                    <AppText styles="text-xs font-nunbold" style={{ color: "#60a5fa" }}>
                        Payout Information
                    </AppText>
                    <AppText
                        styles="text-xs mt-1"
                        style={{ color: "#93c5fd" }}
                    >
                        • Funds will be sent to your default payment profile{"\n"}
                        • Processing time: 1–3 business days{"\n"}
                        • No additional fees
                    </AppText>
                </View>
            </View>

            {/* Continue button */}
            <TouchableOpacity
                onPress={handleContinue}
                disabled={!amount}
                className="w-full py-4 rounded-xl items-center"
                style={{
                    backgroundColor: colors.accent,
                    opacity: !amount ? 0.5 : 1,
                }}
                activeOpacity={0.8}
            >
                <View className="flex-row items-center gap-2">
                    <AppText styles="text-base text-white font-nunbold">
                        Continue
                    </AppText>
                    <Ionicons name="chevron-forward" size={20} color="#fff" />
                </View>
            </TouchableOpacity>
        </>
    );

    // --- step 2: confirmation ---
    const renderConfirmStep = () => (
        <>
            {/* summary card */}
            <View
                className="rounded-xl p-5 gap-4"
                style={{ backgroundColor: colors.primary200 }}
            >
                {/* withdrawal amount row */}
                <View className="flex-row items-center justify-between pb-4 border-b" style={{ borderColor: colors.accent + "44" }}>
                    <AppText
                        styles="text-sm"
                        style={{ color: "#94a3b8" }}
                    >
                        Withdrawal Amount
                    </AppText>
                    <AppText styles="text-lg text-white font-nunbold">
                        {symbol} {parsedAmount.toFixed(2)}
                    </AppText>
                </View>

                {/* fee row */}
                <View className="flex-row items-center justify-between">
                    <AppText
                        styles="text-sm"
                        style={{ color: "#94a3b8" }}
                    >
                        Processing Fee
                    </AppText>
                    <AppText styles="text-sm text-white font-nunbold">
                        {symbol} 0.00
                    </AppText>
                </View>

                {/* you'll receive row */}
                <View
                    className="flex-row items-center justify-between pt-4 border-t-2"
                    style={{ borderColor: colors.accent }}
                >
                    <AppText styles="text-base text-white font-nunbold">
                        You'll Receive
                    </AppText>
                    <AppText
                        styles="text-xl font-nunbold"
                        style={{ color: colors.accent50 }}
                    >
                        {symbol} {parsedAmount.toFixed(2)}
                    </AppText>
                </View>
            </View>

            {/* payout method card */}
            <View
                className="rounded-xl p-4"
                style={{ backgroundColor: colors.primary200 }}
            >
                <AppText
                    styles="text-xs mb-2"
                    style={{ color: "#94a3b8" }}
                >
                    Payout Method
                </AppText>
                <AppText styles="text-sm text-white font-nunbold">
                    Default Payment Profile
                </AppText>
                <AppText
                    styles="text-xs mt-1"
                    style={{ color: "#94a3b8" }}
                >
                    Funds will be sent to your default payment method
                </AppText>
            </View>

            {/* error */}
            {error && (
                <View
                    className="flex-row items-start gap-3 p-4 rounded-xl border"
                    style={{
                        backgroundColor: "#ef444410",
                        borderColor: "#ef444430",
                    }}
                >
                    <Ionicons
                        name="alert-circle-outline"
                        size={20}
                        color="#f87171"
                        style={{ marginTop: 2 }}
                    />
                    <AppText
                        styles="text-xs flex-1"
                        style={{ color: "#f87171" }}
                    >
                        {error}
                    </AppText>
                </View>
            )}

            {/* Back / Confirm buttons */}
            <View className="flex-row gap-3">
                <TouchableOpacity
                    onPress={handleBack}
                    disabled={isLoading}
                    className="flex-1 py-4 rounded-xl items-center"
                    style={{
                        backgroundColor: colors.primary200,
                        opacity: isLoading ? 0.5 : 1,
                    }}
                    activeOpacity={0.7}
                >
                    <AppText styles="text-base text-white font-nunbold">
                        Back
                    </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleConfirm}
                    disabled={isLoading}
                    className="flex-1 py-4 rounded-xl items-center"
                    style={{
                        backgroundColor: colors.accent,
                        opacity: isLoading ? 0.5 : 1,
                    }}
                    activeOpacity={0.8}
                >
                    {isLoading ? (
                        <View className="flex-row items-center gap-2">
                            <ActivityIndicator size="small" color="#fff" />
                            <AppText styles="text-base text-white font-nunbold">
                                Processing…
                            </AppText>
                        </View>
                    ) : (
                        <View className="flex-row items-center gap-2">
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={20}
                                color="#fff"
                            />
                            <AppText styles="text-base text-white font-nunbold">
                                Confirm Payout
                            </AppText>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </>
    );

    // ==================================================================
    // Main render
    // ==================================================================
    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View
                className="flex-1 justify-end"
                style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            >
                <View
                    className="rounded-t-2xl border-t-2"
                    style={{
                        backgroundColor: colors.primary100,
                        borderColor: colors.accent,
                        maxHeight: "90%",
                    }}
                >
                    {/* header */}
                    <View className="flex-row items-center justify-between p-6 pb-4">
                        <View className="flex-row items-center gap-3">
                            <View
                                className="w-10 h-10 rounded-lg items-center justify-center"
                                style={{ backgroundColor: colors.accent + "33" }}
                            >
                                <Ionicons
                                    name="cash-outline"
                                    size={20}
                                    color={colors.accent50}
                                />
                            </View>
                            <AppText styles="text-base text-white font-nunbold">
                                {step === "amount"
                                    ? "Request Payout"
                                    : "Confirm Payout"}
                            </AppText>
                        </View>

                        <TouchableOpacity
                            onPress={handleClose}
                            disabled={isLoading}
                            className="w-8 h-8 rounded-lg items-center justify-center"
                            style={{ backgroundColor: colors.primary200 }}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* scrollable body */}
                    <ScrollView
                        className="px-6 pb-6"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ gap: 16 }}
                    >
                        {success
                            ? renderSuccess()
                            : step === "amount"
                                ? renderAmountStep()
                                : renderConfirmStep()}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default RequestPayoutModal;