import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useAnimatedReaction,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { UserContext } from '../src/UserContex';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import NavBar from '../src/Navbar';
const { width, height } = Dimensions.get('window');
const RADIUS = width * 0.3; // Adjust this value to change the size of the circle and the colored gradient border

const transportImages = {
  Walking: require('../assets/images/solar_walking-bold.png'),
  Cycling: require('../assets/images/solar_bicycling-bold.png'),
  Running: require('../assets/images/solar_running-2-bold.png'),
};

const SummaryScreen = ({ route }) => {
  const { user } = useContext(UserContext);
  const rotate = useSharedValue(0);
  const navigation = useNavigation();
  const [statIndex, setStatIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [content, setContent] = useState("");
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
  const {
    distance, // Distance in km
    time, // Formatted duration
    calories, // Calories burned
    transportMode, // Selected transport mode
    routeCoordinates, // Array of route coordinates
    co2Saved,
  } = route.params;

  const statistics = [
    { label: 'Time', value: time },
    { label: 'Distance', value: `${distance} km` },
    { label: 'Calories', value: `${calories} kcal` },
    { label: 'CO2', value: `${co2Saved} kg` },
  ];

  const currentStatIndex = useDerivedValue(() => {
    const totalStats = statistics.length;
    const normalizedAngle = ((rotate.value % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const index = Math.floor((normalizedAngle / (2 * Math.PI)) * totalStats) % totalStats;
    return index;
  });

  useAnimatedReaction(
    () => currentStatIndex.value,
    (index) => {
      if (index !== statIndex) {
        runOnJS(setStatIndex)(index);
      }
    },
    [statIndex]
  );

  const gesture = Gesture.Pan().onUpdate((e) => {
    rotate.value += e.translationX * 0.005; // Reduced angular velocity for slower animation speed
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}rad` }],
    };
  });

  const handleShareOrPrivate = async (isPrivate) => {
    try {
      const routeData = {
        user_id: user.id,
        transport_mode_id: transportMode === 'Walking' ? 1 : transportMode === 'Cycling' ? 2 : 3,
        distance_km: parseFloat(distance), // Ensure it's a number
        CO2: parseFloat((co2Saved)), // Ensure it's a number
        kcal: parseFloat(calories), // Ensure it's a number
        duration: time,
        money: parseFloat((distance * 0.5).toFixed(2)), // Ensure it's a number
        is_private: isPrivate ? 0 : 1, // Adjusted logic: 0 for private, 1 for shared
        routeCoordinates: routeCoordinates,
        content: content.trim(), // Remove unnecessary whitespace
      };

      const response = await fetch('http://192.168.56.1:5000/api/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(routeData),
      });

      if (!response.ok) {
        throw new Error('Failed to send route');
      }

      const result = await response.json();
      Alert.alert('Success', isPrivate ? 'Route kept private!' : 'Route shared successfully!');
      setModalVisible(false);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error sending route:', error);
      Alert.alert('Error', 'Failed to send route.');
    }
  };

  return (
    <View style={styles.container}>
      {/* MapView */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          customMapStyle={customMapStyle}
          initialRegion={{
            latitude: routeCoordinates[0]?.latitude || 37.78825,
            longitude: routeCoordinates[0]?.longitude || -122.4324,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Polyline coordinates={routeCoordinates} strokeWidth={5} strokeColor="blue" />
        </MapView>
        </View>

      {/* Transport Image */}
      <Image source={transportImages[transportMode]} style={styles.transportImage} />

      {/* Statistics */}
      <View style={styles.statisticsContainer}>
        <Text style={styles.statisticLabel}>
          {statistics[statIndex]?.label || ''}
        </Text>
        <Text style={styles.statisticValue}>
          {statistics[statIndex]?.value || ''}
        </Text>
      </View>

      {/* Rotating Circle */}
      <GestureDetector gesture={gesture}>
        <View style={styles.circleContainer}>
          <Animated.View style={[styles.circle, animatedStyle]}>
          <LinearGradient
              colors={['#D87A8F', '#6BB5C9', '#6A9F7B', '#D1B358']}    // Pastel colors
              style={styles.gradientCircle}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            {/* Inner circle to hide the center */}
            <View style={styles.innerCircle} />
          </Animated.View>

          {/* Share button is independent of the rotating circle */}
          <TouchableOpacity style={styles.shareButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </GestureDetector>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Add your route details:</Text>
            {/* Mini Map */}
            <MapView
              style={styles.miniMap}
              customMapStyle={customMapStyle}
              initialRegion={{
                latitude: routeCoordinates[0]?.latitude || 37.78825,
                longitude: routeCoordinates[0]?.longitude || -122.4324,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Polyline coordinates={routeCoordinates} strokeWidth={5} strokeColor="blue" />
            </MapView>
            <TextInput
              style={styles.textInput}
              placeholder="Add a description..."
              value={content}
              onChangeText={setContent}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#84D49D' }]}
                onPress={() => handleShareOrPrivate(false)}
              >
                <Text style={styles.modalButtonText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#FF6F61' }]}
                onPress={() => handleShareOrPrivate(true)}
              >
                <Text style={styles.modalButtonText}>Keep Private</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <NavBar/>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1FCF3' },
  mapContainer: {
    borderRadius: 15, // Rounded corners for the map
    overflow: 'hidden', // Ensures the rounded corners are applied
    marginHorizontal: 20, // Margin from the sides
    marginTop: 20,
  },
  map: {
    height: height * 0.4,
    width: '100%',
  },
  miniMap: {
    height: 150,
    width: '100%',
    borderRadius: 10,
    marginBottom: 15,
  },
  transportImage: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginVertical: 10,
  },
  statisticsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statisticLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },

  statisticValue: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -RADIUS + height * 0.05, // Position the circle at the bottom of the screen
    width: width,
  },
  circle: {
    width: RADIUS * 2,
    height: RADIUS * 2,
    borderRadius: RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientCircle: {
    position: 'absolute',
    width: RADIUS * 2,
    height: RADIUS * 2,
    borderRadius: RADIUS,
    borderWidth: 15,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    position: 'absolute',
    width: RADIUS * 1.3, // Slightly smaller than the outer circle
    height: RADIUS * 1.3,
    borderRadius: RADIUS * 0.8,
    backgroundColor: '#F1FCF3', // Match the background color
  },
  shareButton: {
    position: 'absolute',
    bottom: height * 0.16, // Position the share button inside the circle
    width: 120,
    height: 45, // More elongated button
    backgroundColor: '#84D49D',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  textInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SummaryScreen;
