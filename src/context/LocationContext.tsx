'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getPlaceName, geocodeLocation } from '../lib/locationService';

interface LocationContextType {
    latitude: number | null;
    longitude: number | null;
    placeName: string | null;
    error: string | null;
    isLoading: boolean;
    requestLocation: () => Promise<void>;
    setManualLocation: (place: string) => Promise<void>;
    permissionStatus: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [placeName, setPlaceName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

    // Check storage on mount
    useEffect(() => {
        const storedLat = localStorage.getItem('vallaroo_lat');
        const storedLng = localStorage.getItem('vallaroo_lng');
        const storedPlace = localStorage.getItem('vallaroo_place');

        if (storedLat && storedLng) {
            setLatitude(parseFloat(storedLat));
            setLongitude(parseFloat(storedLng));
            if (storedPlace) setPlaceName(storedPlace);
        }
    }, []);

    // Save to storage on change
    useEffect(() => {
        if (latitude && longitude) {
            localStorage.setItem('vallaroo_lat', latitude.toString());
            localStorage.setItem('vallaroo_lng', longitude.toString());
            if (placeName) localStorage.setItem('vallaroo_place', placeName);
        }
    }, [latitude, longitude, placeName]);

    const requestLocation = async () => {
        setIsLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser. Please enter your location manually.');
            setIsLoading(false);
            return;
        }

        // Helper function to get location with specific options
        const tryGetLocation = (options: PositionOptions): Promise<GeolocationPosition> => {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, options);
            });
        };

        // Try high accuracy first (GPS)
        try {
            console.log('Attempting to get location with high accuracy (GPS)...');
            const position = await tryGetLocation({
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            });

            console.log('High accuracy location obtained:', position.coords);
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setError(null);
            setPermissionStatus('granted');

            // Fetch place name
            const name = await getPlaceName(position.coords.latitude, position.coords.longitude);
            setPlaceName(name);
            setIsLoading(false);
            return;

        } catch (highAccuracyError: any) {
            console.log('High accuracy failed:', highAccuracyError.code, highAccuracyError.message);

            // If permission denied, stop immediately
            if (highAccuracyError.code === 1) { // PERMISSION_DENIED
                setError('Location permission denied. Please enable location access in your browser settings or enter your location manually.');
                setPermissionStatus('denied');
                setIsLoading(false);
                return;
            }

            // If position unavailable or timeout with high accuracy, try low accuracy (network-based)
            if (highAccuracyError.code === 2 || highAccuracyError.code === 3) { // POSITION_UNAVAILABLE or TIMEOUT
                try {
                    console.log('Retrying with low accuracy (network-based)...');
                    const position = await tryGetLocation({
                        enableHighAccuracy: false,
                        timeout: 10000,
                        maximumAge: 300000 // Accept cached position up to 5 minutes old
                    });

                    console.log('Low accuracy location obtained:', position.coords);
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                    setError(null);
                    setPermissionStatus('granted');

                    // Fetch place name
                    const name = await getPlaceName(position.coords.latitude, position.coords.longitude);
                    setPlaceName(name);
                    setIsLoading(false);
                    return;

                } catch (lowAccuracyError: any) {
                    console.error('Low accuracy also failed:', lowAccuracyError.code, lowAccuracyError.message);

                    let errorMessage = 'Unable to retrieve your location. Please try again or enter your location manually.';
                    if (lowAccuracyError.code === 3) { // TIMEOUT
                        errorMessage = 'Location request timed out. Please check your connection and try again, or enter your location manually.';
                    }

                    setError(errorMessage);
                    setIsLoading(false);
                    return;
                }
            }

            // Other errors
            setError('Unable to retrieve your location. Please try again or enter your location manually.');
            setIsLoading(false);
        }
    };

    const setManualLocation = async (place: string) => {
        if (!place.trim()) {
            setError('Please enter a location');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await geocodeLocation(place);

            if (result) {
                setLatitude(result.latitude);
                setLongitude(result.longitude);
                // Extract city/town name from display name if needed
                const cityMatch = result.displayName.split(',')[0];
                setPlaceName(cityMatch || place);
                setError(null);
            } else {
                setError('Location not found. Please try a different search.');
                setPlaceName(null);
                setLatitude(null);
                setLongitude(null);
            }
        } catch (err) {
            setError('Failed to find location. Please try again.');
            setPlaceName(null);
            setLatitude(null);
            setLongitude(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LocationContext.Provider
            value={{
                latitude,
                longitude,
                placeName,
                error,
                isLoading,
                requestLocation,
                setManualLocation,
                permissionStatus
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};
