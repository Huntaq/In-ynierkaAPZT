import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Alert, Platform, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import haversine from 'haversine';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import axios from 'axios';
import { UserContext } from './UserContex';

const CustomMap = () => {
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [currentPosition, setCurrentPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [transportMode, setTransportMode] = useState('Walking');
  const [modalVisible, setModalVisible] = useState(false);
  const [lastRecordedPosition, setLastRecordedPosition] = useState(null);
  const { user } = useContext(UserContext);

  // Używane do lokalizacji
  useEffect(() => {
    let watchId;
    const requestLocationPermission = async () => {
      const permission = Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        getLocation();
      } else {
        Alert.alert('Permission Denied', 'Please enable location permissions for this app.');
      }
    };

    const getLocation = () => {
      watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          if (isTracking) {
            const newCoordinate = { latitude, longitude };
            if (lastRecordedPosition) {
              const distance = haversine(lastRecordedPosition, newCoordinate, { unit: 'meter' });
              if (distance >= 5) {
                setRouteCoordinates((prevCoordinates) => [...prevCoordinates, newCoordinate]);
                setDistanceTravelled((prevDistance) => prevDistance + distance);
                setLastRecordedPosition(newCoordinate);
              }
            } else {
              setLastRecordedPosition(newCoordinate);
              setRouteCoordinates((prevCoordinates) => [...prevCoordinates, newCoordinate]);
            }
          }

          setCurrentPosition({ latitude, longitude });
          setRegion((prevRegion) => ({
            ...prevRegion,
            latitude,
            longitude,
          }));
        },
        (error) => {
          console.error(error);
          Alert.alert('Error', 'Unable to fetch location. Please try again.');
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 5,
          interval: 5000,
          fastestInterval: 2000,
        }
      );
    };

    requestLocationPermission();

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, [isTracking, lastRecordedPosition]);

  // Ustawienie timera
  useEffect(() => {
    let interval = null;

    if (isTracking) {
      interval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTracking]);

  // Formatowanie czasu
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Funkcje obliczeniowe
  const calculateSavings = () => (distanceTravelled / 1000 * 0.5).toFixed(2);
  const calculateCO2Savings = () => (distanceTravelled / 1000 * 120).toFixed(2);
  const calculateCaloriesBurned = () => {
    const caloriesPerKm = transportMode === 'Walking' ? 50 : 35;
    return (distanceTravelled / 1000 * caloriesPerKm).toFixed(2);
  };

  // Wysyłanie danych do backendu
  const handleSavePress = async () => {
    try {
      const data = {
        user_id: user.id,
        transport_mode_id: transportMode === 'Walking' ? '1' : transportMode === 'Running' ? '2' : '3',
        distance_km: (distanceTravelled / 1000).toFixed(2),
        CO2: calculateCO2Savings(),
        kcal: calculateCaloriesBurned(),
        duration: formatTime(timeElapsed),
        money: calculateSavings(),
        is_private: false,
        routeCoordinates, // Dodanie punktów trasy
      };
  
      console.log('Wysyłanie danych:', data);
  
      const response = await axios.post('http://192.168.56.1:5000/api/routes', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 201) {
        Alert.alert('Success', 'Route has been saved successfully.');
        setModalVisible(false);
      } else {
        throw new Error('Failed to save route.');
      }
    } catch (error) {
      console.error('Błąd podczas zapisywania trasy:', error.response?.data || error.message);
      Alert.alert('Błąd', 'Nie udało się zapisać trasy. Spróbuj ponownie.');
    }
  };

  // Sterowanie
  const handleStartPress = () => {
    setIsTracking(true);
    setRouteCoordinates([]);
    setDistanceTravelled(0);
    setTimeElapsed(0);
    setLastRecordedPosition(null);
  };

  const handleStopPress = () => {
    setIsTracking(false);
  };

  const handleFinishPress = () => {
    setIsTracking(false);
    setModalVisible(true);
  };

  const handleTransportModeChange = (mode) => setTransportMode(mode);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        <Marker coordinate={currentPosition} title="Your Location" />
        <Polyline coordinates={routeCoordinates} strokeWidth={5} strokeColor="blue" />
      </MapView>

      <View style={styles.controls}>
        <Text style={styles.distanceText}>Distance: {distanceTravelled.toFixed(2)} m</Text>
        <Text style={styles.timerText}>Time: {formatTime(timeElapsed)}</Text>
        <View style={styles.modeButtons}>
          {['Walking', 'Cycling', 'Running'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.modeButton,
                transportMode === mode ? styles.activeButton : null,
              ]}
              onPress={() => handleTransportModeChange(mode)}
            >
              <Text style={styles.buttonText}>{mode}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.startButton} onPress={handleStartPress}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stopButton} onPress={handleStopPress}>
          <Text style={styles.stopButtonText}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinishPress}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Trasa ukończona!</Text>
            <Text style={styles.modalText}>Czas: {formatTime(timeElapsed)}</Text>
            <Text style={styles.modalText}>Dystans: {(distanceTravelled / 1000).toFixed(2)} km</Text>
            <Text style={styles.modalText}>Zaoszczędzone pieniądze: {calculateSavings()} PLN</Text>
            <Text style={styles.modalText}>Zaoszczędzone CO2: {calculateCO2Savings()} g</Text>
            <Text style={styles.modalText}>Spalone kalorie: {calculateCaloriesBurned()} kcal</Text>
            <TouchableOpacity style={styles.saveButton} onPress={handleSavePress}>
              <Text style={styles.buttonText}>Zapisz</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  controls: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
  },

  distanceText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },

  timerText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },

  transportText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },

  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },

  modeButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  activeButton: {
    backgroundColor: '#8A2BE2',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },

  startButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    paddingVertical: 10,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  stopButton: {
    backgroundColor: '#FF6347',
    borderRadius: 10,
    paddingVertical: 10,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  finishButton: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    paddingVertical: 10,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveButton: {
    backgroundColor: '#32CD32',
    marginTop: 10,
  },

  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },

  stopButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },

  finishButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
  },

  miniMap: {
    width: '100%',
    height: 100,
    marginBottom: 20,
  },

  cancelButton: {
    backgroundColor: '#FF6347',
    marginTop: 10,
  },
  weatherContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  weatherText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 5,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  
  
});

export default CustomMap;
