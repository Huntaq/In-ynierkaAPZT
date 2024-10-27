import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import axios from 'axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [userRoutes, setUserRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Użycie jednego useEffect dla pobrania eventów i tras użytkownika
  useEffect(() => {
    const fetchEventsAndRoutes = async () => {
      try {
        const eventResponse = await axios.get('http://192.168.56.1:5000/api/events');
        setEvents(eventResponse.data);
        
        const routeResponse = await axios.get('http://192.168.56.1:5000/api/user_routes');
        setUserRoutes(routeResponse.data);
      } catch (error) {
        console.error('Error fetching events or user routes:', error); 
      } finally {
        setLoading(false);
      }
    };

    fetchEventsAndRoutes();
  }, []); // Pusty array oznacza, że useEffect wykona się tylko raz przy załadowaniu komponentu

  const calculateProgress = (event) => {
    const { startDate, endDate, distance } = event;
    
    const userRoutesForEvent = userRoutes.filter(route => {
      const routeDate = new Date(route.date); 
      return routeDate >= new Date(startDate) && routeDate <= new Date(endDate);
    });

    const totalDistanceCovered = userRoutesForEvent.reduce((total, route) => total + route.distance_km, 0);
    return Math.min(totalDistanceCovered / distance, 1);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {events.length === 0 ? (
        <Text>No events available</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const progress = calculateProgress(item);

            return (
              <View style={styles.eventContainer}>
                {item.image && (
                  <Image source={{ uri: item.image }} style={styles.image} />
                )}
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.type}>Type: {item.type}</Text>
                <Text style={styles.distance}>Distance: {item.distance} km</Text>
                <Text style={styles.progressText}>Progress: {(progress * 100).toFixed(2)}%</Text>
                <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={progress} />
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  eventContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    marginBottom: 5,
  },
  type: {
    fontSize: 12,
    color: '#888',
  },
  distance: {
    fontSize: 12,
    color: '#888',
  },
  progressText: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default Events;
