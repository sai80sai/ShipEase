import axios from 'axios';

const OPENROUTESERVICE_API_KEY = '5b3ce3597851110001cf62489f42e4f82b29437a82d58875b6bd3dc6'; // Replace with your OpenRouteService key
const OPENROUTESERVICE_DIRECTIONS_API_URL = 'https://api.openrouteservice.org/v2/directions/driving-car';

/**
 * Fetch directions using OpenRouteService.
 * @param {Object} origin - { latitude, longitude }.
 * @param {Object} destination - { latitude, longitude }.
 * @returns {Promise<Array>} - Array of coordinates [{ latitude, longitude }].
 */
export const getDirections = async (origin, destination) => {
  try {
    if (!origin || !destination) {
      throw new Error('Missing origin or destination.');
    }

    const response = await axios.get(OPENROUTESERVICE_DIRECTIONS_API_URL, {
      params: {
        api_key: OPENROUTESERVICE_API_KEY,
        start: `${origin.longitude},${origin.latitude}`,
        end: `${destination.longitude},${destination.latitude}`,
      },
    });

    const route = response.data?.routes?.[0]?.geometry?.coordinates;
    if (!route) {
      console.warn('No route found.');
      return [];
    }

    return route.map(([longitude, latitude]) => ({ latitude, longitude })); // Convert to expected format
  } catch (error) {
    console.error('Error fetching directions:', error.message);
    return [];
  }
};
