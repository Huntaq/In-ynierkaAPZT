import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

const RegistrationOne = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const navigation = useNavigation();

  const handleNext = () => {
    if (password !== confirmPassword) {
      setPasswordError(true);
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setPasswordError(false);
    
    navigation.navigate('RegistrationTwo', {
      username,
      email,
      password,
    });
  };

  return (
    <View style={tw`flex-1 bg-green-100 p-5 justify-center`}>      
      <Text style={tw`text-2xl font-bold text-center mb-5`}>Register</Text>
      <TextInput
        style={tw`h-12 border border-gray-400 rounded-lg p-3 bg-white mb-4`}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={tw`h-12 border border-gray-400 rounded-lg p-3 bg-white mb-4`}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={tw`h-12 border border-gray-400 rounded-lg p-3 bg-white mb-4`}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={tw`h-12 border ${passwordError ? 'border-red-500' : 'border-gray-400'} rounded-lg p-3 bg-white mb-4`}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={tw`bg-green-500 p-4 rounded-lg items-center`} onPress={handleNext}>
        <Text style={tw`text-white text-lg font-bold`}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegistrationOne;
