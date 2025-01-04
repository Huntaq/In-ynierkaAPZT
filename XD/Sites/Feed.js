import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TextInput, Button } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import NavBar from '../src/Navbar';

const transportModeDetails = {
  1: { label: 'Walking', image: require('../assets/images/solar_walking-bold.png') },
  2: { label: 'Cycling', image: require('../assets/images/solar_bicycling-bold.png') },
  3: { label: 'Running', image: require('../assets/images/solar_running-2-bold.png') },
};

const RoutesList = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://192.168.56.1:5000/api/user_routes', { withCredentials: true });
        const parsedRoutes = response.data.map(route => ({
          ...route,
          route_coordinates: Array.isArray(route.route_coordinates)
            ? route.route_coordinates
            : JSON.parse(route.route_coordinates || '[]'),
        }));

        const sortedRoutes = parsedRoutes.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRoutes(sortedRoutes);

        await fetchCommentsForRoutes(sortedRoutes);
      } catch (err) {
        setError('Error fetching routes');
      } finally {
        setLoading(false);
      }
    };

    const fetchCommentsForRoutes = async (routes) => {
      try {
        const allComments = {};
        for (const route of routes) {
          const response = await axios.get(`http://192.168.56.1:5000/api/comments/${route.id}`, { withCredentials: true });
          allComments[route.id] = response.data;
        }
        setComments(allComments);
      } catch (err) {
        console.error('Error fetching comments:', err.response?.data || err.message);
      }
    };

    fetchRoutes();
  }, []);

  const handleAddComment = async (routeId) => {
    if (newComment[routeId]) {
      try {
        const response = await axios.post(
          `http://192.168.56.1:5000/api/comments_add/${routeId}`,
          { comment_text: newComment[routeId], user_id: 1 }, // Replace user_id with dynamic value if needed
          { withCredentials: true }
        );

        setComments((prevComments) => ({
          ...prevComments,
          [routeId]: [
            ...(prevComments[routeId] || []),
            {
              comment_id: response.data.comment_id,
              comment_text: newComment[routeId],
              comment_date: new Date().toISOString(),
            },
          ],
        }));

        setNewComment((prevNewComment) => ({
          ...prevNewComment,
          [routeId]: '',
        }));
      } catch (err) {
        console.error('Error adding comment:', err.response?.data || err.message);
      }
    }
  };

  const calculateRegion = (coordinates) => {
    if (coordinates.length === 0) {
      return {
        latitude: 40.7128,
        longitude: -74.006,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }

    const latitudes = coordinates.map(coord => coord.latitude);
    const longitudes = coordinates.map(coord => coord.longitude);

    const minLatitude = Math.min(...latitudes);
    const maxLatitude = Math.max(...latitudes);
    const minLongitude = Math.min(...longitudes);
    const maxLongitude = Math.max(...longitudes);

    return {
      latitude: (minLatitude + maxLatitude) / 2,
      longitude: (minLongitude + maxLongitude) / 2,
      latitudeDelta: Math.max(0.01, maxLatitude - minLatitude + 0.02),
      longitudeDelta: Math.max(0.01, maxLongitude - minLongitude + 0.02),
    };
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={routes}
          keyExtractor={(item, index) => `route-${index}`}
          renderItem={({ item }) => {
            const coordinates = item.route_coordinates.map(coord => ({
              latitude: parseFloat(coord.latitude),
              longitude: parseFloat(coord.longitude),
            }));

            const initialRegion = calculateRegion(coordinates);
            const transportMode = transportModeDetails[item.transport_mode_id] || {};

            return (
              <View style={styles.route}>
                <View style={styles.header}>
                  <Text style={styles.username}>{item.username}</Text>
                  <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>

                <MapView
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={initialRegion}
                >
                  {coordinates.length > 0 && (
                    <>
                      <Marker coordinate={coordinates[0]} title={`Start of Route`} pinColor="green" />
                      <Marker coordinate={coordinates[coordinates.length - 1]} title={`End of Route`} pinColor="red" />
                      <Polyline coordinates={coordinates} strokeColor="#0000FF" strokeWidth={3} />
                    </>
                  )}
                </MapView>

                <View style={styles.transportType}>
                  {transportMode.image && (
                    <Image source={transportMode.image} style={styles.transportImage} />
                  )}
                  <Text style={styles.transportLabel}>
                    {transportMode.label || 'Unknown'}
                  </Text>
                </View>

                <View style={styles.details}>
                  <Text style={styles.text}>Distance: {item.distance_km} km</Text>
                  <Text style={styles.text}>CO2 Emissions: {item.CO2} kg</Text>
                  <Text style={styles.text}>Calories Burned: {item.kcal} kcal</Text>
                  <Text style={styles.text}>Duration: {item.duration} minutes</Text>
                  <Text style={styles.text}>Cost: ${item.money}</Text>
                  <Text style={styles.text}>Cost: {item.content}</Text>
                </View>

                <View style={styles.commentsSection}>
                  <Text style={styles.commentsTitle}>Comments:</Text>
                  {comments[item.id]?.map((comment, index) => (
                    <Text key={`comment-${index}`} style={styles.commentText}>
                      {comment.comment_text} - {new Date(comment.comment_date).toLocaleDateString()}
                    </Text>
                  ))}
                  <TextInput
                    style={styles.commentInput}
                    value={newComment[item.id] || ''}
                    onChangeText={(text) => setNewComment((prev) => ({ ...prev, [item.id]: text }))}
                    placeholder="Add a comment"
                  />
                  <Button title="Add Comment" onPress={() => handleAddComment(item.id)} />
                </View>
              </View>
            );
          }}
        />
      )}
      <NavBar />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: 'gray',
  },
  transportType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  transportImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  transportLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  details: {
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  commentsSection: {
    marginTop: 10,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
    marginBottom: 5,
  },
  commentInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
});

export default RoutesList;
