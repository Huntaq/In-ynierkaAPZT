import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Alert, Platform, Image, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import haversine from 'haversine';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './UserContex';

const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');
const CustomMap = () => {
  const navigation = useNavigation();
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
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [transportMode, setTransportMode] = useState('Walking');
  const [modalVisible, setModalVisible] = useState(false);
  const [lastRecordedPosition, setLastRecordedPosition] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const { user } = useContext(UserContext);
  const customMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#263c3f"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6b9a76"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9ca5b3"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#1f2835"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#f3d19c"
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2f3948"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#515c6d"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
  
  ]
  //Prośba o doste do lokalizacji
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
    //Pobieranie lokalizacji
    const getLocation = () => {
      watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          if (isTracking && !isPaused) {
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
  }, [isTracking, isPaused, lastRecordedPosition]);

  useEffect(() => {
    let interval = null;

    if (isTracking && !isPaused) {
      interval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTracking, isPaused]);
//liczenie kalorii
  const calculateCalories = (distance) => {
    const weight = 65; 
    const metValues = {
      Walking: 3.9,
      Running: 9.0,
      Cycling: 6.8,
    };
    const met = metValues[transportMode] || 3.8; 
    const caloriesPerMeter = (met * weight) / (60 * 1000); 
    return (distance * caloriesPerMeter).toFixed(2);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartPress = () => {
    setIsTracking(true);
    setIsStarted(true);
    setIsPaused(false);
    setRouteCoordinates([]);
    setDistanceTravelled(0);
    setTimeElapsed(0);
    setLastRecordedPosition(null);
  };

  const handlePausePress = () => {
    setIsPaused((prev) => !prev);
  };

  const handleFinishPress = () => {
    setIsTracking(false);
    setIsStarted(false);
    setModalVisible(true);
  
    
    const carCO2Emission = 106.6 * (distanceTravelled / 1000); 
  
   
    const co2Saved = carCO2Emission;
  
    console.log('Route Coordinates:', routeCoordinates); 
    //przerzucanie dalej informacji
    navigation.navigate('SummaryScreen', {
      distance: (distanceTravelled / 1000).toFixed(2), 
      time: formatTime(timeElapsed), 
      calories: calculateCalories(distanceTravelled), 
      transportMode, 
      routeCoordinates, 
      co2Saved: (co2Saved / 1000).toFixed(2), 
    });
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} customMapStyle={customMapStyle}>
        <Marker coordinate={currentPosition} title="Your Location" />
        <Polyline coordinates={routeCoordinates} strokeWidth={5} strokeColor="blue" />
      </MapView>
      {!isStarted && <Text style={styles.textText}>Choose your form of transport</Text>}
      <View style={styles.controls}>
      {!isStarted ? (
  <View style={styles.transportModeContainer}>
    {['Walking', 'Cycling', 'Running'].map((mode) => (
      <TouchableOpacity
        key={mode}
        style={[
          styles.transportButton,
          transportMode === mode ? styles.activeTransportButton : null,
        ]}
        onPress={() => setTransportMode(mode)}
      >
        <Image
          source={
            mode === 'Walking'
              ? require('../assets/images/solar_walking-bold.png')
              : mode === 'Cycling'
              ? require('../assets/images/solar_bicycling-bold.png')
              : require('../assets/images/solar_running-2-bold.png')
          }
          style={styles.transportIcon}
        />
        <Text style={styles.ModeText}>{mode}</Text>
      </TouchableOpacity>
    ))}
  </View>
) : (
  <View style={styles.selectedTransportContainer}>
    <Image
      source={
        transportMode === 'Walking'
          ? require('../assets/images/solar_walking-bold.png')
          : transportMode === 'Cycling'
          ? require('../assets/images/solar_bicycling-bold (1).png')
          : require('../assets/images/solar_running-2-bold.png')
      }
      style={styles.selectedTransportIcon}
    />
    <Text style={styles.selectedTransportText}>{transportMode}</Text>
  </View>
)}


        {!isStarted ? (
          <TouchableOpacity style={styles.startButton} onPress={handleStartPress}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              Distance: <Text style={styles.boldText}>{(distanceTravelled / 1000).toFixed(2)} km</Text>
            </Text>
            <Text style={styles.statsText}>
              Time: <Text style={styles.boldText}>{formatTime(timeElapsed)}</Text>
            </Text>
            <Text style={styles.statsText}>
              Calories: <Text style={styles.boldText}>{calculateCalories(distanceTravelled)} kcal</Text>
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.pauseButton} onPress={handlePausePress}>
                <Text style={styles.PausText}>{isPaused ? 'Resume' : 'Pause'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.finishButton} onPress={handleFinishPress}>
                <Text style={styles.buttonText}>Finish</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'Top', 
    alignItems: 'top',     
    backgroundColor: '#F1FCF3',
  },
  

  map: {
    
    width: width, 
    height: height*0.50,  
    marginBottom: 20,
    
  },
  controls: {
    flex: 0.3,
    backgroundColor: '#F1FCF3',
    padding: 10,
    borderRadius: 10,
  },
  startButton: {
    marginTop: 20,
    backgroundColor: '#84D49D',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
    alignSelf: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textText: {
    alignItems: 'center',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',

  },
  statsText: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 5,
  },
  pauseButton: {
    borderWidth: 1,
    borderColor: '#84D49D',
    marginTop: 20,
    backgroundColor: '#F1FCF3',
    paddingVertical: 15,
    flex: 1,
    marginRight: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  finishButton: {
    marginTop: 20,
    backgroundColor: '#FE756A',
    paddingVertical: 15,
    flex: 1,
    marginLeft: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  transportModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  transportButton: {
    alignItems: 'center',
  },
  activeTransportButton: {
    backgroundColor: '#4BD0FF',
    borderRadius: 10,
    padding: 5,
  },
  transportIcon: {
    width: 50,
    height: 50,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  
  ModeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  PausText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#84D49D',
  },
  selectedTransportContainer: {
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 10,
  },
  selectedTransportIcon: {
    width: 50,
    height: 50,
    marginBottom: 5, 
  },
  selectedTransportText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  
});

export default CustomMap;
