import { View, TouchableOpacity, Linking, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Animated, { FadeInDown } from "react-native-reanimated";

import { AppText } from "@/components";
import { EventDetails } from "@/types";
import colors from "@/config/colors";

interface VenueSectionProps {
    event: EventDetails;
}

const VenueSection = ({ event }: VenueSectionProps) => {
    const { venue } = event;

    const latitude = parseFloat(venue.latitude);
    const longitude = parseFloat(venue.longitude);

    const openMaps = () => {
        const scheme = Platform.select({ ios: "maps:0,0?q=", android: "geo:0,0?q=" });
        const latLng = `${latitude},${longitude}`;
        const label = venue.name;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
        });

        Linking.openURL(url!);
    };

    return (
        <Animated.View entering={FadeInDown.delay(1000)} className="bg-primary-100 py-8">
            <View className="px-4">
                {/* Header */}
                <View className="mb-6">
                    <View className="flex-row items-center gap-3 mb-3">
                        <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: colors.accent + "33", borderWidth: 1, borderColor: colors.accent }}>
                            <Ionicons name="location-outline" size={24} color={colors.accent50} />
                        </View>
                        <AppText styles="text-xl text-white" font="font-ibold">Venue & Location</AppText>
                    </View>
                    <AppText styles="text-sm text-slate-300 leading-relaxed" font="font-iregular">
                        Get directions and explore the venue location.
                    </AppText>
                </View>

                {/* Map */}
                <View className="rounded-2xl overflow-hidden mb-4" style={{ height: 250, borderWidth: 2, borderColor: colors.accent }}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{ flex: 1 }}
                        initialRegion={{
                            latitude,
                            longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={{ latitude, longitude }}
                            title={venue.name}
                            description={venue.address}
                        />
                    </MapView>

                    {/* Map Overlay Badge */}
                    <View className="absolute top-4 left-4 px-4 py-2 rounded-lg" style={{ backgroundColor: "rgba(5, 14, 60, 0.9)" }}>
                        <AppText styles="text-xs text-white" font="font-ibold">
                            📍 {venue.name}
                        </AppText>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3 mb-4">
                    <TouchableOpacity
                        onPress={openMaps}
                        className="flex-1 py-3 px-4 rounded-xl flex-row items-center justify-center gap-2"
                        style={{ backgroundColor: colors.accent }}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="navigate-outline" size={20} color={colors.white} />
                        <AppText styles="text-sm text-white" font="font-ibold">Get Directions</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => Linking.openURL(venue.google_maps_url)}
                        className="flex-1 py-3 px-4 bg-primary-100 rounded-xl flex-row items-center justify-center gap-2"
                        style={{ borderWidth: 2, borderColor: colors.accent }}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="open-outline" size={20} color={colors.accent50} />
                        <AppText styles="text-sm text-white" font="font-ibold">Open in Maps</AppText>
                    </TouchableOpacity>
                </View>

                {/* Venue Details Card */}
                <View className="bg-primary rounded-xl p-4 mb-4" style={{ borderWidth: 1, borderColor: colors.accent }}>
                    <AppText styles="text-base text-white mb-4" font="font-ibold">Venue Details</AppText>

                    <View style={{ gap: 16 }}>
                        <View>
                            <AppText styles="text-xs text-slate-400 mb-1" font="font-isemibold">Venue Name</AppText>
                            <AppText styles="text-base text-white" font="font-ibold">{venue.name}</AppText>
                        </View>

                        <View>
                            <AppText styles="text-xs text-slate-400 mb-1" font="font-isemibold">Address</AppText>
                            <AppText styles="text-sm text-white" font="font-iregular">{venue.address}</AppText>
                            <AppText styles="text-sm text-slate-300" font="font-iregular">{venue.city}, {venue.country}</AppText>
                        </View>

                        <View>
                            <AppText styles="text-xs text-slate-400 mb-1" font="font-isemibold">Coordinates</AppText>
                            <View className="px-3 py-2 bg-primary-100 rounded-lg self-start" style={{ borderWidth: 1, borderColor: colors.accent + "50" }}>
                                <AppText styles="text-xs text-accent-50" font="font-iregular">{venue.latitude}, {venue.longitude}</AppText>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Transportation Options */}
                <View className="bg-primary rounded-xl p-4 mb-4" style={{ borderWidth: 1, borderColor: colors.accent }}>
                    <View className="flex-row items-center gap-2 mb-4">
                        <Ionicons name="car-outline" size={20} color={colors.accent50} />
                        <AppText styles="text-base text-white" font="font-ibold">Getting There</AppText>
                    </View>

                    <View style={{ gap: 12 }}>
                        <View className="flex-row items-start gap-3">
                            <View className="w-8 h-8 rounded-lg bg-accent/20 items-center justify-center">
                                <AppText styles="text-sm" font="font-ibold">🚗</AppText>
                            </View>
                            <View className="flex-1">
                                <AppText styles="text-sm text-white" font="font-ibold">By Car</AppText>
                                <AppText styles="text-xs text-slate-300" font="font-iregular">Parking available nearby</AppText>
                            </View>
                        </View>

                        <View className="flex-row items-start gap-3">
                            <View className="w-8 h-8 rounded-lg bg-accent/20 items-center justify-center">
                                <AppText styles="text-sm" font="font-ibold">🚌</AppText>
                            </View>
                            <View className="flex-1">
                                <AppText styles="text-sm text-white" font="font-ibold">Public Transport</AppText>
                                <AppText styles="text-xs text-slate-300" font="font-iregular">Check local bus routes to {venue.city}</AppText>
                            </View>
                        </View>

                        <View className="flex-row items-start gap-3">
                            <View className="w-8 h-8 rounded-lg bg-accent/20 items-center justify-center">
                                <AppText styles="text-sm" font="font-ibold">🚕</AppText>
                            </View>
                            <View className="flex-1">
                                <AppText styles="text-sm text-white" font="font-ibold">Ride-Share</AppText>
                                <AppText styles="text-xs text-slate-300" font="font-iregular">Uber, Bolt available in the area</AppText>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Accessibility */}
                <View className="bg-primary rounded-xl p-4" style={{ borderWidth: 1, borderColor: colors.accent }}>
                    <AppText styles="text-base text-white mb-3" font="font-ibold">Accessibility</AppText>

                    <View style={{ gap: 8 }}>
                        <View className="flex-row items-center gap-2">
                            <AppText styles="text-sm text-accent-50" font="font-ibold">✓</AppText>
                            <AppText styles="text-sm text-slate-300" font="font-iregular">Wheelchair accessible venue</AppText>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <AppText styles="text-sm text-accent-50" font="font-ibold">✓</AppText>
                            <AppText styles="text-sm text-slate-300" font="font-iregular">Accessible parking available</AppText>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <AppText styles="text-sm text-accent-50" font="font-ibold">✓</AppText>
                            <AppText styles="text-sm text-slate-300" font="font-iregular">Accessible restrooms</AppText>
                        </View>
                    </View>

                    <AppText styles="text-xs text-slate-400 mt-3" font="font-iregular">
                        For specific accessibility needs, please contact the organizer
                    </AppText>
                </View>
            </View>
        </Animated.View>
    );
};

export default VenueSection;