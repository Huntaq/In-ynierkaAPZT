import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { UserContext } from '../src/UserContex';
import tw from 'twrnc';

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
    <View style={tw`flex-1 p-4 bg-green-100`}>      
      <TextInput
        style={tw`border border-gray-400 rounded-lg p-3 mb-4 text-lg`}
        placeholder="Search"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        ItemSeparatorComponent={() => <View style={tw`h-px bg-gray-300 my-2`} />}
        renderItem={({ item }) => (
          <View style={tw`flex-row items-center mb-4`}>            
            {item.profilePicture ? (
              <Image source={{ uri: item.profilePicture }} style={tw`w-12 h-12 rounded-full mr-3`} />
            ) : (
              <View style={tw`w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center mr-3`}>
                <Text style={tw`text-white text-lg`}>{item.username.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <Text style={tw`flex-1 text-lg`}>{item.username}</Text>
            <TouchableOpacity
              style={tw`w-10 h-10 bg-green-500 flex items-center justify-center rounded-lg`}
              onPress={() => sendFriendRequest(item.id)}
            >
              <Text style={tw`text-white text-2xl font-bold`}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default FriendListScreen;