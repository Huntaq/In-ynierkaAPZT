import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const Friends = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Funkcja pobierająca listę znajomych dla zalogowanego użytkownika
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`http://192.168.56.1:5000/api/friends/${userId}`);
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
        Alert.alert('Error', 'Failed to fetch friends');
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  // Funkcja wysyłająca zaproszenie do znajomych
  const addFriend = async (friendId) => {
    try {
      await axios.post('http://192.168.56.1:5000/api/friends', { user_id: userId, friend_id: friendId });
      Alert.alert('Success', 'Friend request sent successfully');
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  // Funkcja akceptująca zaproszenie
  const acceptFriend = async (friendId) => {
    try {
      await axios.put('http://192.168.56.1:5000/api/friends/accept', { user_id: userId, friend_id: friendId });
      Alert.alert('Success', 'Friend request accepted');
      // Odświeżenie listy znajomych po zaakceptowaniu zaproszenia
      setFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.friend_id === friendId ? { ...friend, status: 'accepted' } : friend
        )
      );
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error', 'Failed to accept friend request');
    }
  };

  // Funkcja odrzucająca zaproszenie
  const rejectFriend = async (friendId) => {
    try {
      await axios.put('http://192.168.56.1:5000/api/friends/reject', { user_id: userId, friend_id: friendId });
      Alert.alert('Success', 'Friend request rejected');
      // Odświeżenie listy znajomych po odrzuceniu zaproszenia
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.friend_id !== friendId)
      );
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      Alert.alert('Error', 'Failed to reject friend request');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.friend_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text style={styles.text}>Username: {item.username}</Text>
            <Text style={styles.text}>Status: {item.status}</Text>
            {item.status === 'pending' && (
              <View style={styles.buttonContainer}>
                <Button title="Accept" onPress={() => acceptFriend(item.friend_id)} />
                <Button title="Reject" onPress={() => rejectFriend(item.friend_id)} />
              </View>
            )}
          </View>
        )}
      />
      {/* Dodaj przycisk do wysyłania zaproszeń do znajomych */}
      <Button title="Add Friend" onPress={() => addFriend(anotherUserId)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  friendItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default Friends;
