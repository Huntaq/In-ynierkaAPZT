import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../src/UserContex';
import tw from 'twrnc';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://192.168.56.1:5000/api/login', { username, password });

      if (response.status === 200) {
        const userData = response.data.user;
        console.log('Logged in user data:', userData);
        setUser(userData);
        navigation.navigate('Home');
      }
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;
        if (error.response.status === 403) {
          Alert.alert('Login Error', message);
        } else if (error.response.status === 401) {
          Alert.alert('Login Error', message);
        } else {
          Alert.alert('Login Error', 'An unexpected error occurred.');
        }
      } else {
        Alert.alert('Login Error', 'Unable to connect to the server.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={tw`flex-1 items-center justify-start bg-green-100 p-4`}>
      <Image
        source={require('../assets/images/mountain_biking.png')}
        style={tw`w-50 h-50 mt-12 mb-5`}
      />
      <TextInput
        style={tw`h-10 w-75 border border-green-400 rounded-lg mb-3 px-3`}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={tw`h-10 w-75 border border-green-400 rounded-lg mb-3 px-3`}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#84D49D" style={tw`my-3`} />
      ) : (
        <TouchableOpacity style={tw`w-58 h-12 bg-green-400 rounded-xl flex items-center justify-center mt-5`} onPress={handleLogin}>
          <Text style={tw`text-white text-lg font-bold`}>Login</Text>
        </TouchableOpacity>
      )}

      <Text
        style={tw`mt-5 text-green-500 underline text-sm`}
        onPress={() => navigation.navigate('RegistrationOne')}
      >
        Don’t have an account? Sign up!
      </Text>
      
      <Text
        style={tw`mt-2 text-green-500 underline text-sm`}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        Forgot Password?
      </Text>
    </View>
  );
};

export default LoginScreen;
