import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDirections } from '../../utils/getDirections'; // Utility to fetch route directions
import { getDistance } from 'geolib'; // Geolib for distance calculation

const MapPlan = ({ route }) => {
  const { selectedProducts } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(null);

  useEffect(() => {
    const fetchUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        setLocationPermissionGranted(false);
        return;
      }

      // Watch position for real-time updates
      const locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 }, // Update every 5 seconds or 10 meters
        (location) => {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );

      return locationSubscription;
    };

    fetchUserLocation();

    return () => {
      // Cleanup the subscription when the component is unmounted
      if (locationPermissionGranted) {
        locationSubscription.remove(); // Correct cleanup method
      }
    };
  }, [locationPermissionGranted]);

  useEffect(() => {
    const sortAndFetchRoutes = async () => {
      if (!userLocation) return;

      // Step 1: Sort the products by distance from the user
      const distances = selectedProducts.map((product) => ({
        ...product,
        distance: getDistance(
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          { latitude: product.location.latitude, longitude: product.location.longitude }
        ),
      }));

      const sorted = distances.sort((a, b) => a.distance - b.distance);
      setSortedProducts(sorted);

      // Step 2: Fetch the routes sequentially for the sorted products
      let previousLocation = userLocation;
      let routes = [];
      for (let product of sorted) {
        try {
          const directions = await getDirections(previousLocation, {
            latitude: product.location.latitude,
            longitude: product.location.longitude,
          });
          routes.push(directions); // Add the route to the array
          previousLocation = { latitude: product.location.latitude, longitude: product.location.longitude }; // Update the previous location
        } catch (error) {
          console.error('Error fetching directions:', error);
        }
      }
      setRouteCoordinates(routes); // Set all the route coordinates
    };

    sortAndFetchRoutes();
  }, [userLocation]);

  if (locationPermissionGranted === false) {
    return (
      <View style={styles.container}>
        <Text>Location permission denied. Please enable location services.</Text>
      </View>
    );
  }

  if (userLocation === null) {
    return (
      <View style={styles.container}>
        <Text>Loading user location...</Text>
      </View>
    );
  }

  if (sortedProducts.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No products available for routing.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: userLocation?.latitude || 37.78825, // Default latitude
          longitude: userLocation?.longitude || -122.4324, // Default longitude
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true} // Automatically show the user location on the map
      >
        {/* Custom Marker for User Location */}
        <Marker coordinate={userLocation} title="Your Location">
          <Image
            source={require('../../assets/Delivery.jpg')} // Image source
            style={styles.userLocationMarker} // Apply custom styles
          />
        </Marker>

        {/* Markers for all Products */}
        {sortedProducts.map((product) => (
          <Marker
            key={product.id}
            coordinate={{
              latitude: product.location.latitude,
              longitude: product.location.longitude,
            }}
            title={product.name}
            description={`Owner: ${product.ownername}, Phone: ${product.phone}`}
          >
            <Image
              source={{ uri: product.photo }} // Ensure the photo URL is correct
              style={styles.productMarker} 
            />
          </Marker>
        ))}

        {/* Polyline for each route */}
        {routeCoordinates.map((route, index) => (
          <Polyline
            key={index}
            coordinates={route}
            strokeColor="#007BFF"
            strokeWidth={4}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  map: {
    flex: 1,
    width: '100%',
    borderRadius: 15,
    elevation: 10,
    marginTop: 10,
  },
  userLocationMarker: {
    width: 30, 
    height: 30, 
    borderRadius: 15,
  },
  productMarker: {
    width: 30, 
    height: 30, 
    borderRadius: 15, 
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#f44336',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MapPlan;
