import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import NavBar from '../src/Navbar';

const RoutesList = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://192.168.56.1:5000/api/user_routes', { withCredentials: true });
        console.log('Fetched routes:', response.data);

        const parsedRoutes = response.data.map(route => ({
          ...route,
          route_coordinates: typeof route.route_coordinates === 'string'
            ? JSON.parse(route.route_coordinates)
            : route.route_coordinates,
        }));

        setRoutes(parsedRoutes);
      } catch (err) {
        console.error('Error fetching routes:', err.response?.data || err.message);
        setError('Error fetching routes');
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : routes.length === 0 ? (
        <Text style={styles.errorText}>No routes available</Text>
      ) : (
        <FlatList
          data={routes}
          keyExtractor={(item, index) => `route-${index}`}
          renderItem={({ item, index }) => {
            const coordinates = item.route_coordinates.map(coord => ({
              latitude: parseFloat(coord.latitude),
              longitude: parseFloat(coord.longitude),
            }));

            const initialRegion = coordinates.length > 0
              ? {
                  latitude: coordinates[0].latitude,
                  longitude: coordinates[0].longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }
              : {
                  latitude: 40.7128,
                  longitude: -74.006,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                };

            return (
              <View style={styles.route}>
                {/* Map for the specific route */}
                <MapView
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={initialRegion}
                >
                  {coordinates.length > 0 && (
                    <>
                      <Marker
                        coordinate={coordinates[0]}
                        title={`Start of Route ${index + 1}`}
                        pinColor="green"
                      />
                      <Marker
                        coordinate={coordinates[coordinates.length - 1]}
                        title={`End of Route ${index + 1}`}
                        pinColor="red"
                      />
                      <Polyline
                        coordinates={coordinates}
                        strokeColor="#0000FF" // Blue color
                        strokeWidth={3}
                      />
                    </>
                  )}
                </MapView>

                {/* Route details */}
                <View style={styles.details}>
                  <Text style={styles.text}>Transport Mode ID: {item.transport_mode_id}</Text>
                  <Text style={styles.text}>Distance: {item.distance_km} km</Text>
                  <Text style={styles.text}>CO2 Emissions: {item.CO2} kg</Text>
                  <Text style={styles.text}>Calories Burned: {item.kcal} kcal</Text>
                  <Text style={styles.text}>Duration: {item.duration} minutes</Text>
                  <Text style={styles.text}>Cost: ${item.money}</Text>
                  <Text style={styles.text}>Private: {item.is_private ? 'Yes' : 'No'}</Text>
                  <Text style={styles.text}>Date: {new Date(item.date).toLocaleDateString()}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
      <NavBar/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  route: {
    marginBottom: 20,
    padding: 15,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
  },
  details: {
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default RoutesList;
