import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import NavBar from '../src/Navbar'; 

const RoutesList = ({ user_id }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://192.168.56.1:5000/api/user_routes', { withCredentials: true });

        console.log('Response:', response.data); 
        setRoutes(response.data);
      } catch (err) {
        console.error('Fetch routes error:', err); 
        setError('Błąd podczas pobierania tras');
      } finally {
        setLoading(false);
      }
    };
  
    fetchRoutes();
  }, [user_id]);

  return (
    <View style={styles.container}>
      
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />  
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>  
      ) : (
        <FlatList
          data={routes}
          
          renderItem={({ item }) => (
            <View style={styles.route}>
              
              
              <Text style={styles.text}>Transport Mode ID: {item.transport_mode_id}</Text>
              <Text style={styles.text}>Distance: {item.distance_km} km</Text>
              <Text style={styles.text}>CO2 Emissions: {item.CO2} kg</Text>
              <Text style={styles.text}>Calories Burned: {item.kcal} kcal</Text>
              <Text style={styles.text}>Duration: {item.duration} minutes</Text>
              <Text style={styles.text}>Cost: ${item.money}</Text>
              <Text style={styles.text}>Private: {item.is_private ? 'Yes' : 'No'}</Text>
           
              
              
              
            </View>
          )}
        />
      )}<NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  route: {
    marginBottom: 20,
    padding: 15,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default RoutesList;
