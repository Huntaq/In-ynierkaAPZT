import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import NavBar from '../src/Navbar';
import CustomMap from '../src/CustomMaps';
import { UserContext } from '../src/UserContex';
import tw from 'twrnc';

const HomeScreen = () => {
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (user?.push_notifications) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notifications');
      const data = await response.json();
      setNotifications(data);
      if (data.length > 0) setModalVisible(true);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.notificationHeader}>{item.header}</Text>
      <Text style={styles.notificationContent}>{item.content}</Text>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-white`}>
    <CustomMap />
    <NavBar />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 bg-black/80 p-5`}>
          <Text style={tw`text-white text-2xl font-bold text-center mb-5`}>Notifications</Text>

          {notifications.length === 0 ? (
            <Text style={tw`text-white text-lg text-center my-5`}>No new notifications</Text>
          ) : (
            <FlatList
              data={notifications}
              renderItem={renderNotification}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={tw`flex-grow`}
            />
          )}

          <TouchableOpacity
            style={tw`mt-5 bg-red-500 px-5 py-3 rounded-lg self-center`}
            onPress={() => setModalVisible(false)}
          >
            <Text style={tw`text-white text-lg`}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
export default HomeScreen;
