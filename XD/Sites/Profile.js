import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // Dodajemy import biblioteki
import { UserContext } from '../src/UserContex'; 
import NavBarPro from '../src/NavbarProfil';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [isUploading, setIsUploading] = useState(false);

  // Function to handle image selection
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

        // Here we call the function to upload the image to the backend
        handleUploadToBackend(selectedImage);
      }
    });
  };

  // Function to handle image upload to backend
  const handleUploadToBackend = (imageUri) => {
    setIsUploading(true);

    // Prepare form data
    const formData = new FormData();
    formData.append('profilePicture', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profilePicture.jpg',
    });

    fetch('http://192.168.56.1:5000/api/uploadProfilePicture', { // Zmieniamy URL na Twój backend
      method: 'POST',
      body: formData,
      credentials: 'include', // Zakładamy, że sesja używa ciasteczek
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.profilePicture) {
          // Aktualizujemy zdjęcie profilowe w kontekście użytkownika
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

  return (
    <View style={styles.container}>
      {user ? (
        <>
          {user.profilePicture ? (
            <Image 
              source={{ uri: user.profilePicture }} 
              style={styles.image} 
              resizeMode="cover"
              onError={(e) => console.log("Error loading image:", e.nativeEvent.error)}
            />
          ) : (
            <Text style={styles.text}>No profile picture available</Text>
          )}
          <Button 
            title="Change Profile Picture" 
            onPress={handleSelectImage} 
            disabled={isUploading}
          />
          {isUploading && <Text style={styles.text}>Uploading...</Text>}
          <Text style={styles.text}>Username: {user.username}</Text>
          <Text style={styles.text}>Age: {user.age}</Text>
          <Text style={styles.text}>Gender: {user.gender}</Text>
          <Text style={styles.text}>Is Banned: {user.is_banned ? 'Yes' : 'No'}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <NavBarPro />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    backgroundColor: '#ccc',
  },
});

export default Profile;
