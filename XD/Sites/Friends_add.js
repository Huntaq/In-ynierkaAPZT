import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Text, FlatList, Button, Alert } from 'react-native';
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
        console.error('Błąd:', error);
        Alert.alert('Błąd', error.response ? error.response.data.message : error.message);
      }
    };

    fetchUsers();
  }, []);

  
  const filterUsers = (users, query) => {
    const filtered = users.filter(userItem => 
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
        friend_id: friendId   
      });
      
      Alert.alert('Zaproszenie wysłane', response.data.message);
    } catch (error) {
      console.error('Błąd:', error);
      Alert.alert(
        'Błąd',
        error.response ? error.response.data.message : 'Nie udało się wysłać zaproszenia'
      );
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Wyszukaj po nazwie"
        value={searchQuery}
        onChangeText={handleSearch}  
      />
      
      <FlatList
        data={filteredUsers}  
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>{item.username}</Text>
            <Button
              title="Wyślij zaproszenie"
              onPress={() => sendFriendRequest(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
};

export default FriendListScreen;
