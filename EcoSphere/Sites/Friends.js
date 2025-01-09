import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { UserContext } from '../src/UserContex';
import { useNavigation } from '@react-navigation/native';

import acceptIcon from '../assets/images/solar_check-square-bold.png';
import removeIcon from '../assets/images/solar_close-square-bold.png';
import addIcon from '../assets/images/solar_check-square-bold.png';

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

  const removeFriend = async (friendId) => {
    try {
      const response = await axios.delete(`http://192.168.56.1:5000/api/friends/${friendId}`, {
        withCredentials: true,
      });

      Alert.alert('Success', response.data.message);

      setFriends((prevFriends) => prevFriends.filter((friend) => friend.friends_id !== friendId));
    } catch (error) {
      console.error('Error removing friend:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to remove friend');
    }
  };

  const acceptFriendRequest = async (friendId) => {
    try {
      const response = await axios.post(
        'http://192.168.56.1:5000/api/friends_accept',
        { friendId },
        { withCredentials: true }
      );

      Alert.alert('Success', response.data.message);

      setPendingFriends((prevPending) => prevPending.filter((friend) => friend.friends_id !== friendId));

      const responseAccepted = await axios.get('http://192.168.56.1:5000/api/friends', { withCredentials: true });
      setFriends(responseAccepted.data.results || []);
    } catch (error) {
      console.error('Error accepting friend request:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to accept friend request');
    }
  };

  const renderProfileItem = (profilePicture, username, icon, onPressAction) => (
    <View style={styles.profileContainer}>
      {profilePicture ? (
        <Image
          source={{ uri: `http://192.168.56.1${profilePicture}` }}
          style={styles.profilePicture}
          onError={(e) => console.log(`Error loading profile picture for ${username}:`, e.nativeEvent.error)}
        />
      ) : (
        <View style={styles.defaultProfilePicture}>
          <Text style={styles.profileInitial}>{username.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      <Text style={styles.usernameText}>{username}</Text>
      <TouchableOpacity onPress={onPressAction} style={styles.iconButton}>
        <Image source={icon} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Pending Friend Requests</Text>
      {pendingFriends.length === 0 ? (
        <Text style={styles.noPendingText}>🌱</Text>
      ) : (
        <FlatList
          data={pendingFriends}
          keyExtractor={(item) => item.friends_id.toString()}
          renderItem={({ item }) =>
            renderProfileItem(
              item.profilePicture,
              item.username,
              acceptIcon,
              () => acceptFriendRequest(item.friends_id)
            )
          }
        />
      )}

      <View style={styles.separator} />

      <Text style={styles.sectionHeader}>Accepted Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.friends_id.toString()}
        renderItem={({ item }) =>
          renderProfileItem(
            item.profilePicture,
            item.username,
            removeIcon,
            () => removeFriend(item.friends_id)
          )
        }
      />
      <TouchableOpacity onPress={() => navigation.navigate('ADD Friends')} style={styles.addButton}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1FCF3',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  defaultProfilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileInitial: {
    fontSize: 18,
    color: '#fff',
  },
  usernameText: {
    fontSize: 16,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  noPendingText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
  addButton: {
    alignSelf: 'center',
    marginVertical: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6e9b7b',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },

});

export default Friends;
