import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { ProgressBar } from '@react-native-community/progress-bar-android'; // Poprawny import
import axios from 'axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [userRoutes, setUserRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pobranie eventów i tras użytkownika z serwera
    const fetchEventsAndRoutes = async () => {
      try {
        const eventResponse = await axios.get('http://192.168.56.1:5000/api/events'); // Pobierz eventy
        setEvents(eventResponse.data);

        const routeResponse = await axios.get('http://192.168.56.1:5000/api/user_routes'); // Pobierz trasy użytkownika
        setUserRoutes(routeResponse.data);
      } catch (error) {
        console.error('Error fetching events or routes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsAndRoutes();
  }, []);

  // Funkcja do obliczenia postępu użytkownika dla danego eventu w zależności od dat
  const calculateProgress = (event) => {
    const { startDate, endDate, distance: eventDistance } = event;

    // Filtruj trasy, które odbyły się w ramach dat eventu
    const userRoutesForEvent = userRoutes.filter(route => {
      const routeDate = new Date(route.date); // Zakładamy, że `date` w trasach to pole typu string
      return routeDate >= new Date(startDate) && routeDate <= new Date(endDate);
    });

    // Sumuj przebyte kilometry w ramach tego eventu
    const totalDistanceCovered = userRoutesForEvent.reduce((total, route) => total + route.distance_km, 0);

    // Oblicz postęp (maksymalnie 100%)
    return Math.min(totalDistanceCovered / eventDistance, 1); // Postęp nie może przekroczyć 100%
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

                {/* Wskaźnik postępu */}
                <Text style={styles.progressText}>
                  Progress: {(progress * 100).toFixed(2)}%
                </Text>
                <ProgressBar
                  styleAttr="Horizontal" // Zmieniono na poprawną nazwę komponentu
                  indeterminate={false}
                  progress={progress}
                />
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
