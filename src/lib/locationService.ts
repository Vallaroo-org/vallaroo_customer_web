import { Shop } from './api';

export interface DistanceResult {
    [shopId: string]: string; // Distance in km formatted as string
}

const OSRM_API_BASE = 'http://router.project-osrm.org/table/v1/driving';

export const getDrivingDistances = async (
    startLat: number,
    startLng: number,
    shops: Shop[]
): Promise<DistanceResult> => {
    const results: DistanceResult = {};

    // Filter valid shops with coordinates
    const validShops = shops.filter(
        (s) => s.latitude != null && s.longitude != null
    );

    if (validShops.length === 0) return results;

    // Batch requests to respect URL limits (max ~50-80 usually safe, let's use 50)
    const BATCH_SIZE = 50;

    for (let i = 0; i < validShops.length; i += BATCH_SIZE) {
        const batch = validShops.slice(i, i + BATCH_SIZE);

        try {
            // Construct coordinates string: start;shop1;shop2...
            // OSRM expects: longitude,latitude
            const coords = [`${startLng},${startLat}`];

            batch.forEach(shop => {
                coords.push(`${shop.longitude},${shop.latitude}`);
            });

            const coordsString = coords.join(';');

            // sources=0 means calculate matrix from the first coordinate (start) to all others
            // annotations=distance returns the distance matrix
            const url = `${OSRM_API_BASE}/${coordsString}?sources=0&annotations=distance`;

            const response = await fetch(url);

            if (!response.ok) {
                console.error(`OSRM API error: ${response.status}`);
                continue;
            }

            const data = await response.json();

            if (data.code === 'Ok' && data.distances && data.distances[0]) {
                // data.distances[0] is the array of distances from the source (index 0) to all destinations
                // Index 0 in the result array is source->source (0)
                // Index 1 corresponds to batch[0], Index 2 to batch[1], etc.
                const distanceArray = data.distances[0];

                batch.forEach((shop, index) => {
                    // The distance in the response array corresponds to index + 1
                    const distanceMeters = distanceArray[index + 1];

                    if (distanceMeters !== null && distanceMeters !== undefined) {
                        // Convert to KM and format
                        const distanceKm = (distanceMeters / 1000).toFixed(1);
                        results[shop.id] = distanceKm;
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching driving distances:', error);
        }
    }

    return results;
};

export const getPlaceName = async (lat: number, lng: number): Promise<string | null> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
        );

        if (!response.ok) return null;

        const data = await response.json();

        // exact structure depends on location, usually address.city, address.town, address.village
        if (data.address) {
            return data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.county || "Unknown Location";
        }

        return null;
    } catch (error) {
        console.error('Error fetching place name:', error);
        return null;
    }
};
