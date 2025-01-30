import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { UserContext } from '../src/UserContex';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import acceptIcon from '../assets/images/solar_check-square-bold.png';
import removeIcon from '../assets/images/solar_close-square-bold.png';


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
    <View style={tw`flex-row items-center mb-4 border-b border-gray-300 pb-2`}>      
      {profilePicture ? (
        <Image source={{ uri: `http://192.168.56.1${profilePicture}` }} style={tw`w-12 h-12 rounded-full mr-3`} />
      ) : (
        <View style={tw`w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center mr-3`}>
          <Text style={tw`text-white text-lg`}>{username.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      <Text style={tw`flex-1 text-lg`}>{username}</Text>
      <TouchableOpacity onPress={onPressAction} style={tw`p-2`}>
        <Image source={icon} style={tw`w-6 h-6`} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={tw`flex-1 p-4 bg-green-100`}>      
      <Text style={tw`text-xl font-bold my-2`}>Pending Friend Requests</Text>
      {pendingFriends.length === 0 ? (
        <Text style={tw`text-gray-600 text-center text-lg`}>🌱</Text>
      ) : (
        <FlatList
          data={pendingFriends}
          keyExtractor={(item) => item.friends_id.toString()}
          renderItem={({ item }) =>
            renderProfileItem(item.profilePicture, item.username, acceptIcon, () => acceptFriendRequest(item.friends_id))
          }
        />
      )}

      <View style={tw`border-b border-gray-400 my-4`} />
      
      <Text style={tw`text-xl font-bold my-2`}>Accepted Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.friends_id.toString()}
        renderItem={({ item }) =>
          renderProfileItem(item.profilePicture, item.username, removeIcon, () => removeFriend(item.friends_id))
        }
      />
      
      <TouchableOpacity onPress={() => navigation.navigate('ADD Friends')} style={tw`self-center mt-6 w-12 h-12 rounded-full bg-green-600 flex items-center justify-center shadow-lg`}>
        <Text style={tw`text-white text-2xl font-bold`}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Friends;

