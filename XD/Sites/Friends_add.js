import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList, Alert } from 'react-native';
import axios from 'axios';

const FriendSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://192.168.56.1:5000/api/search-users`, {
        params: { name: searchQuery }
      });

      setSearchResults(response.data);
    } catch (error) {
      console.error('Błąd:', error);
      Alert.alert('Błąd', error.response ? error.response.data.message : error.message);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      const response = await axios.post(`http://192.168.56.1:5000/api/send-friend-request`, {
        userId
      });

      alert('Zaproszenie wysłane!');
    } catch (error) {
      console.error('Błąd:', error);
      Alert.alert('Błąd', error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Wyszukaj po nazwie"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Szukaj" onPress={handleSearch} />

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>{item.name}</Text>
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

export default FriendSearchScreen;
