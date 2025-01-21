import axios from 'axios';
import Constants from 'expo-constants';

const config = Constants.expoConfig || {}; // Fallback to an empty object if expoConfig is null
const GOOGLE_API_KEY = config.extra?.googleApiKey;

const GOOGLE_DIRECTIONS_API_URL = 'https://maps.googleapis.com/maps/api/directions/json';

/**
 * Fetch directions between two points using the Google Directions API.
 * @param {Object} origin - The starting point { latitude, longitude }.
 * @param {Object} destination - The ending point { latitude, longitude }.
 * @returns {Promise<Array>} - Array of coordinates representing the route polyline.
 */
export const getDirections = async (origin, destination) => {
  try {
    if (!origin || !destination) {
      throw new Error('Origin or destination is missing.');
    }

    if (!origin.latitude || !origin.longitude || !destination.latitude || !destination.longitude) {
      throw new Error('Invalid origin or destination coordinates.');
    }

    const response = await axios.get(GOOGLE_DIRECTIONS_API_URL, {
      params: {
        origin: `${origin.latitude},${origin.longitude}`,
        destination: `${destination.latitude},${destination.longitude}`,
        key: GOOGLE_API_KEY,
      },
    });

    const routes = response.data.routes;
    if (!routes || routes.length === 0) {
      console.warn('No routes found.');
      return [];
    }

    const points = routes[0]?.overview_polyline?.points;
    if (!points) {
      throw new Error('No polyline points found.');
    }

    return decodePolyline(points);
  } catch (error) {
    console.error('Error fetching directions:', error.message);
    if (error.response) {
      console.error('API response error:', error.response.data);
    }
    return [];
  }
};

/**
 * Decode a polyline string into an array of coordinates.
 * @param {string} polyline - The encoded polyline string.
 * @returns {Array} - Array of coordinates { latitude, longitude }.
 */
const decodePolyline = (polyline) => {
  let index = 0, len = polyline.length;
  let lat = 0, lng = 0;
  const coordinates = [];

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = polyline.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const deltaLat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += deltaLat;

    shift = 0;
    result = 0;
    do {
      b = polyline.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const deltaLng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += deltaLng;

    coordinates.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return coordinates;
};

// Example usage
(async () => {
  const origin = { latitude: 37.7749, longitude: -122.4194 }; // San Francisco
  const destination = { latitude: 34.0522, longitude: -118.2437 }; // Los Angeles

  const directions = await getDirections(origin, destination);
  if (directions.length > 0) {
    console.log('Route coordinates:', directions);
  } else {
    console.warn('No directions found or an error occurred.');
  }
})();
