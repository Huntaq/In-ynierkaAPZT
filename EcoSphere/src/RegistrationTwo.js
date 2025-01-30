import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import tw from 'twrnc';

const RegistrationTwo = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [emailNotification, setEmailNotification] = useState(false);
  const [pushNotification, setPushNotification] = useState(false);
  const [agreeToParticipate, setAgreeToParticipate] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { username, email, password } = route.params;

  const handleRegister = async () => {
    if (!agreeToParticipate) {
      Alert.alert('Error', 'You must agree to participate');
      return;
    }

    const userData = {
      username,
      email,
      password,
      age,
      gender,
      emailNotification: emailNotification ? 1 : 0,
      pushNotification: pushNotification ? 1 : 0,
    };

    try {
      const response = await axios.post('http://192.168.56.1:5000/api/register', userData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'User registered successfully');
        navigation.navigate('Log');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <View style={tw`flex-1 bg-green-100 p-5 justify-center`}>      
      <Text style={tw`text-2xl font-bold text-center mb-5`}>Additional Information</Text>
      <View style={tw`flex-row justify-between mb-4`}>        
        <TextInput
          style={tw`h-12 border border-gray-400 rounded-lg p-3 bg-white flex-1 mr-2`}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <TextInput
          style={tw`h-12 border border-gray-400 rounded-lg p-3 bg-white flex-1`}
          placeholder="Gender (M/F)"
          value={gender}
          onChangeText={setGender}
        />
      </View>
      <View style={tw`mb-5`}>        
        <View style={tw`flex-row items-center mb-2`}>
          <CheckBox value={emailNotification} onValueChange={setEmailNotification} />
          <Text style={tw`text-lg ml-2`}>Notification by email</Text>
        </View>
        <View style={tw`flex-row items-center mb-2`}>
          <CheckBox value={pushNotification} onValueChange={setPushNotification} />
          <Text style={tw`text-lg ml-2`}>Push notification</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <CheckBox value={agreeToParticipate} onValueChange={setAgreeToParticipate} />
          <Text style={tw`text-lg ml-2`}>I agree to participate in rankings and statistics based on the provided data.</Text>
        </View>
      </View>
      <TouchableOpacity style={tw`bg-green-500 p-4 rounded-lg items-center`} onPress={handleRegister}>
        <Text style={tw`text-white text-lg font-bold`}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegistrationTwo;
