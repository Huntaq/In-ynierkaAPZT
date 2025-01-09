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
      const response = await fetch('http://192.168.56.1:5000/api/notifications');
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
    <View style={styles.container}>
      <CustomMap />
      <NavBar />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Notifications</Text>
          {notifications.length === 0 ? (
            <Text style={styles.noNotificationsText}>No new notifications</Text>
          ) : (
            <FlatList
              data={notifications}
              renderItem={renderNotification}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.listContainer}
            />
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  notificationHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  notificationContent: {
    fontSize: 14,
    color: '#666',
  },
  noNotificationsText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ff5757',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;
