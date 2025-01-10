import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert, TouchableOpacity, TextInput, Modal } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { UserContext } from '../src/UserContex'; 
import { useNavigation } from '@react-navigation/native'
import NavBar from '../src/Navbar';

const Profile_settings = () => {
  const { user, setUser } = useContext(UserContext);
  const [emailNotifications, setEmailNotifications] = useState(!!user.email_notifications);
  const [pushNotifications, setPushNotifications] = useState(!!user.push_notifications);
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const handleDeleteAccount = () => {
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (trimmedPassword === trimmedConfirmPassword && trimmedPassword !== '') {
      fetch('http://192.168.56.1:5000/api/user_delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, password: trimmedPassword }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete account');
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            Alert.alert('Success', 'Your account has been deleted.');
            setUser(null); 
          } else {
            Alert.alert('Error', data.message);
          }
        })
        .catch((error) => {
          console.error('Error deleting account:', error);
          Alert.alert('Error', 'There was an issue deleting your account.');
        });
    } else {
      Alert.alert('Error', 'Passwords do not match or are empty.');
    }
  };

  const updateEmailNotifications = (newValue) => {
    fetch('http://192.168.56.1:5000/api/updateEmailNotifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, emailNotifications: newValue ? 1 : 0 }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update email notifications');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Email notifications updated successfully:', data);
      })
      .catch((error) => {
        console.error('Error updating email notifications:', error);
        Alert.alert('Error', 'Unable to update email notifications.');
      });
  };
  
  const updatePushNotifications = (newValue) => {
    fetch('http://192.168.56.1:5000/api/updatePushNotifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, pushNotifications: newValue ? 1 : 0 }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update push notifications');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Push notifications updated successfully:', data);
      })
      .catch((error) => {
        console.error('Error updating push notifications:', error);
        Alert.alert('Error', 'Unable to update push notifications.');
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
            />
          ) : (
            <Text style={styles.text}>No profile picture available</Text>
          )}

          <Text style={styles.all}>
            <Text style={styles.label}>Username: </Text>
            <Text style={styles.value}>{user.username}</Text>
          </Text>
          <Text style={styles.all}>
            <Text style={styles.label}>Age: </Text>
            <Text style={styles.value}>{user.age}</Text>
          </Text>
          <Text style={styles.all}>
            <Text style={styles.label}>Gender: </Text>
            <Text style={styles.value}>
              {user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : 'Other'}
            </Text>
          </Text>
          <Text style={styles.all}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </Text>

          <View style={styles.checkboxRow}>
            <CheckBox
              value={emailNotifications}
              onValueChange={(newValue) => {
                setEmailNotifications(newValue);
                updateEmailNotifications(newValue);
              }}
            />
            <Text style={styles.checkboxLabel}>Email Notifications</Text>
          </View>

          <View style={styles.checkboxRow}>
            <CheckBox
              value={pushNotifications}
              onValueChange={(newValue) => {
                setPushNotifications(newValue);
                updatePushNotifications(newValue);
              }}
            />
            <Text style={styles.checkboxLabel}>Push Notifications</Text>
          </View>

          <TouchableOpacity
            style={styles.DeleteButton}
            onPress={() => {
              setModalVisible(true); // This keeps the modal functionality
            }}
          >
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.LogoutButton}
            onPress={() => {
              Alert.alert('Logged Out', 'You have been logged out successfully.');
              navigation.navigate('Ecosphere');
            }}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Are you sure </Text>
                {/* Password Input */}
                <TextInput
                  placeholder="Password"
                  secureTextEntry
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
                {/* Confirm Password Input */}
                <TextInput
                  placeholder="Confirm Password"
                  secureTextEntry
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#84D49D' }]}
                    onPress={handleDeleteAccount}
                  >
                    <Text style={styles.modalButtonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#FF6F61' }]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <View style={styles.noUserContainer}>
          <Text style={styles.text}>No user data available</Text>
          <Button title="Go to Login" onPress={() => { navigation.navigate('Startsite') }} />
        </View>
      )}
      <NavBar/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#F1FCF3',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    borderRadius: 75,
    marginBottom: 20,
    backgroundColor: '#ccc',
    marginTop: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    width: 100,
  },
  all: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingLeft: 30,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    textAlign: 'right',
    marginLeft: 30,
  },
  DeleteButton: {
    marginTop: 20,
    backgroundColor: '#84D49D',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
    alignSelf: 'center',
  },
  LogoutButton: {
    marginTop: 20,
    backgroundColor: '#D9534F', // Red color
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginLeft: 30,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
    padding: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noUserContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile_settings;
