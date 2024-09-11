import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { UserContext } from '../src/UserContex'; 
import NavBar from '../src/Navbar';

const Profile = () => {
  const { user } = useContext(UserContext);

  // Debugging URL in console
  console.log("User profile picture URL:", user?.profilePicture);

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
          <Text style={styles.text}>Username: {user.username}</Text>
          <Text style={styles.text}>Age: {user.age}</Text>
          <Text style={styles.text}>Gender: {user.gender}</Text>
          <Text style={styles.text}>Is Banned: {user.is_banned ? 'Yes' : 'No'}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <NavBar />
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
