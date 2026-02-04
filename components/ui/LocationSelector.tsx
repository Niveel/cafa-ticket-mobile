import { View, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import AppText from "./AppText";
import AppErrorMessage from "../form/AppErrorMessage";
import colors from "@/config/colors";

export type LocationData = {
    venue_name: string;
    venue_address: string;
    venue_city: string;
    venue_country: string;
    latitude: string;
    longitude: string;
};

interface LocationSelectorProps {
    onLocationSelect: (location: LocationData) => void;
    initialValue?: string;
    label?: string;
    required?: boolean;
    error?: string;
}

const LocationSelector = ({
    onLocationSelect,
    label = "Venue Location",
    required = false,
    error,
}: LocationSelectorProps) => {
    const [isLoading, setIsLoading] = useState(false);

    // Extract city from address components
    const extractCity = (addressComponents: any[]) => {
        const locality = addressComponents.find((comp) => comp.types.includes("locality"));
        if (locality) return locality.long_name;

        const district = addressComponents.find((comp) => comp.types.includes("administrative_area_level_2"));
        if (district) return district.long_name;

        const region = addressComponents.find((comp) => comp.types.includes("administrative_area_level_1"));
        if (region) return region.long_name;

        return "";
    };

    // Extract country from address components
    const extractCountry = (addressComponents: any[]) => {
        const country = addressComponents.find((comp) => comp.types.includes("country"));
        return country?.long_name || "";
    };

    // Extract street address from address components
    const extractStreetAddress = (addressComponents: any[]) => {
        const streetNumber = addressComponents.find((comp) => comp.types.includes("street_number"))?.long_name || "";
        const route = addressComponents.find((comp) => comp.types.includes("route"))?.long_name || "";
        return `${streetNumber} ${route}`.trim();
    };

    return (
        <View>
            {/* Label */}
            <View className="flex-row items-center mb-2">
                <AppText styles="text-sm text-white">
                    {label}
                </AppText>
                {required && (
                    <AppText styles="text-sm text-accent-50 ml-1">
                        {" "}
                        *
                    </AppText>
                )}
            </View>

            {/* Google Places Autocomplete */}
            <View
                className="rounded-xl border-2 overflow-hidden"
                style={{
                    backgroundColor: colors.primary100,
                    borderColor: error ? colors.primary100 : colors.accent,
                }}
            >
                <GooglePlacesAutocomplete
                    placeholder="Search for venue or address..."
                    fetchDetails={true}
                    keyboardShouldPersistTaps="always"
                    listViewDisplayed="auto"
                    onPress={(data, details = null) => {
                        if (!details) return;

                        const addressComponents = details.address_components || [];

                        const locationData: LocationData = {
                            venue_name: details.name || "",
                            venue_address: extractStreetAddress(addressComponents) || details.formatted_address || "",
                            venue_city: extractCity(addressComponents),
                            venue_country: extractCountry(addressComponents),
                            latitude: details.geometry.location.lat.toFixed(6),
                            longitude: details.geometry.location.lng.toFixed(6),
                        };

                        onLocationSelect(locationData);
                    }}
                    query={{
                        key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "",
                        language: "en",
                    }}
                    styles={{
                        container: {
                            flex: 0,
                        },
                        textInputContainer: {
                            backgroundColor: "transparent",
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                            paddingHorizontal: 0,
                        },
                        textInput: {
                            height: 48,
                            backgroundColor: colors.primary100,
                            color: colors.white,
                            fontSize: 14,
                            fontFamily: "Inter-Regular",
                            paddingLeft: 48,
                            paddingRight: 16,
                            borderWidth: 0,
                        },
                        predefinedPlacesDescription: {
                            color: colors.white,
                        },
                        listView: {
                            backgroundColor: colors.primary,
                            borderWidth: 2,
                            borderColor: colors.accent + "4D",
                            borderRadius: 12,
                            marginTop: 8,
                        },
                        row: {
                            backgroundColor: colors.primary100,
                            padding: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.accent + "1A",
                        },
                        separator: {
                            height: 0,
                        },
                        description: {
                            color: colors.white,
                            fontSize: 14,
                            fontFamily: "Inter-Regular",
                        },
                        loader: {
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            height: 20,
                        },
                    }}
                    textInputProps={{
                        placeholderTextColor: colors.white + "60",
                        returnKeyType: "search",
                    }}
                    enablePoweredByContainer={false}
                    debounce={300}
                    nearbyPlacesAPI="GooglePlacesSearch"
                    renderLeftButton={() => (
                        <View
                            style={{
                                position: "absolute",
                                left: 16,
                                top: 12,
                                zIndex: 1,
                            }}
                        >
                            <Ionicons name="location-outline" size={20} color={colors.accent50} />
                        </View>
                    )}
                    renderRightButton={() =>
                        isLoading ? (
                            <View
                                style={{
                                    position: "absolute",
                                    right: 16,
                                    top: 12,
                                    zIndex: 1,
                                }}
                            >
                                <ActivityIndicator size="small" color={colors.accent} />
                            </View>
                        ) : null
                    }
                />
            </View>

            {/* Error Message */}
            {error && <AppErrorMessage error={error} visible={!!error} />}

            {/* Helper Text */}
            {!error && (
                <AppText styles="text-xs text-white mt-2" style={{ opacity: 0.6 }}>
                    Start typing to search for venues or addresses worldwide
                </AppText>
            )}
        </View>
    );
};

export default LocationSelector;