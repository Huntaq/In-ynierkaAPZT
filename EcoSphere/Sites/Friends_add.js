import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { UserContext } from '../src/UserContex';

const FriendListScreen = () => {
  const { user } = useContext(UserContext);
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post(`http://192.168.56.1:5000/api/search_friend`, {});
        setUserList(response.data.friends);
        filterUsers(response.data.friends, searchQuery);
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', error.response ? error.response.data.message : error.message);
      }
    };

    fetchUsers();
  }, []);

  const filterUsers = (users, query) => {
    const filtered = users.filter(
      (userItem) =>
        userItem.id !== user.id &&  
        userItem.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterUsers(userList, query);
  };

  const sendFriendRequest = async (friendId) => {
    try {
      const response = await axios.post('http://192.168.56.1:5000/api/friend_add', {
        user_id: user.id,
        friend_id: friendId,
      });

      Alert.alert('Request Sent', response.data.message);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Error',
        error.response ? error.response.data.message : 'Error sending friend request'
      );
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            {item.profilePicture ? (
              <Image
                source={{ uri: item.profilePicture }}
                style={styles.profileImage}
                onError={(e) => console.log(`Error loading image for ${item.username}:`, e.nativeEvent.error)}
              />
            ) : (
              <View style={styles.defaultProfileImage}>
                <Text style={styles.profileInitial}>
                  {item.username.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.username}>{item.username}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => sendFriendRequest(item.id)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1FCF3',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  defaultProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileInitial: {
    fontSize: 20,
    color: '#fff',
  },
  username: {
    flex: 1,
    fontSize: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#84d49D',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default FriendListScreen;
