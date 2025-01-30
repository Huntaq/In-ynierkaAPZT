import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { UserContext } from '../src/UserContex';
import NavBar from '../src/Navbar';
import axios from 'axios';
import tw from 'twrnc';

const { height } = Dimensions.get('window');

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [isUploading, setIsUploading] = useState(false);
  const [recentEventImages, setRecentEventImages] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'There was an issue selecting the image.');
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0].uri;
        console.log('Selected image URI: ', selectedImage);

        handleUploadToBackend(selectedImage);
      }
    });
  };

  const handleUploadToBackend = (imageUri) => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append('profilePicture', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profilePicture.jpg',
    });

    fetch('http://192.168.56.1:5000/api/uploadProfilePicture', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.profilePicture) {
          setUser({
            ...user,
            profilePicture: data.profilePicture,
          });
          Alert.alert('Success', 'Profile picture updated successfully!');
        }
      })
      .catch((error) => {
        console.error('Error uploading profile picture:', error);
        Alert.alert('Error', 'There was an issue uploading the image.');
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  useEffect(() => {
    const fetchRecentEventImages = async () => {
      try {
        const response = await axios.get('http://192.168.56.1:5000/api/event');
        setRecentEventImages(response.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching recent event images:', error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchRecentEventImages();
  }, []);

  return (
    <View style={tw`flex-1 bg-green-100 items-center p-4 w-full`}>
      {user ? (
        <>
          <View style={tw`relative items-center mt-10`}>
            {user.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={tw`w-40 h-40 rounded-full bg-gray-300`} />
            ) : (
              <View style={tw`w-40 h-40 rounded-full bg-gray-200`} />
            )}
            <TouchableOpacity style={tw`absolute bottom-2 right-2 w-10 h-10 bg-blue-500 rounded-full justify-center items-center`} onPress={handleSelectImage} disabled={isUploading}>
              <Text style={tw`text-white text-xl font-bold`}>+</Text>
            </TouchableOpacity>
          </View>
          {isUploading && <ActivityIndicator size="large" color="#007BFF" style={tw`mt-4`} />}
          <Text style={tw`text-lg mt-4`}>{user.username}</Text>

          {loadingEvents ? (
            <ActivityIndicator size="large" color="#007BFF" />
          ) : (
            <FlatList
              data={recentEventImages}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => <Image source={{ uri: item.imageUrl }} style={tw`w-24 h-24 mr-2 rounded-lg bg-gray-300`} />}
            />
          )}
        </>
      ) : (
        <Text style={tw`text-lg mt-4`}>No user data available</Text>
      )}
      <NavBar/>
    </View>
  );
};

export default Profile;


