import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const Friends = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
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
          </View>
        )}
      />
      {}
      
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
