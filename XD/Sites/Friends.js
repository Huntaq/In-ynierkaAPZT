import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Image, Button } from 'react-native';
import axios from 'axios';
import { UserContext } from '../src/UserContex';
import { useNavigation } from '@react-navigation/native';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get('http://192.168.56.1:5000/api/friends', {
          withCredentials: true,
        });
        setFriends(response.data.results || []);
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

  const handleDeleteFriend = async (friendId) => {
    try {
      const response = await axios.delete(`http://192.168.56.1:5000/api/friends/${friendId}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Friend removed successfully');
        setFriends(friends.filter((friend) => friend.user_id !== friendId));
      }
    } catch (error) {
      console.error('Error deleting friend:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to remove friend');
    }
  };
  

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.user_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text style={styles.text}>Username: {item.username}</Text>
            {item.profilePicture ? (
              <Image 
              source={{ uri: `http://192.168.56.1${item.profilePicture}` }} 
              style={styles.profilePicture} 
              resizeMode="cover"
              onError={(e) => console.log("Error loading image:", e.nativeEvent.error)}
            />
            ) : (
              <Text style={styles.text}>No profile picture available</Text>
            )}
            <Button title="Remove Friend" onPress={() => handleDeleteFriend(item.user_id)} />
          </View>

        )}
        
      />
      <Button
      title="Dodaj Przyjaciela"
      onPress={() => navigation.navigate('ADD Friends')}
    />
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
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default Friends;