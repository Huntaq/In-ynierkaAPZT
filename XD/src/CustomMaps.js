import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import haversine from 'haversine';
import { useNavigation } from '@react-navigation/native';

const CustomMap = () => {
  const navigation = useNavigation(); 
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
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
  const [lastRecordedPosition, setLastRecordedPosition] = useState(null); // New state

  useEffect(() => {
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
      Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          if (isTracking) {
            const newCoordinate = { latitude, longitude };

            // Update only if the distance from last recorded position exceeds 200 meters
            if (lastRecordedPosition) {
              const distance = haversine(lastRecordedPosition, newCoordinate, { unit: 'meter' });
              if (distance >= 200) {
                setRouteCoordinates((prevCoordinates) => [...prevCoordinates, newCoordinate]);

                // Update distanceTravelled
                setDistanceTravelled((prevDistance) => prevDistance + distance);

                // Update last recorded position
                setLastRecordedPosition(newCoordinate);
              }
            } else {
              // If it's the first coordinate, set it as the last recorded position
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
          console.log(error);
          Alert.alert('Error', 'Unable to fetch location. Please try again.');
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10, 
          interval: 10000, 
          fastestInterval: 5000, 
        }
      );
    };

    requestLocationPermission();

    return () => {
      Geolocation.clearWatch(); 
    };
  }, [isTracking, lastRecordedPosition]);

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

  const handleStartPress = () => {
    setIsTracking(true);
    setRouteCoordinates([]);
    setDistanceTravelled(0);
    setTimeElapsed(0);
    setLastRecordedPosition(null); // Reset last recorded position
    console.log('Start pressed');
  };

  const handleStopPress = () => {
    setIsTracking(false);
    console.log('Stop pressed');
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleTransportModeChange = (mode) => {
    setTransportMode(mode);
  };

  const calculateSavings = () => {
    const savingsPerKm = transportMode === 'Bus' ? 1 : 0.5;
    return (distanceTravelled * savingsPerKm).toFixed(2);
  };

  const calculateCO2Savings = () => {
    const co2PerKm = 120; // g CO2/km
    return (distanceTravelled * co2PerKm).toFixed(2);
  };

  const calculateCaloriesBurned = () => {
    const caloriesPerKm = transportMode === 'Walking' ? 50 : 35;
    return (distanceTravelled * caloriesPerKm).toFixed(2);
  };

  const handleFinishPress = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      >
        <Marker
          coordinate={currentPosition}
          title={"Your Location"}
          description={"This is where you are currently located."}
        />
        <Polyline coordinates={routeCoordinates} strokeWidth={5} strokeColor="blue" />
      </MapView>
      <View style={styles.controls}>
        <Text style={styles.distanceText}>Distance: {distanceTravelled.toFixed(2)} km</Text>
        <Text style={styles.timerText}>Time: {formatTime(timeElapsed)}</Text>
        <Text style={styles.transportText}>Mode: {transportMode}</Text>

        <View style={styles.modeButtons}>
          <TouchableOpacity 
            style={[
              styles.modeButton, 
              transportMode === 'Walking' ? styles.activeButton : null
            ]}
            onPress={() => handleTransportModeChange('Walking')}
          >
            <Text style={styles.buttonText}>Walking</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.modeButton, 
              transportMode === 'Cycling' ? styles.activeButton : null
            ]}
            onPress={() => handleTransportModeChange('Cycling')}
          >
            <Text style={styles.buttonText}>Cycling</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.modeButton, 
              transportMode === 'Bus' ? styles.activeButton : null
            ]}
            onPress={() => handleTransportModeChange('Bus')}
          >
            <Text style={styles.buttonText}>Bus</Text>
          </TouchableOpacity>
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

      {/* Modal Popup */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Trasa ukończona!</Text>
            
            {/* Minimapa z trasą */}
            <MapView
              style={styles.miniMap}
              region={{
                latitude: routeCoordinates.length > 0 ? routeCoordinates[0].latitude : 0,
                longitude: routeCoordinates.length > 0 ? routeCoordinates[0].longitude : 0,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Polyline coordinates={routeCoordinates} strokeWidth={3} strokeColor="red" />
            </MapView>
            
            {/* Informacje */}
            <Text style={styles.modalText}>Czas: {formatTime(timeElapsed)}</Text>
            <Text style={styles.modalText}>Dystans: {distanceTravelled.toFixed(2)} km</Text>
            <Text style={styles.modalText}>Zaoszczędzone pieniądze: {calculateSavings()} PLN</Text>
            <Text style={styles.modalText}>Zaoszczędzone CO2: {calculateCO2Savings()} g</Text>
            <Text style={styles.modalText}>Spalone kalorie: {calculateCaloriesBurned()} kcal</Text>

            {/* Przycisk zamknięcia */}
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
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
  shareButton: {
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    marginTop: 10,
  },
});

export default CustomMap;
