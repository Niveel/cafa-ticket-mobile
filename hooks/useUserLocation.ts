import { useState, useEffect } from "react";
import * as Location from "expo-location";
import * as Sentry from '@sentry/react-native';

interface UserLocation {
    city: string | null;
    country: string | null;
    latitude: number | null;
    longitude: number | null;
}

interface UseUserLocationReturn {
    location: UserLocation;
    isLoading: boolean;
    hasPermission: boolean | null;
    error: string | null;
    requestPermission: () => Promise<void>;
    refreshLocation: () => Promise<void>;
}

export const useUserLocation = (): UseUserLocationReturn => {
    const [location, setLocation] = useState<UserLocation>({
        city: null,
        country: null,
        latitude: null,
        longitude: null,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getUserLocation = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Request permission (will show prompt if not yet determined)
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                setHasPermission(false);
                setIsLoading(false);
                return;
            }

            setHasPermission(true);

            // Get current position
            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            // Reverse geocode to get address
            const [address] = await Location.reverseGeocodeAsync({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });

            if (address) {
                setLocation({
                    city: address.city || address.subregion || null,
                    country: address.country || null,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            }
        } catch (err) {
            console.error("Error getting location:", err);
            Sentry.captureException(err);
            setError("Failed to get location");
            setHasPermission(false);
        } finally {
            setIsLoading(false);
        }
    };

    const requestPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status === "granted") {
                setHasPermission(true);
                await getUserLocation();
            } else {
                setHasPermission(false);
            }
        } catch (err) {
            console.error("Error requesting permission:", err);
            Sentry.captureException(err);
            setError("Failed to request permission");
            setHasPermission(false);
        }
    };

    const refreshLocation = async () => {
        await getUserLocation();
    };

    useEffect(() => {
        getUserLocation();
    }, []);

    return {
        location,
        isLoading,
        hasPermission,
        error,
        requestPermission,
        refreshLocation,
    };
};