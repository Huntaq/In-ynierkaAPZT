import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, Dimensions } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import axios from 'axios';
import { UserContext } from '../src/UserContex';

const { width } = Dimensions.get('window');

const SummaryScreen = ({ route, navigation }) => {
  const { user } = useContext(UserContext);

  const {
    distance = 0,
    time = '00:00:00',
    calories = 0,
    transportMode = 'Unknown',
    routeCoordinates = [],
  } = route.params || {};

  const [isPrivate, setIsPrivate] = useState(false);

  const calculateCO2 = (transportMode, distance) => {
    const co2PerKm = {
      Walking: 0.5,
      Cycling: 1,
      Running: 1.5,
    };

    return (co2PerKm[transportMode] || 0) * distance;
  };

  const calculateMoneySaved = (distance) => {
    const avgCostPerKm = 1.5;
    return (distance * avgCostPerKm).toFixed(2);
  };

  const handleSendToDatabase = async () => {
    const user_id = user?.id;

    if (!user_id) {
      Alert.alert('Error', 'User not logged in or user ID is missing.');
      return;
    }

    const transport_mode_id = transportMode === 'Walking' ? 1 : transportMode === 'Cycling' ? 2 : 3;
    const CO2 = calculateCO2(transportMode, distance);
    const money = calculateMoneySaved(distance);

    const data = {
      user_id,
      transport_mode_id,
      distance_km: parseFloat(distance),
      CO2,
      kcal: parseFloat(calories),
      duration: time,
      money: parseFloat(money),
      is_private: isPrivate ? 1 : 0,
      routeCoordinates, // Ensure this is an array of valid coordinates
    };

    console.log('Data being sent to the database:', data);

    try {
      const response = await axios.post('http://192.168.56.1:5000/api/routes', data);
      if (response.status === 201) {
        Alert.alert('Success', 'Route saved successfully!');
        navigation.navigate('Home'); // Redirect to Home or another appropriate screen
      } else {
        throw new Error('Failed to save the route');
      }
    } catch (error) {
      console.error('Error saving route:', error);
      Alert.alert('Error', 'Failed to save the route. Please try again.');
    }
  };

  const statistics = [
    { key: 'Transport Mode', value: transportMode },
    { key: 'Distance', value: `${distance} km` },
    { key: 'Time', value: time },
    { key: 'Calories Burned', value: `${calories} kcal` },
    { key: 'CO2 Saved', value: `${calculateCO2(transportMode, distance).toFixed(2)} kg` },
    { key: 'Money Saved', value: `${calculateMoneySaved(distance)} currency units` },
  ];

  const renderStatistic = ({ item }) => (
    <View style={styles.statisticCard}>
      <Text style={styles.statisticKey}>{item.key}</Text>
      <Text style={styles.statisticValue}>{item.value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Route Summary</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: routeCoordinates[0]?.latitude || 0,
          longitude: routeCoordinates[0]?.longitude || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Polyline coordinates={routeCoordinates} strokeWidth={5} strokeColor="blue" />
      </MapView>
      <FlatList
        data={statistics}
        renderItem={renderStatistic}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.statisticList}
      />
      <TouchableOpacity
        style={[styles.button, isPrivate ? styles.privateButton : styles.publicButton]}
        onPress={() => setIsPrivate((prev) => !prev)}
      >
        <Text style={styles.buttonText}>{isPrivate ? 'Make Public' : 'Make Private'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSendToDatabase}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F1FCF3',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  map: {
    height: 300,
    marginBottom: 20,
  },
  statisticList: {
    marginBottom: 20,
  },
  statisticCard: {
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 2,
  },
  statisticKey: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statisticValue: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    height: 50,
    width: 232,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginTop: 20,
  },
  publicButton: {
    borderColor: '#84D49D',
    backgroundColor: '#84D49D',
    alignItems: 'center',
    width: 300,
    alignSelf: 'center',
  },
  privateButton: {
    borderColor: '#84D49D',
    backgroundColor: '#84D49D',
    alignItems: 'center',
    width: 300,
    alignSelf: 'center',
  },
  saveButton: {
    borderColor: '#84D49D',
    backgroundColor: '#84D49D',
    alignItems: 'center',
    width: 300,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SummaryScreen;
