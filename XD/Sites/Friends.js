import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Image, Button } from 'react-native';
import axios from 'axios';
import { UserContext } from '../src/UserContex';
import { useNavigation } from '@react-navigation/native';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [pendingFriends, setPendingFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const responseAccepted = await axios.get('http://192.168.56.1:5000/api/friends', { withCredentials: true });
        setFriends(responseAccepted.data.results || []);

        const responsePending = await axios.get('http://192.168.56.1:5000/api/friends_pending', { withCredentials: true });
        setPendingFriends(responsePending.data.results || []);
      } catch (error) {
        console.error('Error fetching friends:', error.response?.data || error.message);
        Alert.alert('Error', error.response?.data?.message || 'Failed to fetch friends');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchFriends();
    }
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Pending Friend Requests</Text>
      <FlatList
        data={pendingFriends}
        keyExtractor={(item) => item.friends_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text style={styles.text}>Username: {item.username}</Text>
            {item.profilePicture ? (
              <Image source={{ uri: `http://192.168.56.1${item.profilePicture}` }} style={styles.profilePicture} />
            ) : (
              <Text style={styles.text}>No profile picture available</Text>
            )}
            <Button title="Accept Friend" onPress={() => {}} />
          </View>
        )}
      />

      <View style={styles.separator} />

      <Text style={styles.sectionHeader}>Accepted Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.friends_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text style={styles.text}>Username: {item.username}</Text>
            {item.profilePicture ? (
              <Image source={{ uri: `http://192.168.56.1${item.profilePicture}` }} style={styles.profilePicture} />
            ) : (
              <Text style={styles.text}>No profile picture available</Text>
            )}
            <Button title="Remove Friend" onPress={() => {}} />
          </View>
        )}
      />
      <Button title="Dodaj Przyjaciela" onPress={() => navigation.navigate('ADD Friends')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 20,
  },
  friendItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  text: {
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default Friends;
