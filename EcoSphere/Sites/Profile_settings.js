import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert, TouchableOpacity, TextInput, Modal } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { UserContext } from '../src/UserContex'; 
import { useNavigation } from '@react-navigation/native'
import NavBar from '../src/Navbar';
import tw from 'twrnc';

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
    <View style={tw`flex-1 bg-green-100 p-4`}> 
      {user ? (
        <>
          {user.profilePicture ? (
            <Image source={{ uri: user.profilePicture }} style={tw`w-40 h-40 self-center rounded-full mt-6`} resizeMode="cover" />
          ) : (
            <Text style={tw`text-lg text-center mt-4`}>No profile picture available</Text>
          )}

          <Text style={tw`text-lg font-bold mt-4`}>Username: <Text style={tw`italic font-normal`}>{user.username}</Text></Text>
          <Text style={tw`text-lg font-bold mt-2`}>Age: <Text style={tw`italic font-normal`}>{user.age}</Text></Text>
          <Text style={tw`text-lg font-bold mt-2`}>Gender: <Text style={tw`italic font-normal`}>{user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : 'Other'}</Text></Text>
          <Text style={tw`text-lg font-bold mt-2`}>Email: <Text style={tw`italic font-normal`}>{user.email}</Text></Text>
          
          <View style={tw`flex-row items-center mt-4`}>
            <CheckBox value={emailNotifications} onValueChange={(newValue) => setEmailNotifications(newValue)} />
            <Text style={tw`ml-2 text-base`}>Email Notifications</Text>
          </View>
          
          <View style={tw`flex-row items-center mt-2`}>
            <CheckBox value={pushNotifications} onValueChange={(newValue) => setPushNotifications(newValue)} />
            <Text style={tw`ml-2 text-base`}>Push Notifications</Text>
          </View>
          
          <TouchableOpacity style={tw`bg-red-500 py-3 mt-6 rounded-lg w-3/4 self-center`} onPress={() => setModalVisible(true)}>
            <Text style={tw`text-white text-lg font-bold text-center`}>Delete Account</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={tw`bg-green-500 py-3 mt-4 rounded-lg w-3/4 self-center`} onPress={() => { Alert.alert('Logged Out', 'You have been logged out successfully.'); navigation.navigate('Ecosphere'); }}>
            <Text style={tw`text-white text-lg font-bold text-center`}>Logout</Text>
          </TouchableOpacity>

          <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={tw`flex-1 justify-center items-center bg-black/50`}>
              <View style={tw`bg-white p-6 rounded-lg w-3/4 items-center`}>
                <Text style={tw`text-xl font-bold mb-4`}>Are you sure?</Text>
                <TextInput placeholder="Password" secureTextEntry style={tw`border-b border-gray-300 w-full my-2 p-2`} value={password} onChangeText={setPassword} />
                <TextInput placeholder="Confirm Password" secureTextEntry style={tw`border-b border-gray-300 w-full my-2 p-2`} value={confirmPassword} onChangeText={setConfirmPassword} />
                <View style={tw`flex-row mt-4 w-full justify-between`}>
                  <TouchableOpacity style={tw`bg-green-500 py-2 px-6 rounded-lg`} onPress={handleDeleteAccount}>
                    <Text style={tw`text-white font-bold`}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={tw`bg-red-500 py-2 px-6 rounded-lg`} onPress={() => setModalVisible(false)}>
                    <Text style={tw`text-white font-bold`}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-lg`}>No user data available</Text>
          <Button title="Go to Login" onPress={() => navigation.navigate('Startsite')} />
        </View>
      )}
      <NavBar/>
    </View>
  );
};
export default Profile_settings;
