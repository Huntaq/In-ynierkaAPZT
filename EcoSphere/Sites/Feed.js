import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TextInput, Button } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import { UserContext } from '../src/UserContex'; // Ensure this is the correct path
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

  const { user } = useContext(UserContext); // Access user from UserContext
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
    if (!routeId) {
      console.error('Route ID is undefined');
      return;
    }

    if (newComment[routeId]) {
      try {
        const response = await axios.post(
          `http://192.168.56.1:5000/api/comments_add/${routeId}`,
          { comment_text: newComment[routeId], user_id: user.id }, // Using user.id dynamically
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
              username: user.username, // Include username for immediate UI update
              profilePicture: user.profilePicture, // Include profile picture for immediate UI update
            },
          ],
        }));

        setNewComment((prev) => ({ ...prev, [routeId]: '' }));
      } catch (error) {
        console.error('Error adding comment:', error);
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
      <FlatList
        data={routes}
        keyExtractor={(item) => `route-${item.id}`}
        renderItem={({ item }) => {
          const transportMode = transportModeDetails[item.transport_mode_id] || {};
          const coordinates = item.route_coordinates.map(coord => ({
            latitude: parseFloat(coord.latitude),
            longitude: parseFloat(coord.longitude),
          }));
  
          return (
            <View style={styles.route}>
              {/* Transport Mode */}
              <View style={styles.transportTypeContainer}>
                {transportMode.image && (
                  <Image source={transportMode.image} style={styles.transportImage} />
                )}
                <Text style={styles.transportLabel}>
                  {transportMode.label || 'Unknown'}
                </Text>
              </View>
  
              
             {/* Post Header */}
                <View style={styles.header}>
                  <View style={styles.profileContainer}>
                    {item.profilePicture ? (
                      <Image source={{ uri: item.profilePicture }} style={styles.profileImage} />
                    ) : (
                      <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>
                          {item.username?.charAt(0).toUpperCase() || '?'}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.username}>{item.username || 'Unknown User'}</Text>
                  </View>
                  <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>

  
              {/* Map Section */}
              <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={calculateRegion(coordinates)}
              >
                {coordinates.length > 0 && (
                  <>
                    <Marker
                      coordinate={coordinates[0]}
                      title="Start of Route"
                      pinColor="green"
                    />
                    <Marker
                      coordinate={coordinates[coordinates.length - 1]}
                      title="End of Route"
                      pinColor="red"
                    />
                    <Polyline
                      coordinates={coordinates}
                      strokeColor="#0000FF"
                      strokeWidth={3}
                    />
                  </>
                )}
              </MapView>
  
              {/* Route Details */}
              <View style={styles.details}>
                <Text style={styles.text}>{item.content}</Text>
              </View>
  
              {/* Comments Section */}
              <View style={styles.commentsSection}>
                <Text style={styles.commentsTitle}>Comments:</Text>
  
                {/* Add Comment Section */}
                <View style={styles.commentInputContainer}>
                  <TextInput
                    style={styles.commentInput}
                    value={newComment[item.id] || ''}
                    onChangeText={(text) =>
                      setNewComment((prev) => ({ ...prev, [item.id]: text }))
                    }
                    placeholder="Add a comment"
                  />
                  <Button title="➤" onPress={() => handleAddComment(item.id)} />
                </View>
  
               
               {/* Comments List */}
                  {comments[item.id]?.map((comment) => (
                    <View key={comment.comment_id} style={styles.commentItem}>
                      {/* User's profile picture and username */}
                      <View style={styles.commentHeader}>
                        {comment.profilePicture ? (
                          <Image
                            source={{ uri: comment.profilePicture }}
                            style={styles.commentProfileImage}
                          />
                        ) : (
                          <View style={styles.placeholderImage}>
                            <Text style={styles.placeholderText}>
                              {comment.username?.charAt(0).toUpperCase() || '?'}
                            </Text>
                          </View>
                        )}
                        {/* Move the username to the top of the comment */}
                        <View style={styles.commentDetails}>
                          <Text style={styles.commentAuthor}>{comment.username || 'Unknown User'}</Text>
                        </View>
                      </View>
                      {/* Comment text displayed below the username */}
                      <Text style={styles.commentText}>{comment.comment_text}</Text>
                    </View>
                  ))}

              </View>
            </View>
          );
        }}
        ListEmptyComponent={() =>
          loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Text style={styles.text}>No routes available</Text>
          )
        }
      />
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1FCF3', // Light background for the app
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  route: {
    marginVertical: 10, // Vertical margin for spacing between routes
    padding: 15,
    borderColor: '#ccc', // Subtle border color for better aesthetics
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffffff', // White background for each route card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Shadow for Android
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align image and username vertically
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10, // Space between image and username
  },
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  transportTypeContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    backgroundColor: '#007bff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  transportImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  transportLabel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  details: {
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    lineHeight: 22, // Better readability for multi-line text
  },
  commentsSection: {
    marginTop: 15,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10, // Space between profile image and username
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  commentText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 40, // Aligns with the profile image size
    lineHeight: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 5,
    color: '#333',
  },
  separator: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  likesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  likesCount: {
    fontSize: 14,
    color: '#333',
  },
});


export default RoutesList;

