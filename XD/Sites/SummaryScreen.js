import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import axios from 'axios';
import { UserContext } from '../src/UserContex';

const SummaryScreen = ({ route, navigation }) => {
  const { user } = useContext(UserContext);

  const {
    distance = 0,
    time = '00:00:00',
    calories = 0,
    transportMode = 'Unknown',
    routeCoordinates = [],
  } = route.params || {};

  const [isModalVisible, setModalVisible] = useState(false);
  const [content, setContent] = useState(''); // Zmieniono z description na content

  const calculateCO2 = (transportMode, distance) => {
    const co2PerKm = { Walking: 0.5, Cycling: 1, Running: 1.5 };
    return (co2PerKm[transportMode] || 0) * distance;
  };

  const calculateMoneySaved = (distance) => {
    const avgCostPerKm = 1.5;
    return (distance * avgCostPerKm).toFixed(2);
  };

  const handleSendToDatabase = async (isPrivate) => {
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
      routeCoordinates,
      content, // Użycie content zamiast description
    };

    try {
      const response = await axios.post('http://192.168.56.1:5000/api/routes', data);
      if (response.status === 201) {
        Alert.alert('Success', 'Route saved successfully!');
        setModalVisible(false);
        navigation.navigate('Home');
      } else {
        throw new Error('Failed to save the route');
      }
    } catch (error) {
      console.error('Error saving route:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save the route. Please try again.');
    }
  };

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
      <TouchableOpacity style={styles.shareButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Share</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Add Content</Text>
            <MapView
              style={styles.modalMap}
              initialRegion={{
                latitude: routeCoordinates[0]?.latitude || 0,
                longitude: routeCoordinates[0]?.longitude || 0,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Polyline coordinates={routeCoordinates} strokeWidth={5} strokeColor="blue" />
            </MapView>
            <TextInput
              placeholder="Add content to your post"
              style={styles.input}
              value={content} // Użycie content zamiast description
              onChangeText={setContent}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.keepPrivateButton]}
                onPress={() => handleSendToDatabase(false)}
              >
                <Text style={styles.buttonText}>Keep Private</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.shareButton]}
                onPress={() => handleSendToDatabase(true)}
              >
                <Text style={styles.buttonText}>Share</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F1FCF3' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  map: { height: 300, marginBottom: 20 },
  shareButton: { backgroundColor: '#84D49D', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: 300, backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center' },
  modalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalMap: { height: 200, width: '100%', marginBottom: 20 },
  input: { width: '100%', borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 10, padding: 5 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 },
  button: { flex: 1, marginHorizontal: 5, paddingVertical: 10, borderRadius: 5, alignItems: 'center' },
  keepPrivateButton: { backgroundColor: '#FF6B6B' },
  closeButton: { backgroundColor: '#ccc', marginTop: 10 },
});

export default SummaryScreen;
