import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { UserContext } from '../src/UserContex';
import NavBarPro from '../src/NavbarProfil';
import axios from 'axios';

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
    <View style={styles.container}>
      {user ? (
        <>
          <View style={styles.imageContainer}>
            {user.profilePicture ? (
              <Image 
                source={{ uri: user.profilePicture }} 
                style={styles.image} 
                resizeMode="cover"
                onError={(e) => console.log("Error loading image:", e.nativeEvent.error)}
              />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}
            <TouchableOpacity style={styles.changeButton} onPress={handleSelectImage} disabled={isUploading}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
          {isUploading && <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />}
          <Text style={styles.username}>{user.username}</Text>

          <Text style={styles.recentEventsTitle}></Text>
          {loadingEvents ? (
            <ActivityIndicator size="large" color="#007BFF" />
          ) : (
            <FlatList
              data={recentEventImages}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
              )}
            />
          )}
        </>
      ) : (
        <Text style={styles.text}>No user data available</Text>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
   
    backgroundColor: '#F1FCF3'
  },
  text: {
    fontSize: 18,
    marginTop: 20,
  },
  imageContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50, 
  },
  image: {
    width: height * 0.2,
    height: height * 0.2,
    borderRadius: (height * 0.2) / 2,
    backgroundColor: '#ccc',
  },
  imagePlaceholder: {
    width: height * 0.2,
    height: height * 0.2,
    borderRadius: (height * 0.2) / 2,
    backgroundColor: '#e0e0e0',
  },
  changeButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 18,
    marginTop: 10, 
  },
  loadingIndicator: {
    marginTop: 10,
  },
  recentEventsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
  },
  eventImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
});

export default Profile;
