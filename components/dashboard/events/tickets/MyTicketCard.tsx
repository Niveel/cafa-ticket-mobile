import { View, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { memo, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system/legacy";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppText from "../../../ui/AppText";
import type { MyTicket } from "@/types/tickets.types";
import colors from "@/config/colors";
import { useFormatMoney } from "@/hooks/useFormatMoney";
import { getFullImageUrl } from "@/utils/imageUrl";
import { placeholderImage } from "@/data/constants";
import { API_BASE_URL } from "@/config/settings";

interface MyTicketCardProps {
    ticket: MyTicket;
}

const ANDROID_TICKET_DOWNLOAD_DIR_URI_KEY = "cafa_android_ticket_download_dir_uri";

const openNativeShare = async (options: {
    title: string;
    url: string;
    type: string;
    filename: string;
    saveToFiles?: boolean;
    failOnCancel?: boolean;
    showAppsToView?: boolean;
}) => {
    if (Platform.OS === "web") {
        throw new Error("Native share is not available on web.");
    }

    const shareModule = await import("react-native-share");
    const share = shareModule.default;
    await share.open(options);
};

const MyTicketCard = ({ ticket }: MyTicketCardProps) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadFeedback, setDownloadFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    const formatMoney = useFormatMoney();
    const featuredImageUri = getFullImageUrl(ticket.event.featured_image) || undefined;
    const [cardImageUri, setCardImageUri] = useState<string>(featuredImageUri || placeholderImage);
    const AUTH_TOKEN_KEY = "cafa_auth_token";

    useEffect(() => {
        setCardImageUri(featuredImageUri || placeholderImage);
    }, [featuredImageUri]);

    const showDownloadFeedback = (type: "success" | "error", message: string) => {
        setDownloadFeedback({ type, message });
        setTimeout(() => setDownloadFeedback(null), 3500);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-GH", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (time: string) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-GH", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusStyle = (status: string) => {
        const styles = {
            active: { bg: colors.accent, color: colors.white },
            used: { bg: colors.primary200, color: colors.white },
            cancelled: { bg: colors.primary100, color: colors.white },
        };
        return styles[status as keyof typeof styles] || styles.active;
    };

    const getEventStatusStyle = (status: string) => {
        const styles = {
            upcoming: { bg: colors.primary200, color: colors.white },
            ongoing: { bg: colors.accent, color: colors.white },
            past: { bg: colors.primary200, color: colors.white },
        };
        return styles[status as keyof typeof styles] || styles.upcoming;
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        const endpoint = `${API_BASE_URL}/tickets/${ticket.ticket_id}/download/`;
        try {
            const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
            console.log("[MyTicketCard] download started", {
                ticketId: ticket.ticket_id,
                endpoint,
                hasAuthToken: !!token,
            });

            const ticketsDir = `${FileSystem.documentDirectory ?? ""}tickets`;
            if (!FileSystem.documentDirectory) {
                throw new Error("Device file storage is unavailable");
            }

            await FileSystem.makeDirectoryAsync(ticketsDir, { intermediates: true });

            const fileUri = `${ticketsDir}/${ticket.ticket_id}.pdf`;
            const result = await FileSystem.downloadAsync(endpoint, fileUri, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (result.status !== 200) {
                console.log("[MyTicketCard] download failed", {
                    ticketId: ticket.ticket_id,
                    endpoint,
                    status: result.status,
                    fileUri,
                });
                throw new Error("Failed to download ticket");
            }

            console.log("[MyTicketCard] download success", {
                ticketId: ticket.ticket_id,
                endpoint,
                status: result.status,
                fileUri: result.uri,
            });

            if (Platform.OS === "ios") {
                await openNativeShare({
                    title: `Ticket ${ticket.ticket_id}`,
                    url: result.uri,
                    type: "application/pdf",
                    filename: `${ticket.ticket_id}.pdf`,
                    saveToFiles: true,
                    failOnCancel: false,
                });
            } else {
                const requestAndStoreDownloadDirectoryUri = async (): Promise<string | null> => {
                    const downloadsUri =
                        FileSystem.StorageAccessFramework.getUriForDirectoryInRoot("Download");
                    const permission =
                        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(
                            downloadsUri
                        );

                    if (permission.granted && permission.directoryUri) {
                        await AsyncStorage.setItem(
                            ANDROID_TICKET_DOWNLOAD_DIR_URI_KEY,
                            permission.directoryUri
                        );
                        return permission.directoryUri;
                    }

                    return null;
                };

                const writePdfToDirectory = async (directoryUri: string) => {
                    const safFileUri =
                        await FileSystem.StorageAccessFramework.createFileAsync(
                            directoryUri,
                            `${ticket.ticket_id}_${Date.now()}`,
                            "application/pdf"
                        );

                    const base64Pdf = await FileSystem.readAsStringAsync(result.uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });

                    await FileSystem.StorageAccessFramework.writeAsStringAsync(
                        safFileUri,
                        base64Pdf,
                        { encoding: FileSystem.EncodingType.Base64 }
                    );
                };

                let savedToSelectedDirectory = false;
                let directoryUri = await AsyncStorage.getItem(
                    ANDROID_TICKET_DOWNLOAD_DIR_URI_KEY
                );

                if (!directoryUri || !directoryUri.startsWith("content://")) {
                    directoryUri = await requestAndStoreDownloadDirectoryUri();
                }

                if (directoryUri) {
                    try {
                        await writePdfToDirectory(directoryUri);
                        savedToSelectedDirectory = true;
                    } catch {
                        await AsyncStorage.removeItem(ANDROID_TICKET_DOWNLOAD_DIR_URI_KEY);
                        const renewedDirectoryUri =
                            await requestAndStoreDownloadDirectoryUri();
                        if (renewedDirectoryUri) {
                            await writePdfToDirectory(renewedDirectoryUri);
                            savedToSelectedDirectory = true;
                        }
                    }
                }

                if (!savedToSelectedDirectory) {
                    const contentUri = await FileSystem.getContentUriAsync(result.uri);
                    await openNativeShare({
                        title: `Ticket ${ticket.ticket_id}`,
                        url: contentUri,
                        type: "application/pdf",
                        filename: `${ticket.ticket_id}.pdf`,
                        failOnCancel: false,
                        showAppsToView: true,
                    });
                }
            }

            showDownloadFeedback(
                "success",
                Platform.OS === "ios"
                    ? "Ticket PDF is ready. Use Save to Files or share it."
                    : "Ticket PDF saved to Downloads."
            );
        } catch (error) {
            console.log("[MyTicketCard] download exception", {
                ticketId: ticket.ticket_id,
                endpoint,
                message: error instanceof Error ? error.message : String(error),
            });
            showDownloadFeedback("error", "Failed to download ticket. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const ticketStatus = getStatusStyle(ticket.status);
    const eventStatus = getEventStatusStyle(ticket.event.status);

    return (
        <View
            className="rounded-xl border-2 overflow-hidden"
            style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
            accessible
            accessibilityRole="summary"
            accessibilityLabel={`Ticket for ${ticket.event.title}. Status ${ticket.status}. Event ${ticket.event.status}.`}
        >
            {/* Event Image */}
            <View className="relative h-48">
                <Image
                    source={{ uri: cardImageUri }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={120}
                    accessible
                    accessibilityRole="image"
                    accessibilityLabel={`${ticket.event.title} featured image`}
                    onError={() => setCardImageUri(placeholderImage)}
                />
                {/* Status Badges */}
                <View className="absolute top-3 right-3 flex-row gap-2">
                    <View className="px-2 py-1 rounded-lg border" style={{ backgroundColor: eventStatus.bg, borderColor: eventStatus.color }}>
                        <AppText styles="text-xs capitalize" font="font-isemibold" style={{ color: eventStatus.color }}>
                            {ticket.event.status}
                        </AppText>
                    </View>
                    <View className="px-2 py-1 rounded-lg border" style={{ backgroundColor: ticketStatus.bg, borderColor: ticketStatus.color }}>
                        <AppText styles="text-xs capitalize" font="font-isemibold" style={{ color: ticketStatus.color }}>
                            {ticket.status}
                        </AppText>
                    </View>
                </View>

                {/* Category Badge */}
                <View className="absolute top-3 left-3">
                    <View className="px-2 py-1 rounded-lg border" style={{ backgroundColor: colors.primary100 + "CC", borderColor: colors.accent + "4D" }}>
                        <AppText styles="text-xs text-white" font="font-isemibold">
                            {ticket.event.category.name}
                        </AppText>
                    </View>
                </View>
            </View>

            {/* Content */}
            <View className="p-2 gap-1">
                {/* Event Title */}
                <TouchableOpacity
                    onPress={() => router.push(`/events/${ticket.event.slug}`)}
                    accessibilityRole="button"
                    accessibilityLabel={`Open event ${ticket.event.title}`}
                    accessibilityHint="Navigates to event details"
                >
                    <AppText styles="text-base text-white underline" font="font-ibold" numberOfLines={2}>
                        {ticket.event.title}
                    </AppText>
                </TouchableOpacity>

                {/* Event Details Grid */}
                <View className="gap-1">
                    <View className="flex-row items-start gap-2">
                        <Ionicons name="calendar-outline" size={16} color={colors.accent50} style={{ marginTop: 2 }} />
                        <View className="flex-1">
                            <AppText styles="text-xs text-white mb-0.5" font="font-iregular" style={{ opacity: 0.7 }}>
                                Date
                            </AppText>
                            <AppText styles="text-sm text-white" font="font-isemibold">
                                {formatDate(ticket.event.start_date)}
                            </AppText>
                        </View>
                        <View className="flex-1">
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="time-outline" size={16} color={colors.accent50} style={{ marginTop: 2 }} />
                                <View className="flex-1">
                                    <AppText styles="text-xs text-white mb-0.5" font="font-iregular" style={{ opacity: 0.7 }}>
                                        Time
                                    </AppText>
                                    <AppText styles="text-sm text-white" font="font-isemibold">
                                        {formatTime(ticket.event.start_time)}
                                    </AppText>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row items-start gap-2">
                        <Ionicons name="location-outline" size={16} color={colors.accent50} style={{ marginTop: 2 }} />
                        <View className="flex-1">
                            <AppText styles="text-xs text-white mb-0.5" font="font-iregular" style={{ opacity: 0.7 }}>
                                Venue
                            </AppText>
                            <AppText styles="text-sm text-white" font="font-isemibold" numberOfLines={1}>
                                {ticket.event.venue_name}, {ticket.event.venue_city}
                            </AppText>
                        </View>
                    </View>
                </View>

                {/* Divider */}
                <View className="border-t" style={{ borderColor: colors.accent }} />

                {/* Ticket Info */}
                <View className="flex-row items-center justify-between">
                    <View>
                        <AppText styles="text-xs text-white mb-1" font="font-iregular" style={{ opacity: 0.7 }}>
                            Ticket Type
                        </AppText>
                        <AppText styles="text-sm text-white" font="font-ibold">
                            {ticket.ticket_type.name}
                        </AppText>
                    </View>
                    <View className="items-end">
                        <AppText styles="text-xs text-white mb-1" font="font-iregular" style={{ opacity: 0.7 }}>
                            Amount Paid
                        </AppText>
                        <AppText styles="text-sm text-white" font="font-ibold" style={{ color: colors.accent50 }}>
                            {formatMoney(ticket.amount_paid)}
                        </AppText>
                    </View>
                </View>

                {/* Check-in Status */}
                {ticket.is_checked_in && (
                    <View className="p-2 rounded-lg border" style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}>
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="checkmark-circle" size={20} color={colors.accent50} />
                            <View>
                                <AppText styles="text-sm text-white" font="font-isemibold" style={{ color: colors.accent50 }}>
                                    Checked In
                                </AppText>
                                {ticket.checked_in_at && (
                                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.8 }}>
                                        {formatDate(ticket.checked_in_at)}
                                    </AppText>
                                )}
                            </View>
                        </View>
                    </View>
                )}

                {/* Attendee Info */}
                <View className="p-2 rounded-lg" style={{ backgroundColor: colors.primary200 }}>
                    <AppText styles="text-xs text-white mb-1" font="font-iregular" style={{ opacity: 0.7 }}>
                        Attendee
                    </AppText>
                    <AppText styles="text-sm text-white mb-1" font="font-isemibold">
                        {ticket.attendee_info.name}
                    </AppText>
                    <AppText styles="text-xs text-white" font="font-imedium" style={{ opacity: 0.6 }}>
                        {ticket.ticket_id}
                    </AppText>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => router.push(`/dashboard/tickets/${ticket.ticket_id}`)}
                        className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl"
                        style={{ backgroundColor: colors.accent }}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={`View ticket ${ticket.ticket_id}`}
                        accessibilityHint="Opens full ticket details"
                    >
                        <Ionicons name="eye-outline" size={16} color={colors.white} />
                        <AppText styles="text-sm text-white" font="font-ibold">
                            View
                        </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleDownload}
                        disabled={isDownloading}
                        className="px-4 py-3 rounded-xl"
                        style={{ backgroundColor: colors.primary200, opacity: isDownloading ? 0.5 : 1 }}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={`Download ticket ${ticket.ticket_id}`}
                        accessibilityHint="Attempts to download this ticket"
                        accessibilityState={{ disabled: isDownloading, busy: isDownloading }}
                    >
                        {isDownloading ? (
                            <ActivityIndicator size="small" color={colors.white} />
                        ) : (
                            <Ionicons name="download-outline" size={20} color={colors.white} />
                        )}
                    </TouchableOpacity>
                </View>

                {downloadFeedback && (
                    <View
                        className="mt-2 rounded-xl px-3 py-2 border"
                        style={{
                            backgroundColor:
                                downloadFeedback.type === "success"
                                    ? colors.accent + "22"
                                    : colors.primary200,
                            borderColor:
                                downloadFeedback.type === "success"
                                    ? colors.accent
                                    : colors.accent + "66",
                        }}
                        accessible
                        accessibilityRole="alert"
                        accessibilityLabel={downloadFeedback.message}
                    >
                        <AppText
                            styles="text-xs"
                            font="font-imedium"
                            style={{ color: colors.white }}
                        >
                            {downloadFeedback.message}
                        </AppText>
                    </View>
                )}
            </View>
        </View>
    );
};

export default memo(MyTicketCard, (prevProps, nextProps) => {
    const prev = prevProps.ticket;
    const next = nextProps.ticket;

    return (
        prev.ticket_id === next.ticket_id &&
        prev.status === next.status &&
        prev.is_checked_in === next.is_checked_in &&
        prev.checked_in_at === next.checked_in_at &&
        prev.amount_paid === next.amount_paid &&
        prev.event.status === next.event.status &&
        prev.event.featured_image === next.event.featured_image
    );
});
